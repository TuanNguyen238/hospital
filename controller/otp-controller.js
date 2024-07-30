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
      const otpId = await this.#otpService.createOtp(otp);
      res.status(200).json({ id: otpId });
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
      await this.#otpService.requestOtp(phoneNumber, fcmToken);
      res.status(200).json({ message: "OTP request sent to Flutter app" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Error sending OTP request: " + err.message });
    }
  }

  async verifyOtp(req, res) {
    try {
      const otp = req.body;
      console.log(otp);
      await this.#otpService.verifyOtp(otp);
      res.status(200).json({ message: "OTP verified successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = OtpController;
