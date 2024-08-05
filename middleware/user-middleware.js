const jwt = require("jsonwebtoken");
const ErrorCode = require("../enum/error-code");
const dotenv = require("dotenv");

dotenv.config();
const SECRET_KEY = process.env.SIGNER_KEY;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(500).json({ error: ErrorCode.TOKEN_UNAUTHENTICATED });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(500).json({ error: ErrorCode.TOKEN_UNAUTHENTICATED });
    }

    const currentTime = Math.floor(Date.now() / 1000);

    if (user.exp < currentTime) {
      return res.status(500).json({ error: ErrorCode.TOKEN_EXPIRED });
    }

    if (user.scope !== "ADMIN") {
      return res.status(500).json({ error: ErrorCode.TOKEN_UNAUTHENTICATED });
    }

    next();
  });
};

module.exports = authenticateToken;
