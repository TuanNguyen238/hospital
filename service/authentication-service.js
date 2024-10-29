const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repository/user-repository.js");
const dotenv = require("dotenv");
const EnumRole = require("../enum/enum-role.js");
const ErrorCode = require("../enum/error-code.js");
const RefreshTokenRepository = require("../repository/refreshToken-repository.js");
const StatusCode = require("../enum/status-code.js");

dotenv.config();

class AuthenticationService {
  #userRepository;
  #refreshTokenRepository;

  constructor() {
    this.#userRepository = new UserRepository();
    this.#refreshTokenRepository = new RefreshTokenRepository();
  }

  async logout({ refreshToken }) {
    if (!refreshToken) {
      throw {
        status: StatusCode.HTTP_401_UNAUTHORIZED,
        message: ErrorCode.TOKEN_UNAUTHENTICATED,
      };
    }

    try {
      const userToken = jwt.verify(refreshToken, process.env.SIGNER_KEY);

      const user = await this.#userRepository.findByPhoneNumber(userToken.sub);

      const isValid = await this.#refreshTokenRepository.findRefreshToken(
        user,
        refreshToken
      );

      if (!isValid)
        throw {
          status: StatusCode.HTTP_401_UNAUTHORIZED,
          message: ErrorCode.TOKEN_UNAUTHENTICATED,
        };

      await this.#refreshTokenRepository.deleteByToken(refreshToken);
      return {
        status: ErrorCode.SUCCESS,
        message: ErrorCode.LOGOUTED,
      };
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        throw {
          status: StatusCode.HTTP_401_UNAUTHORIZED,
          message: ErrorCode.TOKEN_UNAUTHENTICATED,
        };
      }
      throw err;
    }
  }

  async authenticate(authentication) {
    return this.#authenticateUser(authentication, true);
  }

  async authWeb(authentication) {
    return this.#authenticateUser(authentication, false);
  }

  async #authenticateUser(authentication, isMobile) {
    const user = await this.#userRepository.findByPhoneNumber(
      authentication.phoneNumber
    );
    if (!user)
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.USER_NOT_EXISTED,
      };

    const hasCorrectRole = isMobile
      ? user.role.name === EnumRole.USER
      : user.role.name !== EnumRole.USER;
    if (!hasCorrectRole)
      throw {
        status: StatusCode.HTTP_403_FORBIDDEN,
        message: ErrorCode.INSUFFICIENT_PERMISSION,
      };

    const authenticated = await bcrypt.compare(
      authentication.password,
      user.password
    );
    if (!authenticated)
      throw {
        status: StatusCode.HTTP_401_UNAUTHORIZED,
        message: ErrorCode.UNAUTHENTICATED,
      };

    const token = this.#generateToken(user);
    const refreshToken = this.#generateRefreshToken(user);
    await this.#saveRefreshToken(refreshToken, user);

    return {
      message: ErrorCode.AUTHENTICATED,
      data: { user, token, refreshToken },
    };
  }

  async refreshToken(phoneNumber, refreshToken) {
    const user = await this.#userRepository.findByPhoneNumber(phoneNumber);

    const isValid = await this.#refreshTokenRepository.findRefreshToken(
      user,
      refreshToken
    );
    if (!isValid)
      throw {
        status: StatusCode.HTTP_401_UNAUTHORIZED,
        message: ErrorCode.TOKEN_UNAUTHENTICATED,
      };

    const newAccessToken = this.#generateToken(user);
    const newRefreshToken = this.#generateRefreshToken(user);
    await this.#saveRefreshToken(newRefreshToken, user);

    return {
      message: ErrorCode.AUTHENTICATED,
      data: { token: newAccessToken, refreshToken: newRefreshToken },
    };
  }

  #generateToken(user) {
    const payload = {
      sub: user.phoneNumber,
      iss: "hospital",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      scope: user.role.name,
    };

    return jwt.sign(payload, process.env.SIGNER_KEY, { algorithm: "HS512" });
  }

  #generateRefreshToken(user) {
    const payload = {
      sub: user.phoneNumber,
      iss: "hospital",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      scope: user.role.name,
    };

    return jwt.sign(payload, process.env.SIGNER_KEY, { algorithm: "HS512" });
  }

  async #saveRefreshToken(refreshToken, user) {
    const existingToken = await this.#refreshTokenRepository.findByUser(user);

    if (existingToken) {
      existingToken.token = refreshToken;
      await this.#refreshTokenRepository.saveRefreshToken(existingToken);
    } else
      await this.#refreshTokenRepository.saveRefreshToken({
        token: refreshToken,
        user: user,
      });
  }
}

module.exports = AuthenticationService;
