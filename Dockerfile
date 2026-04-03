# ── Stage 1: Build React frontend ─────────────────────────────────────────────
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
ARG VITE_AUTH_ENABLED=false
ARG VITE_GOOGLE_CLIENT_ID=
RUN npm run build

# ── Stage 2: Python backend ────────────────────────────────────────────────────
FROM python:3.12-slim
WORKDIR /app

# Install curl (needed for Open-Meteo + Google token verification)
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Backend source
COPY backend/ ./backend/

# Frontend build output
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# SQLite DB lives here (mount a volume at /app/data in production)
RUN mkdir -p /app/data
ENV DB_PATH=/app/data/forecast.db

WORKDIR /app/backend
EXPOSE 8000
CMD ["python", "serve.py"]
