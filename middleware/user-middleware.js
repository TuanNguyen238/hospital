const jwt = require("jsonwebtoken");
const ErrorCode = require("../enum/error-code");
const dotenv = require("dotenv");
const EnumRole = require("../enum/enum-role");
const StatusCode = require("../enum/status-code");
const Status = require("../enum/status");
const UserRepository = require("../repository/user-repository");
const TokenRepository = require("../repository/token-repository");

dotenv.config();

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

    jwt.verify(token, process.env.SIGNER_KEY, async (err, user) => {
      if (err) {
        console.log("Token verification error:", err);
        return res.status(StatusCode.HTTP_401_UNAUTHORIZED).json({
          status: Status.ERROR,
          message: ErrorCode.TOKEN_UNAUTHENTICATED,
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

      if (userData.status != Status.ACTIVE)
        return res.status(StatusCode.HTTP_400_BAD_REQUEST).json({
          status: Status.ERROR,
          message: ErrorCode.USER_DISABLED,
        });

      const tokenRepository = new TokenRepository();
      const isValid = await tokenRepository.findByUser(userData);
      if (!isValid)
        return res.status(StatusCode.HTTP_401_UNAUTHORIZED).json({
          status: Status.ERROR,
          message: ErrorCode.TOKEN_UNAUTHENTICATED,
        });

      req.scope = user.scope;
      req.sub = user.sub;
      console.log(
        "User authenticated successfully. User ID:",
        req.sub,
        req.scope
      );
      next();
    });
  }

  static authenticateTokenAdmin(req, res, next) {
    UserMiddleware.authenticateToken(req, res, next, [EnumRole.ADMIN]);
  }

  static authenticationTokenUser(req, res, next) {
    UserMiddleware.authenticateToken(req, res, next, [
      EnumRole.USER,
      EnumRole.STAFF,
      EnumRole.DOCTOR,
      EnumRole.ADMIN,
    ]);
  }

  static authenticationTokenStaff(req, res, next) {
    UserMiddleware.authenticateToken(req, res, next, [
      EnumRole.STAFF,
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
