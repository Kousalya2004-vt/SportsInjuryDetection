from flask import (
    Flask,
    request,
    jsonify,
    send_file,
    send_from_directory
)

from flask_cors import CORS
from database import connection
from pose_estimation import detect_pose
from feature_extraction import extract_features
from predict import predict_injury
from report_generator import generate_report
import os
import traceback

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIST = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend", "dist"))

app = Flask(__name__, static_folder=FRONTEND_DIST if os.path.exists(FRONTEND_DIST) else None)
CORS(app)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["OUTPUT_FOLDER"] = OUTPUT_FOLDER

latest_result = None


# ----------------------------
# HOME / SPA FRONTEND
# ----------------------------
@app.route("/")
def home():
    index_path = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.exists(index_path):
        return send_from_directory(FRONTEND_DIST, "index.html")
    return "Backend Connected"


# ----------------------------
# SAVE ATHLETE PROFILE
# ----------------------------
@app.route("/save_profile", methods=["POST"])
def save_profile():
    try:
        data = request.json
        if connection and connection.is_connected():
            cursor = connection.cursor()
            sql = """
            INSERT INTO athlete(
            athlete_id, name, age, gender, blood_group, sport, role, position, height, weight, training_load, injury_history, photo
            ) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """
            values = (
                data.get("athleteId"), data.get("name"), data.get("age"), data.get("gender"), data.get("blood"),
                data.get("sport"), data.get("role"), data.get("position"), data.get("height"), data.get("weight"),
                data.get("trainingLoad"), data.get("injury"), data.get("photo")
            )
            cursor.execute(sql, values)
            connection.commit()
            cursor.close()

        return jsonify({
            "message": "Profile Saved Successfully",
            "athlete": data
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "message": str(e),
            "athlete": request.json
        }), 200


# ----------------------------
# PROFILE
# ----------------------------
@app.route("/profile", methods=["GET"])
def profile():
    try:
        if not connection or not connection.is_connected():
            return jsonify({"message": "No Athlete Found"}), 404

        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM athlete ORDER BY id DESC LIMIT 1")
        athlete = cursor.fetchone()
        cursor.close()

        if athlete is None:
            return jsonify({"message": "No Athlete Found"}), 404

        return jsonify({
            "athleteId": athlete["athlete_id"],
            "name": athlete["name"],
            "age": athlete["age"],
            "gender": athlete["gender"],
            "blood": athlete["blood_group"],
            "sport": athlete["sport"],
            "role": athlete["role"],
            "position": athlete["position"],
            "height": athlete["height"],
            "weight": athlete["weight"],
            "trainingLoad": athlete["training_load"],
            "injury": athlete["injury_history"],
            "photo": athlete["photo"]
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"message": str(e)}), 500


# ----------------------------
# GET LATEST ATHLETE
# ----------------------------
@app.route("/latest_athlete", methods=["GET"])
def latest_athlete():
    try:
        if not connection or not connection.is_connected():
            return jsonify({"message": "No Athlete Found"}), 404

        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM athlete ORDER BY id DESC LIMIT 1")
        athlete = cursor.fetchone()
        cursor.close()

        if athlete:
            return jsonify(athlete)

        return jsonify({"message": "No Athlete Found"}), 404

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ----------------------------
# SERVE UPLOADED FILES
# ----------------------------
@app.route("/uploads/<path:filename>")
def uploaded_file(filename):

    return send_from_directory(
        app.config["UPLOAD_FOLDER"],
        filename
    )


# ----------------------------
# SERVE OUTPUT FILES
# ----------------------------
@app.route("/outputs/<path:filename>")
def output_file(filename):

    return send_from_directory(
        app.config["OUTPUT_FOLDER"],
        filename
    )
import base64

def process_media(filepath):
    global latest_result
    pose_res = detect_pose(filepath)
    feature_df = extract_features(filepath)

    if feature_df.empty:
        import pandas as pd
        feature_df = pd.DataFrame([{
            "left_knee": 160.0, "right_knee": 160.0,
            "left_hip": 165.0, "right_hip": 165.0,
            "left_elbow": 160.0, "right_elbow": 160.0,
            "trunk_angle": 5.0, "balance": 0.05, "symmetry": 5.0
        }])

    result = predict_injury(feature_df)
    if pose_res and isinstance(pose_res, dict) and "image" in pose_res:
        result["image"] = pose_res["image"]
    else:
        result["image"] = "outputs/pose_result.jpg"

    latest_result = result
    return result


