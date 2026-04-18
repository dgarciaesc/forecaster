"""SQLite persistence for forecast data."""
import json
import os
import sqlite3
import time
from pathlib import Path

DB_PATH = Path(os.environ.get("DB_PATH", Path(__file__).parent / "forecast.db"))


def _conn():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con


def init_db():
    with _conn() as con:
        for table in ("forecast", "sea_points"):
            con.execute(f"""
                CREATE TABLE IF NOT EXISTS {table} (
                    spot_id    INTEGER PRIMARY KEY,
                    data       TEXT NOT NULL,
                    updated_at REAL NOT NULL
                )
            """)
        con.execute("""
            CREATE TABLE IF NOT EXISTS meta (
                key   TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
        """)
        con.execute("""
            CREATE TABLE IF NOT EXISTS alerts (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                email      TEXT NOT NULL,
                sports     TEXT NOT NULL,
                days       INTEGER NOT NULL DEFAULT 3,
                weekend    INTEGER NOT NULL DEFAULT 0,
                no_rain    INTEGER NOT NULL DEFAULT 0,
                zone       TEXT NOT NULL DEFAULT 'all',
                created_at REAL NOT NULL,
                last_sent  REAL NOT NULL DEFAULT 0
            )
        """)


def save_spots(spots_data: list[dict], table: str = "forecast"):
    now = time.time()
    with _conn() as con:
        for spot in spots_data:
            con.execute(
                f"INSERT OR REPLACE INTO {table} (spot_id, data, updated_at) VALUES (?, ?, ?)",
                (spot["id"], json.dumps(spot), now)
            )
        if table == "forecast":
            con.execute(
                "INSERT OR REPLACE INTO meta (key, value) VALUES ('last_refresh', ?)",
                (str(now),)
            )


def load_spots(table: str = "forecast") -> list[dict] | None:
    """Returns all rows from the given table, or None if empty."""
    with _conn() as con:
        rows = con.execute(f"SELECT data FROM {table} ORDER BY spot_id").fetchall()
    if not rows:
        return None
    return [json.loads(r["data"]) for r in rows]


def save_alert(email: str, sports: dict, days: int, weekend: bool, no_rain: bool, zone: str):
    now = time.time()
    with _conn() as con:
        con.execute(
            "INSERT INTO alerts (email, sports, days, weekend, no_rain, zone, created_at, last_sent) VALUES (?, ?, ?, ?, ?, ?, ?, 0)",
            (email, json.dumps(sports), days, int(weekend), int(no_rain), zone, now)
        )


def load_alerts() -> list[dict]:
    with _conn() as con:
        rows = con.execute("SELECT * FROM alerts").fetchall()
    return [dict(r) for r in rows]


def load_alerts_by_email(email: str) -> list[dict]:
    with _conn() as con:
        rows = con.execute("SELECT * FROM alerts WHERE email=? ORDER BY created_at DESC", (email,)).fetchall()
    return [dict(r) for r in rows]


def delete_alert(alert_id: int):
    with _conn() as con:
        con.execute("DELETE FROM alerts WHERE id=?", (alert_id,))


def update_alert_sent(alert_id: int):
    with _conn() as con:
        con.execute("UPDATE alerts SET last_sent=? WHERE id=?", (time.time(), alert_id))


def last_refresh() -> float:
    """Returns timestamp of last refresh, or 0 if never."""
    with _conn() as con:
        row = con.execute("SELECT value FROM meta WHERE key='last_refresh'").fetchone()
    return float(row["value"]) if row else 0.0
