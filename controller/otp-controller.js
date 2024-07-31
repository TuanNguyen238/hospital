const OtpService = require("../service/otp-service.js");

class OtpController {
  #otpService = null;

  constructor() {
    this.#otpService = new OtpService();
  }

  async createOtp(req, res) {
    try {
      const otp = req.body;
      console.log(otp);
      const message = await this.#otpService.createOtp(otp);
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
      const { phoneNumber, fcmToken } = req.body;
      console.log(phoneNumber, fcmToken);
      const message = await this.#otpService.requestOtp(phoneNumber, fcmToken);
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async verifyOtp(req, res) {
    try {
      const otp = req.body;
      console.log(otp);
      const valid = await this.#otpService.verifyOtp(otp);
      console.log(valid);
      res.status(valid.statusCode).json({ message: valid.message });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = OtpController;
