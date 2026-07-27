import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "Athlete",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const signup = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.mobile ||
      !form.password ||
      !form.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      alert("Enter a valid email");
      return;
    }

    if (form.mobile.length !== 10) {
      alert("Enter a valid 10-digit mobile number");
      return;
    }

    if (form.password.length < 6) {
      alert("Password should be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!terms) {
      alert("Please accept Terms & Conditions");
      return;
    }

    // Store user login session
    localStorage.setItem("user_logged_in", "true");
    localStorage.setItem("user_email", form.email);
    localStorage.setItem("user_name", form.name);

    const initialProfile = {
      athleteId: "ATH-" + Math.floor(1000 + Math.random() * 9000),
      name: form.name,
      email: form.email,
      mobile: form.mobile,
      role: form.role || "Athlete",
      sport: "Cricket",
      injury: "No"
    };
    localStorage.setItem("athlete_profile", JSON.stringify(initialProfile));

    alert(`🎉 Account created successfully! Welcome, ${form.name}.`);
    navigate("/profile");
  };

  return (
    <div className="signupPage">
      <div className="signupBox">

        <h1>🏃 Sports Injury Detection</h1>

        <h3>Create Account</h3>

        <p className="subtitle">
          AI Powered Athlete Injury Detection & Performance Analysis
        </p>

        <form onSubmit={signup}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="Athlete">Athlete</option>
            <option value="Coach">Coach</option>
          </select>

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <div className="options">
            <label>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              Show Password
            </label>
          </div>

          <div className="options">
            <label>
              <input
                type="checkbox"
                checked={terms}
                onChange={() => setTerms(!terms)}
              />
              I accept Terms & Conditions
            </label>
          </div>

          <button type="submit">
            Create Account
          </button>

        </form>

        <p>
          Already have an account?{" "}
          <Link to="/">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;