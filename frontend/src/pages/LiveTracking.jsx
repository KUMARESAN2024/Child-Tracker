import React, { useEffect, useState } from "react";
import { fetchChildDetails } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

const LiveTracking = () => {
  const storedEmail = localStorage.getItem("userEmail");
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(localStorage.getItem("selectedChildId") || "");
  const [selectedChild, setSelectedChild] = useState(null);
  const [error, setError] = useState("");

  // 🧹 Clear selected child on full page refresh
  useEffect(() => {
    const handleRefresh = () => {
      localStorage.removeItem("selectedChildId");
    };
    window.addEventListener("beforeunload", handleRefresh);
    return () => window.removeEventListener("beforeunload", handleRefresh);
  }, []);

  // 📦 Fetch all children + update selected child every 5s
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchChildDetails(storedEmail);
        if (data) {
          setChildren(data);
          if (selectedChildId) {
            const child = data.find((c) => c._id === selectedChildId);
            setSelectedChild(child);
          }
        }
      } catch {
        setError("Failed to fetch child details");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [storedEmail, selectedChildId]);

  const handleChildSelect = (id) => {
    setSelectedChildId(id);
    localStorage.setItem("selectedChildId", id);
  };

  const lat = parseFloat(selectedChild?.latitude);
  const lng = parseFloat(selectedChild?.longitude);
  const isValidCoord = !isNaN(lat) && !isNaN(lng);

  return (
    <div className="container mt-2"> {/* Changed from mt-5 to mt-4 for tighter spacing */}
      <h2 className="text-center mb-4">📍Child Live Location Tracking</h2> {/* Removed space after 📍 */}

      <div className="mb-3">
        <label className="form-label fw-bold">Select a child:</label>
        <select
          className="form-select"
          value={selectedChildId}
          onChange={(e) => handleChildSelect(e.target.value)}
        >
          <option value="">-- Choose Child --</option>
          {children.map((child) => (
            <option key={child._id} value={child._id}>
              {child.name} ({child.age} yrs)
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-danger">{error}</p>}

      <div className="row justify-content-center">
        <div className="col-md-10">
          {selectedChild && isValidCoord ? (
            <div className="card shadow-lg p-4 border-0 rounded-4">
              <h5 className="text-center text-primary mb-3">
                🗺️ Live Location for {selectedChild.name}
              </h5>
              <p className="text-center text-dark mb-3">
                <strong>Latitude:</strong> {lat}, <strong>Longitude:</strong> {lng}
              </p>

              <div className="rounded overflow-hidden shadow-sm border">
                <iframe
                  title="Live Location Map"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${lat},${lng}&z=17&t=m&output=embed`}
                  allowFullScreen
                ></iframe>
              </div>

              <p className="mt-3 text-center text-secondary">
                This map refreshes every <strong>5 seconds</strong> with the latest coordinates.
              </p>
            </div>
          ) : selectedChildId ? (
            <p className="text-danger text-center mt-4">
              ⚠️ Invalid or missing coordinates for this child.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;


