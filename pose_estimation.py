import cv2
import mediapipe as mp
import math
import os


mp_pose = mp.solutions.pose
mp_draw = mp.solutions.drawing_utils


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

    return round(angle, 2)


def detect_pose(file_path):

    output_folder = "outputs"

    os.makedirs(output_folder, exist_ok=True)


    pose = mp_pose.Pose(
        static_image_mode=False,
        model_complexity=1,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )


    ext = os.path.splitext(file_path)[1].lower()

    image_ext = [
        ".jpg",
        ".jpeg",
        ".png"
    ]


    # ==========================
    # IMAGE PROCESSING
    # ==========================

    if ext in image_ext:
        image = cv2.imread(file_path)
        if image is None:
            pose.close()
            return None

        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        result = pose.process(rgb)

        output_path = "outputs/pose_result.jpg"

        if not result.pose_landmarks:
            cv2.imwrite(output_path, image)
            pose.close()
            return {"image": output_path}

        mp_draw.draw_landmarks(
            image,
            result.pose_landmarks,
            mp_pose.POSE_CONNECTIONS
        )

        lm = result.pose_landmarks.landmark
        h, w, _ = image.shape

        def point(i):
            return (
                int(lm[i].x * w),
                int(lm[i].y * h)
            )

        features = calculate_features(point)
        cv2.imwrite(output_path, image)
        pose.close()

        features["image"] = output_path
        return features

    # ==========================
    # VIDEO PROCESSING
    # ==========================
    cap = cv2.VideoCapture(file_path)
    if not cap.isOpened():
        pose.close()
        return None

    values = []
    output_path = "outputs/pose_result.jpg"

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = pose.process(rgb)

        if not result.pose_landmarks:
            cv2.imwrite(output_path, frame)
            continue

        mp_draw.draw_landmarks(
            frame,
            result.pose_landmarks,
            mp_pose.POSE_CONNECTIONS
        )

        lm = result.pose_landmarks.landmark
        h, w, _ = frame.shape

        def point(i):
            return (
                int(lm[i].x * w),
                int(lm[i].y * h)
            )

        values.append(calculate_features(point))
        cv2.imwrite(output_path, frame)

    cap.release()
    pose.close()

    if len(values) == 0:
        return {"image": output_path}

    average = {}
    keys = values[0].keys()

    for key in keys:
        total = sum(item[key] for item in values)
        average[key] = round(total / len(values), 2)

    average["image"] = output_path
    return average



def calculate_features(p):


    left_shoulder = p(11)
    right_shoulder = p(12)

    left_elbow = p(13)
    right_elbow = p(14)

    left_wrist = p(15)
    right_wrist = p(16)

    left_hip = p(23)
    right_hip = p(24)

    left_knee = p(25)
    right_knee = p(26)

    left_ankle = p(27)
    right_ankle = p(28)



    return {


        "left_knee":

        calculate_angle(
            left_hip,
            left_knee,
            left_ankle
        ),



        "right_knee":

        calculate_angle(
            right_hip,
            right_knee,
            right_ankle
        ),



        "left_hip":

        calculate_angle(
            left_shoulder,
            left_hip,
            left_knee
        ),



        "right_hip":

        calculate_angle(
            right_shoulder,
            right_hip,
            right_knee
        ),



        "left_elbow":

        calculate_angle(
            left_shoulder,
            left_elbow,
            left_wrist
        ),



        "right_elbow":

        calculate_angle(
            right_shoulder,
            right_elbow,
            right_wrist
        ),



        "trunk_angle":

        abs(
            left_shoulder[0] -
            left_hip[0]
        ) * 100,



        "balance":

        abs(
            left_hip[0] -
            right_hip[0]
        ),



        "symmetry":

        abs(
            left_knee[1] -
            right_knee[1]
        )

    }



if __name__ == "__main__":


    path = input(
        "Enter image/video path: "
    )


    result = detect_pose(path)


    if result:

        print(result)

    else:

        print("No pose detected")