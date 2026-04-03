"""
Standalone script: fetch forecast for all spots and save to SQLite.
Run manually or via cron: python3 refresh.py
"""
import asyncio
import time
import traceback

from spots import SPOTS
from forecaster import fetch_spot_forecast, build_daily_forecast, build_hourly_forecast, summarize
from db import init_db, save_spots


async def fetch_spot(spot: dict) -> dict:
    raw     = await fetch_spot_forecast(spot["lat"], spot["lon"])
    cf      = spot.get("coast_facing", 0)
    days    = build_daily_forecast(raw, coast_facing=cf)
    hourly  = build_hourly_forecast(raw, coast_facing=cf)
    summary = summarize(days)
    return {
        "id":      spot["id"],
        "name":    spot["name"],
        "region":  spot["region"],
        "lat":     spot["lat"],
        "lon":     spot["lon"],
        "days":    days,
        "hourly":  hourly,
        "summary": summary,
    }


async def main(batch_size=3, delay=0.8):
    init_db()
    print(f"Fetching {len(SPOTS)} spots (batch={batch_size}, delay={delay}s)…")
    t0 = time.time()
    results = []

    for i in range(0, len(SPOTS), batch_size):
        batch = SPOTS[i:i + batch_size]
        names = [s["name"] for s in batch]
        print(f"  batch {i//batch_size + 1}: {names}")
        try:
            batch_results = await asyncio.gather(*[fetch_spot(s) for s in batch])
            results.extend(batch_results)
        except Exception as e:
            print(f"  ERROR in batch: {e}")
            traceback.print_exc()
        if i + batch_size < len(SPOTS):
            await asyncio.sleep(delay)

    if results:
        save_spots(results)
        print(f"Done — {len(results)}/{len(SPOTS)} spots saved in {time.time()-t0:.1f}s")
    else:
        print("ERROR: no spots fetched, DB not updated")


if __name__ == "__main__":
    asyncio.run(main())
