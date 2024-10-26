const jwt = require("jsonwebtoken");
const ErrorCode = require("../enum/error-code");
const dotenv = require("dotenv");
const EnumRole = require("../enum/enum-role");

dotenv.config();
const SECRET_KEY = process.env.SIGNER_KEY;

class UserMiddleware {
  static authenticateToken(req, res, next, allowedRoles = []) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log("No token provided.");
      return res.status(500).json({ error: ErrorCode.TOKEN_UNAUTHENTICATED });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        console.log("Token verification error:", err);
        return res.status(500).json({ error: ErrorCode.TOKEN_UNAUTHENTICATED });
      }

      const currentTime = Math.floor(Date.now() / 1000);

      if (user.exp < currentTime) {
        console.log("Token expired.");
        return res.status(500).json({ error: ErrorCode.TOKEN_EXPIRED });
      }

      if (allowedRoles.length && !allowedRoles.includes(user.scope)) {
        console.log("Insufficient permissions. User role:", user.scope);
        return res.status(500).json({ error: ErrorCode.TOKEN_UNAUTHENTICATED });
      }

      req.userId = user.id;
      req.sub = user.sub;
      console.log("User authenticated successfully. User ID:", req.userId);
      next();
    });
  }

  static authenticateTokenAdmin(req, res, next) {
    UserMiddleware.authenticateToken(req, res, next, [EnumRole.ADMIN]);
  }

  static authenticationTokenUser(req, res, next) {
    UserMiddleware.authenticateToken(req, res, next, [
      EnumRole.USER,
      EnumRole.DOCTOR,
      EnumRole.ADMIN,
    ]);
  }

  static authenticationTokenDoctor(req, res, next) {
    UserMiddleware.authenticateToken(req, res, next, [
      EnumRole.DOCTOR,
      EnumRole.ADMIN,
    ]);
  }
}

module.exports = UserMiddleware;
