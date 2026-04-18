import os, sys
sys.path.insert(0, '/Users/U01ADC2F/projects/forecaster/backend')
from pathlib import Path

for line in Path('/Users/U01ADC2F/projects/forecaster/backend/.env').read_text().splitlines():
    line = line.strip()
    if line and not line.startswith('#') and '=' in line:
        k, v = line.split('=', 1)
        os.environ[k.strip()] = v.strip()

from alerts import SMTP_USER, SMTP_PASS, FROM_EMAIL, check_and_send_alerts
print('SMTP_USER:', SMTP_USER)
print('PASS set:', bool(SMTP_PASS))
print('FROM_EMAIL:', FROM_EMAIL)

from db import load_spots, load_alerts

alerts = load_alerts()
print('Alerts in DB:', len(alerts))
for a in alerts:
    print(' -', a)

spots = load_spots(table='forecast')
print('Spots:', len(spots))
check_and_send_alerts(spots)
print('Done')
