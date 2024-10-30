const jwt = require("jsonwebtoken");
const ErrorCode = require("../enum/error-code");
const dotenv = require("dotenv");
const EnumRole = require("../enum/enum-role");
const StatusCode = require("../enum/status-code");
const Status = require("../enum/status");
const RefreshTokenRepository = require("../repository/refreshToken-repository");
const UserRepository = require("../repository/user-repository");

dotenv.config();
const SECRET_KEY = process.env.SIGNER_KEY;

class UserMiddleware {
  static authenticateToken(req, res, next, allowedRoles = []) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log("No token provided.");
      return res.status(StatusCode.HTTP_401_UNAUTHORIZED).json({
        status: Status.ERROR,
        message: ErrorCode.TOKEN_UNAUTHENTICATED,
      });
    }

    jwt.verify(token, SECRET_KEY, async (err, user) => {
      if (err) {
        console.log("Token verification error:", err);
        return res.status(StatusCode.HTTP_401_UNAUTHORIZED).json({
          status: Status.ERROR,
          message: ErrorCode.TOKEN_UNAUTHENTICATED,
        });
      }

      const currentTime = Math.floor(Date.now() / 1000);

      if (user.exp < currentTime) {
        console.log("Token expired.");
        return res.status(StatusCode.HTTP_401_UNAUTHORIZED).json({
          status: Status.ERROR,
          message: ErrorCode.TOKEN_EXPIRED,
        });
      }

      if (allowedRoles.length && !allowedRoles.includes(user.scope)) {
        console.log("Insufficient permissions. User role:", user.scope);
        return res.status(StatusCode.HTTP_403_FORBIDDEN).json({
          status: Status.ERROR,
          message: ErrorCode.INSUFFICIENT_PERMISSION,
        });
      }
      const userRepository = new UserRepository();
      const userData = await userRepository.findByPhoneNumber(user.sub);

      const refreshTokenRepository = new RefreshTokenRepository();
      const isValid = await refreshTokenRepository.findByUser(userData);
      if (!isValid)
        throw {
          status: StatusCode.HTTP_401_UNAUTHORIZED,
          message: ErrorCode.TOKEN_UNAUTHENTICATED,
        };

      req.sub = user.sub;
      console.log("User authenticated successfully. User ID:", req.sub);
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
