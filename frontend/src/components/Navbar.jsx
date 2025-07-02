import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; // ✅ Import custom styles

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow px-3">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/dashboard">
          🚀 Child Tracker
        </Link>

        {/* Toggler Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto text-center">
            <li className="nav-item">
              <Link className="nav-link nav-bold navbar-brand" to="/dashboard">
                📊 Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-bold navbar-brand" to="/live-tracking">
                📍 Live Tracking
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-bold navbar-brand" to="/safe-zone">
                🛡️ Safe Zone
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-bold navbar-brand" to="/child-activity">
                📋 Child Activity
              </Link>
            </li>
            <li className="nav-item mt-2 mt-lg-0">
              <button
                className="btn btn-danger ms-lg-3 w-100 w-lg-auto fw-bold"
                onClick={handleLogout}
              >
                🔓 Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
