import asyncio
import functools
import json
import subprocess
from datetime import datetime, timezone
from collections import defaultdict
from typing import Any

QUALITY_THRESHOLD = 60  # score >= 60 = quality day


# ── Scoring functions ──────────────────────────────────────────────────────────

def _wind_angle_diff(wind_dir: float, coast_facing: float) -> float:
    """
    Devuelve el ángulo (0-180°) entre el viento y la dirección offshore.
    0° = viento puramente offshore, 180° = viento puramente onshore.
    """
    offshore_dir = (coast_facing + 180) % 360
    diff = abs(wind_dir - offshore_dir) % 360
    return diff if diff <= 180 else 360 - diff


def _wind_surf_score(wind_kn: float, wind_dir: float, coast_facing: float) -> float:
    """
    Penaliza el viento combinando velocidad y dirección respecto a la playa.
    Offshore ligero es positivo; onshore a cualquier velocidad es malo.
    """
    diff = _wind_angle_diff(wind_dir, coast_facing)
    ws = wind_kn

    if diff < 60:           # Offshore (0-60°) — alisa la ola
        if ws < 3:   return 85   # demasiado flojo, ola sin cara
        elif ws < 8: return 100  # ideal: offshore ligero
        elif ws < 15: return 80  # offshore moderado, aún bueno
        elif ws < 22: return 40  # offshore fuerte, empieza a cerrar
        else:        return 10   # offshore de tormenta

    elif diff < 120:        # Cross-shore (60-120°) — neutral/leve penalización
        if ws < 3:   return 80
        elif ws < 8: return 65
        elif ws < 12: return 35
        else:        return 10

    else:                   # Onshore (120-180°) — arruina las condiciones
        if ws < 3:   return 55   # onshore muy flojo, tolerable
        elif ws < 6: return 25
        elif ws < 10: return 8
        else:        return 0


def _score_surf(wave_height: float, wave_period: float,
                wind_kn: float, wind_dir: float = 0, coast_facing: float = 0) -> float:
    # Wave height (40%)
    wh = wave_height
    if wh < 0.3:        wh_s = 0
    elif wh < 0.5:      wh_s = 20
    elif wh < 1.0:      wh_s = 55
    elif wh < 1.5:      wh_s = 85
    elif wh < 2.5:      wh_s = 100
    elif wh < 3.5:      wh_s = 75
    elif wh < 5.0:      wh_s = 40
    else:               wh_s = 10

    # Wave period (35%)
    wp = wave_period
    if wp < 5:          wp_s = 0
    elif wp < 7:        wp_s = 30
    elif wp < 9:        wp_s = 60
    elif wp < 12:       wp_s = 85
    elif wp < 16:       wp_s = 100
    else:               wp_s = 90

    # Wind (25%) — dirección + velocidad
    ws_s = _wind_surf_score(wind_kn, wind_dir, coast_facing)

    return round(0.40 * wh_s + 0.35 * wp_s + 0.25 * ws_s, 1)


def _score_windsurf(wind_kn: float, wave_height: float) -> float:
    # Wind (70%)
    ws = wind_kn
    if ws < 8:          ws_s = 0
    elif ws < 12:       ws_s = 40
    elif ws < 18:       ws_s = 75
    elif ws < 25:       ws_s = 100
    elif ws < 35:       ws_s = 65
    elif ws < 40:       ws_s = 25
    else:               ws_s = 0

    # Wave height (30%)
    wh = wave_height
    if wh < 0.3:        wh_s = 50
    elif wh < 1.0:      wh_s = 70
    elif wh < 2.0:      wh_s = 90
    elif wh < 3.5:      wh_s = 100
    else:               wh_s = 50

    return round(0.70 * ws_s + 0.30 * wh_s, 1)


def _score_wingfoil(wind_kn: float, wave_height: float) -> float:
    # Wind (80%)
    ws = wind_kn
    if ws < 8:          ws_s = 0
    elif ws < 10:       ws_s = 40
    elif ws < 15:       ws_s = 90
    elif ws < 20:       ws_s = 100
    elif ws < 25:       ws_s = 60
    else:               ws_s = 20

    # Wave height (20%)
    wh = wave_height
    if wh < 0.5:        wh_s = 80
    elif wh < 1.5:      wh_s = 100
    elif wh < 2.5:      wh_s = 70
    else:               wh_s = 30

    return round(0.80 * ws_s + 0.20 * wh_s, 1)


