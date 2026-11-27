# Frectangles Backend (FastAPI)

The API for the Frectangles math puzzle game.

## Layout

```
backend/
├── app/
│   ├── main.py            # App factory + CORS, mounts routers, DB init
│   ├── core/
│   │   ├── config.py      # Settings loaded from env / .env
│   │   └── db.py          # SQLModel engine + session dependency
│   ├── models/
│   │   └── level_progress.py  # per-player, per-level move count
│   └── api/
│       └── routes/
│           ├── health.py   # GET /health, GET /hello
│           └── progress.py # PUT /api/progress, GET /api/progress/{client_id}
├── tests/                 # pytest + FastAPI TestClient
├── requirements.txt       # runtime dependencies
├── requirements-dev.txt   # runtime + test dependencies
├── Dockerfile             # container image (runs on any container host)
└── .env.example           # copy to .env for local config
```

## API

| Method | Path                          | Description                                        |
| ------ | ----------------------------- | -------------------------------------------------- |
| GET    | `/health`                     | Liveness probe.                                    |
| GET    | `/hello`                      | Connectivity smoke test.                           |
| PUT    | `/api/progress`               | Upsert a player's move count for a level.          |
| PUT    | `/api/progress/complete`      | Mark a (client, level) completed, recording moves. |
| GET    | `/api/progress/{client_id}`   | List a player's stored per-level progress.         |
| GET    | `/api/analytics/completions`  | Aggregate started/completed/avg-moves per level.   |

Players are identified by an anonymous `client_id` (a UUID the frontend
generates and stores in `localStorage`) — no accounts required.

## Requirements

- Python 3.12+ (the container image pins 3.12)

## Local development

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
cp .env.example .env               # optional; defaults work out of the box

uvicorn app.main:app --reload      # http://localhost:8000
```

- Interactive API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

## Tests

```bash
pip install -r requirements-dev.txt
pytest
```

## Configuration

Settings come from environment variables (or a local `.env`). See
`.env.example`:

| Variable       | Default                                            | Description                                                        |
| -------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| `ENVIRONMENT`  | `development`                                       | `development` or `production`.                                    |
| `CORS_ORIGINS` | `http://localhost:3000,https://frectangles.com`    | Comma-separated list of allowed origins.                          |
| `DATABASE_URL` | `sqlite:///./frectangles.db`                        | SQLAlchemy URL. SQLite locally (zero setup); Postgres in prod.    |

Tables are created automatically on startup (`SQLModel.metadata.create_all`).
When the schema grows beyond this, introduce Alembic migrations.

## Deployment (Render Blueprint)

`render.yaml` (repo root) is an infrastructure-as-code blueprint: in Render,
choose **New → Blueprint** and connect this repo. Render builds the API from
`backend/Dockerfile`, provisions a managed Postgres, and injects `DATABASE_URL`
automatically — no manual environment wiring. The app code is host-agnostic
(it just reads `DATABASE_URL`), so any other Postgres host works too.

## Docker

```bash
docker build -t frectangles-api ./backend
docker run -p 8000:8000 frectangles-api
```

The container reads `$PORT` if the host provides one (defaults to `8000`).
