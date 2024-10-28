const StatusCode = require("../enum/status-code.js");
const Status = require("../enum/status.js");
const OtpService = require("../service/otp-service.js");

class OtpController {
  #otpService;

  constructor() {
    this.#otpService = new OtpService();
  }

  async createOtp(req, res) {
    try {
      console.log(req.body);
      const result = await this.#otpService.createOtp(req.body);
      res.status(StatusCode.HTTP_200_OK).json({
        status: Status.SUCCESS,
        message: result.message,
      });
    } catch (err) {
      console.log("Error:", err);
      res.status(err.status || StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getAllOtp(req, res) {
    try {
      const result = await this.#otpService.getAllOtp();
      res.status(StatusCode.HTTP_200_OK).json({
        status: Status.SUCCESS,
        message: result.message,
      });
    } catch (err) {
      console.log("Error:", err);
      res.status(err.status || StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async requestOtp(req, res) {
    try {
      console.log(req.body);
      const result = await this.#otpService.requestOtp(req.body);
      res.status(StatusCode.HTTP_200_OK).json({
        status: StatusCode.SUCCESS,
        message: result.message,
      });
    } catch (err) {
      console.log("Error:", err);
      res.status(err.status || StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async verifyOtp(req, res) {
    try {
      console.log(req.body);
      const result = await this.#otpService.verifyOtp(req.body);
      res.status(StatusCode.HTTP_200_OK).json({
        status: Status.SUCCESS,
        message: result.message,
      });
    } catch (err) {
      console.log("Error:", err);
      res.status(err.status || StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  }
}

module.exports = OtpController;
