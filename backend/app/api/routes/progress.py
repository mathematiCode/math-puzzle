"""Endpoints for storing and reading per-level move counts (issue #115).

The frontend is the source of truth (localStorage) and sends the current count
here best-effort, so the upsert simply *sets* the stored value — making retries
idempotent.
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.core.db import get_session
from app.models.level_progress import (
    LevelCompletion,
    LevelProgress,
    LevelProgressRead,
    LevelProgressUpsert,
)

router = APIRouter(prefix="/api/progress", tags=["progress"])


def _find_row(
    session: Session, client_id: str, level_id: int
) -> LevelProgress | None:
    return session.exec(
        select(LevelProgress).where(
            LevelProgress.client_id == client_id,
            LevelProgress.level_id == level_id,
        )
    ).first()


@router.put("", response_model=LevelProgressRead)
def upsert_progress(
    payload: LevelProgressUpsert,
    session: Session = Depends(get_session),
) -> LevelProgress:
    """Create or update the stored move count for (client_id, level_id)."""
    existing = _find_row(session, payload.client_id, payload.level_id)

    if existing is None:
        row = LevelProgress(**payload.model_dump())
    else:
        existing.move_count = payload.move_count
        existing.updated_at = datetime.now(timezone.utc)
        row = existing

    session.add(row)
    session.commit()
    session.refresh(row)
    return row


@router.put("/complete", response_model=LevelProgressRead)
def complete_level(
    payload: LevelCompletion,
    session: Session = Depends(get_session),
) -> LevelProgress:
    """Mark a (client_id, level) as completed.

    Idempotent: completion is a one-way flag, so repeated calls are harmless and
    a move-count sync never clears it. Creates the row if the player somehow
    completes a level we have no prior progress for.
    """
    existing = _find_row(session, payload.client_id, payload.level_id)

    if existing is None:
        row = LevelProgress(
            client_id=payload.client_id,
            level_id=payload.level_id,
            completed=True,
            moves_at_completion=payload.move_count,
        )
    else:
        existing.completed = True
        # Record moves only on the first completion so the stat reflects how
        # many moves it took to *first* solve the level, not a later replay.
        if existing.moves_at_completion is None and payload.move_count is not None:
            existing.moves_at_completion = payload.move_count
        existing.updated_at = datetime.now(timezone.utc)
        row = existing

    session.add(row)
    session.commit()
    session.refresh(row)
    return row


@router.get("/{client_id}", response_model=list[LevelProgressRead])
def list_progress(
    client_id: str,
    session: Session = Depends(get_session),
) -> list[LevelProgress]:
    """Return all stored level progress for a player."""
    return list(
        session.exec(
            select(LevelProgress)
            .where(LevelProgress.client_id == client_id)
            .order_by(LevelProgress.level_id)
        ).all()
    )