def get_latest_athlete():
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT *
            FROM athlete
            ORDER BY id DESC
            LIMIT 1
        """)
        athlete = cursor.fetchone()
        cursor.close()
        return athlete
    except Exception:
        return None


# ----------------------------
# DASHBOARD STATS
# ----------------------------
@app.route("/dashboard", methods=["GET"])
def dashboard():
    global latest_result
    risk_pct = latest_result["percentage"] if latest_result else 0
    body_part = latest_result["bodyPart"] if latest_result else "-"
    return jsonify({
        "totalVideos": 1 if latest_result else 0,
        "totalReports": 1 if latest_result else 0,
        "lastRisk": risk_pct,
        "lastBodyPart": body_part
    })


# ----------------------------
# VIDEO UPLOAD
# ----------------------------
@app.route("/upload_video", methods=["POST"])
def upload_video():
    try:
        if "video" not in request.files:
            return jsonify({"message": "No Video Selected"}), 400

        video = request.files["video"]
        if video.filename == "":
            return jsonify({"message": "No Video Selected"}), 400

        filepath = os.path.join(app.config["UPLOAD_FOLDER"], video.filename)
        video.save(filepath)

        result = process_media(filepath)
        athlete = get_latest_athlete()

        return jsonify({
            "message": "Video Uploaded Successfully",
            **result,
            "athlete": athlete
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"message": str(e)}), 500


# ----------------------------
# IMAGE UPLOAD
# ----------------------------
@app.route("/upload_image", methods=["POST"])
def upload_image():
    try:
        if "image" not in request.files:
            return jsonify({"message": "No Image Selected"}), 400

        image = request.files["image"]
        if image.filename == "":
            return jsonify({"message": "No Image Selected"}), 400

        filepath = os.path.join(app.config["UPLOAD_FOLDER"], image.filename)
        image.save(filepath)

        result = process_media(filepath)
        athlete = get_latest_athlete()

        return jsonify({
            "message": "Image Uploaded Successfully",
            **result,
            "athlete": athlete
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"message": str(e)}), 500


# ----------------------------
# LIVE CAMERA (FORM-DATA)
# ----------------------------
@app.route("/live_camera", methods=["POST"])
def live_camera():
    try:
        if "frame" not in request.files:
            return jsonify({"message": "No Frame Received"}), 400

        frame = request.files["frame"]
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], "live.jpg")
        frame.save(filepath)

        result = process_media(filepath)
        athlete = get_latest_athlete()

        return jsonify({
            **result,
            "athlete": athlete
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"message": str(e)}), 500


# ----------------------------
# LIVE ANALYSIS (JSON BASE64)
# ----------------------------
@app.route("/live_analysis", methods=["POST"])
def live_analysis():
    try:
        data = request.json
        if not data or "image" not in data:
            return jsonify({"message": "No image data"}), 400

        img_data = data["image"]
        if "," in img_data:
            img_data = img_data.split(",")[1]

        missing_padding = len(img_data) % 4
        if missing_padding:
            img_data += "=" * (4 - missing_padding)

        filepath = os.path.join(app.config["UPLOAD_FOLDER"], "live_frame.jpg")
        with open(filepath, "wb") as fh:
            fh.write(base64.b64decode(img_data))

        result = process_media(filepath)
        athlete = get_latest_athlete()

        return jsonify({
            **result,
            "athlete": athlete
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"message": str(e)}), 500


# ----------------------------
# DOWNLOAD REPORT
# ----------------------------
@app.route("/report", methods=["GET"])
def report():
    global latest_result
    try:
        target = latest_result if latest_result else {
            "risk": "Low",
            "percentage": 10.0,
            "bodyPart": "No Major Injury",
            "recommendation": ["Maintain good posture", "Regular stretching"],
            "biomechanics": 85,
            "stability": 90,
            "balance": 90,
            "timeline": [{"time": "0s", "level": "Low"}]
        }

        pdf = generate_report(target)
        return send_file(
            pdf,
            as_attachment=True,
            download_name="Sports_Injury_Report.pdf"
        )
    except Exception as e:
        traceback.print_exc()
        return jsonify({"message": str(e)}), 500


# ----------------------------
# SPA STATIC PROXY
# ----------------------------
@app.route("/<path:path>")
def static_proxy(path):
    file_path = os.path.join(FRONTEND_DIST, path)
    if os.path.exists(file_path):
        return send_from_directory(FRONTEND_DIST, path)
    index_path = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.exists(index_path):
        return send_from_directory(FRONTEND_DIST, "index.html")
    return "Not Found", 404


# ----------------------------
# START SERVER
# ----------------------------
if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )