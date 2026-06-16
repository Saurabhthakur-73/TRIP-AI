const Trip = require("../models/Trip.model");

// ─── Naya Trip Create karo ───────────────────────────────────
// Firebase mein: addDoc(collection(db, "AITrips"), {...})
// Ab: POST /api/trips
const createTrip = async (req, res, next) => {
  try {
    const { userSelection, tripData } = req.body;

    if (!userSelection) {
      return res.status(400).json({
        success: false,
        message: "Trip details daalo (location, days, budget, people)!",
      });
    }

    const trip = await Trip.create({
      userId: req.user._id,
      userSelection,
      tripData: tripData || null,
      isGenerated: !!tripData,
    });

    res.status(201).json({
      success: true,
      message: "Trip ban gayi!",
      trip,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Single Trip lo (ID se) ──────────────────────────────────
// Firebase mein: getDoc(doc(db, "AITrips", tripId))
// Ab: GET /api/trips/:id
const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id).populate(
      "userId",
      "name email picture"
    );

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip nahi mili!",
      });
    }

    // Sirf apni trip dekho (ya public trips)
    if (trip.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Ye trip tumhari nahi hai!",
      });
    }

    res.json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// ─── User ki saari trips lo ──────────────────────────────────
// Firebase mein: query(collection(db, "AITrips"), where("userEmail", "==", email))
// Ab: GET /api/trips/my-trips
const getMyTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ userId: req.user._id })
      .sort({ createdAt: -1 }) // Latest pehle
      .select("-tripData"); // List mein full data mat bhejo (performance)

    res.json({
      success: true,
      count: trips.length,
      trips,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Trip mein AI data update karo ──────────────────────────
// AI generate karne ke baad trip update karo
// Ab: PUT /api/trips/:id
const updateTrip = async (req, res, next) => {
  try {
    const { tripData } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip nahi mili ya tumhari nahi hai!",
      });
    }

    trip.tripData = tripData;
    trip.isGenerated = true;
    await trip.save();

    res.json({ success: true, message: "Trip update ho gayi!", trip });
  } catch (error) {
    next(error);
  }
};

// ─── Trip Delete karo ────────────────────────────────────────
// Ab: DELETE /api/trips/:id
const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip nahi mili ya tumhari nahi hai!",
      });
    }

    res.json({ success: true, message: "Trip delete ho gayi!" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTrip, getTripById, getMyTrips, updateTrip, deleteTrip };
