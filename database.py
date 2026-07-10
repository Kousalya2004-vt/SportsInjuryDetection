import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Venkata@123",
    database="sports_injury"
)

print("Database Connected Successfully")