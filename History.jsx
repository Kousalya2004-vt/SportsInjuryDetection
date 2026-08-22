import React, { useState, useEffect } from "react";
import "./History.css";

function History() {
  const [historyItems, setHistoryItems] = useState([]);
  const [stats, setStats] = useState({
    total_analyses: 0,
    this_week: 0,
    highest_risk: 0,
    highest_risk_file: "-",
    most_common_risk: "-",
  });

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [athleteFilter, setAthleteFilter] = useState("");
  const [sportFilter, setSportFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  // Modals
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [activeName, setActiveName] = useState("");

  const fetchHistory = () => {
    setLoading(true);
    fetch("http://127.0.0.1:5000/api/history")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setHistoryItems(data.items);
        if (data.stats) setStats(data.stats);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching history:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const savedAth = localStorage.getItem("athlete_profile");
    if (savedAth) {
      try {
        const parsed = JSON.parse(savedAth);
        if (parsed && parsed.name) setActiveName(parsed.name);
      } catch (e) {}
    }
    const savedUser = localStorage.getItem("user_name");
    if (savedUser) setActiveName((prev) => prev || savedUser);

    fetchHistory();
  }, []);

  const handleDelete = (itemId, videoName) => {
    if (
      window.confirm(
        `Are you sure you want to delete analysis history for "${videoName}"?`
      )
    ) {
      fetch(
        `http://127.0.0.1:5000/api/history/${encodeURIComponent(itemId)}`,
        {
          method: "DELETE",
        }
      )
        .then(() => fetchHistory())
        .catch(() => fetchHistory());
    }
  };

  const handleDownloadPdf = async (itemId) => {
    try {
      const url = `http://127.0.0.1:5000/report?id=${encodeURIComponent(itemId || "")}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Report fetch failed");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Kinetic_Movement_Risk_Report_${itemId || "latest"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(`http://127.0.0.1:5000/report?id=${encodeURIComponent(itemId || "")}`, "_blank");
    }
  };

  const handleReanalyze = (item) => {
    alert(`Re-analyzing ${item.video_name}... Processing MediaPipe Pose pipeline.`);
    fetchHistory();
  };

  // Filter items
  const filteredItems = historyItems.filter((item) => {
    const matchesSearch =
      (item.video_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.athlete_name || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAthlete = athleteFilter
      ? (item.athlete_name || "").toLowerCase().includes(athleteFilter.toLowerCase())
      : true;

    const matchesSport = sportFilter
      ? (item.sport || "").toLowerCase().includes(sportFilter.toLowerCase())
      : true;

    const matchesRisk =
      riskFilter === "All"
        ? true
        : (item.risk_level || "").toLowerCase() === riskFilter.toLowerCase();

    return matchesSearch && matchesAthlete && matchesSport && matchesRisk;
  });

  return (
    <div className="historyPage fade-in">
      <div className="historyHeader">
        <h1>Analysis History</h1>
        <p className="subtitle">
          Every uploaded video and its analysis, kept permanently until you delete it.
        </p>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="historyStatsGrid">
        <div className="statCard">
          <span className="statLabel">TOTAL ANALYSES</span>
          <span className="statValue">{stats.total_analyses}</span>
        </div>

        <div className="statCard">
          <span className="statLabel">THIS WEEK</span>
          <span className="statValue">{stats.this_week}</span>
        </div>

        <div className="statCard">
          <span className="statLabel">HIGHEST RISK</span>
          <span className="statValue">{stats.highest_risk}</span>
          <span className="statSub">{stats.highest_risk_file}</span>
        </div>

        <div className="statCard">
          <span className="statLabel">MOST COMMON RISK</span>
          <span className="statValue">{stats.most_common_risk}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="filterBar">
        <div className="searchBox">
          <span className="searchIcon">🔍</span>
          <input
            type="text"
            placeholder="Search video or athlete name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <input
          type="text"
          className="filterInput"
          placeholder="Athlete"
          value={athleteFilter}
          onChange={(e) => setAthleteFilter(e.target.value)}
        />

        <input
          type="text"
          className="filterInput"
          placeholder="Sport"
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
        />

        <select
          className="filterSelect"
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
        >
          <option value="All">All risk levels</option>
          <option value="Low">Low Risk</option>
          <option value="Moderate">Moderate Risk</option>
          <option value="High">High Risk</option>
        </select>
      </div>

      {/* Analysis Cards Grid */}
      {loading ? (
        <div className="loadingState">Loading analysis history...</div>
      ) : filteredItems.length === 0 ? (
        <div className="emptyState">
          <p>No analysis records found matching your filters.</p>
        </div>
      ) : (
        <div className="analysisCardsGrid">
          {filteredItems.map((item, idx) => {
            const riskClass =
              (item.risk_level || "").toLowerCase().includes("high")
                ? "risk-high"
                : (item.risk_level || "").toLowerCase().includes("mod")
                ? "risk-moderate"
                : "risk-low";

            return (
              <div key={idx} className="analysisCard">
                <div className="cardHeader">
                  <span className="videoTitle" title={item.video_name}>
                    {item.video_name}
                  </span>
                  <span className={`riskBadge ${riskClass}`}>
                    {item.risk_level || "Moderate"}
                  </span>
                </div>

                <div className="sportSubtitle">{item.sport || "running"}</div>

                <div className="metricsRow">
                  <span>
                    <strong>Probability:</strong> {item.probability}
                  </span>
                  <span>
                    <strong>Confidence:</strong> {item.confidence || "100%"}
                  </span>
                </div>

                <div className="authorTimestamp">
                  {item.created_at || "8/14/2026, 12:15:27 PM"} · by{" "}
                  {activeName || item.athlete_name || "Kousalya Venkata Sai Lakshmi"}
                </div>

                <p className="summarySnippet">{item.summary}</p>

                {/* Bottom Action Icon Buttons */}
                <div className="cardActionIcons">
                  <button
                    className="actionIconBtn"
                    title="Re-analyze video"
                    onClick={() => handleReanalyze(item)}
                  >
                    ✨
                  </button>

                  <button
                    className="actionIconBtn"
                    title="Download PDF Report"
                    onClick={() => handleDownloadPdf(item.id)}
                  >
                    📥
                  </button>

                  <button
                    className="actionIconBtn"
                    title="View Detailed Summary"
                    onClick={() => setSelectedSummary(item)}
                  >
                    📄
                  </button>

                  <button
                    className="actionIconBtn"
                    title="Play Video Preview"
                    onClick={() => setSelectedVideo(item)}
                  >
                    🎥
                  </button>

                  <button
                    className="actionIconBtn danger"
                    title="Delete record"
                    onClick={() => handleDelete(item.id, item.video_name)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Modal */}
      {selectedSummary && (
        <div className="modalOverlay" onClick={() => setSelectedSummary(null)}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>Movement Risk Report Summary</h3>
              <button className="closeBtn" onClick={() => setSelectedSummary(null)}>
                ✕
              </button>
            </div>
            <div className="modalBody">
              <h4>{selectedSummary.video_name}</h4>
              <p>
                <strong>Athlete:</strong> {selectedSummary.athlete_name} |{" "}
                <strong>Activity:</strong> {selectedSummary.sport}
              </p>
              <div className="modalScoresGrid">
                <div className="mScoreBox">
                  <span className="mVal">{selectedSummary.movement_quality}</span>
                  <span className="mLbl">Movement Quality</span>
                </div>
                <div className="mScoreBox">
                  <span className="mVal">{selectedSummary.biomechanics}</span>
                  <span className="mLbl">Biomech Efficiency</span>
                </div>
                <div className="mScoreBox">
                  <span className="mVal">{selectedSummary.fatigue_risk}</span>
                  <span className="mLbl">Fatigue Risk</span>
                </div>
                <div className="mScoreBox">
                  <span className="mVal">{selectedSummary.athlete_health}</span>
                  <span className="mLbl">Athlete Health</span>
                </div>
              </div>

              <h4 style={{ marginTop: "16px" }}>Recommendations</h4>
              <ul>
                {(selectedSummary.recommendations || [selectedSummary.summary]).map(
                  (rec, rIdx) => (
                    <li key={rIdx}>{rec}</li>
                  )
                )}
              </ul>
            </div>
            <div className="modalFooter">
              <button
                className="btnPrimary"
                onClick={() => handleDownloadPdf(selectedSummary.id)}
              >
                📥 Download Full PDF Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {selectedVideo && (
        <div className="modalOverlay" onClick={() => setSelectedVideo(null)}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>Video Analysis Preview</h3>
              <button className="closeBtn" onClick={() => setSelectedVideo(null)}>
                ✕
              </button>
            </div>
            <div className="modalBody" style={{ textAlign: "center" }}>
              <p>
                <strong>File:</strong> {selectedVideo.video_name}
              </p>
              <div className="videoPlayerBox">
                <video
                  controls
                  autoPlay
                  src={`http://127.0.0.1:5000/uploads/${selectedVideo.video_name}`}
                  style={{ width: "100%", maxHeight: "360px", borderRadius: "8px" }}
                >
                  Your browser does not support video preview.
                </video>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
