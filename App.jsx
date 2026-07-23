import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import LiveCamera from "./pages/LiveCamera";

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 80px)" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/live" element={<LiveCamera />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;