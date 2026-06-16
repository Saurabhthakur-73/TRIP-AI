const express = require("express");
const router = express.Router();
const {
  createTrip,
  getTripById,
  getMyTrips,
  updateTrip,
  deleteTrip,
} = require("../controllers/trip.controller");
const { protect } = require("../middleware/auth.middleware");

// Saare trip routes protected hain (login zaroori)
router.use(protect);

// POST   /api/trips          → Naya trip banao
router.post("/", createTrip);

// GET    /api/trips/my-trips → Apni saari trips dekho
router.get("/my-trips", getMyTrips);

// GET    /api/trips/:id      → Ek trip dekho
router.get("/:id", getTripById);

// PUT    /api/trips/:id      → Trip update karo (AI data add)
router.put("/:id", updateTrip);

// DELETE /api/trips/:id      → Trip delete karo
router.delete("/:id", deleteTrip);

module.exports = router;
