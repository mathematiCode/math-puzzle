"""Per-player, per-level progress — currently the move count (issue #115).

Players are identified by an anonymous `client_id` (a UUID generated on the
device), so no accounts are required.

Levels are keyed by their *stable* `level_id` (the `id` from levels.json), not
their position in the level list, so levels can be reordered or inserted without
scrambling historical tracking (issue #105).
"""

from datetime import datetime, timezone

from sqlalchemy import UniqueConstraint
from sqlmodel import Field, SQLModel


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class LevelProgressBase(SQLModel):
    client_id: str = Field(max_length=64, index=True)
    # Stable, order-independent level identifier (levels.json `id`).
    level_id: int = Field(index=True)
    move_count: int = Field(default=0, ge=0)


class LevelProgress(LevelProgressBase, table=True):
    __tablename__ = "level_progress"
    __table_args__ = (
        UniqueConstraint("client_id", "level_id", name="uq_client_level"),
    )

    id: int | None = Field(default=None, primary_key=True)
    # Whether this player has ever finished this level. Set once (and never
    # cleared by a move-count sync) so completion analytics are monotonic.
    completed: bool = Field(default=False, index=True)
    # Move count captured at the moment the level was first completed, so
    # analytics can report how many moves it took players to solve each level
    # (issue #89). None until the level is completed.
    moves_at_completion: int | None = Field(default=None, ge=0)
    updated_at: datetime = Field(default_factory=_utcnow)


class LevelProgressUpsert(LevelProgressBase):
    """Request body for setting a player's move count for a level."""


class LevelCompletion(SQLModel):
    """Request body for marking a (client, level) as completed."""

    client_id: str = Field(max_length=64)
    level_id: int
    # Moves the player took to reach completion (optional; best-effort).
    move_count: int | None = Field(default=None, ge=0)


class LevelProgressRead(LevelProgressBase):
    """Response body."""

    id: int
    completed: bool
    moves_at_completion: int | None
    updated_at: datetime


class LevelCompletionStat(SQLModel):
    """Per-level aggregate for the analytics page, keyed by stable level_id."""

    level_id: int
    started_count: int
    completed_count: int
    # Average moves taken by players who completed this level, rounded to one
    # decimal. None when nobody has completed it (or no move data was sent).
    avg_moves_to_complete: float | None = None


class CompletionAnalytics(SQLModel):
    """Site-wide completion analytics across all levels."""

    total_players: int
    levels: list[LevelCompletionStat]
