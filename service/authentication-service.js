const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repository/user-repository.js");
const dotenv = require("dotenv");
const EnumRole = require("../enum/enum-role.js");
const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const TokenRepository = require("../repository/token-repository.js");

dotenv.config();

class AuthenticationService {
  #userRepository;
  #tokenRepository;

  constructor() {
    this.#userRepository = new UserRepository();
    this.#tokenRepository = new TokenRepository();
  }

  async logout({ token }) {
    if (!token)
      throw {
        status: StatusCode.HTTP_401_UNAUTHORIZED,
        message: ErrorCode.TOKEN_UNAUTHENTICATED,
      };

    try {
      const userToken = jwt.verify(token, process.env.SIGNER_KEY);

      const user = await this.#userRepository.findByPhoneNumber(userToken.sub);
      const isValid = await this.#tokenRepository.findToken(user, token);

      if (isValid) await this.#tokenRepository.deleteByToken(token);

      return {
        status: StatusCode.HTTP_200_OK,
        message: isValid ? ErrorCode.LOGOUTED : ErrorCode.SUCCESS,
      };
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        const userToken = jwt.decode(token);
        const user = await this.#userRepository.findByPhoneNumber(
          userToken.sub
        );
        const isValid = await this.#tokenRepository.findToken(user, token);

        if (isValid) await this.#tokenRepository.deleteByToken(token);

        return {
          status: StatusCode.HTTP_200_OK,
          message: isValid ? ErrorCode.LOGOUTED : ErrorCode.SUCCESS,
        };
      } else if (err instanceof jwt.JsonWebTokenError)
        return {
          status: StatusCode.HTTP_200_OK,
          message: ErrorCode.SUCCESS,
        };
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
    await this.#saveToken(token, user);

    return {
      message: ErrorCode.AUTHENTICATED,
      data: { user, token },
    };
  }

  #generateToken(user) {
    const payload = {
      sub: user.phoneNumber,
      iss: "hospital",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      scope: user.role.name,
    };

    return jwt.sign(payload, process.env.SIGNER_KEY, { algorithm: "HS512" });
  }

  async #saveToken(token, user) {
    const existingToken = await this.#tokenRepository.findByUser(user);

    if (existingToken) {
      existingToken.token = token;
      await this.#tokenRepository.saveToken(existingToken);
    } else
      await this.#tokenRepository.saveToken({
        token: token,
        user: user,
      });
  }
}

module.exports = AuthenticationService;
