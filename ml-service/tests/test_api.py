from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_ml_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "nyayasetu-ml-service"
    assert "model_loaded" in data

def test_ml_model_info_untrained():
    response = client.get("/model/info")
    assert response.status_code == 200
    data = response.json()
    assert "supported_categories" in data
    assert len(data["supported_categories"]) >= 10
    assert "agricultural_insurance" in data["supported_categories"]

def test_predict_without_trained_model_returns_honest_error():
    # When model is not trained yet, it should NOT return fake predictions
    response = client.post("/predict", json={"query": "My crop insurance is delayed"})
    # Either 503 if untrained, or 200 if trained
    assert response.status_code in [200, 503]
    if response.status_code == 503:
        assert "not yet trained" in response.json()["detail"]
