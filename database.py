import os
import mysql.connector

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "Venkata@123")
DB_NAME = os.getenv("DB_NAME", "sports_injury")

connection = None

try:
    connection = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    if connection.is_connected():
        print("✅ MySQL Database Connected Successfully to", DB_NAME)
except Exception as err:
    print("⚠️ MySQL Connection Notice:", err)
    print("ℹ️ Backend running with fallback local storage support.")