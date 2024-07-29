const OtpRepository = require("../repository/otp-repository.js");

class OtpService {
  #otpRepository;

  constructor() {
    this.#otpRepository = new OtpRepository();
  }

  async createOtp(otp) {
    return this.#otpRepository.createOtp(otp);
  }
}

module.exports = OtpService;