def _score_kitesurf(wind_kn: float, wave_height: float) -> float:
    # Wind (70%)
    ws = wind_kn
    if ws < 8:          ws_s = 0
    elif ws < 12:       ws_s = 40
    elif ws < 18:       ws_s = 85
    elif ws < 25:       ws_s = 100
    elif ws < 30:       ws_s = 70
    elif ws < 35:       ws_s = 30
    else:               ws_s = 0

    # Wave height (30%)
    wh = wave_height
    if wh < 0.5:        wh_s = 70
    elif wh < 2.0:      wh_s = 100
    elif wh < 3.5:      wh_s = 80
    else:               wh_s = 40

    return round(0.70 * ws_s + 0.30 * wh_s, 1)


# ── Beginner scoring functions ─────────────────────────────────────────────────

def _score_surf_beginner(wave_height: float, wave_period: float,
                         wind_kn: float, wind_dir: float = 0, coast_facing: float = 0) -> float:
    # Wave height (40%) — smaller waves are ideal
    wh = wave_height
    if wh < 0.2:        wh_s = 0
    elif wh < 0.4:      wh_s = 40
    elif wh < 0.7:      wh_s = 80
    elif wh < 1.0:      wh_s = 100
    elif wh < 1.5:      wh_s = 60
    elif wh < 2.0:      wh_s = 20
    else:               wh_s = 0

    # Wave period (35%) — medium periods ok
    wp = wave_period
    if wp < 5:          wp_s = 10
    elif wp < 7:        wp_s = 50
    elif wp < 10:       wp_s = 90
    elif wp < 14:       wp_s = 100
    else:               wp_s = 85

    # Wind (25%) — lighter wind preferred
    diff = _wind_angle_diff(wind_dir, coast_facing)
    ws = wind_kn
    if diff < 60:           # Offshore
        if ws < 3:   ws_s = 70
        elif ws < 6: ws_s = 100
        elif ws < 10: ws_s = 70
        elif ws < 15: ws_s = 30
        else:        ws_s = 0
    elif diff < 120:        # Cross-shore
        if ws < 3:   ws_s = 70
        elif ws < 6: ws_s = 50
        elif ws < 10: ws_s = 20
        else:        ws_s = 0
    else:                   # Onshore
        if ws < 3:   ws_s = 40
        elif ws < 6: ws_s = 10
        else:        ws_s = 0

    return round(0.40 * wh_s + 0.35 * wp_s + 0.25 * ws_s, 1)


def _score_windsurf_beginner(wind_kn: float, wave_height: float) -> float:
    # Wind (70%) — lower range, steady winds
    ws = wind_kn
    if ws < 5:          ws_s = 0
    elif ws < 8:        ws_s = 30
    elif ws < 12:       ws_s = 90
    elif ws < 18:       ws_s = 100
    elif ws < 22:       ws_s = 60
    elif ws < 28:       ws_s = 20
    else:               ws_s = 0

    # Wave height (30%) — flat/small water preferred
    wh = wave_height
    if wh < 0.5:        wh_s = 100
    elif wh < 1.0:      wh_s = 80
    elif wh < 1.5:      wh_s = 40
    elif wh < 2.5:      wh_s = 10
    else:               wh_s = 0

    return round(0.70 * ws_s + 0.30 * wh_s, 1)


def _score_wingfoil_beginner(wind_kn: float, wave_height: float) -> float:
    # Wind (80%) — lighter, consistent wind
    ws = wind_kn
    if ws < 8:          ws_s = 0
    elif ws < 10:       ws_s = 40
    elif ws < 14:       ws_s = 100
    elif ws < 18:       ws_s = 90
    elif ws < 22:       ws_s = 50
    elif ws < 28:       ws_s = 15
    else:               ws_s = 0

    # Wave height (20%) — flat/small water preferred
    wh = wave_height
    if wh < 0.5:        wh_s = 100
    elif wh < 1.0:      wh_s = 75
    elif wh < 1.5:      wh_s = 35
    elif wh < 2.5:      wh_s = 10
    else:               wh_s = 0

    return round(0.80 * ws_s + 0.20 * wh_s, 1)


