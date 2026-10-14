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

def test_ml_model_info_trained():
    response = client.get("/model/info")
    assert response.status_code == 200
    data = response.json()
    assert "supported_categories" in data
    assert len(data["supported_categories"]) >= 10
    assert "agricultural_insurance" in data["supported_categories"]
    assert data["status"] in ["ready", "untrained"]

def test_predict_real_query():
    response = client.post("/predict", json={
        "query": "My PMFBY crop insurance claim was rejected after heavy rainfall in Maharashtra."
    })
    assert response.status_code == 200
    data = response.json()
    assert "predicted_category" in data
    assert "confidence" in data
    assert "model_version" in data
    assert "all_probabilities" in data
    assert data["confidence"] > 0
