const Child = require('../models/Child');

// ➤ Get Live Location of a Specific Child by ID
exports.getChildLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const child = await Child.findById(id);

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
};

// ➤ Get All Child Details by User Email
exports.getChildDetails = async (req, res) => {
  const { userEmail } = req.params;
  try {
    const children = await Child.find({ userEmail });
    if (children.length === 0) {
      return res.status(404).json({ message: 'No child details found for this user.' });
    }
    res.status(200).json(children);
  } catch (error) {
    console.error("Error fetching child details:", error);
    res.status(500).json({ message: 'Server error fetching child details.' });
  }
};

// ➤ Add New Child Details
exports.addChildDetails = async (req, res) => {
  try {
    const newChild = new Child(req.body);
    await newChild.save();
    const children = await Child.find({ userEmail: req.body.userEmail });
    res.status(201).json({ message: 'Child added successfully', children });
  } catch (error) {
    console.error("Error saving child details:", error);
    res.status(500).json({ message: 'Error saving child details' });
  }
};


