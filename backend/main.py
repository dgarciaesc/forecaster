import asyncio
import hashlib
import json
import os
import subprocess
import time
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException, BackgroundTasks, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from spots import SPOTS, SEA_POINTS
from forecaster import fetch_spot_forecast, build_daily_forecast, build_hourly_forecast, summarize
from db import init_db, save_spots, load_spots, last_refresh

AUTH_ENABLED      = os.getenv("AUTH_ENABLED", "false").lower() == "true"
GOOGLE_CLIENT_ID  = os.getenv("GOOGLE_CLIENT_ID", "")

_snapshot: list[dict] | None = None
_sea_snapshot: list[dict] | None = None
_refreshing = False

# Token verification cache: {sha256_prefix: (exp_timestamp, user_info)}
_token_cache: dict = {}


async def _verify_token(authorization: str | None = Header(default=None)) -> dict:
    if not AUTH_ENABLED:
        return {"sub": "anonymous"}

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization[7:]
    token_key = hashlib.sha256(token.encode()).hexdigest()[:24]

    now = time.time()
    if token_key in _token_cache:
        exp, info = _token_cache[token_key]
        if now < exp:
            return info
        del _token_cache[token_key]

    # Verify with Google tokeninfo endpoint via curl
    result = subprocess.run(
        ["curl", "-sf", "--max-time", "10",
         f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        raise HTTPException(status_code=401, detail="Token verification failed")
    try:
        data = json.loads(result.stdout)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token response")
    if "error_description" in data or "error" in data:
        raise HTTPException(status_code=401, detail=data.get("error_description", "Invalid token"))
    if GOOGLE_CLIENT_ID and data.get("aud") != GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=401, detail="Token audience mismatch")

    exp = float(data.get("exp", now + 3600))
    _token_cache[token_key] = (exp, data)
    return data


async def _fetch_spot(spot: dict) -> dict:
    raw     = await fetch_spot_forecast(spot["lat"], spot["lon"])
    cf      = spot.get("coast_facing", 0)
    days    = build_daily_forecast(raw, coast_facing=cf)
    hourly  = build_hourly_forecast(raw, coast_facing=cf)
    summary = summarize(days)
    result  = {"id": spot["id"], "lat": spot["lat"], "lon": spot["lon"], "summary": summary}
    if "name" in spot:
        result["name"]   = spot["name"]
        result["region"] = spot["region"]
        result["days"]   = days
        result["hourly"] = hourly
    return result


async def _fetch_all(all_spots: list, batch_size=3, delay=0.8) -> list[dict]:
    results = []
    for i in range(0, len(all_spots), batch_size):
        batch = all_spots[i:i + batch_size]
        results.extend(await asyncio.gather(*[_fetch_spot(s) for s in batch]))
        if i + batch_size < len(all_spots):
            await asyncio.sleep(delay)
    return results


async def do_refresh():
    global _snapshot, _sea_snapshot, _refreshing
    if _refreshing:
        return
    _refreshing = True
    print("[refresh] fetching spots + sea points…")
    try:
        results    = await _fetch_all(SPOTS + SEA_POINTS)
        spots_data = [r for r in results if "name" in r]
        sea_data   = [r for r in results if "name" not in r]
        save_spots(spots_data, table="forecast")
        save_spots(sea_data,   table="sea_points")
        _snapshot     = spots_data
        _sea_snapshot = sea_data
        print(f"[refresh] done — {len(spots_data)} spots, {len(sea_data)} sea points")
    except Exception as e:
        import traceback
        print(f"[refresh] ERROR: {e}\n{traceback.format_exc()}")
    finally:
        _refreshing = False


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _snapshot, _sea_snapshot
    init_db()
    _snapshot     = load_spots(table="forecast")
    _sea_snapshot = load_spots(table="sea_points")
    if _snapshot:
        age = int(time.time() - last_refresh())
        print(f"[startup] loaded {len(_snapshot)} spots + {len(_sea_snapshot or [])} sea points (age: {age}s)")
    else:
        print("[startup] DB empty — call GET /api/refresh to populate")
    yield


app = FastAPI(title="Forecaster API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["GET"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.get("/api/forecast")
async def forecast(user: dict = Depends(_verify_token)):
    if not _snapshot:
        raise HTTPException(status_code=503, detail="No data — call /api/refresh first")
    return {"spots": _snapshot, "sea_points": _sea_snapshot or []}


@app.get("/api/refresh")
async def refresh(background_tasks: BackgroundTasks, user: dict = Depends(_verify_token)):
    if _refreshing:
        return {"status": "already_running"}
    background_tasks.add_task(do_refresh)
    return {"status": "started"}


@app.get("/api/health")
async def health():
    age = int(time.time() - last_refresh())
    return {"status": "ok", "spots": len(_snapshot) if _snapshot else 0,
            "refreshing": _refreshing, "data_age_s": age}


# ── Serve React SPA (must be last) ────────────────────────────────────────────
STATIC_DIR = Path(__file__).parent.parent / "frontend" / "dist"
if STATIC_DIR.exists():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        return FileResponse(STATIC_DIR / "index.html")
