# Forecaster

Previsión de surf, windsurf, wingfoil y kitesurf para los próximos 7 días en España, Portugal y Canarias. Mapa interactivo con mapa de calor, ranking de spots y parte meteorológico detallado por horas.

![stack](https://img.shields.io/badge/backend-FastAPI-009688?style=flat-square) ![stack](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61dafb?style=flat-square) ![stack](https://img.shields.io/badge/data-Open--Meteo-4ade80?style=flat-square)

---

## Características

- **Mapa interactivo** (Leaflet) con 48 spots en España, Portugal y Canarias
- **Mapa de calor** estilo Windy, interpolado con IDW, enmascarado sobre el mar
- **Ranking** de spots por días de calidad en los próximos 7 días
- **Selector de deporte**: Surf · Windsurf · Wingfoil · Kitesurf
- **Parte detallado** por horas al hacer clic en un spot (estilo Windguru)
- **Ficha del spot**: tipo de fondo, ola, mejores condiciones y recomendaciones
- **Buscador** de spots en el header
- **Login con Google** (desactivado por defecto, activable con feature flag)
- **Base de datos SQLite** con refresco automático cada hora vía `/api/refresh`
- **Despliegue con Docker** (Railway, Render, o cualquier VPS)

---

## Estructura del proyecto

```
forecaster/
├── Dockerfile              # Build multi-stage: frontend → backend
├── .dockerignore
├── start.sh                # Script de arranque local (backend + frontend)
│
├── backend/
│   ├── serve.py            # Punto de entrada: uvicorn en thread (hereda acceso de red)
│   ├── main.py             # FastAPI: rutas /api/forecast, /api/refresh, /api/health
│   ├── forecaster.py       # Lógica de puntuación y llamadas a Open-Meteo (via curl)
│   ├── spots.py            # Lista de 48 spots + 20 puntos de mar para el heatmap
│   ├── db.py               # Capa SQLite: guardar/leer previsiones
│   ├── refresh.py          # Script standalone para poblar la DB manualmente
│   ├── requirements.txt
│   └── .env                # Variables de entorno (no se sube al repo)
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── .env                 # Variables de entorno del frontend (no se sube al repo)
    └── src/
        ├── main.jsx         # Entrada React, envuelve con GoogleOAuthProvider
        ├── App.jsx          # Estado global, layout principal
        ├── index.css        # Variables CSS, estilos globales, animaciones
        ├── data/
        │   └── spotInfo.js  # Descripciones estáticas de cada spot
        └── components/
            ├── Header.jsx        # Logo animado + buscador de spots
            ├── MapView.jsx       # Mapa Leaflet + marcadores + leyenda
            ├── HeatmapLayer.jsx  # Canvas heatmap con IDW + máscara de tierra
            ├── Ranking.jsx       # Panel izquierdo: ranking por sport
            ├── SportSelector.jsx # Panel derecho: selector de deporte
            ├── SportIcons.jsx    # Iconos SVG para cada deporte
            ├── SpotInfoCard.jsx  # Tarjeta flotante con info del spot seleccionado
            ├── WindguruModal.jsx # Modal con parte horario estilo Windguru
            └── LoginScreen.jsx   # Pantalla de login con Google (feature flag)
```

---

## Requisitos

- **Python 3.12+** (o [uv](https://docs.astral.sh/uv/))
- **Node.js 18+** / npm

---

## Arranque local

### Opción rápida (script automático)

```bash
./start.sh
```

Instala dependencias, arranca backend y frontend, y abre la app en `http://localhost:5173`.

### Opción manual

**Backend:**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Poblar la base de datos (primera vez)
python3 refresh.py

# Arrancar el servidor
python3 serve.py
```

**Frontend** (en otra terminal):
```bash
cd frontend
npm install
npm run dev
```

La app estará en `http://localhost:5173` y la API en `http://localhost:8000`.

### Poblar datos manualmente

Si la DB está vacía o quieres refrescar los datos:

```bash
# Opción A: script directo
cd backend && python3 refresh.py

# Opción B: via API (con el servidor corriendo)
curl http://localhost:8000/api/refresh
```

---

## Variables de entorno

### `backend/.env`

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `AUTH_ENABLED` | `false` | Activa el login con Google |
| `GOOGLE_CLIENT_ID` | — | Client ID de Google OAuth |
| `DB_PATH` | `backend/forecast.db` | Ruta de la base de datos SQLite |

### `frontend/.env`

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `VITE_AUTH_ENABLED` | `false` | Activa la pantalla de login |
| `VITE_GOOGLE_CLIENT_ID` | — | Client ID de Google OAuth (mismo que backend) |

---

## Activar login con Google

1. Ve a [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Crea un **OAuth 2.0 Client ID** de tipo *Web application*
3. Añade `http://localhost:5173` en *Authorized JavaScript origins* (y tu dominio de producción)
4. Copia el Client ID y actualiza ambos `.env`:

```bash
# backend/.env
AUTH_ENABLED=true
GOOGLE_CLIENT_ID=XXXXXXXX.apps.googleusercontent.com

# frontend/.env
VITE_AUTH_ENABLED=true
VITE_GOOGLE_CLIENT_ID=XXXXXXXX.apps.googleusercontent.com
```

5. Reinicia ambos servidores.

---

## Despliegue

La app se distribuye como un único contenedor Docker: el frontend se compila dentro del build y FastAPI lo sirve como archivos estáticos.

### Railway (recomendado)

1. Sube el código a GitHub
2. [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Railway detecta el `Dockerfile` automáticamente
4. En **Settings → Variables** añade las variables de entorno necesarias
5. En **Settings → Volumes** añade un volumen en `/app/data` para persistir la DB
6. Tras el deploy, llama a `https://TU_URL/api/refresh` para poblar la DB

### Render

1. [render.com](https://render.com) → New Web Service → Docker
2. Añade las variables de entorno
3. Add Disk → mount path `/app/data`

### VPS / servidor propio

```bash
docker build -t forecaster .
docker run -d \
  -p 8000:8000 \
  -v /ruta/datos:/app/data \
  -e AUTH_ENABLED=false \
  forecaster
```

---

## Cómo funciona la puntuación

Cada hora del forecast recibe una puntuación de 0–100 según el deporte:

- **Surf**: 40% altura de ola + 35% período + 25% viento (offshore penaliza menos, onshore penaliza fuerte). Cada spot tiene `coast_facing` para calcular el ángulo del viento respecto a la playa.
- **Windsurf / Kitesurf**: 70% velocidad de viento + 30% altura de ola
- **Wingfoil**: 80% viento + 20% ola

Un día se considera **de calidad** si la media diurna (8h–20h) supera 60/100. El ranking ordena por número de días de calidad en los próximos 7 días.

Los datos provienen de [Open-Meteo](https://open-meteo.com/): Marine API (olas) + Forecast API (viento).