def _score_kitesurf_beginner(wind_kn: float, wave_height: float) -> float:
    # Wind (70%) — lower range
    ws = wind_kn
    if ws < 8:          ws_s = 0
    elif ws < 10:       ws_s = 30
    elif ws < 15:       ws_s = 90
    elif ws < 20:       ws_s = 100
    elif ws < 25:       ws_s = 55
    elif ws < 30:       ws_s = 15
    else:               ws_s = 0

    # Wave height (30%) — flat/small water preferred
    wh = wave_height
    if wh < 0.5:        wh_s = 100
    elif wh < 1.0:      wh_s = 75
    elif wh < 1.5:      wh_s = 40
    elif wh < 2.5:      wh_s = 10
    else:               wh_s = 0

    return round(0.70 * ws_s + 0.30 * wh_s, 1)


def compute_scores(wh: float, wp: float, ws: float,
                   wind_dir: float, coast_facing: float) -> dict:
    return {
        "surf":               _score_surf(wh, wp, ws, wind_dir, coast_facing),
        "surf_beginner":      _score_surf_beginner(wh, wp, ws, wind_dir, coast_facing),
        "windsurf":           _score_windsurf(ws, wh),
        "windsurf_beginner":  _score_windsurf_beginner(ws, wh),
        "wingfoil":           _score_wingfoil(ws, wh),
        "wingfoil_beginner":  _score_wingfoil_beginner(ws, wh),
        "kitesurf":           _score_kitesurf(ws, wh),
        "kitesurf_beginner":  _score_kitesurf_beginner(ws, wh),
    }

# Keep for backwards compat (used in summarize)
SCORE_FN = {
    "surf":      None,   # handled via compute_scores
    "windsurf":  None,
    "wingfoil":  None,
    "kitesurf":  None,
}


# ── Open-Meteo fetchers ────────────────────────────────────────────────────────

def _build_url(base: str, params: dict) -> str:
    from urllib.parse import urlencode
    return f"{base}?{urlencode(params)}"


def _fetch_sync(url: str, params: dict, retries: int = 4) -> dict:
    """Use curl subprocess — works in any sandbox environment."""
    full_url = _build_url(url, params)
    for attempt in range(retries):
        result = subprocess.run(
            ["curl", "-sf", "--max-time", "30", full_url],
            capture_output=True, text=True
        )
        if result.returncode != 0:
            wait = 2 ** attempt
            print(f"[curl] returncode={result.returncode} attempt={attempt+1}/{retries} stderr={result.stderr[:120]!r} — retrying in {wait}s")
            import time; time.sleep(wait)
            continue
        try:
            data = json.loads(result.stdout)
        except Exception:
            print(f"[curl] bad JSON (len={len(result.stdout)}): {result.stdout[:120]!r}")
            import time; time.sleep(2 ** attempt)
            continue
        if "error" in data:
            raise RuntimeError(f"API error: {data['error']}")
        return data
    raise RuntimeError(f"Max retries reached for {url}")


async def fetch_spot_forecast(lat: float, lon: float) -> dict[str, Any]:
    loop = asyncio.get_event_loop()
    marine, weather = await asyncio.gather(
        loop.run_in_executor(None, functools.partial(_fetch_sync,
            "https://marine-api.open-meteo.com/v1/marine", {
                "latitude": lat, "longitude": lon,
                "hourly": "wave_height,wave_period,wave_direction",
                "timezone": "Europe/Madrid", "forecast_days": 7,
            })),
        loop.run_in_executor(None, functools.partial(_fetch_sync,
            "https://api.open-meteo.com/v1/forecast", {
                "latitude": lat, "longitude": lon,
                "hourly": "windspeed_10m,winddirection_10m",
                "wind_speed_unit": "kn",
                "timezone": "Europe/Madrid", "forecast_days": 7,
            })),
    )
    return {"marine": marine, "weather": weather}


# ── Aggregation ────────────────────────────────────────────────────────────────

