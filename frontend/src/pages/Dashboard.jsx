import React, { useEffect, useState } from "react";
import {
  fetchChildDetails,
  addChildDetails,
  deleteChild,
  updateChildLocation,
} from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const storedEmail = localStorage.getItem("userEmail");
  const storedPhone = localStorage.getItem("userPhone");

  const [children, setChildren] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userEmail: "",
    name: "",
    age: "",
    gender: "",
    location: "",
    latitude: "",
    longitude: "",
    parentContact: "",
    emergencyContact: "",
    healthConditions: "",
    schoolName: "",
    grade: "",
  });

  const [editLocationId, setEditLocationId] = useState(null);
  const [manualLocation, setManualLocation] = useState({ latitude: "", longitude: "" });

  useEffect(() => {
    fetchChildDetails()
      .then((data) => data && setChildren(data))
      .catch(() => console.log("No child details found"));
  }, []);

  const handleShowForm = () => {
    setShowForm(!showForm);

    if (!showForm && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            userEmail: storedEmail || "",
            parentContact: storedPhone || "",
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
        },
        () => {
          setFormData((prev) => ({
            ...prev,
            userEmail: storedEmail || "",
            parentContact: storedPhone || "",
          }));
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addChildDetails(formData);
      if (response && response.children) {
        setChildren(response.children);
        setShowForm(false);
        setFormData({
          userEmail: storedEmail || "",
          name: "",
          age: "",
          gender: "",
          location: "",
          latitude: "",
          longitude: "",
          parentContact: storedPhone || "",
          emergencyContact: "",
          healthConditions: "",
          schoolName: "",
          grade: "",
        });
      }
    } catch (error) {
      console.error("Error adding child details", error);
    }
  };

  const handleDelete = async (childId) => {
    try {
      await deleteChild(childId);
      setChildren((prev) => prev.filter((child) => child._id !== childId));
    } catch (error) {
      console.error("Error deleting child", error);
    }
  };

  const handleManualUpdate = async (childId) => {
    if (!manualLocation.latitude || !manualLocation.longitude) {
      alert("Please enter both latitude and longitude.");
      return;
    }

    try {
      const updated = await updateChildLocation(childId, {
        latitude: parseFloat(manualLocation.latitude),
        longitude: parseFloat(manualLocation.longitude),
      });
      if (updated) {
        setChildren((prev) =>
          prev.map((child) =>
            child._id === childId
              ? { ...child, latitude: updated.latitude, longitude: updated.longitude }
              : child
          )
        );
        setEditLocationId(null);
        setManualLocation({ latitude: "", longitude: "" });
      }
    } catch (error) {
      console.error("Failed to update location manually", error);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "1100px" }}>
      <style>
        {`
          .form-container {
            display: none;
            transition: all 0.4s ease-in-out;
          }
          .form-container.show {
            display: block;
          }
        `}
      </style>

      <h2 className="text-center mb-4">👶 Child Dashboard</h2>

      {children.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
          {children.map((child) => (
            <div className="col" key={child._id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title text-center">Child Details</h5>
                  <table className="table table-sm table-striped">
                    <tbody>
                      <tr><th>Name</th><td>{child.name}</td></tr>
                      <tr><th>Age</th><td>{child.age}</td></tr>
                      <tr><th>Gender</th><td>{child.gender}</td></tr>
                      <tr><th>Location</th><td>{child.location}</td></tr>
                      <tr><th>Latitude</th><td>{child.latitude || "N/A"}</td></tr>
                      <tr><th>Longitude</th><td>{child.longitude || "N/A"}</td></tr>
                      <tr><th>Parent Contact</th><td>{child.parentContact}</td></tr>
                      <tr><th>Emergency Contact</th><td>{child.emergencyContact}</td></tr>
                      <tr><th>Health</th><td>{child.healthConditions || "None"}</td></tr>
                      <tr><th>School</th><td>{child.schoolName}</td></tr>
                      <tr><th>Grade</th><td>{child.grade}</td></tr>
                    </tbody>
                  </table>

                  {/* Buttons side by side */}
                  <div className="row mt-3">
                    <div className="col-6 pe-1">
                      <button
                        className="btn btn-danger w-100"
                        onClick={() => handleDelete(child._id)}
                      >
                        ❌ Delete
                      </button>
                    </div>
                    <div className="col-6 ps-1">
                      <button
                        className="btn btn-warning w-100"
                        onClick={() => {
                          setEditLocationId(child._id);
                          setManualLocation({
                            latitude: child.latitude || "",
                            longitude: child.longitude || "",
                          });
                        }}
                      >
                        ✏️ Update Location
                      </button>
                    </div>
                  </div>

                  {/* Manual Location Update Form */}
                  {editLocationId === child._id && (
                    <div className="mt-3">
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Enter Latitude"
                        value={manualLocation.latitude}
                        onChange={(e) =>
                          setManualLocation({ ...manualLocation, latitude: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Enter Longitude"
                        value={manualLocation.longitude}
                        onChange={(e) =>
                          setManualLocation({ ...manualLocation, longitude: e.target.value })
                        }
                      />

                      <div className="row">
                        <div className="col-6 pe-1">
                          <button
                            className="btn btn-success w-100"
                            onClick={() => handleManualUpdate(child._id)}
                          >
                            ✅ Save
                          </button>
                        </div>
                        <div className="col-6 ps-1">
                          <button
                            className="btn btn-secondary w-100"
                            onClick={() => setEditLocationId(null)}
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-danger">No child details found.</p>
      )}

      <button className="btn btn-success w-100 mb-3" onClick={handleShowForm}>
        {showForm ? "Cancel" : "➕ Add Child"}
      </button>

      {/* Add Child Form */}
      <form
        onSubmit={handleSubmit}
        className={`form-container border p-4 rounded bg-light ${showForm ? "show" : ""}`}
      >
        <div className="row g-3">
          {Object.keys(formData).map((key) => {
            const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

            if (key === "gender") {
              return (
                <div key={key} className="col-md-4">
                  <label className="form-label">{label}</label>
                  <select
                    className="form-select"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              );
            }

            return (
              <div key={key} className="col-md-4">
                <label className="form-label">{label}</label>
                <input
                  type={key === "age" ? "number" : "text"}
                  className="form-control"
                  placeholder={`Enter ${label}`}
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  required={key !== "healthConditions"}
                  disabled={key === "userEmail" || key === "parentContact"}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-4">
          <button type="submit" className="btn btn-primary w-100">
            ✅ Save Child Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default Dashboard;
