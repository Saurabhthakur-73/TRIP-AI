const jwt = require("jsonwebtoken");

// JWT Token generate karo
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Response mein user + token bhejo
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      authProvider: user.authProvider,
    },
  });
};

module.exports = { generateToken, sendTokenResponse };