def _daytime_avg(times: list[str], values: list, hours=(8, 20)) -> dict[str, float]:
    """Return per-date average of values during daytime hours."""
    day_vals: dict[str, list[float]] = defaultdict(list)
    for t, v in zip(times, values):
        if v is None:
            continue
        dt = datetime.fromisoformat(t)
        if hours[0] <= dt.hour < hours[1]:
            day_vals[dt.date().isoformat()].append(v)
    return {d: sum(vs) / len(vs) for d, vs in day_vals.items() if vs}


def build_hourly_forecast(raw: dict, coast_facing: float = 0) -> list[dict]:
    """3-hourly data for the Windguru-style popup."""
    from datetime import date as date_cls
    today = date_cls.today().isoformat()

    marine  = raw["marine"]["hourly"]
    weather = raw["weather"]["hourly"]

    wave_h = dict(zip(marine["time"],  marine["wave_height"]))
    wave_p = dict(zip(marine["time"],  marine["wave_period"]))
    wave_d = dict(zip(marine["time"],  marine["wave_direction"]))
    wind_s = dict(zip(weather["time"], weather["windspeed_10m"]))
    wind_d = dict(zip(weather["time"], weather["winddirection_10m"]))

    hours = []
    for t in marine["time"]:
        dt = datetime.fromisoformat(t)
        if dt.date().isoformat() < today:
            continue
        if dt.hour % 3 != 0:
            continue
        wh   = wave_h.get(t) or 0.0
        wp   = wave_p.get(t) or 8.0
        wd   = wave_d.get(t) or 0.0
        ws   = wind_s.get(t) or 0.0
        wdir = wind_d.get(t) or 0.0

        scores = compute_scores(wh, wp, ws, wdir, coast_facing)
        hours.append({
            "time":        t,
            "wind_speed":  round(ws, 1),
            "wind_dir":    round(wdir, 0),
            "wave_height": round(wh, 2),
            "wave_period": round(wp, 1),
            "wave_dir":    round(wd, 0),
            "scores":      scores,
        })
    return hours


def build_daily_forecast(raw: dict, coast_facing: float = 0) -> list[dict]:
    from datetime import date as date_cls
    today = date_cls.today().isoformat()

    marine  = raw["marine"]["hourly"]
    weather = raw["weather"]["hourly"]

    times_m = marine["time"]
    wave_h  = _daytime_avg(times_m, marine["wave_height"])
    wave_p  = _daytime_avg(times_m, marine["wave_period"])
    wave_d  = _daytime_avg(times_m, marine["wave_direction"])

    times_w = weather["time"]
    wind_s  = _daytime_avg(times_w, weather["windspeed_10m"])
    wind_d  = _daytime_avg(times_w, weather["winddirection_10m"])

    dates = sorted(d for d in (set(wave_h) & set(wave_p) & set(wind_s)) if d >= today)

    days = []
    for date in dates:
        wh   = wave_h.get(date, 0.0)
        wp   = wave_p.get(date, 8.0)
        ws   = wind_s.get(date, 0.0)
        wd   = wind_d.get(date, 0.0)
        mwd  = wave_d.get(date, 0.0)

        scores = compute_scores(wh, wp, ws, wd, coast_facing)

        days.append({
            "date":        date,
            "wave_height": round(wh, 2),
            "wave_period": round(wp, 1),
            "wind_speed":  round(ws, 1),
            "wind_dir":    round(wd, 0),
            "wave_dir":    round(mwd, 0),
            "scores":      scores,
        })

    return days


def summarize(days: list[dict]) -> dict:
    sports = ["surf", "windsurf", "wingfoil", "kitesurf",
              "surf_beginner", "windsurf_beginner", "wingfoil_beginner", "kitesurf_beginner"]
    result = {}
    for sport in sports:
        day_scores = [d["scores"][sport] for d in days]
        quality    = sum(1 for s in day_scores if s >= QUALITY_THRESHOLD)
        avg        = round(sum(day_scores) / len(day_scores), 1) if day_scores else 0
        result[sport] = {"daily_scores": day_scores, "quality_days": quality, "avg_score": avg}
    return result


