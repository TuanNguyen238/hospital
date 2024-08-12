const jwt = require("jsonwebtoken");
const ErrorCode = require("../enum/error-code");
const dotenv = require("dotenv");
const EnumRole = require("../enum/enum-role");

dotenv.config();
const SECRET_KEY = process.env.SIGNER_KEY;

class UserMiddleware {
  static authenticateToken(
    req,
    res,
    next,
    allowedRoles = [],
    validateUser = false
  ) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
      return res.status(500).json({ error: ErrorCode.TOKEN_UNAUTHENTICATED });

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err)
        return res.status(500).json({ error: ErrorCode.TOKEN_UNAUTHENTICATED });

      const currentTime = Math.floor(Date.now() / 1000);

      if (user.exp < currentTime)
        return res.status(500).json({ error: ErrorCode.TOKEN_EXPIRED });

      if (allowedRoles.length && !allowedRoles.includes(user.scope))
        return res.status(500).json({ error: ErrorCode.TOKEN_UNAUTHENTICATED });

      if (
        validateUser &&
        user.sub !== req.body.phoneNumber &&
        user.sub !== req.query.phoneNumber &&
        user.scope !== EnumRole.ADMIN
      )
        return res.status(500).json({ error: ErrorCode.TOKEN_UNAUTHENTICATED });

      next();
    });
  }

  static authenticateTokenAdmin(req, res, next) {
    UserMiddleware.authenticateToken(req, res, next, [EnumRole.ADMIN]);
  }

  static authenticationTokenUser(req, res, next) {
    UserMiddleware.authenticateToken(
      req,
      res,
      next,
      [EnumRole.USER, EnumRole.ADMIN],
      true
    );
  }

  static authenticationTokenDoctor(req, res, next) {
    UserMiddleware.authenticateToken(
      req,
      res,
      next,
      [EnumRole.DOCTOR, EnumRole.ADMIN],
      true
    );
  }
}

module.exports = UserMiddleware;
