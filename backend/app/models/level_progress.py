"""Per-player, per-level progress — currently the move count (issue #115).

Players are identified by an anonymous `client_id` (a UUID generated on the
device), so no accounts are required.
"""

from datetime import datetime, timezone

from sqlalchemy import UniqueConstraint
from sqlmodel import Field, SQLModel


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class LevelProgressBase(SQLModel):
    client_id: str = Field(max_length=64, index=True)
    level: int = Field(index=True)
    move_count: int = Field(default=0, ge=0)


class LevelProgress(LevelProgressBase, table=True):
    __tablename__ = "level_progress"
    __table_args__ = (
        UniqueConstraint("client_id", "level", name="uq_client_level"),
    )

    id: int | None = Field(default=None, primary_key=True)
    updated_at: datetime = Field(default_factory=_utcnow)


class LevelProgressUpsert(LevelProgressBase):
    """Request body for setting a player's move count for a level."""


class LevelProgressRead(LevelProgressBase):
    """Response body."""

    id: int
    updated_at: datetime
