import os
import joblib
import numpy as np
from risk_engine import evaluate_injury_risk

MODEL_PATH = "model/xgboost_model.pkl"

# Load model if available
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    model = None


def predict_injury(feature_df):
    """
    Evaluates injury risk using trained model if present, combined with
    the Milestone 3 Risk Engine, Anomaly Detector, and Recommendation Generator.
    """
    if feature_df is None or feature_df.empty:
        import pandas as pd
        feature_df = pd.DataFrame([{
            "left_knee": 160.0, "right_knee": 160.0,
            "left_hip": 165.0, "right_hip": 165.0,
            "left_elbow": 160.0, "right_elbow": 160.0,
            "trunk_angle": 5.0, "balance": 0.05, "symmetry": 5.0
        }])

    base_pred = None
    if model is not None:
        try:
            pred_class = model.predict(feature_df)[0]
            prob = float(max(model.predict_proba(feature_df)[0]) * 100) if hasattr(model, "predict_proba") else 80.0
            base_pred = {"class": pred_class, "probability": prob}
        except Exception:
            pass

    # Use unified Milestone 3 Risk Engine
    result = evaluate_injury_risk(feature_df, base_pred)

    if base_pred and "probability" in base_pred:
        # Blend model confidence if available
        result["percentage"] = round((result["percentage"] + base_pred["probability"]) / 2.0, 1)

    result["image"] = "outputs/pose_result.jpg"
    return result