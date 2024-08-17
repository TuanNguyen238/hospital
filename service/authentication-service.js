const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repository/user-repository.js");
const dotenv = require("dotenv");
const EnumRole = require("../enum/enum-role.js");
const ErrorCode = require("../enum/error-code.js");
const RefreshTokenRepository = require("../repository/refreshToken-repository.js");

dotenv.config();

class AuthenticationService {
  #userRepository;
  #refreshTokenRepository;

  constructor() {
    this.#userRepository = new UserRepository();
    this.#refreshTokenRepository = new RefreshTokenRepository();
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

    if (!user) throw new Error(ErrorCode.USER_NOT_EXISTED);

    const hasCorrectRole = isMobile
      ? user.role.name === EnumRole.USER
      : user.role.name !== EnumRole.USER;

    if (!hasCorrectRole) throw new Error(ErrorCode.USER_NOT_EXISTED);

    const authenticated = await bcrypt.compare(
      authentication.password,
      user.password
    );

    if (!authenticated) throw new Error(ErrorCode.UNAUTHENTICATED);

    const token = this.#generateToken(user);
    const refreshToken = this.#generateRefreshToken(user);

    await this.#refreshTokenRepository.saveRefreshToken({
      token: refreshToken,
      user: user,
    });

    return {
      message: ErrorCode.AUTHENTICATED,
      user: user,
      token: token,
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

  async refreshToken(refreshToken) {
    try {
      const user = jwt.verify(refreshToken, process.env.SIGNER_KEY);

      const isValid = await this.#refreshTokenRepository.findRefreshToken(
        user.sub,
        refreshToken
      );
      return isValid;
      /*if (!isValid) throw new Error(ErrorCode.TOKEN_UNAUTHENTICATED);

      const newAccessToken = this.#generateToken(user);
      const newRefreshToken = this.#generateRefreshToken(user);

      await this.#userRepository.saveRefreshToken(user.id, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };*/
    } catch (err) {
      throw new Error(ErrorCode.TOKEN_UNAUTHENTICATED);
    }
  }
}

module.exports = AuthenticationService;
