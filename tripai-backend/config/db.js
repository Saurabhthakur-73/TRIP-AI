const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes("xxxxx")) {
    console.log("⚠️  MongoDB URI nahi hai — baad mein connect karenge!");
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
};

module.exports = connectDB;