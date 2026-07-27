import React, { useState } from "react";
import "./RecommendationsWidget.css";

const RecommendationsWidget = ({ recommendationPlan }) => {
  const [completedExercises, setCompletedExercises] = useState({});

  const plan = recommendationPlan || {
    immediate_protocols: [
      "Maintain proper warm-up before sessions.",
      "Hydrate adequately.",
    ],
    rehab_exercises: [
      {
        name: "Single-Leg Romanian Deadlift",
        sets: "3 Sets x 8 Reps per leg",
        target: "Gluteus Medius & Hamstrings",
        purpose: "Enhances hip stability and single-leg balance.",
      },
    ],
    technique_cues: ["Keep knee tracking over toes during landings."],
    medical_alert: false,
    summary_text: "Standard prevention plan.",
  };

  const toggleExercise = (idx) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="recommendations-container">
      <div className="rec-header">
        <h3 className="section-title">🏥 Corrective Action Plan & Rehabilitation Protocol</h3>
        {plan.medical_alert && (
          <div className="medical-alert-badge">
            ⚠️ Medical Clearance Recommended
          </div>
        )}
      </div>
      <p className="rec-summary">{plan.summary_text}</p>

      {/* Immediate Protocols */}
      <div className="rec-section">
        <h4 className="rec-subtitle">⚡ Immediate Action Protocols</h4>
        <ul className="protocol-list">
          {plan.immediate_protocols?.map((proto, idx) => (
            <li key={idx} className="protocol-item">
              <span className="proto-bullet">•</span> {proto}
            </li>
          ))}
        </ul>
      </div>

      {/* Targeted Exercises */}
      <div className="rec-section">
        <h4 className="rec-subtitle">🏋️ Targeted Rehabilitation & Strength Exercises</h4>
        <div className="exercise-grid">
          {plan.rehab_exercises?.map((ex, idx) => {
            const isDone = completedExercises[idx];
            return (
              <div key={idx} className={`exercise-card ${isDone ? "completed" : ""}`}>
                <div className="ex-card-header">
                  <span className="ex-name">{ex.name}</span>
                  <button className="check-btn" onClick={() => toggleExercise(idx)}>
                    {isDone ? "✓ Completed" : "+ Mark Done"}
                  </button>
                </div>
                <div className="ex-meta">
                  <span className="ex-sets">{ex.sets}</span>
                  <span className="ex-target">Target: {ex.target}</span>
                </div>
                <p className="ex-purpose">{ex.purpose}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technique & Form Cues */}
      {plan.technique_cues?.length > 0 && (
        <div className="rec-section">
          <h4 className="rec-subtitle">🎯 Biomechanical Coaching & Form Cues</h4>
          <div className="cue-box">
            {plan.technique_cues.map((cue, idx) => (
              <div key={idx} className="cue-item">
                💡 {cue}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationsWidget;
