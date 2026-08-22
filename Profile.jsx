import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoRotate, setPhotoRotate] = useState(0);
  const [photoOffsetY, setPhotoOffsetY] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    athleteId: "ATH-" + Math.floor(1000 + Math.random() * 9000),
    name: "",
    age: "",
    gender: "Male",
    blood: "O+",
    mobile: "",
    email: "",
    sport: "Cricket",
    role: "Athlete",
    position: "",
    team: "",
    experience: "",
    coachName: "",
    coachMobile: "",
    height: "",
    weight: "",
    bmi: "",
    dominantHand: "Right",
    dominantLeg: "Right",
    trainingLoad: "Moderate (10-15 hrs/wk)",
    fitnessLevel: "Advanced",
    injury: "No",
    injuryPart: "",
    injuryType: "",
    painLevel: "0",
    medicalCondition: "",
  });

  const [athletesList, setAthletesList] = useState([
    {
      athleteId: "ATH001",
      name: "Kousalya Venkata Sai Lakshmi",
      sport: "Football",
      position: "Defensive Midfielder",
      age: "22",
      height: "168",
      weight: "58",
      injury: "None",
      trainingLoad: "Medium"
    },
    {
      athleteId: "ATH002",
      name: "Kiruthi Varshni",
      sport: "Cricket",
      position: "Cricketer",
      age: "20",
      height: "168",
      weight: "60",
      injury: "None",
      trainingLoad: "Medium"
    }
  ]);

  useEffect(() => {
    // Load existing profile from localStorage if previously saved by user
    const existing = localStorage.getItem("athlete_profile");
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        if (parsed && parsed.name) {
          setForm((prev) => ({ ...prev, ...parsed }));
          if (parsed.photo) setPhoto(parsed.photo);
        }
      } catch (e) {}
    }

    // Load registered athletes list
    const savedAthletes = localStorage.getItem("registered_athletes_list");
    if (savedAthletes) {
      try {
        const parsed = JSON.parse(savedAthletes);
        if (Array.isArray(parsed) && parsed.length > 0) setAthletesList(parsed);
      } catch (e) {}
    } else {
      fetch("http://127.0.0.1:5000/athletes")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setAthletesList(data);
            localStorage.setItem("registered_athletes_list", JSON.stringify(data));
          }
        })
        .catch(() => {});
    }
  }, []);

  const addAthleteRecord = (newAth) => {
    const updated = [newAth, ...athletesList];
    setAthletesList(updated);
    localStorage.setItem("registered_athletes_list", JSON.stringify(updated));
    localStorage.setItem("athlete_profile", JSON.stringify(newAth));
  };

  const handleDeleteAthlete = async (athToDelete, indexToDelete) => {
    const athName = athToDelete.name || athToDelete.athleteId || "Athlete";
    const athId = athToDelete.athleteId || "";

    if (!window.confirm(`Are you sure you want to delete profile for "${athName}"?`)) {
      return;
    }

    const updatedList = athletesList.filter((ath, idx) => {
      if (athId && ath.athleteId) {
        return ath.athleteId !== athId;
      }
      return idx !== indexToDelete;
    });

    setAthletesList(updatedList);
    localStorage.setItem("registered_athletes_list", JSON.stringify(updatedList));

    if (athId) {
      try {
        await fetch(`http://127.0.0.1:5000/delete_athlete/${encodeURIComponent(athId)}`, {
          method: "DELETE",
        });
      } catch (e) {}
    }
  };


  const getPositionOptions = (sportName) => {
    switch (sportName) {
      case "Cricket":
        return ["Batsman", "Fast Bowler", "Spin Bowler", "All-Rounder", "Wicket-Keeper"];
      case "Football":
        return ["Forward / Striker", "Winger", "Attacking Midfielder", "Central Midfielder", "Defensive Midfielder", "Full Back / Wing Back", "Center Back", "Goalkeeper"];
      case "Basketball":
        return ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"];
      case "Running / Track":
        return ["Sprinter (100m/200m)", "Middle Distance (400m/800m)", "Long Distance / Marathon", "Hurdler", "Relay Runner"];
      case "Badminton":
        return ["Singles Player", "Doubles Player", "Mixed Doubles"];
      case "Tennis":
        return ["Baseline Player", "Serve & Volley", "Singles", "Doubles"];
      case "Swimming":
        return ["Freestyle Specialist", "Backstroke Specialist", "Breaststroke Specialist", "Butterfly Specialist", "Medley Swimmer"];
      case "Gymnastics / Weightlifting":
        return ["Powerlifting / Squat", "Olympic Weightlifting", "Calisthenics / Rings", "CrossFit / Hybrid"];
      default:
        return ["Player", "Forward", "Defender", "Midfielder", "Attacker", "Captain / Leader"];
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto BMI calculation
      if (name === "height" || name === "weight") {
        const h = parseFloat(name === "height" ? value : prev.height);
        const w = parseFloat(name === "weight" ? value : prev.weight);
        if (h > 0 && w > 0) {
          updated.bmi = (w / ((h / 100) * (h / 100))).toFixed(1);
        }
      }

      return updated;
    });
  };

  const uploadPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhoto(URL.createObjectURL(file));
    }
  };

  const autoFillSample = () => {
    setForm({
      athleteId: "ATH-8842",
      name: "Alex Vance",
      age: "23",
      gender: "Male",
      blood: "B+",
      mobile: "9876543210",
      email: "alex.vance@athlete.com",
      sport: "Football",
      role: "Athlete",
      position: "Forward",
      team: "National Strikers",
      experience: "5 Years",
      coachName: "Coach Marcus",
      coachMobile: "9123456789",
      height: "180",
      weight: "75",
      bmi: "23.1",
      dominantHand: "Right",
      dominantLeg: "Right",
      trainingLoad: "High (15+ hrs/wk)",
      fitnessLevel: "Elite",
      injury: "Yes",
      injuryPart: "Knee",
      injuryType: "ACL Strain",
      painLevel: "3",
      medicalCondition: "None",
    });
  };

  const formRef = React.useRef(null);

  const saveProfile = async (e) => {
    if (e) e.preventDefault();

    if (!form.name || !form.athleteId || !form.age || !form.sport || !form.height || !form.weight) {
      alert("⚠️ Please fill all required athlete details (Name, ID, Age, Sport, Height, Weight).");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        athleteId: form.athleteId,
        name: form.name,
        age: form.age,
        gender: form.gender,
        blood: form.blood,
        sport: form.sport,
        role: form.role,
        position: form.position,
        height: form.height,
        weight: form.weight,
        trainingLoad: form.trainingLoad,
        injury: form.injury,
        photo: photo || "profile.png",
      };

      const response = await fetch("http://127.0.0.1:5000/save_profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      addAthleteRecord({
        athleteId: form.athleteId,
        name: form.name,
        sport: form.sport,
        position: form.position || "Player",
        age: form.age,
        injury: form.injury === "Yes" ? (form.injuryPart ? `${form.injuryPart} Strain` : "Yes") : "None",
        trainingLoad: form.trainingLoad.includes("High") ? "High" : form.trainingLoad.includes("Elite") ? "High" : "Medium"
      });
      setSavedSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      addAthleteRecord({
        athleteId: form.athleteId,
        name: form.name,
        sport: form.sport,
        position: form.position || "Player",
        age: form.age,
        injury: form.injury === "Yes" ? (form.injuryPart ? `${form.injuryPart} Strain` : "Yes") : "None",
        trainingLoad: form.trainingLoad.includes("High") ? "High" : form.trainingLoad.includes("Elite") ? "High" : "Medium"
      });
      setSavedSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }


    setLoading(false);
  };

  const proceedToAnalysis = () => {
    navigate("/upload");
  };

  return (
    <div className="profilePage fade-in">
      <div className="profileHeader">
        <div>
          <h1>🏃 Athlete Profile Setup</h1>
          <p className="subtitle">
            Complete your anatomical and sports profile to unlock AI Pose & Injury Risk Predictions
          </p>
        </div>

        <div className="headerActions">
          <button type="button" className="btn-secondary" onClick={autoFillSample}>
            ✨ Auto-Fill Sample
          </button>
          <button type="button" className="btn-primary" onClick={saveProfile} disabled={loading}>
            {loading ? "Saving..." : "💾 Save Profile ➔"}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="successBanner glass-card">
          <div className="successIcon">✅</div>
          <div>
            <h3>Athlete Details Verified & Saved!</h3>
            <p>Your biometric profile is saved successfully. You can now proceed to AI Injury Analysis.</p>
          </div>
          <button className="btn-primary" onClick={proceedToAnalysis}>
            Proceed to AI Injury Analysis ➔
          </button>
        </div>
      )}

      <form ref={formRef} onSubmit={saveProfile} className="profileForm">
        {/* Photo Avatar Section */}
        <div className="profileSection glass-card">
          <div className="avatarUploadGroup">
            <div className="avatarRing" style={{ overflow: "hidden" }}>
              <img
                src={photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                alt="Athlete Avatar"
                className="avatarImg"
                style={{
                  transform: `scale(${photoZoom}) rotate(${photoRotate}deg) translateY(${photoOffsetY}px)`,
                  transition: "transform 0.15s ease",
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="avatarText" style={{ flex: 1 }}>
              <h3>🖼️ Adjustable Profile Photo</h3>
              <p>Upload a photo or choose an avatar, then adjust zoom, rotation, and alignment.</p>
              
              <div className="photoControlsRow">
                <label className="uploadLabel">
                  📷 Upload New Photo
                  <input type="file" accept="image/*" onChange={uploadPhoto} hidden />
                </label>

                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: "8px 14px", fontSize: "0.85rem" }}
                  onClick={() => setPhotoRotate((prev) => (prev + 90) % 360)}
                >
                  🔄 Rotate ({photoRotate}°)
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: "8px 14px", fontSize: "0.85rem" }}
                  onClick={() => {
                    setPhotoZoom(1);
                    setPhotoRotate(0);
                    setPhotoOffsetY(0);
                  }}
                >
                  ↺ Reset Adjustments
                </button>
              </div>

              {/* Sliders for Zoom & Vertical Shift */}
              <div className="adjustmentSlidersGrid" style={{ marginTop: "14px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                <div className="sliderItem">
                  <label style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 700 }}>🔍 ZOOM ({photoZoom.toFixed(1)}x)</label>
                  <input
                    type="range"
                    min="0.8"
                    max="2.5"
                    step="0.1"
                    value={photoZoom}
                    onChange={(e) => setPhotoZoom(parseFloat(e.target.value))}
                    style={{ width: "100%", accentColor: "#38bdf8" }}
                  />
                </div>

                <div className="sliderItem">
                  <label style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 700 }}>↕️ VERTICAL POSITION ({photoOffsetY}px)</label>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    step="2"
                    value={photoOffsetY}
                    onChange={(e) => setPhotoOffsetY(parseInt(e.target.value))}
                    style={{ width: "100%", accentColor: "#38bdf8" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Basic Information */}
        <div className="profileSection glass-card">
          <h3>📌 Personal & Contact Information</h3>
          <div className="grid3">
            <div className="formGroup">
              <label>Athlete ID *</label>
              <input type="text" name="athleteId" value={form.athleteId} onChange={handleChange} required />
            </div>

            <div className="formGroup">
              <label>Full Name *</label>
              <input type="text" name="name" placeholder="e.g. Alex Vance" value={form.name} onChange={handleChange} required />
            </div>

            <div className="formGroup">
              <label>Age (Years) *</label>
              <input type="number" name="age" placeholder="22" value={form.age} onChange={handleChange} required />
            </div>

            <div className="formGroup">
              <label>Gender *</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Blood Group</label>
              <select name="blood" value={form.blood} onChange={handleChange}>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Mobile Number</label>
              <input type="text" name="mobile" placeholder="9876543210" value={form.mobile} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Section 2: Sports & Performance */}
        <div className="profileSection glass-card">
          <h3>🏆 Sports & Role Profile</h3>
          <div className="grid3">
            <div className="formGroup">
              <label>Primary Sport *</label>
              <select name="sport" value={form.sport} onChange={handleChange} required>
                <option value="Cricket">Cricket</option>
                <option value="Football">Football</option>
                <option value="Basketball">Basketball</option>
                <option value="Running / Track">Running / Track</option>
                <option value="Badminton">Badminton</option>
                <option value="Tennis">Tennis</option>
                <option value="Swimming">Swimming</option>
                <option value="Gymnastics / Weightlifting">Gymnastics / Weightlifting</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Role</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="Athlete">Athlete</option>
                <option value="Coach">Coach</option>
                <option value="Physio">Physiotherapist</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Playing Position *</label>
              <select name="position" value={form.position} onChange={handleChange}>
                <option value="">-- Select Position --</option>
                {getPositionOptions(form.sport).map((pos, idx) => (
                  <option key={idx} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>

            <div className="formGroup">
              <label>Team / Academy</label>
              <input type="text" name="team" value={form.team} onChange={handleChange} />
            </div>

            <div className="formGroup">
              <label>Coach Name</label>
              <input type="text" name="coachName" placeholder="Coach Marcus" value={form.coachName} onChange={handleChange} />
            </div>

            <div className="formGroup">
              <label>Coach Contact</label>
              <input type="text" name="coachMobile" placeholder="Contact number" value={form.coachMobile} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Section 3: Physical & Biometric Metrics */}
        <div className="profileSection glass-card">
          <h3>📐 Physical Biometrics & Measurements</h3>
          <div className="grid4">
            <div className="formGroup">
              <label>Height (cm) *</label>
              <input type="number" name="height" placeholder="e.g. 175" value={form.height} onChange={handleChange} required />
            </div>

            <div className="formGroup">
              <label>Weight (kg) *</label>
              <input type="number" name="weight" placeholder="e.g. 70" value={form.weight} onChange={handleChange} required />
            </div>

            <div className="formGroup">
              <label>BMI (Auto)</label>
              <div className="bmiDisplayBadge">{form.bmi ? `${form.bmi} kg/m²` : "--"}</div>
            </div>

            <div className="formGroup">
              <label>Dominant Leg</label>
              <select name="dominantLeg" value={form.dominantLeg} onChange={handleChange}>
                <option value="Right">Right Leg</option>
                <option value="Left">Left Leg</option>
                <option value="Ambidextrous">Both</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Training & Medical History */}
        <div className="profileSection glass-card">
          <h3>🏥 Injury & Training History</h3>
          <div className="grid3">
            <div className="formGroup">
              <label>Training Load Category</label>
              <select name="trainingLoad" value={form.trainingLoad} onChange={handleChange}>
                <option value="Low (<5 hrs/wk)">Low (&lt; 5 hrs/wk)</option>
                <option value="Moderate (5-12 hrs/wk)">Moderate (5-12 hrs/wk)</option>
                <option value="High (12-20 hrs/wk)">High (12-20 hrs/wk)</option>
                <option value="Elite (20+ hrs/wk)">Elite (&gt; 20 hrs/wk)</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Previous Injury History? *</label>
              <select name="injury" value={form.injury} onChange={handleChange}>
                <option value="No">No Previous Major Injury</option>
                <option value="Yes">Yes (Have Injury History)</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Affected Body Part (If Any)</label>
              <input type="text" name="injuryPart" placeholder="e.g. Knee / Ankle / Shoulder" value={form.injuryPart} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="profileActions">
          {savedSuccess && (
            <span className="savedTag">✅ Profile Saved Successfully!</span>
          )}
          <button type="submit" className="btn-primary saveBtn" disabled={loading}>
            {loading ? "Saving Profile..." : "💾 Add Athlete ➔"}
          </button>
        </div>
      </form>

      {/* Registered Athletes Table (Matching Image 2) */}
      <div className="registeredAthletesSection glass-card" style={{ marginTop: "32px", padding: "28px" }}>
        <div className="registeredAthletesHeader">
          <h2>Registered Athletes</h2>
          <span className="totalAthletesBadge">{athletesList.length} total</span>
        </div>

        <div className="athletesTableContainer">
          <table className="athletesTable">
            <thead>
              <tr>
                <th>ATHLETE ID</th>
                <th>NAME</th>
                <th>SPORT</th>
                <th>POSITION</th>
                <th>AGE</th>
                <th>INJURY HISTORY</th>
                <th>TRAINING LOAD</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {athletesList.map((ath, idx) => (
                <tr key={idx} className="athleteRow">
                  <td className="athIdCol"><strong>{ath.athleteId}</strong></td>
                  <td className="athNameCol">{ath.name}</td>
                  <td>{ath.sport}</td>
                  <td>{ath.position || "Player"}</td>
                  <td>{ath.age}</td>
                  <td className="athInjuryCol">{ath.injury || "None"}</td>
                  <td>
                    <span className={`loadBadge load-${(ath.trainingLoad || "Medium").toLowerCase()}`}>
                      {ath.trainingLoad || "Medium"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button
                        className="selectAthBtn"
                        onClick={() => {
                          localStorage.setItem("athlete_profile", JSON.stringify(ath));
                          alert(`Selected active athlete: ${ath.name}`);
                        }}
                      >
                        Select
                      </button>
                      <button
                        className="deleteAthBtn"
                        onClick={() => handleDeleteAthlete(ath, idx)}
                        style={{
                          background: "rgba(244, 63, 94, 0.18)",
                          color: "#fb7185",
                          border: "1px solid rgba(244, 63, 94, 0.4)",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bottom Quick-Save Bar */}
      <div className="stickySaveBar glass-card">
        <div className="stickySaveInfo">
          <span>🏃 <strong>{form.name || "New Athlete"}</strong> ({form.sport})</span>
          {savedSuccess ? (
            <span className="badge-saved">✅ Saved</span>
          ) : (
            <span className="badge-pending">⚠️ Unsaved Changes</span>
          )}
        </div>
        <div className="stickySaveButtons">
          <button type="button" className="btn-secondary" onClick={autoFillSample}>
            ✨ Auto-Fill Sample
          </button>
          <button type="button" className="btn-primary" onClick={saveProfile} disabled={loading}>
            {loading ? "Saving..." : "💾 Add Athlete ➔"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;