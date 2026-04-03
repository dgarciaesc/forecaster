#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "🌊  Surf Forecast – Arranque"
echo "================================"

# ── Backend ──────────────────────────────────────────────────────────────────
echo ""
echo "▶  Backend (FastAPI)…"
cd "$ROOT/backend"

if command -v uv &>/dev/null; then
  uv venv --python 3.12 --quiet
  uv pip install --quiet -r requirements.txt
  source .venv/bin/activate 2>/dev/null || source venv/bin/activate 2>/dev/null
elif command -v python3 &>/dev/null; then
  python3 -m venv .venv
  source .venv/bin/activate
  pip install --quiet -r requirements.txt
else
  echo "ERROR: Python3 no encontrado. Instala uv: https://docs.astral.sh/uv/"
  exit 1
fi

echo "   Backend listo → http://localhost:8000"
uvicorn main:app --port 8000 --reload &
BACKEND_PID=$!

# ── Frontend ─────────────────────────────────────────────────────────────────
echo ""
echo "▶  Frontend (React + Vite)…"
cd "$ROOT/frontend"

if ! command -v npm &>/dev/null; then
  echo "ERROR: Node.js/npm no encontrado."
  echo "Instala Node.js desde https://nodejs.org (LTS) o con nvm."
  kill $BACKEND_PID 2>/dev/null
  exit 1
fi

npm install --silent
echo "   Frontend listo → http://localhost:5173"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅  App corriendo en http://localhost:5173"
echo "   (Ctrl+C para parar)"

wait $BACKEND_PID $FRONTEND_PID
