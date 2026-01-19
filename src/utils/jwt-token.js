// const jwt = require("jsonwebtoken");

// exports.generateToken = (payload) => {
//   return jwt.sign(payload, process.env.JWT_SECRET, {
//     expiresIn: "30m"
//   });
// };

// exports.verifyToken = (token) => {
//   return jwt.verify(token, process.env.JWT_SECRET);
// };


const jwt = require("jsonwebtoken");

exports.generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });

exports.generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
