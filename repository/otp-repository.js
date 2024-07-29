const Otp = require("../models/otp.js");
const AppDataSource = require("../utils/configs");

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
    return otp.id;
  }

  async verifyOtp(otp) {
    const verifiedOtp = await this.#repository.findOne({
      where: {
        phoneNumber: otp.phoneNumber,
        otp: otp.otp,
      },
    });
    return verifiedOtp && new Date() < new Date(verifiedOtp.expireAt);
  }
}

module.exports = OtpRepository;
