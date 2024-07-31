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
    await this.#otpRepository.createOtp(otp);
    return {
      message: ErrorCode.OTP_SENT,
    };
  }

  async getAllOtp() {
    return this.#otpRepository.getAllOtp();
  }

  async verifyOtp(otp) {
    const isValid = await this.#otpRepository.verifyOtp(otp);
    const statusCode = isValid ? 200 : 400;
    const message = isValid ? ErrorCode.OTP_VERIFIED : ErrorCode.INVALID_OTP;
    return {
      message: message,
      statusCode: statusCode,
    };
  }

  async requestOtp(phoneNumber, fcmToken) {
    const user = await this.#userRepository.findByPhoneNumber(phoneNumber);
    if (!user) throw new Error(ErrorCode.PHONE_NUMBER_NOT_EXISTED);

    const isAdmin = user.roles.some((role) => role.name === EnumRole.ADMIN);
    if (isAdmin) throw new Error(ErrorCode.PHONE_NUMBER_NOT_EXISTED);

    await this.#otpRepository.requestOtp(phoneNumber, fcmToken);

    return {
      message: ErrorCode.OTP_SENT,
    };
  }
}

module.exports = OtpService;
