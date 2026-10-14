import os
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import PredictRequest, PredictResponse, ModelInfoResponse, SUPPORTED_CATEGORIES, CATEGORY_DESCRIPTIONS

app = FastAPI(
    title="NYAYASETU ML Service",
    description="Citizen Legal Issue Classification and Source Retrieval Guidance API",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
MODEL_FILE = os.path.join(MODEL_DIR, "best_classifier.joblib")
METADATA_FILE = os.path.join(MODEL_DIR, "model_metadata.joblib")

loaded_model = None
model_metadata = {}

def load_active_model():
    global loaded_model, model_metadata
    if os.path.exists(MODEL_FILE):
        try:
            loaded_model = joblib.load(MODEL_FILE)
            if os.path.exists(METADATA_FILE):
                model_metadata = joblib.load(METADATA_FILE)
        except Exception as e:
            print(f"Error loading model: {e}")
            loaded_model = None

# Attempt load on startup
load_active_model()

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "nyayasetu-ml-service",
        "version": "1.0.0",
        "model_loaded": loaded_model is not None,
        "active_model": model_metadata.get("model_name", "none")
    }

@app.get("/model/info", response_model=ModelInfoResponse)
def get_model_info():
    if loaded_model is None:
        return ModelInfoResponse(
            status="untrained",
            active_model=None,
            model_version=None,
            supported_categories=SUPPORTED_CATEGORIES,
            training_data_version=None,
            evaluation_macro_f1=None
        )
    return ModelInfoResponse(
        status="ready",
        active_model=model_metadata.get("model_name", "LogisticRegression"),
        model_version=model_metadata.get("version", "1.0.0"),
        supported_categories=SUPPORTED_CATEGORIES,
        training_data_version=model_metadata.get("dataset_version", "v1.0"),
        evaluation_macro_f1=model_metadata.get("macro_f1", 0.0)
    )

@app.post("/predict", response_model=PredictResponse)
def predict_issue(request: PredictRequest):
    global loaded_model
    if loaded_model is None:
        load_active_model()

    if loaded_model is None:
        raise HTTPException(
            status_code=503,
            detail="ML Issue Classification model is not yet trained. Run training pipeline first (python src/train.py)."
        )

    text = request.query.strip()
    try:
        # Prediction via pipeline (TF-IDF Vectorizer + Classifier)
        probas = loaded_model.predict_proba([text])[0]
        classes = loaded_model.classes_
        top_idx = probas.argmax()
        top_class = classes[top_idx]
        confidence = float(probas[top_idx])

        # Confidence Calibration / Clarification Policy
        # If highest confidence is below 0.35, classify as other_or_unclear
        needs_clarification = confidence < 0.35
        clarification_prompt = None
        if needs_clarification:
            clarification_prompt = "Could you provide more context, such as the specific scheme, authority, or problem you are facing?"

        prob_dict = {str(c): round(float(p), 4) for c, p in zip(classes, probas)}

        return PredictResponse(
            predicted_category=top_class if not needs_clarification else "other_or_unclear",
            confidence=round(confidence, 4),
            model_version=model_metadata.get("version", "1.0.0"),
            model_type=model_metadata.get("model_name", "LogisticRegression"),
            needs_clarification=needs_clarification,
            clarification_prompt=clarification_prompt,
            category_description=CATEGORY_DESCRIPTIONS.get(top_class, ""),
            all_probabilities=prob_dict
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")
