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

    await this.#refreshTokenRepository.saveRefreshToken({ refreshToken, user });

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
}

module.exports = AuthenticationService;
