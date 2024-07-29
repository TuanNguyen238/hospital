const OtpRepository = require("../repository/otp-repository.js");

class OtpService {
  #otpRepository;

  constructor() {
    this.#otpRepository = new OtpRepository();
  }

  async createOtp(otp) {
    return this.#otpRepository.createOtp(otp);
  }

  async getAllOtp() {
    return this.#otpRepository.getAllOtp();
  }

  async verifyOtp(otp) {
    return this.#otpRepository.verifyOtp(otp);
  }
}

module.exports = OtpService;
