import os
import json
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, f1_score, accuracy_score, precision_score, recall_score
from .prepare_data import prepare_dataset, SAMPLE_CSV

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
REPORTS_DIR = os.path.join(os.path.dirname(__file__), "..", "reports")

def train_and_evaluate():
    os.makedirs(MODELS_DIR, exist_ok=True)
    os.makedirs(REPORTS_DIR, exist_ok=True)

    if not os.path.exists(SAMPLE_CSV):
        prepare_dataset()

    df = pd.read_csv(SAMPLE_CSV)
    print(f"Loaded {len(df)} samples across {df['issue_category'].nunique()} categories.")

    X = df["query"]
    y = df["issue_category"]

    # Stratified split: 70% Train, 30% Test (due to initial curated sample size)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.30, random_state=42, stratify=y
    )

    candidate_models = {
        "LogisticRegression": LogisticRegression(max_iter=1000, C=1.5, random_state=42),
        "MultinomialNB": MultinomialNB(alpha=0.1),
    }

    results = {}
    best_model_name = None
    best_macro_f1 = -1.0
    best_pipeline = None

    for name, clf in candidate_models.items():
        pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1, sublinear_tf=True)),
            ("clf", clf)
        ])

        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)

        acc = float(accuracy_score(y_test, y_pred))
        macro_f1 = float(f1_score(y_test, y_pred, average="macro", zero_division=0))
        precision = float(precision_score(y_test, y_pred, average="macro", zero_division=0))
        recall = float(recall_score(y_test, y_pred, average="macro", zero_division=0))

        report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)

        results[name] = {
            "accuracy": round(acc, 4),
            "macro_f1": round(macro_f1, 4),
            "macro_precision": round(precision, 4),
            "macro_recall": round(recall, 4),
            "report": report
        }

        print(f"[RESULT] {name}: Accuracy={acc:.4f}, Macro-F1={macro_f1:.4f}")

        if macro_f1 > best_macro_f1:
            best_macro_f1 = macro_f1
            best_model_name = name
            best_pipeline = pipeline

    # Save evaluation report
    report_file = os.path.join(REPORTS_DIR, "model_comparison.json")
    with open(report_file, "w") as f:
        json.dump({
            "timestamp": datetime.utcnow().isoformat(),
            "best_model": best_model_name,
            "best_macro_f1": best_macro_f1,
            "models": results
        }, f, indent=2)

    # Persist best model artifact and metadata
    best_model_path = os.path.join(MODELS_DIR, "best_classifier.joblib")
    metadata_path = os.path.join(MODELS_DIR, "model_metadata.joblib")

    joblib.dump(best_pipeline, best_model_path)
    joblib.dump({
        "model_name": best_model_name,
        "version": "1.0.0",
        "dataset_version": "nyayasetu_curated_v1",
        "macro_f1": round(best_macro_f1, 4),
        "trained_at": datetime.utcnow().isoformat()
    }, metadata_path)

    print(f"[BEST] Model '{best_model_name}' persisted to: {best_model_path}")
    print(f"[REPORT] Comparison saved to: {report_file}")
    return best_model_path

if __name__ == "__main__":
    train_and_evaluate()
