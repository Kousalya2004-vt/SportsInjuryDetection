import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "700px",
          background: "#1e293b",
          padding: "40px",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
        }}
      >
        <h1 style={{ color: "#38bdf8" }}>Sports Injury Detection AI</h1>

        <p>
          Detect sports injuries using AI-based pose estimation and athlete
          profile analysis.
        </p>

        <br />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <Link to="/login">
            <button
              style={{
                padding: "12px 25px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </Link>

          <Link to="/profile">
            <button
              style={{
                padding: "12px 25px",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Athlete Profile
            </button>
          </Link>
        </div>

        <br />

        <h3>Features</h3>

        <p>✔ Athlete Registration</p>
        <p>✔ Injury History</p>
        <p>✔ Pose Estimation</p>
        <p>✔ AI Analysis</p>
      </div>
    </div>
  );
}

export default Home;