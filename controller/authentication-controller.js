const ErrorCode = require("../enum/error-code");
const Status = require("../enum/status");
const StatusCode = require("../enum/status-code");
const AuthenticationService = require("../service/authentication-service");

class AuthenticationController {
  #authenticationService;

  constructor() {
    this.#authenticationService = new AuthenticationService();
  }

  async logout(req, res) {
    try {
      const result = await this.#authenticationService.logout(req.body);
      res.status(StatusCode.HTTP_200_OK).json({
        status: Status.SUCCESS,
        message: result.message,
      });
    } catch (err) {
      res.status(err.status || StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
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

  async generateUrl(req, res) {
    try {
      const result = await this.#authenticationService.generateUrl();
      res.redirect(result);
      console.log(result);
    } catch (err) {
      console.error("Error: ", err);
      res.status(err.status || StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async callback(req, res) {
    try {
      const result = await this.#authenticationService.callback(req.query.code);
      res.status(StatusCode.HTTP_200_OK).send({
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

  async sendEmail(req, res) {
    try {
      const result = await this.#authenticationService.sendEmail(req.body);
      res.status(StatusCode.HTTP_200_OK).send({
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
