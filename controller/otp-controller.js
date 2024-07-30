const OtpService = require("../service/otp-service.js");
const { getMessaging } = require("firebase-admin/messaging");

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
      console.log(otpId);
      res.status(201).json({ id: otpId });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }

  async getAllOtp(req, res) {
    try {
      const otps = await this.#otpService.getAllOtp();
      res.status(200).json(otps);
    } catch (error) {
      res.status(500).send({ err: err.message });
    }
  }

  async requestOtp(req, res) {
    const { phoneNumber, fcmToken } = req.body;
    console.log("request is call");
    console.log(phoneNumber);
    console.log(fcmToken);
    const message = {
      token: fcmToken,
      data: {
        phone_number: phoneNumber,
        otp_request: "true",
      },
    };

    try {
      await getMessaging().send(message);
      res.send("OTP request sent to Flutter app");
    } catch (error) {
      console.error("Error sending FCM message:", error);
      res.status(500).send("Error sending OTP request");
    }
  }

  async verifyOtp(req, res) {
    const otp = req.body;
    console.log(otp);
    try {
      const isValid = await this.#otpService.verifyOtp(otp);
      if (isValid) res.status(200).send("OTP verified successfully");
      else res.status(400).send("Invalid OTP");
    } catch (err) {
      console.error("Error verifying OTP", err);
      res.status(500).send("Error verifying OTP");
    }
  }
}

module.exports = OtpController;
