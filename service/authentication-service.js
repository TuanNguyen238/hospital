const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repository/user-repository.js");

class AuthenticationService {
  #userRepository = null;

  constructor() {
    this.#userRepository = new UserRepository();
  }

  async authenticate(authentication) {
    return authentication;
    /*const user = await this.#userRepository.findByPhoneNumber(
      authentication.phoneNumber
    );
    if (!user) {
      throw new Error("USER_NOT_EXISTED");
    }
    

    const authenticated = await bcrypt.compare(request.password, user.password);
    if (!authenticated) {
      throw new Error("UNAUTHENTICATED");
    }

    const token = this.generateToken(user);

    return {
      token: token,
      isAuthenticated: true,
    };*/
  }

  generateToken(user) {
    const payload = {
      sub: user.username,
      iss: "tuannguyen",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
      scope: this.buildScope(user),
    };

    return jwt.sign(payload, process.env.SIGNER_KEY, { algorithm: "HS512" });
  }

  buildScope(user) {
    return user.roles.map((role) => role.name);
  }
}

module.exports = AuthenticationService;
