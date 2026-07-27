def calculate_risk_scores(feature_df, anomaly_data=None):
    """
    Computes comprehensive joint-specific risk scores, overall risk index, and severity tiers.
    """
    if feature_df is None or feature_df.empty:
        left_knee, right_knee = 160.0, 160.0
        left_hip, right_hip = 165.0, 165.0
        left_elbow, right_elbow = 160.0, 160.0
        trunk_angle = 5.0
        balance_val = 0.05
        symmetry_val = 5.0
    else:
        left_knee = float(feature_df["left_knee"].mean()) if "left_knee" in feature_df else 160.0
        right_knee = float(feature_df["right_knee"].mean()) if "right_knee" in feature_df else 160.0
        left_hip = float(feature_df["left_hip"].mean()) if "left_hip" in feature_df else 160.0
        right_hip = float(feature_df["right_hip"].mean()) if "right_hip" in feature_df else 160.0
        left_elbow = float(feature_df["left_elbow"].mean()) if "left_elbow" in feature_df else 160.0
        right_elbow = float(feature_df["right_elbow"].mean()) if "right_elbow" in feature_df else 160.0
        trunk_angle = float(feature_df["trunk_angle"].mean()) if "trunk_angle" in feature_df else 5.0
        balance_val = float(feature_df["balance"].mean()) if "balance" in feature_df else 0.05
        symmetry_val = float(feature_df["symmetry"].mean()) if "symmetry" in feature_df else 5.0

    min_knee = min(left_knee, right_knee)
    min_hip = min(left_hip, right_hip)
    min_elbow = min(left_elbow, right_elbow)

    # 1. Knee Risk Score (0 - 100)
    if min_knee < 100:
        knee_risk = 92
    elif min_knee < 120:
        knee_risk = 78
    elif min_knee < 140:
        knee_risk = 45
    elif min_knee < 155:
        knee_risk = 25
    else:
        knee_risk = 10

    # 2. Hip Risk Score (0 - 100)
    if min_hip < 125:
        hip_risk = 85
    elif min_hip < 145:
        hip_risk = 60
    elif min_hip < 160:
        hip_risk = 30
    else:
        hip_risk = 12

    # 3. Lower Back Risk Score (0 - 100)
    if trunk_angle > 25:
        back_risk = 88
    elif trunk_angle > 18:
        back_risk = 68
    elif trunk_angle > 12:
        back_risk = 38
    else:
        back_risk = 15

    # 4. Ankle & Balance Risk Score (0 - 100)
    if balance_val > 0.15:
        ankle_risk = 82
    elif balance_val > 0.08:
        ankle_risk = 55
    elif balance_val > 0.05:
        ankle_risk = 30
    else:
        ankle_risk = 14

    # 5. Upper Body & Elbow Risk Score (0 - 100)
    if min_elbow < 120:
        upper_risk = 75
    elif min_elbow < 140:
        upper_risk = 45
    else:
        upper_risk = 15

    # Penalty adjustment based on anomaly frequency
    anomaly_penalty = 0
    if anomaly_data and "total_anomalies" in anomaly_data:
        anomaly_penalty = min(20, anomaly_data["total_anomalies"] * 3)

    # Calculate overall composite risk score
    weights = [0.35, 0.25, 0.20, 0.12, 0.08]
    raw_composite = (
        knee_risk * weights[0] +
        hip_risk * weights[1] +
        back_risk * weights[2] +
        ankle_risk * weights[3] +
        upper_risk * weights[4] +
        anomaly_penalty
    )
    overall_risk_score = round(min(100.0, max(5.0, raw_composite)), 1)

    # Risk Category
    if overall_risk_score >= 75:
        category = "Critical"
        severity_label = "Critical Injury Risk"
        primary_body_part = "Knee & Lower Back" if back_risk > 50 else "Knee Joint"
    elif overall_risk_score >= 50:
        category = "High"
        severity_label = "High Risk"
        primary_body_part = "Knee" if knee_risk >= hip_risk else "Hip Joint"
    elif overall_risk_score >= 30:
        category = "Moderate"
        severity_label = "Moderate Risk"
        primary_body_part = "Lower Back / Hip" if back_risk >= hip_risk else "Hip"
    else:
        category = "Low"
        severity_label = "Low Risk"
        primary_body_part = "No Major Injury"

    # Additional metrics: Stability & Biomechanics Indices
    stability_score = max(20, min(100, int(100 - (symmetry_val * 2.5 + balance_val * 200))))
    biomechanics_score = max(25, min(100, int(100 - overall_risk_score * 0.75)))

    return {
        "overall_risk": overall_risk_score,
        "category": category,
        "severity_label": severity_label,
        "primary_body_part": primary_body_part,
        "joint_risks": {
            "Knee": knee_risk,
            "Hip": hip_risk,
            "Lower Back": back_risk,
            "Ankle & Balance": ankle_risk,
            "Upper Body": upper_risk
        },
        "stability_score": stability_score,
        "biomechanics_score": biomechanics_score
    }
