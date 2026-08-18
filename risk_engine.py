from anomaly_detector import detect_movement_anomalies
from risk_scoring import calculate_risk_scores
from recommendations import generate_corrective_recommendations

def evaluate_injury_risk(feature_df, base_prediction=None):
    """
    Unified Risk Engine evaluating movement anomalies, joint risk scores,
    and generating targeted corrective action plans.
    """
    # 1. Detect movement anomalies
    anomaly_summary = detect_movement_anomalies(feature_df)

    # 2. Compute multi-joint risk scores
    risk_summary = calculate_risk_scores(feature_df, anomaly_summary)

    # 3. Generate targeted corrective recommendations
    recommendation_plan = generate_corrective_recommendations(risk_summary, anomaly_summary)

    # Format dynamic response object
    result = {
        "risk": risk_summary["category"],
        "percentage": risk_summary["overall_risk"],
        "confidence": round(min(98.5, max(70.0, 100.0 - (100.0 - risk_summary["overall_risk"]) * 0.15)), 1),
        "severity": risk_summary["severity_label"],
        "bodyPart": risk_summary["primary_body_part"],
        "reason": f"Detected elevated risk in {risk_summary['primary_body_part']} with {anomaly_summary['total_anomalies']} movement anomaly flags.",
        "recommendation": [ex["name"] + ": " + ex["purpose"] for ex in recommendation_plan["rehab_exercises"]],
        "recommendation_plan": recommendation_plan,
        "joint_risks": risk_summary["joint_risks"],
        "anomaly_summary": anomaly_summary,
        "biomechanics": risk_summary["biomechanics_score"],
        "stability": risk_summary["stability_score"],
        "balance": max(30, min(100, int(100 - risk_summary["joint_risks"]["Ankle & Balance"] * 0.6))),
        "kneeAngle": round(float(feature_df["left_knee"].mean()) if "left_knee" in feature_df else 160.0, 1),
        "hipAngle": round(float(feature_df["left_hip"].mean()) if "left_hip" in feature_df else 165.0, 1),
        "ankleAngle": round(float(feature_df["left_knee"].mean() * 0.85) if "left_knee" in feature_df else 135.0, 1),
        "shoulderAngle": round(float(feature_df["left_hip"].mean() * 0.95) if "left_hip" in feature_df else 155.0, 1),
        "elbowAngle": round(float(feature_df["left_elbow"].mean()) if "left_elbow" in feature_df else 160.0, 1),
        "timeline": [
            {"time": a["timestamp"], "level": a["severity"], "type": a["type"], "description": a["description"]}
            for a in anomaly_summary["anomalies"][:5]
        ] if anomaly_summary["anomalies"] else [
            {"time": "0.0s", "level": risk_summary["category"], "type": "Normal Alignment", "description": "Movement mechanics within safe range."}
        ]
    }

    return result
