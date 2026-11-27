"""Aggregate analytics across all players (issue #89).

Powers the (unlisted) secret analytics page: how many anonymous players have
started and completed each level. All counts are of distinct `client_id`s.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlmodel import Session, select

from app.core.db import get_session
from app.models.level_progress import (
    CompletionAnalytics,
    LevelCompletionStat,
    LevelProgress,
)

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/completions", response_model=CompletionAnalytics)
def completion_analytics(
    session: Session = Depends(get_session),
) -> CompletionAnalytics:
    """Per-level started/completed player counts, plus the total player count.

    A player has "started" a level if any progress row exists for it, and
    "completed" it if that row's `completed` flag is set. Levels with no
    activity are omitted; the frontend fills in zeros for the full level list.
    """
    # Distinct players who have any progress row for each level ("started").
    started_rows = session.exec(
        select(
            LevelProgress.level_id,
            func.count(func.distinct(LevelProgress.client_id)),
        )
        .group_by(LevelProgress.level_id)
        .order_by(LevelProgress.level_id)
    ).all()

    # Distinct players whose row for the level is flagged completed, plus the
    # average moves it took them to get there (ignoring rows with no move data).
    completed_rows = session.exec(
        select(
            LevelProgress.level_id,
            func.count(func.distinct(LevelProgress.client_id)),
            func.avg(LevelProgress.moves_at_completion),
        )
        .where(LevelProgress.completed == True)  # noqa: E712
        .group_by(LevelProgress.level_id)
    ).all()
    completed_by_level = {
        level_id: (count, avg_moves)
        for level_id, count, avg_moves in completed_rows
    }

    levels = []
    for level_id, started in started_rows:
        count, avg_moves = completed_by_level.get(level_id, (0, None))
        levels.append(
            LevelCompletionStat(
                level_id=level_id,
                started_count=started,
                completed_count=count,
                # AVG returns float on SQLite but Decimal on Postgres — cast so
                # rounding and the float response field behave identically.
                avg_moves_to_complete=(
                    round(float(avg_moves), 1) if avg_moves is not None else None
                ),
            )
        )

    total_players = (
        session.exec(
            select(func.count(func.distinct(LevelProgress.client_id)))
        ).one()
    )

    return CompletionAnalytics(total_players=total_players, levels=levels)
