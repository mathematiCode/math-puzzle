"""Health and smoke-test endpoints."""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check() -> dict[str, str]:
    """Liveness probe used by hosting platforms and uptime checks."""
    return {"status": "ok"}


@router.get("/hello")
def hello() -> dict[str, str]:
    """Simple connectivity check (used by the frontend during setup)."""
    return {"message": "Hello from FastAPI"}
