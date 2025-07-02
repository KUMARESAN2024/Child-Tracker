const express = require("express");
const router = express.Router();
const Child = require("../models/Child");

// ➕ POST /api/children — Add a new child
router.post("/", async (req, res) => {
  try {
    const newChild = new Child(req.body);
    await newChild.save();
    res.status(201).json(newChild);
  } catch (error) {
    console.error("Error saving child:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 📥 GET /api/children/:userEmail — Get all children by user email
router.get("/:userEmail", async (req, res) => {
  try {
    const children = await Child.find({ userEmail: req.params.userEmail });
    res.json(children);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ❌ DELETE /api/children/:id — Delete a child by ID
router.delete("/:id", async (req, res) => {
  try {
    const result = await Child.findByIdAndDelete(req.params.id);
    res.json({ message: "Child deleted", result });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 📍 PUT /api/children/update-location/:id — Update GPS location only (without logging)
router.put("/update-location/:id", async (req, res) => {
  const { latitude, longitude } = req.body;
  try {
    const updatedChild = await Child.findByIdAndUpdate(
      req.params.id,
      { latitude, longitude },
      { new: true }
    );
    res.json(updatedChild);
  } catch (error) {
    res.status(500).json({ message: "Failed to update location" });
  }
});

// 📡 GET /api/children/location/:id — Get live location of child by ID
router.get("/location/:id", async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }
    res.json({
      latitude: child.latitude,
      longitude: child.longitude
    });
  } catch (error) {
    console.error("Error fetching child location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 📝 PUT /api/children/:id/location — Update location and log history
router.put("/:id/location", async (req, res) => {
  const { latitude, longitude } = req.body;
  try {
    const updated = await Child.findByIdAndUpdate(
      req.params.id,
      {
        latitude,
        longitude,
        $push: {
          activityLogs: {
            latitude,
            longitude,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    console.error("Failed to update location:", error);
    res.status(500).json({ message: "Error updating location" });
  }
});

// 📜 GET /api/children/activity/:id — Get child activity history
router.get("/activity/:id", async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }
    res.json(child.activityLogs || []);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ message: "Error fetching activity log" });
  }
});

router.post("/set-safe-zone", async (req, res) => {
  const { child_id, latitude, longitude, radius } = req.body;

  try {
    const updated = await Child.findByIdAndUpdate(
      child_id,
      {
        safeZone: { latitude, longitude, radius },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Safe Zone updated", updated });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to update Safe Zone" });
  }
});


module.exports = router;
