const jwt = require("jsonwebtoken");
const ErrorCode = require("../enum/error-code");
const dotenv = require("dotenv");

dotenv.config();
const SECRET_KEY = process.env.SIGNER_KEY;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: ErrorCode.TOKEN_UNAUTHENTICATED });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: ErrorCode.TOKEN_UNAUTHENTICATED });
    }
    next();
  });
};

module.exports = authenticateToken;
