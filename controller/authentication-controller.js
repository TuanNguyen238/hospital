const AuthenticationService = require("../service/authentication-service");

class AuthenticationController {
  #authenticationService = null;

  constructor() {
    this.#authenticationService = new AuthenticationService();
  }

  async authenticate(req, res) {
    try {
      const authentication = req.body;
      const isAuthenticated = await this.#authenticationService.authenticate(
        authentication
      );
      res.json(isAuthenticated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = AuthenticationController;