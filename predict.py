import os
import joblib
import numpy as np

MODEL_PATH = "model/xgboost_model.pkl"

# Load model if available
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    model = None


def predict_injury(feature_df):

    # ------------------------
    # If trained model exists
    # ------------------------
    if model is not None:

        prediction = model.predict(feature_df)[0]

        if hasattr(model, "predict_proba"):
            probability = float(
                max(model.predict_proba(feature_df)[0]) * 100
            )
        else:
            probability = 80.0

    # ------------------------
    # Demo prediction
    # ------------------------
    else:

        avg = feature_df.mean(numeric_only=True)

        score = 0

        if avg["left_knee"] < 150:
            score += 25

        if avg["right_knee"] < 150:
            score += 25

        if avg["balance"] > 0.08:
            score += 25

        if avg["symmetry"] > 15:
            score += 25

        probability = min(score, 100)

        if probability >= 75:
            prediction = 2
        elif probability >= 50:
            prediction = 1
        else:
            prediction = 0

    # ------------------------
    # Risk Level & Reason
    # ------------------------
    left_knee = float(feature_df["left_knee"].mean()) if "left_knee" in feature_df else 160.0
    right_knee = float(feature_df["right_knee"].mean()) if "right_knee" in feature_df else 160.0
    left_hip = float(feature_df["left_hip"].mean()) if "left_hip" in feature_df else 160.0
    right_hip = float(feature_df["right_hip"].mean()) if "right_hip" in feature_df else 160.0
    left_elbow = float(feature_df["left_elbow"].mean()) if "left_elbow" in feature_df else 160.0
    right_elbow = float(feature_df["right_elbow"].mean()) if "right_elbow" in feature_df else 160.0
    trunk_angle = float(feature_df["trunk_angle"].mean()) if "trunk_angle" in feature_df else 5.0
    balance_val = float(feature_df["balance"].mean()) if "balance" in feature_df else 0.05
    symmetry_val = float(feature_df["symmetry"].mean()) if "symmetry" in feature_df else 5.0

    knee_angle = round((left_knee + right_knee) / 2.0, 1)
    hip_angle = round((left_hip + right_hip) / 2.0, 1)
    elbow_angle = round((left_elbow + right_elbow) / 2.0, 1)
    ankle_angle = round(knee_angle * 0.85, 1)
    shoulder_angle = round(hip_angle * 0.95, 1)

    if prediction == 2 or left_knee < 120 or right_knee < 120:
        risk = "High"
        body_part = "Knee"
        severity = "High Risk"
        reason = "Excessive knee flexion / strain detected."
        recommendation = [
            "Stop training immediately",
            "Consult a sports physiotherapist",
            "Apply ice therapy & rest",
            "Avoid high-impact jumping and heavy squatting"
        ]
    elif prediction == 1 or left_hip < 150 or right_hip < 150 or trunk_angle > 15:
        risk = "Medium"
        body_part = "Hip / Lower Back" if trunk_angle > 15 else "Hip"
        severity = "Moderate Risk"
        reason = "Limited mobility or uneven trunk angle detected."
        recommendation = [
            "Reduce training intensity",
            "Perform dynamic mobility & stretching exercises",
            "Strengthen core & glute muscles",
            "Warm up thoroughly before workouts"
        ]
    else:
        risk = "Low"
        body_part = "No Major Injury"
        severity = "Low Risk"
        reason = "Normal movement mechanics and alignment detected."
        recommendation = [
            "Continue regular training schedule",
            "Maintain optimal biomechanical posture",
            "Perform cool-down stretching post workout"
        ]

    biomechanics = min(100, max(40, int((knee_angle + hip_angle) / 3.2)))
    stability = max(30, min(100, 100 - int(symmetry_val)))
    balance_score = max(30, min(100, 100 - int(balance_val * 100)))

    timeline = [
        {"time": "0s", "level": risk},
        {"time": "5s", "level": risk},
        {"time": "10s", "level": risk}
    ]

    return {
        "risk": risk,
        "percentage": round(probability, 2),
        "confidence": round(probability, 2),
        "severity": severity,
        "bodyPart": body_part,
        "reason": reason,
        "recommendation": recommendation,
        "image": "outputs/pose_result.jpg",
        "biomechanics": biomechanics,
        "stability": stability,
        "balance": balance_score,
        "kneeAngle": knee_angle,
        "hipAngle": hip_angle,
        "ankleAngle": ankle_angle,
        "shoulderAngle": shoulder_angle,
        "elbowAngle": elbow_angle,
        "timeline": timeline
    }