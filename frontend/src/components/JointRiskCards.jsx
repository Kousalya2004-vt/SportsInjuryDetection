import React from "react";
import "./JointRiskCards.css";

const JointRiskCards = ({ jointRisks }) => {
  const risks = jointRisks || {
    Knee: 15,
    Hip: 12,
    "Lower Back": 10,
    "Ankle & Balance": 14,
    "Upper Body": 10,
  };

  const getRiskColor = (score) => {
    if (score >= 75) return "#ef4444"; // Red
    if (score >= 50) return "#f97316"; // Orange
    if (score >= 30) return "#eab308"; // Yellow
    return "#10b981"; // Green
  };

  const getRiskBadge = (score) => {
    if (score >= 75) return "Critical";
    if (score >= 50) return "High Risk";
    if (score >= 30) return "Moderate";
    return "Optimal";
  };

  return (
    <div className="joint-risk-container">
      <h3 className="section-title">⚡ Multi-Joint Biomechanical Risk Breakdown</h3>
      <div className="joint-cards-grid">
        {Object.entries(risks).map(([joint, score]) => {
          const color = getRiskColor(score);
          const badge = getRiskBadge(score);
          return (
            <div className="joint-card" key={joint}>
              <div className="joint-card-header">
                <span className="joint-name">{joint}</span>
                <span
                  className="joint-badge"
                  style={{ backgroundColor: `${color}22`, color: color, borderColor: color }}
                >
                  {badge}
                </span>
              </div>
              <div className="joint-score-val" style={{ color: color }}>
                {score}%
              </div>
              <div className="joint-progress-bg">
                <div
                  className="joint-progress-fill"
                  style={{ width: `${Math.min(100, Math.max(5, score))}%`, backgroundColor: color }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JointRiskCards;
