const jwt = require("jsonwebtoken");
const HttpError = require("../errors/http-error");

const isAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throw new Error("Authentication failed!");
  }
  try {
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("Authentication failed!");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};

module.exports = isAuth;
