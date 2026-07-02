const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
} = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", auth, getProfile);
router.post("/logout", auth, logoutUser);

module.exports = router;
