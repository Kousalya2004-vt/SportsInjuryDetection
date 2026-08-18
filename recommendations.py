def generate_corrective_recommendations(risk_summary, anomaly_summary):
    """
    Generates targeted, simple English corrective exercise plans and recommendations.
    """
    category = risk_summary.get("category", "Low")
    primary_part = risk_summary.get("primary_body_part", "No Major Injury")
    joint_risks = risk_summary.get("joint_risks", {})

    immediate_protocols = []
    rehab_exercises = []
    technique_cues = []
    medical_alert = False

    # 1. Immediate Protocols in Simple English
    if category in ["Critical", "High"]:
        immediate_protocols.append("Stop heavy jumping and fast sprinting right now.")
        immediate_protocols.append("Rest your leg, put an ice pack on sore joints, and keep your leg raised.")
        immediate_protocols.append("Cut your weekly workout load by half until your leg feels better.")
        medical_alert = True
    elif category == "Moderate":
        immediate_protocols.append("Do fewer heavy squats and jump landings this week.")
        immediate_protocols.append("Warm up for 15 minutes before every workout with light leg and hip stretches.")
        immediate_protocols.append("Use an ice pack or foam roller on your muscles after training.")
    else:
        immediate_protocols.append("Keep up your normal regular training routine.")
        immediate_protocols.append("Take easy recovery walks or light swimming on rest days.")
        immediate_protocols.append("Stretch your muscles for 10 minutes after every workout.")

    # 2. Targeted Exercises in Simple English
    knee_risk = joint_risks.get("Knee", 0)
    hip_risk = joint_risks.get("Hip", 0)
    back_risk = joint_risks.get("Lower Back", 0)
    ankle_risk = joint_risks.get("Ankle & Balance", 0)

    # Knee Recommendations
    if knee_risk > 40:
        rehab_exercises.append({
            "name": "Slow Step-Downs",
            "sets": "3 Sets x 10 Reps",
            "target": "Thigh & Knee Muscles",
            "purpose": "Keeps your knee straight over your foot and prevents it from bending inward."
        })
        rehab_exercises.append({
            "name": "Straight Leg Kicks",
            "sets": "3 Sets x 15 Reps",
            "target": "Thigh Muscles",
            "purpose": "Strengthens your knee joint without putting heavy weight on your back."
        })
        technique_cues.append("Keep your knee straight over your second toe whenever landing or bending.")

    # Hip & Glute Recommendations
    if hip_risk > 40:
        rehab_exercises.append({
            "name": "Single-Leg Balance Lift",
            "sets": "3 Sets x 8 Reps per leg",
            "target": "Hip & Buttock Muscles",
            "purpose": "Builds hip strength and helps you stay balanced on one foot."
        })
        rehab_exercises.append({
            "name": "Side Band Walks (Clamshells)",
            "sets": "3 Sets x 15 Reps",
            "target": "Outer Hips",
            "purpose": "Stops your knee from twisting inward by making your outer hip muscles strong."
        })
        technique_cues.append("Keep your hips level and do not let your side tilt when standing on one leg.")

    # Lower Back & Core Recommendations
    if back_risk > 40:
        rehab_exercises.append({
            "name": "Band Core Press",
            "sets": "3 Sets x 12 Reps per side",
            "target": "Stomach & Core Muscles",
            "purpose": "Builds stomach strength to keep your spine straight and prevent back pain."
        })
        rehab_exercises.append({
            "name": "Bird-Dog Arm & Leg Hold",
            "sets": "3 Sets x 10 Reps (5s hold)",
            "target": "Lower Back & Core",
            "purpose": "Helps you stand tall with good spine balance during fast movements."
        })
        technique_cues.append("Keep your back straight and do not lean too far forward when bending.")

    # Ankle & Balance Recommendations
    if ankle_risk > 40:
        rehab_exercises.append({
            "name": "Single-Leg Cushion Stand",
            "sets": "3 Sets x 30 Seconds per leg",
            "target": "Ankle & Balance Muscles",
            "purpose": "Strengthens your ankles so you do not twist or sprain them when turning."
        })
        technique_cues.append("Spread your toes flat and press your whole foot into the ground for balance.")

    # Default general exercises if all risks are low
    if len(rehab_exercises) == 0:
        rehab_exercises.append({
            "name": "Dynamic Hip Stretches",
            "sets": "2 Sets x 8 Reps per side",
            "target": "Hips & Legs",
            "purpose": "Keeps your joints flexible and stops stiffness after running."
        })
        rehab_exercises.append({
            "name": "Glute Bridges",
            "sets": "3 Sets x 12 Reps",
            "target": "Glutes & Hips",
            "purpose": "Warms up your hip muscles before you start sports or running."
        })
        technique_cues.append("Move smoothly and stop if you feel any sharp pain.")

    return {
        "immediate_protocols": immediate_protocols,
        "rehab_exercises": rehab_exercises,
        "technique_cues": technique_cues,
        "medical_alert": medical_alert,
        "summary_text": f"Simple safety plan for your {primary_part.lower()} with {category.lower()} risk."
    }
