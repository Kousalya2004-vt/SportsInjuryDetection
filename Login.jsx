import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const fillDemoAccount = () => {
    setEmail("athlete.kousalya@sports.ai");
    setPassword("SportsAI@2026");
  };

  const login = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your Email Address and Password.");
      return;
    }

    const nameFromEmail = email.split("@")[0].replace(".", " ");
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

    // Save active user session
    localStorage.setItem("user_logged_in", "true");
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_name", formattedName);

    alert(`Welcome back, ${formattedName}! Login successful.`);

    const savedProfile = localStorage.getItem("athlete_profile");
    if (savedProfile) {
      navigate("/upload");
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="loginPage fade-in">
      <div className="loginGlowBackground"></div>

      <div className="loginBox glass-card">
        <div className="loginHeader">
          <div className="loginBadge">⚡ KinetIQ Access</div>
          <h2>Welcome Back</h2>
          <p className="subtitle">
            Sign in to access AI Biomechanical Pose Estimation & Injury Risk Reports
          </p>
        </div>

        <form onSubmit={login} className="loginForm">
          <div className="inputGroup">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. athlete@sports.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="inputGroup">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="optionsRow">
            <label className="checkboxLabel">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              Show Password
            </label>

            <label className="checkboxLabel">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              Remember Me
            </label>
          </div>

          <button type="submit" className="btn-primary loginBtn">
            Sign In & Analyze ➔
          </button>

          <button type="button" className="btn-secondary demoBtn" onClick={fillDemoAccount}>
            🪄 Auto-Fill Demo Credentials
          </button>
        </form>

        <div className="loginFooter">
          <p>
            New to KinetIQ? <Link to="/signup">Create Athlete Account</Link>
          </p>
          <p className="helpText">
            💡 After logging in, you will fill your Athlete Profile to unlock complete AI Injury Predictions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;