const jwt = require("jsonwebtoken");
const ErrorCode = require("../enum/error-code");
const dotenv = require("dotenv");
const EnumRole = require("../enum/enum-role");

dotenv.config();
const SECRET_KEY = process.env.SIGNER_KEY;

class UserMiddleware {
  static authenticateTokenAdmin(req, res, next) {
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

      if (user.scope !== EnumRole.ADMIN)
        return res.status(500).json({ error: ErrorCode.TOKEN_UNAUTHENTICATED });

      next();
    });
  }

  static authenticationTokenUser(req, res, next) {
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

      if (
        user.sub !== req.body.phoneNumber &&
        user.sub !== req.query.phoneNumber &&
        user.scope !== EnumRole.ADMIN
      )
        return res.status(500).json({ error: ErrorCode.TOKEN_UNAUTHENTICATED });

      next();
    });
  }

  static authenticationTokenDoctor(req, res, next) {
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

      if (user.sub === EnumRole.USER)
        throw new Error({ error: ErrorCode.TOKEN_UNAUTHENTICATED });

      if (
        user.sub !== req.body.phoneNumber &&
        user.sub !== req.query.phoneNumber &&
        user.scope !== EnumRole.ADMIN
      )
        return res.status(500).json({ error: ErrorCode.TOKEN_UNAUTHENTICATED });

      next();
    });
  }
}

module.exports = UserMiddleware;
