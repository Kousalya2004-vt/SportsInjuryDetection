import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [athlete, setAthlete] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check user login session state
    const loggedIn = localStorage.getItem("user_logged_in") === "true";
    setIsLoggedIn(loggedIn);

    const savedName = localStorage.getItem("user_name");
    if (savedName) setUserName(savedName);

    // Sync active athlete from localStorage or backend
    const saved = localStorage.getItem("athlete_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAthlete(parsed);
        if (!savedName && parsed.name) setUserName(parsed.name.split(" ")[0]);
      } catch (e) {}
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user_logged_in");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={styles.header}>
      <div style={styles.logoContainer} onClick={() => navigate("/")}>
        <div style={styles.logoBadge}>🏃</div>
        <div>
          <h2 style={styles.logoTitle}>KinetIQ<span style={{ color: "#38bdf8" }}>.AI</span></h2>
          <p style={styles.logoSubtitle}>Sports Injury & Posture Intelligence</p>
        </div>
      </div>

      <nav style={styles.navLinks}>
        <Link to="/" style={isActive("/") ? styles.activeLink : styles.link}>
          Home
        </Link>
        <Link to="/profile" style={isActive("/profile") ? styles.activeLink : styles.link}>
          Athlete Management
        </Link>
        <Link to="/upload" style={isActive("/upload") ? styles.activeLink : styles.link}>
          Video Analysis
        </Link>
        <Link to="/live" style={isActive("/live") ? styles.activeLink : styles.link}>
          Live Video
        </Link>
        <Link to="/injury-prediction" style={isActive("/injury-prediction") ? styles.activeLink : styles.link}>
          Reports
        </Link>
        <Link to="/dashboard" style={isActive("/dashboard") ? styles.activeLink : styles.link}>
          Dashboard
        </Link>
      </nav>

      <div style={styles.rightSection}>
        {isLoggedIn ? (
          <>
            <div style={styles.athleteBadge} onClick={() => navigate("/profile")}>
              <span style={styles.onlineDot}></span>
              <span style={styles.athleteName}>{athlete?.name ? athlete.name : (userName || "Sumit R")}</span>
              <span style={styles.sportTag}>ATHLETE</span>
            </div>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Link to="/login" style={styles.loginBtn}>
              Sign In
            </Link>
            <Link to="/signup" style={styles.signupBtn}>
              Create Account
            </Link>
          </div>
        )}
      </div>
    </header>
  );

}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 32px",
    background: "rgba(15, 23, 42, 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  },
  logoBadge: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.4rem",
    boxShadow: "0 0 15px rgba(56, 189, 248, 0.4)",
  },
  logoTitle: {
    fontSize: "1.35rem",
    fontWeight: 800,
    letterSpacing: "-0.5px",
    color: "#f8fafc",
    lineHeight: 1.1,
  },
  logoSubtitle: {
    fontSize: "0.72rem",
    color: "#94a3b8",
    fontWeight: 500,
    letterSpacing: "0.4px",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(30, 41, 59, 0.5)",
    padding: "6px 12px",
    borderRadius: "30px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  link: {
    color: "#94a3b8",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: 600,
    transition: "all 0.25s ease",
  },
  activeLink: {
    color: "#ffffff",
    background: "linear-gradient(135deg, #0284c7, #38bdf8)",
    padding: "8px 18px",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: 700,
    boxShadow: "0 4px 12px rgba(56, 189, 248, 0.35)",
    textDecoration: "none",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  athleteBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(16, 185, 129, 0.12)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    padding: "6px 14px",
    borderRadius: "20px",
    cursor: "pointer",
  },
  onlineDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#10b981",
    boxShadow: "0 0 8px #10b981",
  },
  athleteName: {
    color: "#f8fafc",
    fontWeight: 700,
    fontSize: "0.85rem",
  },
  sportTag: {
    color: "#34d399",
    fontSize: "0.75rem",
    fontWeight: 600,
    background: "rgba(16, 185, 129, 0.2)",
    padding: "2px 8px",
    borderRadius: "10px",
  },
  profileRequiredBadge: {
    background: "rgba(245, 158, 11, 0.15)",
    color: "#fbbf24",
    border: "1px solid rgba(245, 158, 11, 0.4)",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "0.82rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  loginBtn: {
    background: "rgba(56, 189, 248, 0.15)",
    color: "#38bdf8",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    padding: "8px 18px",
    borderRadius: "12px",
    fontSize: "0.88rem",
    fontWeight: 700,
    textDecoration: "none",
    transition: "all 0.25s ease",
  },
  signupBtn: {
    background: "linear-gradient(135deg, #0284c7, #38bdf8)",
    color: "#ffffff",
    padding: "8px 18px",
    borderRadius: "12px",
    fontSize: "0.88rem",
    fontWeight: 700,
    textDecoration: "none",
    boxShadow: "0 4px 12px rgba(56, 189, 248, 0.3)",
    transition: "all 0.25s ease",
  },
  logoutBtn: {
    background: "rgba(244, 63, 94, 0.15)",
    color: "#fb7185",
    border: "1px solid rgba(244, 63, 94, 0.3)",
    padding: "8px 14px",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.25s ease",
  },
};

export default Navbar;