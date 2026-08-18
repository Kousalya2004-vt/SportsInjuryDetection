"""
============================================================
KinetIQ.AI - Sports Injury Prevention Platform
Milestone 4: Automated Testing & Validation Suite
============================================================
"""

import os
import sys
import unittest
import numpy as np
import pickle

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from feature_extraction import calculate_angle, get_features
from anomaly_detector import detect_movement_anomalies
from risk_engine import calculate_risk_scores


class TestBiomechanicsAndAIModel(unittest.TestCase):

    def test_angle_calculation(self):
        """Test 3D / 2D angle calculation geometry."""
        a = [0, 1]
        b = [0, 0]
        c = [1, 0]
        angle = calculate_angle(a, b, c)
        self.assertAlmostEqual(angle, 90.0, places=1)

    def test_angle_geometry(self):
        """Test angle computation for straight line."""
        a = [0, 1]
        b = [0, 0]
        c = [0, -1]
        angle = calculate_angle(a, b, c)
        self.assertAlmostEqual(angle, 180.0, places=1)

    def test_xgboost_model_file_exists(self):
        """Verify trained XGBoost model and label encoder files exist."""
        model_path = os.path.join(os.path.dirname(__file__), "injury_model.pkl")
        encoder_path = os.path.join(os.path.dirname(__file__), "label_encoder.pkl")
        self.assertTrue(os.path.exists(model_path), "injury_model.pkl missing!")
        self.assertTrue(os.path.exists(encoder_path), "label_encoder.pkl missing!")

    def test_model_loading_and_inference(self):
        """Test loading XGBoost model and executing dummy prediction."""
        model_path = os.path.join(os.path.dirname(__file__), "injury_model.pkl")
        with open(model_path, "rb") as f:
            model = pickle.load(f)

        # Create synthetic feature vector (9 features matching trained model)
        sample_features = np.array([[150.0, 165.0, 155.0, 140.0, 150.0, 155.0, 5.0, 0.05, 15.0]])
        prediction = model.predict(sample_features)
        self.assertIsNotNone(prediction)
        self.assertEqual(len(prediction), 1)

    def test_anomaly_detector(self):
        """Test anomaly detector logic on synthetic DataFrame."""
        import pandas as pd
        sample_df = pd.DataFrame([{
            "left_knee": 105.0,
            "right_knee": 160.0,
            "left_hip": 150.0,
            "right_hip": 140.0,
            "trunk_angle": 12.0,
            "balance": 0.08,
            "symmetry": 25.0
        }])
        result = detect_movement_anomalies(sample_df)
        self.assertIn("anomalies", result)
        self.assertIn("total_anomalies", result)
        self.assertGreater(result["total_anomalies"], 0)

    def test_risk_engine_scores(self):
        """Test risk engine calculation produces valid metrics."""
        import pandas as pd
        feature_df = pd.DataFrame([{
            "left_knee": 152.62,
            "right_knee": 164.87,
            "left_hip": 157.96,
            "right_hip": 142.03,
            "left_elbow": 150.0,
            "right_elbow": 155.0,
            "trunk_angle": 0.02,
            "balance": 0.03,
            "symmetry": 24.3
        }])
        risk_result = calculate_risk_scores(feature_df)
        self.assertIn("overall_risk", risk_result)
        self.assertIn("severity_label", risk_result)
        self.assertGreaterEqual(risk_result["overall_risk"], 0)
        self.assertLessEqual(risk_result["overall_risk"], 100)


class TestFlaskBackendRoutes(unittest.TestCase):

    def setUp(self):
        from app import app
        app.testing = True
        self.client = app.test_client()

    def test_home_route(self):
        """Test Flask root endpoint responds."""
        response = self.client.get("/")
        self.assertIn(response.status_code, [200, 404])

    def test_risk_analytics_api(self):
        """Test /api/risk_analytics endpoint."""
        response = self.client.get("/api/risk_analytics")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("overall_risk", data)
        self.assertIn("joint_risks", data)

    def test_recommendations_api(self):
        """Test /api/recommendations endpoint."""
        response = self.client.get("/api/recommendations")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("rehab_exercises", data)

    def test_athletes_route(self):
        """Test /athletes endpoint."""
        response = self.client.get("/athletes")
        self.assertEqual(response.status_code, 200)

    def test_history_api(self):
        """Test /api/history GET endpoint."""
        response = self.client.get("/api/history")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("items", data)
        self.assertIn("stats", data)

    def test_user_profile_api(self):
        """Test /api/user/profile GET endpoint."""
        response = self.client.get("/api/user/profile")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("email", data)
        self.assertIn("name", data)

    def test_password_change_api(self):
        """Test /api/settings/password POST endpoint."""
        from app import load_user
        current_user = load_user()
        curr_pass = current_user.get("password", "password123")
        response = self.client.post("/api/settings/password", json={
            "current_password": curr_pass,
            "new_password": "password123",
            "confirm_password": "password123"
        })
        self.assertEqual(response.status_code, 200)


if __name__ == "__main__":
    print("\n============================================================")
    print("RUNNING KINETIQ.AI MILESTONE 4 TEST SUITE")
    print("============================================================\n")
    unittest.main()
