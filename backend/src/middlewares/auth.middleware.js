const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blacklist.model");

/**
 * @name authUserMW
 * @description Middleware to authenticate user using JWT token from cookies. If valid, attaches user info to req.user, otherwise returns 401 Unauthorized.
 * @access Protected
 */
async function authUserMW(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const isTokenBlacklisted = await BlacklistToken.findOne({ token });

  if (isTokenBlacklisted) {
    return res.status(401).json({ message: "Token is invalid" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = {
  authUserMW,
};
