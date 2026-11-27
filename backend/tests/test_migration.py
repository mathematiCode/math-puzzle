"""The lightweight level_progress schema migration (issues #89, #105).

Simulates a database provisioned *before* the analytics columns and the stable
level_id rename existed, and verifies startup brings it up to date without a
migration framework.
"""

import app.core.db as db_module
from sqlalchemy import create_engine, inspect, text


def _legacy_table(engine) -> None:
    """Create the original pre-#89/#105 level_progress table + one row."""
    with engine.begin() as conn:
        conn.execute(
            text(
                """
                CREATE TABLE level_progress (
                    id INTEGER PRIMARY KEY,
                    client_id VARCHAR,
                    level INTEGER,
                    move_count INTEGER,
                    updated_at DATETIME
                )
                """
            )
        )
        conn.execute(
            text(
                "INSERT INTO level_progress (client_id, level, move_count) "
                "VALUES ('old', 3, 5)"
            )
        )


def test_migrate_renames_level_and_adds_columns(monkeypatch) -> None:
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}
    )
    _legacy_table(engine)

    monkeypatch.setattr(db_module, "engine", engine)
    db_module._migrate_level_progress()

    cols = {c["name"] for c in inspect(engine).get_columns("level_progress")}
    # `level` renamed to `level_id`; analytics columns added.
    assert "level" not in cols
    assert {"level_id", "completed", "moves_at_completion"} <= cols

    with engine.connect() as conn:
        row = conn.execute(
            text(
                "SELECT level_id, completed, moves_at_completion "
                "FROM level_progress WHERE client_id = 'old'"
            )
        ).one()
    # Value carried over under the new name; new columns backfilled sanely.
    assert row[0] == 3
    assert bool(row[1]) is False
    assert row[2] is None


def test_migrate_is_idempotent(monkeypatch) -> None:
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}
    )
    monkeypatch.setattr(db_module, "engine", engine)
    # No table yet — must not raise.
    db_module._migrate_level_progress()

    # Create the current schema, then run twice: both no-ops.
    from app.models.level_progress import LevelProgress  # noqa: F401
    from sqlmodel import SQLModel

    SQLModel.metadata.create_all(engine)
    db_module._migrate_level_progress()
    db_module._migrate_level_progress()

    cols = {c["name"] for c in inspect(engine).get_columns("level_progress")}
    assert "level_id" in cols
