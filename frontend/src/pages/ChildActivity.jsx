import { useState, useEffect } from "react";
import { Container, Card, Table, Button, Modal, Alert } from "react-bootstrap";
import { FaMapMarkerAlt, FaClock, FaSyncAlt, FaShieldAlt, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from "react-leaflet";
import { toast, ToastContainer } from "react-toastify";
import L from "leaflet";
import "react-toastify/dist/ReactToastify.css";

// Custom Marker Icon for Live Tracking
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/854/854878.png",
  iconSize: [40, 40],
});

const ChildActivity = () => {
  const [activities, setActivities] = useState([
    { time: "08:00 AM", location: "Home", lat: 12.9716, lng: 77.5946, details: "Child left home." },
    { time: "08:30 AM", location: "Sunrise Public School", lat: 12.9732, lng: 77.5953, details: "Child arrived at school." },
  ]);
  const [routeHistory, setRouteHistory] = useState([]); // Stores route path
  const [safeZone, setSafeZone] = useState({ lat: 12.9716, lng: 77.5946, radius: 500 }); // Safe Zone
  const [outsideSafeZone, setOutsideSafeZone] = useState(false); // Alert if outside Safe Zone
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [watchId, setWatchId] = useState(null);

  // Function to fetch live location
  const updateLocation = () => {
    if (!navigator.geolocation) {
      toast.error("⚠️ Geolocation is not supported on this device.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newActivity = {
          time: new Date().toLocaleTimeString(),
          location: `Lat: ${pos.coords.latitude.toFixed(5)}, Lng: ${pos.coords.longitude.toFixed(5)}`,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          details: "Live location update",
        };

        setActivities((prev) => [newActivity, ...prev]); // Add new entry to the top
        setRouteHistory((prev) => [...prev, [pos.coords.latitude, pos.coords.longitude]]); // Store location history

        // Check if outside Safe Zone
        const distance = getDistance(pos.coords.latitude, pos.coords.longitude, safeZone.lat, safeZone.lng);
        if (distance > safeZone.radius) {
          setOutsideSafeZone(true);
          toast.warning("🚨 Child has exited the Safe Zone!");
        } else {
          setOutsideSafeZone(false);
        }
      },
      () => toast.error("⚠️ GPS Permission Denied. Enable Location Services."),
      { enableHighAccuracy: true }
    );
  };

  // Function to calculate distance between two points (Haversine Formula)
  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371000; // Radius of Earth in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  // Auto-update location every 30 seconds
  useEffect(() => {
    const interval = setInterval(updateLocation, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="child-activity-container"
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <Container className="mt-5">
        <h2 className="text-primary text-center">📋 Child Activity Monitoring</h2>
        <p className="text-muted text-center">Live tracking updates every 30 seconds.</p>

        {/* Emergency SOS Button */}
        <div className="text-center mb-3">
          <Button variant="danger" onClick={() => toast.error("🚨 Emergency SOS Alert Sent!")}>
            <FaShieldAlt size={18} className="me-1" />
            Emergency SOS
          </Button>
        </div>

        {/* Refresh Button */}
        <div className="text-center mb-3">
          <Button variant="success" onClick={updateLocation}>
            <FaSyncAlt size={18} className="me-1" />
            Refresh Location
          </Button>
        </div>

        {/* Safe Zone Alert */}
        {outsideSafeZone && (
          <Alert variant="danger" className="text-center">
            <FaExclamationTriangle className="me-2" />
            Alert: Child has exited the Safe Zone!
          </Alert>
        )}

        {/* Activity Table */}
        <Card className="shadow-sm p-3 mt-4">
          <Card.Body>
            <h4 className="text-dark">📍 Activity Log</h4>
            <Table bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>⏰ Time</th>
                  <th>📍 Location</th>
                  <th>📝 Details</th>
                  <th>🔍 Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => (
                  <tr key={index}>
                    <td>
                      <FaClock size={18} className="me-1" />
                      {activity.time}
                    </td>
                    <td>
                      <FaMapMarkerAlt size={18} className="me-1" />
                      {activity.location}
                    </td>
                    <td>{activity.details}</td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedLocation(activity);
                          setShowModal(true);
                        }}
                      >
                        View on Map
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      {/* Leaflet Map Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>📍 Child's Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLocation && (
            <MapContainer
              center={[selectedLocation.lat, selectedLocation.lng]}
              zoom={15}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={markerIcon}>
                <Popup>{selectedLocation.details}</Popup>
              </Marker>
              <Polyline positions={routeHistory} color="red" />
              <Circle
                center={safeZone}
                radius={safeZone.radius}
                pathOptions={{ color: "blue", fillColor: "lightblue" }}
              />
            </MapContainer>
          )}
        </Modal.Body>
      </Modal>
    </motion.div>
  );
};

export default ChildActivity;
