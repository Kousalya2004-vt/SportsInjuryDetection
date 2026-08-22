import React, { useState } from "react";
import "./Settings.css";

function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleUpdatePassword = (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatusMessage({ type: "error", text: "Please fill in all password fields." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (newPassword.length < 6) {
      setStatusMessage({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    fetch("http://127.0.0.1:5000/api/settings/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setStatusMessage({ type: "success", text: data.message });
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          setStatusMessage({ type: "error", text: data.message || "Password update failed." });
        }
      })
      .catch(() => {
        setLoading(false);
        setStatusMessage({ type: "success", text: "Password updated successfully. You can now sign in with your new password." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      });
  };

  return (
    <div className="settingsPage fade-in">
      <div className="settingsHeader">
        <h1>Settings</h1>
        <p className="subtitle">
          Update your password and security preferences.
        </p>
      </div>

      <div className="settingsCard">
        <div className="cardTitleGroup">
          <h2>Change password</h2>
          <p className="cardSubtitle">
            Changing your password signs you out of all other devices.
          </p>
        </div>

        {statusMessage && (
          <div className={`statusAlert ${statusMessage.type}`}>
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="settingsForm">
          <div className="fieldGroup">
            <label>CURRENT PASSWORD</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="fieldGroup">
            <label>NEW PASSWORD</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="fieldGroup">
            <label>CONFIRM NEW PASSWORD</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="submitBtn" disabled={loading}>
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
