"""Database engine and session management.

Uses a single SQLAlchemy engine built from `DATABASE_URL`. Locally this is a
SQLite file (zero setup); in production it points at a managed Postgres.
"""

from collections.abc import Generator

from sqlalchemy import inspect, text
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


# Columns added to `level_progress` after its initial release (issue #89).
# `create_all` only creates whole missing tables, never new columns on an
# existing one, so we add these by hand for databases provisioned before the
# analytics feature. Kept tiny and additive on purpose — the project has no
# migration framework. (type_ddl, backfill_value) per column name.
_ADDED_COLUMNS: dict[str, tuple[str, object]] = {
    "completed": ("BOOLEAN", False),
    "moves_at_completion": ("INTEGER", None),
}

# Columns renamed after the initial release — {old_name: new_name}. The original
# `level` column held the array index; it now holds the stable level_id (issue
# #105), so the rename is just structural (names/types match, values carry over).
_RENAMED_COLUMNS: dict[str, str] = {"level": "level_id"}


def _migrate_level_progress() -> None:
    """Bring an existing level_progress table up to the current schema.

    Idempotent and dialect-agnostic (SQLite 3.25+ and Postgres): renames legacy
    columns and adds any missing analytics columns, backfilling existing rows so
    non-nullable columns read correctly. No-op when the table was just created
    by `create_all` with the current schema.
    """
    inspector = inspect(engine)
    if "level_progress" not in inspector.get_table_names():
        return

    existing = {col["name"] for col in inspector.get_columns("level_progress")}

    renames = {
        old: new
        for old, new in _RENAMED_COLUMNS.items()
        if old in existing and new not in existing
    }
    additions = {
        name: spec
        for name, spec in _ADDED_COLUMNS.items()
        # A pending rename supplies the column, so don't also add it.
        if name not in existing and name not in renames.values()
    }
    if not renames and not additions:
        return

    with engine.begin() as conn:
        # DDL below cannot be parameterized; every identifier is a fixed
        # constant from the maps above, never user input.
        for old, new in renames.items():
            conn.execute(
                text(f"ALTER TABLE level_progress RENAME COLUMN {old} TO {new}")
            )
        for name, (type_ddl, backfill) in additions.items():
            conn.execute(
                text(f"ALTER TABLE level_progress ADD COLUMN {name} {type_ddl}")
            )
            if backfill is not None:
                conn.execute(
                    text(
                        f"UPDATE level_progress SET {name} = :val "
                        f"WHERE {name} IS NULL"
                    ),
                    {"val": backfill},
                )


def init_db() -> None:
    """Create tables for all registered models (no-op if they already exist)."""
    # Import models so they register on SQLModel.metadata before create_all.
    from app.models import level_progress  # noqa: F401

    SQLModel.metadata.create_all(engine)
    _migrate_level_progress()


def get_session() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a database session per request."""
    with Session(engine) as session:
        yield session
