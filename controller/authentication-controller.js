const AuthenticationService = require("../service/authentication-service");

class AuthenticationController {
  #authenticationService;

  constructor() {
    this.#authenticationService = new AuthenticationService();
  }

  async authenticate(req, res) {
    await this.#handleAuthentication(req, res, true);
  }

  async authWeb(req, res) {
    await this.#handleAuthentication(req, res, false);
  }

  async #handleAuthentication(req, res, isMobile) {
    try {
      const authentication = req.body;
      const isAuthenticated = isMobile
        ? await this.#authenticationService.authenticate(authentication)
        : await this.#authenticationService.authWeb(authentication);
      res.status(200).json(isAuthenticated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = AuthenticationController;
