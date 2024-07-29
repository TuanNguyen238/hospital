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

  async createOtp(otp) {
    await this.#repository.save(otp);
    return otp.id;
  }
}

module.exports = OtpRepository;
