"""Database engine and session management.

Uses a single SQLAlchemy engine built from `DATABASE_URL`. Locally this is a
SQLite file (zero setup); in production it points at a managed Postgres.
"""

from collections.abc import Generator

from sqlmodel import Session, SQLModel, create_engine

from app.core.config import get_settings

settings = get_settings()

# SQLite + FastAPI's threadpool requires disabling the same-thread check.
_connect_args = (
    {"check_same_thread": False}
    if settings.database_url.startswith("sqlite")
    else {}
)

engine = create_engine(
    settings.database_url,
    echo=False,
    connect_args=_connect_args,
)


def init_db() -> None:
    """Create tables for all registered models (no-op if they already exist)."""
    # Import models so they register on SQLModel.metadata before create_all.
    from app.models import level_progress  # noqa: F401

    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a database session per request."""
    with Session(engine) as session:
        yield session
