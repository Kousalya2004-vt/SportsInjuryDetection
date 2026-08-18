-- ============================================================
-- SPORTS INJURY DETECTION SYSTEM - MYSQL DATABASE SCHEMA
-- Database Name: sports_injury
-- ============================================================

CREATE DATABASE IF NOT EXISTS sports_injury;
USE sports_injury;

-- 1. Athlete Biometric Profile Table
CREATE TABLE IF NOT EXISTS athlete (
    id INT AUTO_INCREMENT PRIMARY KEY,
    athlete_id VARCHAR(20),
    name VARCHAR(100),
    age INT,
    gender VARCHAR(10),
    blood_group VARCHAR(5),
    sport VARCHAR(50),
    position VARCHAR(50),
    height FLOAT,
    weight FLOAT,
    training_load VARCHAR(20),
    injury_history VARCHAR(10),
    photo VARCHAR(255)
);

-- 2. AI Injury Reports Table
CREATE TABLE IF NOT EXISTS injury_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id VARCHAR(50),
    athlete_id VARCHAR(20),
    risk_level VARCHAR(20),
    risk_percentage FLOAT,
    confidence FLOAT,
    severity VARCHAR(50),
    body_part VARCHAR(100),
    diagnosis_reason TEXT,
    recommendations TEXT,
    biomechanics_score INT,
    stability_score INT,
    balance_score INT,
    knee_angle FLOAT,
    hip_angle FLOAT,
    ankle_angle FLOAT,
    shoulder_angle FLOAT,
    elbow_angle FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. System Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(255),
    role VARCHAR(50)
);
