const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User.model");
const { sendTokenResponse } = require("../utils/jwt.util");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─── Google OAuth Login ──────────────────────────────────────
// Firebase mein Google popup se login hota tha
// Ab frontend se Google token aayega, hum verify karenge
const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body; // Google se mila ID token

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential nahi mila!",
      });
    }

    // Google se token verify karo
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // User already hai? Nahi toh naya banao
    let user = await User.findOne({ email });

    if (!user) {
      // Naya user - register karo
      user = await User.create({
        name,
        email,
        picture,
        googleId,
        authProvider: "google",
      });
    } else if (user.authProvider !== "google") {
      // Pehle se email/password se registered hai
      return res.status(400).json({
        success: false,
        message: "Is email se pehle se account hai. Email/password se login karo.",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// ─── Email/Password Register ─────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email aur password daalo!",
      });
    }

    // Already exist karta hai?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Is email se pehle se account hai!",
      });
    }

    const user = await User.create({ name, email, password });
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// ─── Email/Password Login ────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email aur password daalo!",
      });
    }

    // Password field select karo (by default hidden hai)
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: "Email ya password galat hai!",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email ya password galat hai!",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// ─── Get Current User (Me) ───────────────────────────────────
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      picture: req.user.picture,
      authProvider: req.user.authProvider,
    },
  });
};

module.exports = { googleLogin, register, login, getMe };
