const EnumRole = require("../enum/enum-role.js");
const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const OtpRepository = require("../repository/otp-repository.js");
const UserRepository = require("../repository/user-repository.js");
const dotenv = require("dotenv");

dotenv.config();

class OtpService {
  #otpRepository;
  #userRepository;

  constructor() {
    this.#otpRepository = new OtpRepository();
    this.#userRepository = new UserRepository();
  }

  async createOtp(otp) {
    const user = await this.#userRepository.findByPhoneNumber(otp.phoneNumber);
    if (!user)
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.PHONE_NUMBER_NOT_EXISTED,
      };
    await this.#otpRepository.deleteOtp(otp.phoneNumber);
    await this.#otpRepository.createOtp(otp);
    return { message: ErrorCode.OTP_SENT };
  }

  async getAllOtp() {
    const otps = await this.#otpRepository.getAllOtp();
    return { message: ErrorCode.SUCCESS, data: otps };
  }

  async verifyOtp(otp) {
    const isValid = await this.#otpRepository.verifyOtp(otp);
    if (!isValid) {
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.INVALID_OTP,
      };
    }
    return { message: ErrorCode.OTP_VERIFIED };
  }

  async requestOtp(otp) {
    const user = await this.#userRepository.findByPhoneNumber(otp.phoneNumber);
    if (!user)
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.PHONE_NUMBER_NOT_EXISTED,
      };

    const isUser = user.role.name === EnumRole.USER;
    const isConditionValid =
      (otp.isAuthenticated && !isUser) || (!otp.isAuthenticated && isUser);

    if (isConditionValid) {
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.PHONE_NUMBER_NOT_EXISTED,
      };
    }

    await this.#otpRepository.requestOtp(
      process.env.FCM_TOKEN,
      otp.phoneNumber
    );

    return { message: ErrorCode.OTP_SENT };
  }
}

module.exports = OtpService;
