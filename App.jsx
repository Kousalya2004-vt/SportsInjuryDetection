import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import SidebarLayout from "./components/SidebarLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import LiveCamera from "./pages/LiveCamera";
import InjuryPrediction from "./pages/InjuryPrediction";
import History from "./pages/History";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Navbar */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              <Navbar />
              <Signup />
            </>
          }
        />

        {/* Workspace & Account Routes with Unified Kinetic SidebarLayout */}
        <Route
          path="/dashboard"
          element={
            <SidebarLayout>
              <Dashboard />
            </SidebarLayout>
          }
        />
        <Route
          path="/athlete"
          element={
            <SidebarLayout>
              <Dashboard />
            </SidebarLayout>
          }
        />
        <Route
          path="/upload"
          element={
            <SidebarLayout>
              <Upload />
            </SidebarLayout>
          }
        />
        <Route
          path="/history"
          element={
            <SidebarLayout>
              <History />
            </SidebarLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <SidebarLayout>
              <Profile />
            </SidebarLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <SidebarLayout>
              <Settings />
            </SidebarLayout>
          }
        />
        <Route
          path="/live"
          element={
            <SidebarLayout>
              <LiveCamera />
            </SidebarLayout>
          }
        />
        <Route
          path="/injury-prediction"
          element={
            <SidebarLayout>
              <InjuryPrediction />
            </SidebarLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;