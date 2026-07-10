from flask import Flask, request
from database import db

app = Flask(__name__)

@app.route("/")
def home():
    return "Sports Injury Detection Backend Running"


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data["username"]
    password = data["password"]
    role = data["role"]

    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO users (username, password, role) VALUES (%s, %s, %s)",
        (username, password, role)
    )
    db.commit()

    return {"message": "User Registered Successfully"}


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data["username"]
    password = data["password"]

    cursor = db.cursor()
    cursor.execute(
        "SELECT * FROM users WHERE username=%s AND password=%s",
        (username, password)
    )

    user = cursor.fetchone()

    if user:
        return {"message": "Login Successful"}
    else:
        return {"message": "Invalid Username or Password"}

import os

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/upload", methods=["POST"])
def upload():
    file = request.files["image"]

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    return {
        "message": "Image Uploaded Successfully",
        "filename": file.filename
    }


if __name__ == "__main__":
    app.run(debug=True)