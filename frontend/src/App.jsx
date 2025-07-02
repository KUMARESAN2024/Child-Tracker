import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AuthPage from "./pages/AuthPage";
import NavigationBar from "./components/Navbar";
import LiveTracking from "./pages/LiveTracking";
import SafeZone from "./pages/SafeZone";
import Dashboard from "./pages/Dashboard";
import ChildActivity from "./pages/ChildActivity";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
};

const AnimatedRoutes = ({ safeZone, setSafeZone }) => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/"; // ✅ Hide navbar on login/signup page

  return (
    <>
      {!hideNavbar && <NavigationBar />}
      <AnimatePresence>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/live-tracking" element={<ProtectedRoute><LiveTracking /></ProtectedRoute>} />
            <Route path="/safe-zone" element={<ProtectedRoute><SafeZone safeZone={safeZone} setSafeZone={setSafeZone} /></ProtectedRoute>} />
            <Route path="/child-activity" element={<ProtectedRoute><ChildActivity /></ProtectedRoute>} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

function App() {
  const [safeZone, setSafeZone] = useState({ center: [], radius: 500 });

  return (
    <Router>
      <AnimatedRoutes safeZone={safeZone} setSafeZone={setSafeZone} />
    </Router>
  );
}

export default App;

