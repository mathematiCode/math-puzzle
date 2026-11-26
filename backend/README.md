# Frectangles Backend (FastAPI)

The API for the Frectangles math puzzle game.

> **Status:** project scaffold. No database yet — persistence (e.g. per-level
> move tracking from issue #115) lands in a follow-up PR.

## Layout

```
backend/
├── app/
│   ├── main.py            # App factory + CORS, mounts routers
│   ├── core/
│   │   └── config.py      # Settings loaded from env / .env
│   └── api/
│       └── routes/
│           └── health.py  # GET /health, GET /hello
├── tests/                 # pytest + FastAPI TestClient
├── requirements.txt       # runtime dependencies
├── requirements-dev.txt   # runtime + test dependencies
├── Dockerfile             # container image (runs on any container host)
└── .env.example           # copy to .env for local config
```

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

| Variable       | Default                                            | Description                               |
| -------------- | -------------------------------------------------- | ----------------------------------------- |
| `ENVIRONMENT`  | `development`                                       | `development` or `production`.            |
| `CORS_ORIGINS` | `http://localhost:3000,https://frectangles.com`    | Comma-separated list of allowed origins.  |

## Docker

```bash
docker build -t frectangles-api ./backend
docker run -p 8000:8000 frectangles-api
```

The container reads `$PORT` if the host provides one (defaults to `8000`).
