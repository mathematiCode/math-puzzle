"""FastAPI application entry point.

Run locally with:  uvicorn app.main:app --reload
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import analytics, health, progress
from app.core.config import get_settings
from app.core.db import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup (no-op if they already exist).
    init_db()
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name, lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(progress.router)
    app.include_router(analytics.router)
    return app


app = create_app()
