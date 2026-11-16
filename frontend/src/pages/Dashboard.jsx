import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "Kousalya",
    fullName: "Kousalya Venkata Sai Lakshmi",
    sport: "Running",
    role: "ATHLETE",
  });

  const [stats, setStats] = useState({
    total_analyses: 1,
    this_week: 1,
    highest_risk: 44,
    most_common_risk: "Moderate",
  });

  const [latestAnalysis, setLatestAnalysis] = useState({
    probability: 44,
    risk_level: "Moderate Risk",
    activity: "Running",
    biomechanics: 79,
    fatigue_risk: 95,
    confidence: "100%",
    video_name: "6573047-uhd_3840_2160_25fps.mp4",
  });

  useEffect(() => {
    // Fetch profile
    fetch("http://127.0.0.1:5000/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) {
          const first = data.name.trim().split(" ")[0];
          setUser((prev) => ({
            ...prev,
            firstName: first,
            fullName: data.name,
            role: (data.role || "ATHLETE").toUpperCase(),
          }));
        }
      })
      .catch(() => {
        const savedName = localStorage.getItem("user_name");
        if (savedName) {
          setUser((prev) => ({
            ...prev,
            firstName: savedName.trim().split(" ")[0],
            fullName: savedName,
          }));
        }
      });

    // Check active athlete profile
    const savedAth = localStorage.getItem("athlete_profile");
    if (savedAth) {
      try {
        const parsed = JSON.parse(savedAth);
        if (parsed.name) {
          setUser((prev) => ({
            ...prev,
            fullName: parsed.name,
            firstName: parsed.name.trim().split(" ")[0],
            sport: parsed.sport || "Running",
          }));
        }
      } catch (e) {}
    }

    // Fetch history and latest analysis
    fetch("http://127.0.0.1:5000/api/history")
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
        if (data.items && data.items.length > 0) {
          const latest = data.items[0];
          setLatestAnalysis({
            probability: latest.probability || 44,
            risk_level: latest.risk_level ? `${latest.risk_level} Risk` : "Moderate Risk",
            activity: latest.sport || "Running",
            biomechanics: latest.biomechanics || 79,
            fatigue_risk: latest.fatigue_risk || 95,
            confidence: latest.confidence || "100%",
            video_name: latest.video_name || "6573047-uhd_3840_2160_25fps.mp4",
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="dashboardPage fade-in">
      <div className="dashboardWelcomeHeader">
        <h1>Welcome back, {user.firstName}</h1>
        <p className="subtitle">
          Upload your movement videos and track your injury risk history over time.
        </p>
      </div>

      {/* Side-by-Side Main Grid: Movement Analysis + Athlete Risk Intelligence */}
      <div className="sideBySideContainer">
        {/* Left Column: Movement Analysis Action Card */}
        <div className="movementAnalysisSideCard">
          <div className="cardTitleRow">
            <div className="iconBadge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div>
              <h3>Movement Analysis</h3>
              <p>Upload a clip and run the risk pipeline.</p>
            </div>
          </div>

          <div className="actionButtonsGrid">
            <button className="primaryActionBtn" onClick={() => navigate("/upload")}>
              📤 Upload Video for Analysis ➔
            </button>
            <div className="secondaryActionRow">
              <button className="secondaryActionBtn" onClick={() => navigate("/live")}>
                📹 Live Camera
              </button>
              <button className="secondaryActionBtn" onClick={() => navigate("/injury-prediction")}>
                🧠 Injury Intelligence
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Athlete Risk Overview (with user name and risk) */}
        <div className="athleteRiskOverviewSideCard">
          <div className="overviewHeader">
            <div>
              <span className="athleteTag">ATHLETE RISK ANALYSIS</span>
              <h2>{user.fullName}</h2>
            </div>
            <span className="riskBadgeModerate">{latestAnalysis.risk_level}</span>
          </div>

          <div className="riskScoreRow">
            <div className="bigRiskScore">
              <span className="num">{latestAnalysis.probability}</span>
              <span className="denom">/ 100 Risk Score</span>
            </div>

            <div className="subMetricsPills">
              <div className="sPill">
                <span className="lbl">BIOMECH. EFFICIENCY</span>
                <span className="val">{latestAnalysis.biomechanics}%</span>
              </div>
              <div className="sPill">
                <span className="lbl">FATIGUE RISK</span>
                <span className="val">{latestAnalysis.fatigue_risk}%</span>
              </div>
            </div>
          </div>

          <div className="overviewFooterRow">
            <span className="fileInfo">Activity: <strong>{user.sport}</strong> · Clip: {latestAnalysis.video_name}</span>
            <button className="historyLinkBtn" onClick={() => navigate("/history")}>
              View History ➔
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary Cards Row Side by Side */}
      <div className="dashboardSummaryGrid">
        <div className="summaryCard" onClick={() => navigate("/history")}>
          <span className="summaryLabel">TOTAL ANALYSES</span>
          <span className="summaryVal">{stats.total_analyses}</span>
        </div>

        <div className="summaryCard" onClick={() => navigate("/history")}>
          <span className="summaryLabel">THIS WEEK</span>
          <span className="summaryVal">{stats.this_week}</span>
        </div>

        <div className="summaryCard" onClick={() => navigate("/history")}>
          <span className="summaryLabel">HIGHEST RISK</span>
          <span className="summaryVal">{stats.highest_risk}</span>
        </div>

        <div className="summaryCard" onClick={() => navigate("/history")}>
          <span className="summaryLabel">MOST COMMON RISK</span>
          <span className="summaryVal">{stats.most_common_risk}</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;