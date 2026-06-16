const express = require("express");
const router = express.Router();
const { googleLogin, register, login, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

// POST /api/auth/google   → Google OAuth login
router.post("/google", googleLogin);

// POST /api/auth/google-userinfo → Google Access Token se login
router.post("/google-userinfo", async (req, res, next) => {
  try {
    const { name, email, picture, googleId } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email nahi mila!" });

    const User = require("../models/User.model");
    const { sendTokenResponse } = require("../utils/jwt.util");

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, picture, googleId, authProvider: "google" });
    }
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/register → Email/password register
router.post("/register", register);

// POST /api/auth/login    → Email/password login
router.post("/login", login);

// GET  /api/auth/me       → Current user info (protected)
router.get("/me", protect, getMe);

module.exports = router;