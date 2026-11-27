from fastapi.testclient import TestClient


def test_complete_marks_existing_row(client: TestClient) -> None:
    client.put("/api/progress", json={"client_id": "abc", "level_id": 5, "move_count": 4})

    resp = client.put(
        "/api/progress/complete",
        json={"client_id": "abc", "level_id": 5, "move_count": 4},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["completed"] is True
    # Completion must not clobber the existing move count.
    assert body["move_count"] == 4
    assert body["moves_at_completion"] == 4


def test_moves_at_completion_records_first_solve_only(client: TestClient) -> None:
    client.put(
        "/api/progress/complete",
        json={"client_id": "abc", "level_id": 5, "move_count": 7},
    )
    # Replaying and re-completing with a different count must not overwrite the
    # first-solve move count.
    client.put(
        "/api/progress/complete",
        json={"client_id": "abc", "level_id": 5, "move_count": 99},
    )
    rows = client.get("/api/progress/abc").json()
    assert rows[0]["moves_at_completion"] == 7


def test_complete_creates_row_when_missing(client: TestClient) -> None:
    resp = client.put("/api/progress/complete", json={"client_id": "new", "level_id": 2})
    assert resp.status_code == 200
    assert resp.json()["completed"] is True
    assert resp.json()["move_count"] == 0


def test_complete_is_idempotent_and_survives_move_sync(client: TestClient) -> None:
    client.put("/api/progress/complete", json={"client_id": "abc", "level_id": 5})
    # A later move-count sync must NOT reset completed back to False.
    client.put("/api/progress", json={"client_id": "abc", "level_id": 5, "move_count": 9})
    # Completing again is harmless.
    client.put("/api/progress/complete", json={"client_id": "abc", "level_id": 5})

    rows = client.get("/api/progress/abc").json()
    assert rows[0]["completed"] is True
    assert rows[0]["move_count"] == 9


def test_analytics_counts_distinct_players(client: TestClient) -> None:
    # Two players start level_id 5; both complete it in 4 and 6 moves respectively.
    client.put("/api/progress", json={"client_id": "p1", "level_id": 5, "move_count": 4})
    client.put("/api/progress", json={"client_id": "p2", "level_id": 5, "move_count": 6})
    client.put(
        "/api/progress/complete",
        json={"client_id": "p1", "level_id": 5, "move_count": 4},
    )
    # p2 completes level_id 5 as well.
    client.put(
        "/api/progress/complete",
        json={"client_id": "p2", "level_id": 5, "move_count": 6},
    )
    # p1 also completes level_id 8 but without sending a move count.
    client.put("/api/progress/complete", json={"client_id": "p1", "level_id": 8})

    resp = client.get("/api/analytics/completions")
    assert resp.status_code == 200
    data = resp.json()

    assert data["total_players"] == 2
    by_level = {lvl["level_id"]: lvl for lvl in data["levels"]}

    assert by_level[5]["started_count"] == 2
    assert by_level[5]["completed_count"] == 2
    # Average of 4 and 6 moves.
    assert by_level[5]["avg_moves_to_complete"] == 5.0
    assert by_level[8]["started_count"] == 1
    assert by_level[8]["completed_count"] == 1
    assert by_level[8]["avg_moves_to_complete"] is None


def test_analytics_empty_when_no_activity(client: TestClient) -> None:
    resp = client.get("/api/analytics/completions")
    assert resp.status_code == 200
    assert resp.json() == {"total_players": 0, "levels": []}
