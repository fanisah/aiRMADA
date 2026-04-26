from fastapi.testclient import TestClient
from app.main import app
import os

os.environ["AI_SERVICE_SECRET"] = "test-secret"

client = TestClient(app)
HEADERS = {"X-API-Key": "test-secret"}


def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_optimize_route():
    payload = {
        "origin": {"lat": -7.7956, "lng": 110.3695, "shipment_id": "origin"},
        "destinations": [
            {"lat": -7.8014, "lng": 110.3647, "shipment_id": "ship-1"},
            {"lat": -7.7822, "lng": 110.3672, "shipment_id": "ship-2"},
            {"lat": -7.8102, "lng": 110.3801, "shipment_id": "ship-3"},
        ],
    }
    resp = client.post("/optimize-route/", json=payload, headers=HEADERS)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["ordered_waypoints"]) == 3
    assert data["estimated_distance_km"] > 0


def test_detect_anomaly_gps_silent():
    payload = {
        "vehicle_id": "vehicle-123",
        "last_gps_minutes_ago": 20,
    }
    resp = client.post("/detect-anomaly/", json=payload, headers=HEADERS)
    assert resp.status_code == 200
    anomalies = resp.json()["anomalies"]
    assert len(anomalies) == 1
    assert anomalies[0]["anomaly_type"] == "gps_silent"


def test_unauthorized():
    resp = client.post("/optimize-route/", json={}, headers={"X-API-Key": "wrong"})
    assert resp.status_code == 401
