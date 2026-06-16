const express = require("express");
const router = express.Router();
const { generateTrip } = require("../controllers/ai.controller");
const { protect } = require("../middleware/auth.middleware");

// POST /api/ai/generate-trip → AI se trip generate karo (protected)
router.post("/generate-trip", protect, generateTrip);

module.exports = router;
