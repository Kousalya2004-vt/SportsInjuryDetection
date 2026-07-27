import numpy as np
import pandas as pd

def detect_movement_anomalies(df):
    """
    Analyzes temporal frame-by-frame landmark features to detect movement anomalies.
    Returns list of frame-indexed anomaly flags and overall anomaly statistics.
    """
    if df is None or df.empty:
        return {
            "anomalies": [],
            "total_anomalies": 0,
            "anomaly_rate": 0.0,
            "severity_summary": {"Low": 0, "Medium": 0, "High": 0}
        }

    anomalies = []
    fps = 30.0  # assumed baseline FPS for frame-to-timestamp calculation

    # Pre-calculate velocity/jerk if multiple frames exist
    df_clean = df.copy()
    if len(df_clean) > 1:
        df_clean["knee_diff"] = df_clean["left_knee"].diff().fillna(0).abs()
        df_clean["trunk_diff"] = df_clean["trunk_angle"].diff().fillna(0).abs()
    else:
        df_clean["knee_diff"] = 0
        df_clean["trunk_diff"] = 0

    for idx, row in df_clean.iterrows():
        timestamp = round(idx / fps, 2)
        time_str = f"{timestamp}s"
        frame_anomalies = []

        left_knee = row.get("left_knee", 160.0)
        right_knee = row.get("right_knee", 160.0)
        left_hip = row.get("left_hip", 165.0)
        right_hip = row.get("right_hip", 165.0)
        trunk_angle = row.get("trunk_angle", 5.0)
        balance = row.get("balance", 0.05)
        symmetry = row.get("symmetry", 5.0)
        knee_diff = row.get("knee_diff", 0)

        # 1. Dynamic Knee Valgus / Severe Flexion
        if left_knee < 110 or right_knee < 110:
            frame_anomalies.append({
                "type": "Dynamic Knee Valgus",
                "severity": "High",
                "joint": "Knee",
                "description": f"Excessive knee flexion/valgus angle ({min(left_knee, right_knee):.1f}°)",
                "value": min(left_knee, right_knee)
            })
        elif left_knee < 130 or right_knee < 130:
            frame_anomalies.append({
                "type": "Moderate Knee Flexion Strain",
                "severity": "Medium",
                "joint": "Knee",
                "description": f"Moderate knee flexion strain ({min(left_knee, right_knee):.1f}°)",
                "value": min(left_knee, right_knee)
            })

        # 2. Asymmetrical Hip Drop / Limited Extension
        if left_hip < 140 or right_hip < 140:
            frame_anomalies.append({
                "type": "Asymmetrical Hip Drop",
                "severity": "Medium",
                "joint": "Hip",
                "description": f"Restricted hip joint extension ({min(left_hip, right_hip):.1f}°)",
                "value": min(left_hip, right_hip)
            })

        # 3. Excessive Trunk Lean / Core Instability
        if trunk_angle > 20:
            frame_anomalies.append({
                "type": "Severe Trunk Posture Collapse",
                "severity": "High",
                "joint": "Lower Back",
                "description": f"High forward trunk tilt detected ({trunk_angle:.1f}°)",
                "value": trunk_angle
            })
        elif trunk_angle > 14:
            frame_anomalies.append({
                "type": "Forward Trunk Displacement",
                "severity": "Medium",
                "joint": "Lower Back",
                "description": f"Moderate trunk inclination ({trunk_angle:.1f}°)",
                "value": trunk_angle
            })

        # 4. Asymmetry & Balance Shift
        if symmetry > 20 or balance > 0.12:
            frame_anomalies.append({
                "type": "Lateral Symmetry Imbalance",
                "severity": "Medium",
                "joint": "Lower Limb",
                "description": f"Bilateral limb asymmetry spike ({symmetry:.1f} diff)",
                "value": symmetry
            })

        # 5. Kinematic Acceleration Jerk
        if knee_diff > 35:
            frame_anomalies.append({
                "type": "Kinematic Jerk Instability",
                "severity": "High",
                "joint": "Knee / Ankle",
                "description": f"Abrupt joint velocity change ({knee_diff:.1f}°/frame)",
                "value": knee_diff
            })

        for anomaly in frame_anomalies:
            anomaly["frame"] = int(idx)
            anomaly["timestamp"] = time_str
            anomalies.append(anomaly)

    # Summarize severities
    severity_counts = {"Low": 0, "Medium": 0, "High": 0}
    for a in anomalies:
        sev = a.get("severity", "Medium")
        if sev in severity_counts:
            severity_counts[sev] += 1

    total_frames = max(len(df), 1)
    anomaly_rate = round((len(anomalies) / total_frames) * 100, 1)

    return {
        "anomalies": anomalies[:20],  # Return top 20 anomaly events for timeline
        "total_anomalies": len(anomalies),
        "anomaly_rate": min(100.0, anomaly_rate),
        "severity_summary": severity_counts
    }
