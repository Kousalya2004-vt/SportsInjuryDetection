import cv2
import mediapipe as mp
import pandas as pd
import math
import os

mp_pose = mp.solutions.pose


def calculate_angle(a, b, c):

    ax, ay = a
    bx, by = b
    cx, cy = c

    angle = math.degrees(
        math.atan2(cy - by, cx - bx) -
        math.atan2(ay - by, ax - bx)
    )

    if angle < 0:
        angle += 360

    if angle > 180:
        angle = 360 - angle

    return angle


def get_features(lm):

    def p(i):
        return (
            lm[i].x,
            lm[i].y
        )

    left_shoulder = p(mp_pose.PoseLandmark.LEFT_SHOULDER.value)
    right_shoulder = p(mp_pose.PoseLandmark.RIGHT_SHOULDER.value)

    left_elbow = p(mp_pose.PoseLandmark.LEFT_ELBOW.value)
    right_elbow = p(mp_pose.PoseLandmark.RIGHT_ELBOW.value)

    left_wrist = p(mp_pose.PoseLandmark.LEFT_WRIST.value)
    right_wrist = p(mp_pose.PoseLandmark.RIGHT_WRIST.value)

    left_hip = p(mp_pose.PoseLandmark.LEFT_HIP.value)
    right_hip = p(mp_pose.PoseLandmark.RIGHT_HIP.value)

    left_knee = p(mp_pose.PoseLandmark.LEFT_KNEE.value)
    right_knee = p(mp_pose.PoseLandmark.RIGHT_KNEE.value)

    left_ankle = p(mp_pose.PoseLandmark.LEFT_ANKLE.value)
    right_ankle = p(mp_pose.PoseLandmark.RIGHT_ANKLE.value)

    left_knee_angle = calculate_angle(
        left_hip,
        left_knee,
        left_ankle
    )

    right_knee_angle = calculate_angle(
        right_hip,
        right_knee,
        right_ankle
    )

    left_hip_angle = calculate_angle(
        left_shoulder,
        left_hip,
        left_knee
    )

    right_hip_angle = calculate_angle(
        right_shoulder,
        right_hip,
        right_knee
    )

    left_elbow_angle = calculate_angle(
        left_shoulder,
        left_elbow,
        left_wrist
    )

    right_elbow_angle = calculate_angle(
        right_shoulder,
        right_elbow,
        right_wrist
    )

    trunk_angle = abs(left_shoulder[0] - left_hip[0]) * 100

    balance = abs(left_hip[0] - right_hip[0])

    symmetry = abs(left_knee_angle - right_knee_angle)

    return {

        "left_knee": left_knee_angle,
        "right_knee": right_knee_angle,

        "left_hip": left_hip_angle,
        "right_hip": right_hip_angle,

        "left_elbow": left_elbow_angle,
        "right_elbow": right_elbow_angle,

        "trunk_angle": trunk_angle,
        "balance": balance,
        "symmetry": symmetry

    }


def extract_features(file_path):

    pose = mp_pose.Pose(
        static_image_mode=False,
        model_complexity=1,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )

    ext = os.path.splitext(file_path)[1].lower()

    rows = []

    # ---------- IMAGE ----------
    if ext in [".jpg", ".jpeg", ".png"]:

        image = cv2.imread(file_path)

        if image is None:
            pose.close()
            return pd.DataFrame()

        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        results = pose.process(rgb)

        if results.pose_landmarks:

            rows.append(
                get_features(results.pose_landmarks.landmark)
            )

        pose.close()

        return pd.DataFrame(rows)

    # ---------- VIDEO ----------

    cap = cv2.VideoCapture(file_path)

    while cap.isOpened():

        success, frame = cap.read()

        if not success:
            break

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = pose.process(rgb)

        if results.pose_landmarks:

            rows.append(
                get_features(results.pose_landmarks.landmark)
            )

    cap.release()
    pose.close()

    if len(rows) == 0:
        return pd.DataFrame()

    return pd.DataFrame(rows)


if __name__ == "__main__":

    path = input("Enter image/video path: ")

    df = extract_features(path)

    if df.empty:
        print("No pose detected.")

    else:
        print(df)