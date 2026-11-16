def predict_risk(
    left_knee,
    right_knee,
    left_hip,
    right_hip,
    left_elbow,
    right_elbow,
    trunk_angle,
    balance,
    symmetry
):

    risk = "Low"
    body_part = "None"
    reason = "Normal movement detected."

    recommendations = [
        "Maintain proper warm-up.",
        "Continue current training.",
        "Stay hydrated."
    ]

    # ---------- Knee Risk ----------
    if left_knee < 120 or right_knee < 120:

        risk = "High"
        body_part = "Knee"
        reason = "Excessive knee flexion detected."

        recommendations = [
            "Reduce jumping drills.",
            "Strengthen quadriceps.",
            "Improve landing mechanics.",
            "Stretch hamstrings.",
            "Wear supportive shoes.",
            "Avoid excessive squatting.",
            "Consult a physiotherapist if pain persists."
        ]

    # ---------- Hip Risk ----------
    elif left_hip < 150 or right_hip < 150:

        risk = "Medium"
        body_part = "Hip"
        reason = "Limited hip extension detected."

        recommendations = [
            "Improve hip mobility.",
            "Perform dynamic stretching.",
            "Strengthen glute muscles.",
            "Reduce heavy training.",
            "Practice hip flexibility exercises."
        ]

    # ---------- Elbow Risk ----------
    elif left_elbow < 140 or right_elbow < 140:

        risk = "Medium"
        body_part = "Elbow"
        reason = "Excessive elbow flexion detected."

        recommendations = [
            "Avoid repetitive throwing.",
            "Strengthen forearm muscles.",
            "Take proper rest.",
            "Use correct technique during sports."
        ]

    # ---------- Lower Back ----------
    elif trunk_angle > 15:

        risk = "Medium"
        body_part = "Lower Back"
        reason = "Forward trunk lean detected."

        recommendations = [
            "Improve posture.",
            "Strengthen core muscles.",
            "Avoid heavy lifting.",
            "Practice back stretching exercises."
        ]

    # ---------- Balance ----------
    elif balance < 80:

        risk = "Medium"
        body_part = "Ankle"
        reason = "Poor balance detected."

        recommendations = [
            "Practice balance exercises.",
            "Improve ankle stability.",
            "Perform single-leg exercises.",
            "Strengthen calf muscles."
        ]

    # ---------- Symmetry ----------
    elif symmetry < 85:

        risk = "Medium"
        body_part = "Leg"
        reason = "Movement asymmetry detected."

        recommendations = [
            "Perform unilateral exercises.",
            "Correct muscle imbalance.",
            "Improve movement symmetry.",
            "Increase flexibility."
        ]

    # ---------- Severe Risk ----------
    if (
        (left_knee < 100 or right_knee < 100)
        and trunk_angle > 20
        and balance < 70
    ):

        risk = "High"
        body_part = "Knee & Lower Back"
        reason = "Severe movement abnormality detected."

        recommendations = [
            "Stop training immediately.",
            "Consult a sports doctor.",
            "Avoid running and jumping.",
            "Begin rehabilitation exercises.",
            "Apply ice if swelling is present.",
            "Resume activity only after medical clearance."
        ]

    return {
        "risk": risk,
        "body_part": body_part,
        "reason": reason,
        "recommendations": recommendations
    }