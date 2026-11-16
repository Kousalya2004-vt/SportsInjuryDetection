import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [athlete, setAthlete] = useState(null);

  const [dashboard, setDashboard] = useState({
    totalVideos: 0,
    totalReports: 0,
    lastRisk: 0,
    lastBodyPart: "-"
  });

  const [result, setResult] = useState({
    risk: "",
    percentage: "",
    confidence: "",
    severity: "",
    bodyPart: "",
    reason: "",
    recommendation: [],
    biomechanics: "",
    stability: "",
    balance: "",
    kneeAngle: "",
    hipAngle: "",
    ankleAngle: "",
    shoulderAngle: "",
    elbowAngle: "",
    timeline: [],
    image: ""
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/profile")
      .then((res) => res.json())
      .then((data) => setAthlete(data))
      .catch((err) => console.log(err));

    fetch("http://127.0.0.1:5000/dashboard")
      .then((res) => res.json())
      .then((data) => setDashboard(data))
      .catch(() => {});
  }, []);

  const openUpload = () => {
    fileRef.current.click();
  };

  const uploadVideo = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/upload_video",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setResult({
        risk: data.risk,
        percentage: data.percentage,
        confidence: data.confidence,
        severity: data.severity,
        bodyPart: data.bodyPart,
        reason: data.reason,
        recommendation: data.recommendation || [],
        biomechanics: data.biomechanics,
        stability: data.stability,
        balance: data.balance,
        kneeAngle: data.kneeAngle,
        hipAngle: data.hipAngle,
        ankleAngle: data.ankleAngle,
        shoulderAngle: data.shoulderAngle,
        elbowAngle: data.elbowAngle,
        timeline: data.timeline || [],
        image: data.image,
      });

      setDashboard((prev) => ({
        totalVideos: prev.totalVideos + 1,
        totalReports: prev.totalReports + 1,
        lastRisk: data.percentage,
        lastBodyPart: data.bodyPart,
      }));

    } catch (err) {
      alert("Server Error");
    }

    setLoading(false);
  };

  const downloadReport = () => {
    window.open("http://127.0.0.1:5000/report", "_blank");
  };

  const logout = () => {
    alert("Logged Out Successfully");
    navigate("/");
  };

  return (
    <div className="dashboard">

  {/* Sidebar */}

  <div className="sidebar">

    <h2>KinetIQ AI</h2>

    <button onClick={() => navigate("/profile")}>
      👤 Athlete Profile
    </button>

    <button onClick={openUpload}>
      📤 Upload Video
    </button>

    <button onClick={() => navigate("/live")}>
      📹 Live Camera
    </button>

    <button onClick={downloadReport}>
      📄 Download Report
    </button>

    <button onClick={logout}>
      🚪 Logout
    </button>

    <input
      type="file"
      accept="video/*"
      ref={fileRef}
      style={{ display: "none" }}
      onChange={uploadVideo}
    />

  </div>

  {/* Main Content */}

  <div className="main-content">

    <h1>🏃 AI Sports Injury Detection Dashboard</h1>

    <div className="summary-grid">

      <div className="summary-card">
        <h3>Total Videos</h3>
        <h2>{dashboard.totalVideos}</h2>
      </div>

      <div className="summary-card">
        <h3>Total Reports</h3>
        <h2>{dashboard.totalReports}</h2>
      </div>

      <div className="summary-card">
        <h3>Current Risk</h3>
        <h2>{dashboard.lastRisk}%</h2>
      </div>

      <div className="summary-card">
        <h3>Detected Body Part</h3>
        <h2>{dashboard.lastBodyPart}</h2>
      </div>

    </div>

    {/* Athlete Profile */}

    {athlete && (

      <div className="profile-card">

        <div className="profile-header">

          <img
            src={
              athlete.photo
                ? `http://127.0.0.1:5000/${athlete.photo}`
                : "/profile.png"
            }
            alt="Athlete"
            className="profile-image"
          />

          <div>
            <h2>{athlete.name}</h2>
            <p>{athlete.sport}</p>
          </div>

        </div>

        <div className="profile-grid">

          <p><b>Athlete ID:</b> {athlete.athleteId}</p>
          <p><b>Age:</b> {athlete.age}</p>
          <p><b>Gender:</b> {athlete.gender}</p>
          <p><b>Blood Group:</b> {athlete.blood}</p>
          <p><b>Sport:</b> {athlete.sport}</p>
          <p><b>Position:</b> {athlete.position}</p>
          <p><b>Coach:</b> {athlete.coachName}</p>
          <p><b>Coach Mobile:</b> {athlete.coachMobile}</p>
          <p><b>Height:</b> {athlete.height} cm</p>
          <p><b>Weight:</b> {athlete.weight} kg</p>
          <p><b>Training Load:</b> {athlete.trainingLoad}</p>
          <p><b>Previous Injury:</b> {athlete.injury}</p>

        </div>

      </div>

    )}
        {/* AI Status */}

    <div className="status-card">
      <h2>AI Status</h2>

      <p>✅ Flask Server Connected</p>
      <p>✅ MediaPipe Pose Detection Ready</p>
      <p>✅ AI Prediction Model Loaded</p>
      <p>✅ PDF Report Generator Ready</p>
    </div>

    {/* Loading */}

    {loading && (
      <div className="loading">
        <h2>Analyzing Athlete Movement...</h2>
        <p>Please wait while AI processes the uploaded video.</p>
      </div>
    )}

    {/* Prediction Result */}

    {!loading && result.risk && (

      <div className="prediction-card">

        <h2>AI Injury Prediction</h2>

        <p><strong>Injury Risk:</strong> {result.risk}</p>

        <p><strong>Risk Percentage:</strong> {result.percentage}%</p>

        <p><strong>Confidence:</strong> {result.confidence}%</p>

        <p><strong>Severity:</strong> {result.severity}</p>

        <p><strong>Detected Body Part:</strong> {result.bodyPart}</p>

        <p><strong>Reason:</strong> {result.reason}</p>

        <h3>Recommendations</h3>

        <ul>
          {Array.isArray(result.recommendation)
            ? result.recommendation.map((item, index) => (
                <li key={index}>{item}</li>
              ))
            : null}
        </ul>
                {/* Performance Scores */}

        <div className="score-grid">

          <div className="score-card">
            <h3>Biomechanics</h3>
            <p>{result.biomechanics}/100</p>
          </div>

          <div className="score-card">
            <h3>Stability</h3>
            <p>{result.stability}/100</p>
          </div>

          <div className="score-card">
            <h3>Balance</h3>
            <p>{result.balance}/100</p>
          </div>

        </div>

        {/* Joint Angles */}

        <div className="joint-grid">

          <div className="joint-card">
            <h3>Knee Angle</h3>
            <p>{result.kneeAngle}°</p>
          </div>

          <div className="joint-card">
            <h3>Hip Angle</h3>
            <p>{result.hipAngle}°</p>
          </div>

          <div className="joint-card">
            <h3>Ankle Angle</h3>
            <p>{result.ankleAngle}°</p>
          </div>

          <div className="joint-card">
            <h3>Shoulder Angle</h3>
            <p>{result.shoulderAngle}°</p>
          </div>

          <div className="joint-card">
            <h3>Elbow Angle</h3>
            <p>{result.elbowAngle}°</p>
          </div>

        </div>

        {/* Heatmap */}

        {result.image && (

          <div className="heatmap-section">

            <h3>Pose Detection Result</h3>

            <img
              src={`http://127.0.0.1:5000/${result.image}`}
              alt="Heatmap"
              className="heatmap-image"
            />

          </div>

        )}

        {/* Timeline */}

        {result.timeline.length > 0 && (

          <div className="timeline-section">

            <h3>Risk Timeline</h3>

            <table>

              <thead>

                <tr>
                  <th>Time</th>
                  <th>Risk</th>
                </tr>

              </thead>

              <tbody>

                {result.timeline.map((item, index) => (

                  <tr key={index}>
                    <td>{item.time}</td>
                    <td>{item.level}</td>
                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}
                {/* Action Buttons */}

        <div className="action-buttons">

          <button
            className="analyze-btn"
            onClick={openUpload}
          >
            Analyze Another Video
          </button>

          <button
            className="report-btn"
            onClick={downloadReport}
          >
            Download PDF Report
          </button>

        </div>

      </div>

    )}

  </div>

</div>

  );
}

export default Dashboard;