const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // User ki trip details (form se aata hai) - flexible structure
    userSelection: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    // Gemini AI ka generated trip data
    tripData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    // Trip ka status
    isGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trip", tripSchema);