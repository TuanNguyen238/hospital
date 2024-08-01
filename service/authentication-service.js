const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repository/user-repository.js");
const dotenv = require("dotenv");
const EnumRole = require("../enum/enum-role.js");
const ErrorCode = require("../enum/error-code.js");

dotenv.config();

class AuthenticationService {
  #userRepository;

  constructor() {
    this.#userRepository = new UserRepository();
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

    return {
      message: ErrorCode.AUTHENTICATED,
      user: user,
      token: token,
      isAuthenticated: true,
    };
  }

  #generateToken(user) {
    const payload = {
      sub: user.username,
      iss: "hospital",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      scope: this.#buildScope(user),
    };

    return jwt.sign(payload, process.env.SIGNER_KEY, { algorithm: "HS512" });
  }

  #buildScope(user) {
    return user.roles.map((role) => role.name);
  }
}

module.exports = AuthenticationService;
