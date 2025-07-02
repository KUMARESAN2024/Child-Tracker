const User = require("../models/User");
// const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists. Please log in." });
    }

    const newUser = new User({ fullName, email, phone, password });
    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    // Find user
    const user = await User.findOne({ email });
    console.log("data is "+user);
    if (!user) return res.status(404).json({ message: "User not found",success:false });

    // Compare passwords
    const isMatch = (password===user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials",success:false });

    res.status(200).json({ message: "Login successful", user,success:true });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error,success:false });
  }
};

module.exports = { signup, login };

