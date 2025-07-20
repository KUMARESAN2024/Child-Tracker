import React, { useEffect, useState } from "react";
import { fetchChildDetails } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

const SafeZone = () => {
  const storedEmail = localStorage.getItem("userEmail");
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [error, setError] = useState("");
  const [zoneLat, setZoneLat] = useState("");
  const [zoneLng, setZoneLng] = useState("");
  const [zoneRadius, setZoneRadius] = useState(100); // default radius

  useEffect(() => {
    if (storedEmail) {
      fetchChildDetails(storedEmail)
        .then((data) => data && setChildren(data))
        .catch(() => setError("Failed to fetch child details"));
    }
  }, [storedEmail]);

  const selectedChild = children.find((child) => child._id === selectedChildId);

  const isValidCoord = (lat, lng) =>
    lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng);

  const handleApplySafeZone = async () => {
    const lat = parseFloat(zoneLat);
    const lng = parseFloat(zoneLng);
    const rad = parseInt(zoneRadius);

    if (isNaN(lat) || isNaN(lng) || isNaN(rad)) {
      alert("⚠️ Please enter valid latitude, longitude, and radius.");
      return;
    }

    const payload = {
      child_id: selectedChildId,
      latitude: lat,
      longitude: lng,
      radius: rad,
    };

    try {
      const res = await fetch("http://localhost:5000/api/set-safe-zone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Safe Zone set successfully!");
      } else {
        alert("❌ Failed to set Safe Zone: " + data.error);
      }
    } catch (error) {
      console.error("Safe Zone Error:", error);
      alert("❌ Error while setting Safe Zone");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🛡️ Safe Zone (Geo-Fencing)</h2>

      <div className="mb-3">
        <label className="form-label fw-bold">Select a child:</label>
        <select
          className="form-select"
          value={selectedChildId}
          onChange={(e) => setSelectedChildId(e.target.value)}
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

      {selectedChildId && (
        <div className="row">
          {/* Map Area */}
          <div className="col-md-7 mb-4">
            {selectedChild && isValidCoord(parseFloat(selectedChild.latitude), parseFloat(selectedChild.longitude)) ? (
              <div className="card shadow p-3 border-0 rounded-4">
                <h5 className="text-center text-primary mb-3">
                  🗺️ Map for {selectedChild.name}
                </h5>
                <iframe
                  title="Safe Zone Map"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${zoneLat || selectedChild.latitude},${zoneLng || selectedChild.longitude}&z=17&t=m&output=embed`}
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <p className="text-danger">Invalid or missing coordinates.</p>
            )}
          </div>

          {/* Safe Zone Manual Settings */}
          <div className="col-md-5">
            <div className="card shadow-sm p-4 border-0 rounded-4">
              <h5 className="text-center text-success mb-3">📝 Set Safe Zone</h5>
              <div className="mb-3">
                <label className="form-label">Latitude</label>
                <input
                  type="text"
                  className="form-control"
                  value={zoneLat}
                  onChange={(e) => setZoneLat(e.target.value)}
                  placeholder="e.g., 12.9716"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Longitude</label>
                <input
                  type="text"
                  className="form-control"
                  value={zoneLng}
                  onChange={(e) => setZoneLng(e.target.value)}
                  placeholder="e.g., 77.5946"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Radius (meters)</label>
                <input
                  type="number"
                  className="form-control"
                  value={zoneRadius}
                  onChange={(e) => setZoneRadius(e.target.value)}
                  placeholder="e.g., 100"
                />
              </div>
              <button className="btn btn-primary w-100" onClick={handleApplySafeZone}>
                Apply Safe Zone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafeZone;
