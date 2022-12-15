const jwt = require("jsonwebtoken");

const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

module.exports = createToken;
