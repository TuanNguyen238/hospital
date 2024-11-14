const Otp = require("../models/otp.js");
const AppDataSource = require("../utils/database.js");
const { getMessaging } = require("firebase-admin/messaging");

class OtpRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(Otp);
  }

  async getOtp(phoneNumber) {
    return await this.#repository.findOneBy({ phoneNumber });
  }

  async getAllOtp() {
    return await this.#repository.find();
  }

  async createOtp(otp) {
    await this.#repository.save(otp);
  }

  async deleteOtp(phoneNumber) {
    await this.#repository.delete({ phoneNumber: phoneNumber });
  }

  async verifyOtp(otp) {
    const verifiedOtp = await this.#repository.findOne({
      where: {
        phoneNumber: otp.phoneNumber,
        otp: otp.otp,
      },
    });

    if (!verifiedOtp) return false;

    const currentTime = new Date(otp.expireAt);
    const expiryTime = new Date(verifiedOtp.expireAt);

    return currentTime < expiryTime;
  }

  async requestOtp(fcmToken, phoneNumber) {
    const message = {
      token: fcmToken,
      data: {
        phone_number: phoneNumber,
        otp_request: "true",
      },
    };
    await getMessaging().send(message);
  }
}

module.exports = OtpRepository;
