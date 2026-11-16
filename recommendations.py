def generate_corrective_recommendations(risk_summary, anomaly_summary):
    """
    Generates targeted, evidence-based corrective exercise plans and recommendations.
    """
    category = risk_summary.get("category", "Low")
    primary_part = risk_summary.get("primary_body_part", "No Major Injury")
    joint_risks = risk_summary.get("joint_risks", {})

    immediate_protocols = []
    rehab_exercises = []
    technique_cues = []
    medical_alert = False

    # 1. Immediate Protocols based on Risk Tier
    if category in ["Critical", "High"]:
        immediate_protocols.append("Cease high-impact jumping and explosive sprint drills immediately.")
        immediate_protocols.append("Apply R.I.C.E. (Rest, Ice, Compression, Elevation) protocol to target joints for 48 hours.")
        immediate_protocols.append("Reduce total weekly training load by at least 40% until re-evaluation.")
        medical_alert = True
    elif category == "Moderate":
        immediate_protocols.append("Modify training volume: limit maximal load squats and high-repetition landing drills.")
        immediate_protocols.append("Ensure 15-20 minutes of dynamic warm-up targeting hip and core activation before every session.")
        immediate_protocols.append("Incorporate post-workout cryotherapy or ice foam rolling.")
    else:
        immediate_protocols.append("Maintain existing progressive overload training routine.")
        immediate_protocols.append("Ensure active recovery sessions (light cycling, swimming) on rest days.")
        immediate_protocols.append("Perform 10 minutes of mobility work post-training.")

    # 2. Targeted Rehabilitation & Strength Exercises based on Joint Risks
    knee_risk = joint_risks.get("Knee", 0)
    hip_risk = joint_risks.get("Hip", 0)
    back_risk = joint_risks.get("Lower Back", 0)
    ankle_risk = joint_risks.get("Ankle & Balance", 0)

    # Knee Recommendations
    if knee_risk > 40:
        rehab_exercises.append({
            "name": "Eccentric Step-Downs",
            "sets": "3 Sets x 10 Reps",
            "target": "Vastus Medialis & Quadriceps",
            "purpose": "Improves knee alignment, decelerates knee valgus collapse, and builds patellar stability."
        })
        rehab_exercises.append({
            "name": "Terminal Knee Extensions (TKE)",
            "sets": "3 Sets x 15 Reps",
            "target": "Quadriceps & Patellar Tendon",
            "purpose": "Strengthens end-range knee extension control without heavy spinal loading."
        })
        technique_cues.append("Focus on keeping the knee tracking over the second toe during landings and squats.")

    # Hip & Glute Recommendations
    if hip_risk > 40:
        rehab_exercises.append({
            "name": "Single-Leg Romanian Deadlift",
            "sets": "3 Sets x 8 Reps per leg",
            "target": "Gluteus Medius & Hamstrings",
            "purpose": "Enhances hip stability, pelvic control, and single-leg balance."
        })
        rehab_exercises.append({
            "name": "Banded Clamshells & Monster Walks",
            "sets": "3 Sets x 15 Reps",
            "target": "Gluteus Medius & Abductors",
            "purpose": "Prevents dynamic knee valgus by strengthening primary hip abductors."
        })
        technique_cues.append("Maintain a level pelvis and avoid tilting hips laterally during single-leg stance.")

    # Lower Back & Core Recommendations
    if back_risk > 40:
        rehab_exercises.append({
            "name": "Pallof Press with Resistance Band",
            "sets": "3 Sets x 12 Reps per side",
            "target": "Deep Core & Obliques",
            "purpose": "Builds anti-rotational core stability and prevents forward lumbar spine collapse."
        })
        rehab_exercises.append({
            "name": "Bird-Dog with Isometric Hold",
            "sets": "3 Sets x 10 Reps (5s hold)",
            "target": "Erector Spinae & Multifidus",
            "purpose": "Promotes spine stabilization and neutral trunk alignment under load."
        })
        technique_cues.append("Keep spine in neutral posture; avoid excessive forward trunk lean during squatting.")

    # Ankle & Balance Recommendations
    if ankle_risk > 40:
        rehab_exercises.append({
            "name": "Single-Leg Balance on Foam Pad",
            "sets": "3 Sets x 30 Seconds per leg",
            "target": "Ankle Stabilizers & Proprioceptors",
            "purpose": "Improves neuromuscular feedback and prevents inversion ankle sprains."
        })
        technique_cues.append("Engage foot arch stabilizers and distribute weight evenly across the foot tripod.")

    # Default general exercises if all risks are low
    if len(rehab_exercises) == 0:
        rehab_exercises.append({
            "name": "Dynamic Hip Openers & World's Greatest Stretch",
            "sets": "2 Sets x 8 Reps per side",
            "target": "Hip Flexors & Thoracic Mobility",
            "purpose": "Maintains optimal joint range of motion and prevents stiffness."
        })
        rehab_exercises.append({
            "name": "Glute Bridges with Mini-Band",
            "sets": "3 Sets x 12 Reps",
            "target": "Gluteus Maximus",
            "purpose": "Sustains posterior chain activation prior to athletic activity."
        })
        technique_cues.append("Maintain clean form and listen to body signals during training progression.")

    return {
        "immediate_protocols": immediate_protocols,
        "rehab_exercises": rehab_exercises,
        "technique_cues": technique_cues,
        "medical_alert": medical_alert,
        "summary_text": f"Corrective plan tailored for {primary_part} with {category.lower()} risk classification."
    }
