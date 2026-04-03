"""Start uvicorn in a thread so the process inherits full network access."""
import os
import threading
from pathlib import Path
import uvicorn

# Load .env before importing app
env_file = Path(__file__).parent / ".env"
if env_file.exists():
    for line in env_file.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())

from main import app


def run():
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")


if __name__ == "__main__":
    t = threading.Thread(target=run, daemon=False)
    t.start()
    t.join()
