const Status = require("../enum/status");
const StatusCode = require("../enum/status-code");
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
      const result = isMobile
        ? await this.#authenticationService.authenticate(authentication)
        : await this.#authenticationService.authWeb(authentication);
      res.status(StatusCode.HTTP_200_OK).json({
        status: Status.SUCCESS,
        message: result.message,
        data: isAuthenticated.data,
      });
    } catch (err) {
      console.error("Error: ", err);
      res.status(err.status || StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const result = await this.#authenticationService.refreshToken(req.body);
      res.status(StatusCode.HTTP_200_OK).json({
        status: Status.SUCCESS,
        message: result.message,
        data: result.data,
      });
    } catch (err) {
      console.error("Error: ", err);
      res.status(err.status || StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  }
}

module.exports = AuthenticationController;
