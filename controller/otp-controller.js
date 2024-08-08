const OtpService = require("../service/otp-service.js");

class OtpController {
  #otpService = null;

  constructor() {
    this.#otpService = new OtpService();
  }

  async createOtp(req, res) {
    try {
      console.log(req.body);
      const message = await this.#otpService.createOtp(req.body);
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAllOtp(req, res) {
    try {
      const otps = await this.#otpService.getAllOtp();
      res.status(200).json(otps);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async requestOtp(req, res) {
    try {
      console.log(req.body);
      const message = await this.#otpService.requestOtp(req.body);
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async verifyOtp(req, res) {
    try {
      console.log(req.body);
      const valid = await this.#otpService.verifyOtp(req.body);
      console.log(valid);
      res.status(valid.statusCode).json({ message: valid.message });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = OtpController;
