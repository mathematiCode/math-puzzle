from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

from app.core.db import get_session
from app.main import app

# Import models so their tables are registered on SQLModel.metadata.
from app.models import level_progress  # noqa: F401


@pytest.fixture
def session() -> Generator[Session, None, None]:
    """A fresh in-memory SQLite database per test."""
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    engine.dispose()


@pytest.fixture
def client(session: Session) -> Generator[TestClient, None, None]:
    """TestClient wired to the per-test in-memory database.

    Instantiated without the context manager so the app lifespan (which would
    create the real on-disk database) does not run — tests stay fully isolated.
    """

    def get_session_override() -> Generator[Session, None, None]:
        yield session

    app.dependency_overrides[get_session] = get_session_override
    yield TestClient(app)
    app.dependency_overrides.clear()
