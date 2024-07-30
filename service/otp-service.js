const EnumRole = require("../enum/enum-role.js");
const ErrorCode = require("../enum/error-code.js");
const OtpRepository = require("../repository/otp-repository.js");
const UserRepository = require("../repository/user-repository.js");

class OtpService {
  #otpRepository;
  #userRepository;

  constructor() {
    this.#otpRepository = new OtpRepository();
    this.#userRepository = new UserRepository();
  }

  async createOtp(otp) {
    const user = await this.#userRepository.findByPhoneNumber(otp.phoneNumber);
    if (!user) throw new Error(ErrorCode.PHONE_NUMBER_NOT_EXISTED);
    return this.#otpRepository.createOtp(otp);
  }

  async getAllOtp() {
    return this.#otpRepository.getAllOtp();
  }

  async verifyOtp(otp) {
    const isValid = await this.#otpRepository.verifyOtp(otp);
    return isValid;
  }

  async requestOtp(phoneNumber, fcmToken) {
    const user = await this.#userRepository.findByPhoneNumber(phoneNumber);
    if (!user) throw new Error(ErrorCode.PHONE_NUMBER_NOT_EXISTED);

    const isAdmin = user.roles.some((role) => role.name === EnumRole.ADMIN);
    if (isAdmin) throw new Error(ErrorCode.PHONE_NUMBER_NOT_EXISTED);

    await this.#otpRepository.requestOtp(phoneNumber, fcmToken);
  }
}

module.exports = OtpService;
