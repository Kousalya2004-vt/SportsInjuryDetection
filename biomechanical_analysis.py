def analyze_pose(features):

    injury = []
    recommendations = []
    risk = "Low"

    if features["left_knee"] < 150:
        injury.append("Left Knee")
        recommendations.append("Avoid deep knee bending.")

    if features["right_knee"] < 150:
        injury.append("Right Knee")
        recommendations.append("Strengthen quadriceps and hamstrings.")

    if features["left_hip"] < 150:
        injury.append("Left Hip")
        recommendations.append("Improve hip flexibility.")

    if features["right_hip"] < 150:
        injury.append("Right Hip")
        recommendations.append("Perform hip mobility exercises.")

    if features["left_elbow"] < 160:
        injury.append("Left Elbow")
        recommendations.append("Reduce elbow strain during training.")

    if features["right_elbow"] < 160:
        injury.append("Right Elbow")
        recommendations.append("Maintain proper arm posture.")

    if "trunk_angle" in features:
        if features["trunk_angle"] < 160:
            injury.append("Lower Back")
            recommendations.append("Keep your back straight while performing exercises.")

    if "balance" in features:
        if features["balance"] < 70:
            injury.append("Poor Balance")
            recommendations.append("Practice balance and core stability exercises.")

    if "symmetry" in features:
        if features["symmetry"] < 80:
            injury.append("Body Asymmetry")
            recommendations.append("Correct left-right movement imbalance.")

    if len(injury) == 0:
        recommendations.append("No significant injury risk detected.")

    if len(injury) >= 4:
        risk = "High"
    elif len(injury) >= 2:
        risk = "Medium"
    else:
        risk = "Low"

    return {
        "risk": risk,
        "injury": injury,
        "recommendations": recommendations
    }