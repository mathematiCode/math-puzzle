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
    LevelProgress,
    LevelProgressRead,
    LevelProgressUpsert,
)

router = APIRouter(prefix="/api/progress", tags=["progress"])


@router.put("", response_model=LevelProgressRead)
def upsert_progress(
    payload: LevelProgressUpsert,
    session: Session = Depends(get_session),
) -> LevelProgress:
    """Create or update the stored move count for (client_id, level)."""
    existing = session.exec(
        select(LevelProgress).where(
            LevelProgress.client_id == payload.client_id,
            LevelProgress.level == payload.level,
        )
    ).first()

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
            .order_by(LevelProgress.level)
        ).all()
    )
