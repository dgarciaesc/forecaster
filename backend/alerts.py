"""Alert checking and email delivery via IONOS SMTP."""
import json
import os
import smtplib
from datetime import date, datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from db import load_alerts, update_alert_sent

SMTP_HOST  = os.getenv("SMTP_HOST",  "smtp.ionos.com")
SMTP_PORT  = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER  = os.getenv("SMTP_USER",  "")
SMTP_PASS  = os.getenv("SMTP_PASS",  "")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER)

QUALITY_THRESHOLD = 60
WEEKDAYS = {5, 6}  # Saturday, Sunday

SPORT_LABELS = {
    "surf":               "Surf ⚡",
    "surf_beginner":      "Surf 🌊",
    "windsurf":           "Windsurf ⚡",
    "windsurf_beginner":  "Windsurf 🌊",
    "wingfoil":           "Wingfoil ⚡",
    "wingfoil_beginner":  "Wingfoil 🌊",
    "kitesurf":           "Kitesurf ⚡",
    "kitesurf_beginner":  "Kitesurf 🌊",
}


def _sport_key(sport_id: str, level: str) -> str:
    return f"{sport_id}_beginner" if level == "beginner" else sport_id


def _check_alert(alert: dict, spots: list[dict]) -> list[tuple]:
    """Return list of (spot, [(sport_key, quality_count), ...]) that match the alert."""
    sports    = json.loads(alert["sports"])
    zone      = alert["zone"]
    min_days  = alert["days"]
    weekend   = bool(alert["weekend"])

    filtered = [
        s for s in spots
        if "name" in s and (zone == "all" or s.get("zone") == zone)
    ]

    matching = []
    for spot in filtered:
        spot_matches = []
        for sport_id, level in sports.items():
            key = _sport_key(sport_id, level)
            if weekend:
                quality_count = sum(
                    1 for d in spot.get("days", [])
                    if d["scores"].get(key, 0) >= QUALITY_THRESHOLD
                    and datetime.fromisoformat(d["date"]).weekday() in WEEKDAYS
                )
                if quality_count >= 1:
                    spot_matches.append((key, quality_count))
            else:
                quality_count = spot.get("summary", {}).get(key, {}).get("quality_days", 0)
                if quality_count >= min_days:
                    spot_matches.append((key, quality_count))

        if spot_matches:
            matching.append((spot, spot_matches))

    return matching


def _build_email(sports_json: str, matching: list[tuple]) -> tuple[str, str]:
    sports = json.loads(sports_json)
    sports_str = ", ".join(
        SPORT_LABELS.get(_sport_key(k, v), k) for k, v in sports.items()
    )

    rows = ""
    for spot, matches in matching[:10]:
        detail = ", ".join(
            f"{SPORT_LABELS.get(key, key)}: {q} días"
            for key, q in matches
        )
        rows += (
            f"<tr>"
            f"<td style='padding:8px 14px;border-bottom:1px solid #1e3a5f'>"
            f"<strong>{spot['name']}</strong>"
            f"<span style='color:#64748b;font-size:12px'> · {spot.get('region','')}</span>"
            f"</td>"
            f"<td style='padding:8px 14px;border-bottom:1px solid #1e3a5f;color:#94a3b8;font-size:13px'>{detail}</td>"
            f"</tr>"
        )

    body = f"""<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#060e1a;font-family:sans-serif">
  <div style="max-width:580px;margin:0 auto;background:#0d1b2a;border:1px solid #1e3a5f;border-radius:12px;overflow:hidden">
    <div style="padding:20px 24px;border-bottom:1px solid #1e3a5f">
      <h2 style="margin:0;color:#38bdf8;font-size:20px">🏄 Parte ideal</h2>
      <p style="margin:6px 0 0;color:#94a3b8;font-size:14px">
        Hay condiciones para <strong style="color:#e2e8f0">{sports_str}</strong> en los próximos días.
      </p>
    </div>
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr style="background:#111e35">
          <th style="padding:8px 14px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:#64748b">Spot</th>
          <th style="padding:8px 14px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:#64748b">Condiciones</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
    <div style="padding:16px 24px;border-top:1px solid #1e3a5f">
      <p style="margin:0;font-size:12px;color:#475569">
        Forecaster &mdash; parte meteorológico para deportes de agua
      </p>
    </div>
  </div>
</body>
</html>"""

    subject = f"🏄 Parte ideal para {sports_str}"
    return subject, body


def _send_email(to_email: str, subject: str, body_html: str):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = FROM_EMAIL
    msg["To"]      = to_email
    msg.attach(MIMEText(body_html, "html", "utf-8"))

    if SMTP_PORT == 465:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=15) as smtp:
            smtp.login(SMTP_USER, SMTP_PASS)
            smtp.sendmail(FROM_EMAIL, [to_email], msg.as_string())
    else:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.login(SMTP_USER, SMTP_PASS)
            smtp.sendmail(FROM_EMAIL, [to_email], msg.as_string())


def check_and_send_alerts(spots: list[dict]):
    if not SMTP_USER or not SMTP_PASS:
        print("[alerts] SMTP_USER/SMTP_PASS not set — skipping alert check")
        return

    alerts = load_alerts()
    if not alerts:
        return

    today_start = datetime.combine(date.today(), datetime.min.time()).timestamp()

    for alert in alerts:
        if alert["last_sent"] >= today_start:
            continue  # already sent today

        matching = _check_alert(alert, spots)
        if not matching:
            continue

        subject, body = _build_email(alert["sports"], matching)
        try:
            _send_email(alert["email"], subject, body)
            update_alert_sent(alert["id"])
            print(f"[alerts] sent to {alert['email']} ({len(matching)} spots)")
        except Exception as exc:
            print(f"[alerts] ERROR sending to {alert['email']}: {exc}")
