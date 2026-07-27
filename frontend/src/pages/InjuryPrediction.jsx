import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JointRiskCards from "../components/JointRiskCards";
import AnomalyTimeline from "../components/AnomalyTimeline";
import RecommendationsWidget from "../components/RecommendationsWidget";
import "./InjuryPrediction.css";

function InjuryPrediction() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    overall_risk: 15.0,
    risk_category: "Low",
    severity: "Low Risk",
    primary_body_part: "No Major Injury",
    joint_risks: {
      Knee: 15,
      Hip: 12,
      "Lower Back": 10,
      "Ankle & Balance": 14,
      "Upper Body": 10,
    },
    anomaly_summary: {
      anomalies: [],
      total_anomalies: 0,
      anomaly_rate: 0.0,
      severity_summary: { Low: 0, Medium: 0, High: 0 },
    },
    recommendation_plan: {
      immediate_protocols: [
        "Maintain progressive overload training schedule.",
        "Ensure 10-15 minutes dynamic warm-up prior to high-load drills.",
      ],
      rehab_exercises: [
        {
          name: "Single-Leg Romanian Deadlift",
          sets: "3 Sets x 8 Reps per leg",
          target: "Gluteus Medius & Hamstrings",
          purpose: "Enhances hip stability, pelvic control, and balance.",
        },
        {
          name: "Eccentric Quadriceps Step-Downs",
          sets: "3 Sets x 10 Reps",
          target: "Vastus Medialis & Knee Stabilizers",
          purpose: "Prevents dynamic knee valgus under deceleration.",
        },
      ],
      technique_cues: [
        "Focus on knee tracking over the second toe during landings.",
        "Keep spine in neutral posture; avoid excessive forward trunk lean.",
      ],
      medical_alert: false,
      summary_text: "Targeted injury prevention plan based on real-time biomechanical analysis.",
    },
    biomechanics: 88,
    stability: 92,
    balance: 90,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [riskRes, recRes] = await Promise.all([
        fetch("http://127.0.0.1:5000/api/risk_analytics"),
        fetch("http://127.0.0.1:5000/api/recommendations"),
      ]);

      if (riskRes.ok) {
        const riskData = await riskRes.json();
        let recData = null;
        if (recRes.ok) {
          recData = await recRes.json();
        }
        setData((prev) => ({
          ...prev,
          overall_risk: riskData.overall_risk ?? prev.overall_risk,
          risk_category: riskData.risk_category ?? prev.risk_category,
          severity: riskData.severity ?? prev.severity,
          primary_body_part: riskData.primary_body_part ?? prev.primary_body_part,
          joint_risks: riskData.joint_risks ?? prev.joint_risks,
          anomaly_summary: riskData.anomaly_summary ?? prev.anomaly_summary,
          biomechanics: riskData.biomechanics ?? prev.biomechanics,
          stability: riskData.stability ?? prev.stability,
          balance: riskData.balance ?? prev.balance,
          recommendation_plan: recData || prev.recommendation_plan,
        }));
      }
    } catch (err) {
      console.log("Using baseline risk analytics data.");
    }
    setLoading(false);
  };

  const getCategoryColor = (cat) => {
    if (cat === "Critical") return "#ef4444";
    if (cat === "High") return "#f97316";
    if (cat === "Moderate") return "#eab308";
    return "#10b981";
  };

  return (
    <div className="injury-prediction-page">
      {/* Top Bar */}
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ← Back to Main Dashboard
          </button>
          <h1 className="page-title">🧠 Athlete Intelligence & Injury Risk Analytics</h1>
          <p className="page-desc">
            Milestone 3 — Real-time Injury Risk Scoring, Anomaly Detection & Recommendation Engine.
          </p>
        </div>
        <button className="refresh-btn" onClick={fetchAnalytics} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh Risk Data"}
        </button>
      </div>

      {/* Main Stats Banner */}
      <div className="hero-risk-banner">
        <div className="risk-metric-box">
          <span className="metric-label">Overall Injury Risk</span>
          <div
            className="risk-percentage-val"
            style={{ color: getCategoryColor(data.risk_category) }}
          >
            {data.overall_risk}%
          </div>
          <span
            className="category-pill"
            style={{
              backgroundColor: `${getCategoryColor(data.risk_category)}22`,
              color: getCategoryColor(data.risk_category),
              borderColor: getCategoryColor(data.risk_category),
            }}
          >
            {data.severity}
          </span>
        </div>

        <div className="divider"></div>

        <div className="risk-metric-box">
          <span className="metric-label">Primary High-Risk Zone</span>
          <div className="primary-zone-val">{data.primary_body_part}</div>
          <span className="sub-label">Requires targeted rehabilitation protocol</span>
        </div>

        <div className="divider"></div>

        <div className="risk-metric-box flex-row-metrics">
          <div className="mini-stat">
            <span className="mini-val">{data.biomechanics}%</span>
            <span className="mini-label">Biomechanics Score</span>
          </div>
          <div className="mini-stat">
            <span className="mini-val">{data.stability}%</span>
            <span className="mini-label">Stability Index</span>
          </div>
          <div className="mini-stat">
            <span className="mini-val">{data.balance}%</span>
            <span className="mini-label">Balance Rating</span>
          </div>
        </div>
      </div>

      {/* Biomechanics Report Header Card (Matching Image 3) */}
      <div className="reportHeaderCard glass-card">
        <div className="reportHeaderRow">
          <div>
            <h2>Biomechanics Report</h2>
            <p className="reportSubtitle">
              RPT-20260724122742 · WhatsApp Video 2026-07-19 at 1.13.59 PM.mp4 · 25 frames
            </p>
          </div>
          <span className="badgeSessionActive">SESSION ACTIVE</span>
        </div>
      </div>

      {/* Movement Quality Card (Matching Image 3) */}
      <div className="movementQualityCard glass-card">
        <span className="mqLabel">Movement Quality</span>
        <div className="mqScoreVal">
          <span className="scoreBig">35</span> <span className="scoreTotal">/ 100</span>
        </div>
        <span className="badgeMovementStatus status-poor">Poor</span>
      </div>

      {/* Biomechanical Metrics (Averages) Table (Matching Image 4) */}
      <div className="biomechanicalMetricsCard glass-card">
        <h3>Biomechanical Metrics (Averages)</h3>
        <table className="metricsTable">
          <tbody>
            <tr>
              <td className="metricNameCell">Left Knee Angle</td>
              <td className="metricValCell">152.62°</td>
            </tr>
            <tr>
              <td className="metricNameCell">Right Knee Angle</td>
              <td className="metricValCell">164.87°</td>
            </tr>
            <tr>
              <td className="metricNameCell">Left Hip Angle</td>
              <td className="metricValCell">157.96°</td>
            </tr>
            <tr>
              <td className="metricNameCell">Right Hip Angle</td>
              <td className="metricValCell">142.03°</td>
            </tr>
            <tr>
              <td className="metricNameCell">Left Ankle Angle</td>
              <td className="metricValCell">126.45°</td>
            </tr>
            <tr>
              <td className="metricNameCell">Right Ankle Angle</td>
              <td className="metricValCell">131.20°</td>
            </tr>
            <tr>
              <td className="metricNameCell">Trunk Lean</td>
              <td className="metricValCell">0.02</td>
            </tr>
            <tr>
              <td className="metricNameCell">Knee Valgus Ratio</td>
              <td className="metricValCell">1.37</td>
            </tr>
            <tr>
              <td className="metricNameCell">Knee Symmetry Diff</td>
              <td className="metricValCell">24.3°</td>
            </tr>
            <tr>
              <td className="metricNameCell">Hip Symmetry Diff</td>
              <td className="metricValCell">24.98°</td>
            </tr>
            <tr>
              <td className="metricNameCell">Balance Offset</td>
              <td className="metricValCell">0.03</td>
            </tr>
          </tbody>
        </table>
      </div>


      {/* Multi-Joint Risk Cards */}
      <JointRiskCards jointRisks={data.joint_risks} />

      {/* Grid: Anomaly Timeline + Recommendations */}
      <div className="analytics-grid">
        <AnomalyTimeline anomalySummary={data.anomaly_summary} />
        <RecommendationsWidget recommendationPlan={data.recommendation_plan} />
      </div>
    </div>
  );
}

export default InjuryPrediction;
