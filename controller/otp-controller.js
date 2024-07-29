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
      const otpId = await this.#otpService.createOtp(otp);
      res.status(201).json({ id: otpId });
    } catch (err) {
      res.status(500).json({ err: err.message });
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
    const { phone_number, otp } = req.body;
    console.log(phone_number, otp);
    const otpStore = {
      84937837564: "123456 ",
    };

    if (otpStore[phone_number] && otpStore[phone_number] === otp) {
      res.status(200).send("OTP verified successfully");
    } else {
      res.status(400).send("Invalid OTP");
    }
  }
}

module.exports = OtpController;
