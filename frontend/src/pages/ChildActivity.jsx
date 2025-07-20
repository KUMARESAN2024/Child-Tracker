
import React, { useEffect, useState, useRef } from "react";

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toLocaleString(),
          });
        },
        (error) => {
          reject("Unable to retrieve location");
        }
      );
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
};

const ChildActivity = () => {
  const [locationHistory, setLocationHistory] = useState([]);
  const [error, setError] = useState("");
  const intervalRef = useRef(null);

  // Fetch location every 60 seconds
  useEffect(() => {
    const fetchAndStoreLocation = async () => {
      try {
        const loc = await getCurrentLocation();
        setLocationHistory((prev) => [loc, ...prev]);
        setError("");
      } catch (err) {
        setError(err);
      }
    };

    // Initial fetch
    fetchAndStoreLocation();
    intervalRef.current = setInterval(fetchAndStoreLocation, 60000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <h2 className="mb-4 text-center">📍 Child Location History</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Location History (auto-refreshes every 60s)</h5>
          {locationHistory.length === 0 ? (
            <p>No location data yet.</p>
          ) : (
            <table className="table table-bordered table-striped mt-3">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {locationHistory.map((loc, idx) => (
                  <tr key={idx}>
                    <td>{locationHistory.length - idx}</td>
                    <td>{loc.latitude}</td>
                    <td>{loc.longitude}</td>
                    <td>{loc.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildActivity;
