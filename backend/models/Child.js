const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  location: { type: String, required: true },
  parentContact: { type: String, required: true },
  emergencyContact: { type: String, required: true },
  healthConditions: { type: String, default: "" },
  schoolName: { type: String, required: true },
  grade: { type: String, required: true },

  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },

  // 🕒 Logs of historical locations
  activityLogs: [
    {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],

  // ✅ Added missing comma here and defined safeZone correctly
  safeZone: {
    latitude: Number,
    longitude: Number,
    radius: Number
  }
});

module.exports = mongoose.model("Child", childSchema);
