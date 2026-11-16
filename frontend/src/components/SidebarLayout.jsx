import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./SidebarLayout.css";

function SidebarLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "Kousalya Venkata Sai Lakshmi",
    role: "ATHLETE",
    initials: "KV",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch profile info from backend or localStorage
    fetch("http://127.0.0.1:5000/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) {
          const names = data.name.trim().split(" ");
          const initials =
            names.length > 1
              ? `${names[0][0]}${names[names.length - 1][0]}`
              : names[0].substring(0, 2);

          setUser({
            name: data.name,
            role: (data.role || "ATHLETE").toUpperCase(),
            initials: initials.toUpperCase(),
            photo: data.photo_url,
          });
        }
      })
      .catch(() => {
        const savedName = localStorage.getItem("user_name");
        if (savedName) {
          const names = savedName.trim().split(" ");
          const initials =
            names.length > 1
              ? `${names[0][0]}${names[names.length - 1][0]}`
              : names[0].substring(0, 2);
          setUser((prev) => ({
            ...prev,
            name: savedName,
            initials: initials.toUpperCase(),
          }));
        }
      });
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="kineticAppContainer">
      {/* Top Header Navigation */}
      <header className="kineticTopHeader">
        <div className="kineticBrand" onClick={() => navigate("/dashboard")}>
          <div className="brandBadge">K</div>
          <div className="brandTitles">
            <span className="brandName">Kinetic</span>
            <span className="brandSub">MOVEMENT RISK ANALYSIS</span>
          </div>
        </div>

        <div className="headerUserArea">
          <div
            className="userProfileBadge"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="avatarCircle">{user.initials}</div>
            <div className="userInfoText">
              <span className="userName">{user.name}</span>
              <span className="userRoleTag">{user.role}</span>
            </div>
            <span className="dropdownArrow">▾</span>
          </div>

          {dropdownOpen && (
            <div className="userDropdownMenu glass-card">
              <div
                className="dropdownItem"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/profile");
                }}
              >
                👤 Profile Settings
              </div>
              <div
                className="dropdownItem"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/settings");
                }}
              >
                ⚙️ Security & Settings
              </div>
              <div className="dropdownDivider"></div>
              <div
                className="dropdownItem danger"
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
              >
                🚪 Sign Out
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace with Sidebar & Content */}
      <div className="kineticBodyLayout">
        {/* Left Navigation Sidebar */}
        <aside className="kineticSidebar">
          <div className="navGroup">
            <div className="groupTitle">WORKSPACE</div>

            <Link
              to="/dashboard"
              className={`navItem ${isActive("/dashboard") ? "active" : ""}`}
            >
              <span className="navIcon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              </span>
              <span>My Dashboard</span>
            </Link>

            <Link
              to="/upload"
              className={`navItem ${isActive("/upload") ? "active" : ""}`}
            >
              <span className="navIcon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </span>
              <span>Movement Analysis</span>
            </Link>

            <Link
              to="/history"
              className={`navItem ${isActive("/history") ? "active" : ""}`}
            >
              <span className="navIcon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </span>
              <span>Analysis History</span>
            </Link>
          </div>

          <div className="navGroup">
            <div className="groupTitle">ACCOUNT</div>

            <Link
              to="/profile"
              className={`navItem ${isActive("/profile") ? "active" : ""}`}
            >
              <span className="navIcon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <span>Profile</span>
            </Link>

            <Link
              to="/settings"
              className={`navItem ${isActive("/settings") ? "active" : ""}`}
            >
              <span className="navIcon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </span>
              <span>Settings</span>
            </Link>
          </div>
        </aside>

        {/* Page Main Content Area */}
        <main className="kineticMainView">{children}</main>
      </div>
    </div>
  );
}

export default SidebarLayout;
