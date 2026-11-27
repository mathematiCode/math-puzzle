from fastapi.testclient import TestClient


def test_upsert_creates_then_updates(client: TestClient) -> None:
    # First PUT creates the row.
    create = client.put(
        "/api/progress",
        json={"client_id": "abc", "level": 0, "move_count": 3},
    )
    assert create.status_code == 200
    body = create.json()
    assert body["client_id"] == "abc"
    assert body["level"] == 0
    assert body["move_count"] == 3
    assert "id" in body and "updated_at" in body
    first_id = body["id"]

    # Second PUT for the same (client, level) updates in place — same row id.
    update = client.put(
        "/api/progress",
        json={"client_id": "abc", "level": 0, "move_count": 7},
    )
    assert update.status_code == 200
    assert update.json()["move_count"] == 7
    assert update.json()["id"] == first_id


def test_list_returns_only_that_clients_levels(client: TestClient) -> None:
    client.put("/api/progress", json={"client_id": "abc", "level": 0, "move_count": 1})
    client.put("/api/progress", json={"client_id": "abc", "level": 1, "move_count": 2})
    client.put("/api/progress", json={"client_id": "other", "level": 0, "move_count": 9})

    response = client.get("/api/progress/abc")
    assert response.status_code == 200
    rows = response.json()
    assert [(r["level"], r["move_count"]) for r in rows] == [(0, 1), (1, 2)]


def test_list_unknown_client_is_empty(client: TestClient) -> None:
    response = client.get("/api/progress/nobody")
    assert response.status_code == 200
    assert response.json() == []


def test_negative_move_count_is_rejected(client: TestClient) -> None:
    response = client.put(
        "/api/progress",
        json={"client_id": "abc", "level": 0, "move_count": -1},
    )
    assert response.status_code == 422
