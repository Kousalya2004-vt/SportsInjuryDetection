import React from "react";
import "./AnomalyTimeline.css";

const AnomalyTimeline = ({ anomalySummary }) => {
  const anomalies = anomalySummary?.anomalies || [];
  const total = anomalySummary?.total_anomalies || 0;
  const rate = anomalySummary?.anomaly_rate || 0.0;
  const summary = anomalySummary?.severity_summary || { Low: 0, Medium: 0, High: 0 };

  return (
    <div className="anomaly-timeline-container">
      <div className="anomaly-header">
        <div>
          <h3 className="section-title">📊 Movement Anomaly Timeline & Kinematic Flags</h3>
          <p className="anomaly-subtitle">
            Temporal frame-by-frame joint angle and trajectory anomaly evaluation.
          </p>
        </div>
        <div className="anomaly-stats-badge">
          <span>{total} Anomalies Flagged</span>
          <span className="anomaly-rate">({rate}% Frame Rate)</span>
        </div>
      </div>

      <div className="severity-bar">
        <div className="sev-item high">
          <span className="sev-dot red"></span> High: {summary.High || 0}
        </div>
        <div className="sev-item medium">
          <span className="sev-dot orange"></span> Medium: {summary.Medium || 0}
        </div>
        <div className="sev-item low">
          <span className="sev-dot green"></span> Low: {summary.Low || 0}
        </div>
      </div>

      {anomalies.length === 0 ? (
        <div className="no-anomalies-box">
          <span className="check-icon">✓</span>
          <p>No high-risk movement anomalies detected in the analyzed sequence.</p>
        </div>
      ) : (
        <div className="anomaly-list">
          {anomalies.map((item, idx) => (
            <div
              key={idx}
              className={`anomaly-item severity-${(item.severity || "medium").toLowerCase()}`}
            >
              <div className="anomaly-time">{item.timestamp || `${item.frame || idx}f`}</div>
              <div className="anomaly-content">
                <div className="anomaly-title-row">
                  <span className="anomaly-type">{item.type}</span>
                  <span className={`anomaly-sev-tag ${item.severity?.toLowerCase()}`}>
                    {item.severity}
                  </span>
                </div>
                <p className="anomaly-desc">{item.description}</p>
                {item.joint && <span className="anomaly-joint-tag">Target: {item.joint}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnomalyTimeline;
