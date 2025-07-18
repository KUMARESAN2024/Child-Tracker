const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/userController");

router.post("/signup", signup);
router.post("/login", login); // ✅ Ensure login route is here

module.exports = router;
