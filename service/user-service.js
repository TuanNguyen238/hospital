const EnumRole = require("../enum/enum-role.js");
const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const Status = require("../enum/status.js");
const RewardPointRepository = require("../repository/rewardPoint-repository.js");
const RoleRepository = require("../repository/role-repository.js");
const UserRepository = require("../repository/user-repository.js");
const bcrypt = require("bcrypt");
const Email = require("../utils/email.js");
const DetailDoctorRepository = require("../repository/detailedDoctor-repository.js");
const { isValidType } = require("../enum/enum-type.js");

class UserService {
  #userRepository;
  #roleRepository;
  #rewardPointRepository;
  #email;
  #doctorRepository;

  constructor() {
    this.#userRepository = new UserRepository();
    this.#roleRepository = new RoleRepository();
    this.#rewardPointRepository = new RewardPointRepository();
    this.#email = new Email();
    this.#doctorRepository = new DetailDoctorRepository();
  }

  async getUserById(phoneNumber) {
    const user = await this.#userRepository.findByPhoneNumber(phoneNumber);
    if (!user)
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.USER_NOT_EXISTED,
      };
    return { message: ErrorCode.SUCCESS, data: user };
  }

  async getPointByPhoneNumber(phoneNumber) {
    const point = await this.#rewardPointRepository.getRewardPointByPhoneNumber(
      phoneNumber
    );
    if (!point)
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.USER_NOT_EXISTED,
      };
    return { message: ErrorCode.SUCCESS, data: point };
  }

  async createUser(user) {
    const checkUser = await this.#userRepository.findByPhoneNumber(
      user.phoneNumber
    );
    if (checkUser)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.USER_ALREADY_EXISTS,
      };

    const password = user.password;
    user.password = await bcrypt.hash(user.password, 10);
    const userRole = await this.#roleRepository.getRole(EnumRole.USER);

    if (!userRole)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.ROLE_NOT_EXISTED,
      };

    user.role = userRole;
    user.createdAt = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    const object = "Tài khoản người dùng đã được tạo thành công";
    const text = await this.#email.generateEmailContent(
      user.username,
      user.phoneNumber,
      password,
      EnumRole.USER
    );

    await this.#email.sendEmail(user.email, object, text);
    await this.#userRepository.saveUser(user);
    await this.#rewardPointRepository.saveRewardPoint({ user });

    return { message: ErrorCode.REGISTED };
  }

  #generateRandomNumericPassword(length = 8) {
    const digits = "0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      password += digits[randomIndex];
    }
    return password;
  }

  async adminCreateDoctor(user) {
    const checkUser = await this.#userRepository.findByPhoneNumber(
      user.phoneNumber
    );
    if (checkUser)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.USER_ALREADY_EXISTS,
      };

    if (!isValidType(user.type))
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.TYPE_NOT_EXISTED,
      };

    const randomPassword = this.#generateRandomNumericPassword(8);
    user.password = await bcrypt.hash(randomPassword, 10);
    const userRole = await this.#roleRepository.getRole(EnumRole.DOCTOR);

    if (!userRole)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.ROLE_NOT_EXISTED,
      };

    user.role = userRole;
    user.createdAt = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);

    const object = "Tài khoản bác sĩ đã được tạo thành công";
    const text = await this.#email.generateEmailContent(
      user.username,
      user.phoneNumber,
      randomPassword,
      EnumRole.DOCTOR
    );

    try {
      const savedUser = await this.#userRepository.saveUser(user);
      const detailDoctor = {
        type: user.type,
        user: savedUser,
      };

      await this.#doctorRepository.saveDoctor(detailDoctor);
      await this.#rewardPointRepository.saveRewardPoint({ user: savedUser });
      await this.#email.sendEmail(user.email, object, text);
    } catch (err) {
      console.error("Err: ", err);
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.EMAIL_SEND_FAILED,
      };
    }

    return { message: ErrorCode.REGISTED };
  }

  async adminCreateStaff(user) {
    const checkUser = await this.#userRepository.findByPhoneNumber(
      user.phoneNumber
    );
    if (checkUser)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.USER_ALREADY_EXISTS,
      };

    const randomPassword = this.#generateRandomNumericPassword(8);
    user.password = await bcrypt.hash(randomPassword, 10);
    const userRole = await this.#roleRepository.getRole(EnumRole.STAFF);

    if (!userRole)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.ROLE_NOT_EXISTED,
      };

    user.role = userRole;
    user.createdAt = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);

    const object = "Tài khoản nhân viên đã được tạo thành công";
    const text = await this.#email.generateEmailContent(
      user.username,
      user.phoneNumber,
      randomPassword,
      EnumRole.STAFF
    );

    try {
      const savedUser = await this.#userRepository.saveUser(user);
      await this.#rewardPointRepository.saveRewardPoint({ user: savedUser });
      await this.#email.sendEmail(user.email, object, text);
    } catch (err) {
      console.error("Err: ", err);
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.EMAIL_SEND_FAILED,
      };
    }

    return { message: ErrorCode.REGISTED };
  }

  async doctorCreateUser(user) {
    const checkUser = await this.#userRepository.findByPhoneNumber(
      user.phoneNumber
    );
    if (checkUser)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.USER_ALREADY_EXISTS,
      };
    user.password = await bcrypt.hash(user.phoneNumber, 10);
    user.email = user.phoneNumber + "@gmail.com";
    const role = await this.#roleRepository.getRole(EnumRole.USER);
    user.identifyCard = user.phoneNumber;

    if (!role)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.ROLE_NOT_EXISTED,
      };

    user.role = role;
    user.createdAt = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    await this.#userRepository.saveUser(user);
    await this.#rewardPointRepository.saveRewardPoint({ user });

    return { message: ErrorCode.REGISTED };
  }

  async forgotPass({ phoneNumber, password }) {
    const user = await this.#userRepository.findByPhoneNumber(phoneNumber);

    if (!user || user.role.name === EnumRole.ADMIN)
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.USER_NOT_EXISTED,
      };

    user.password = await bcrypt.hash(password, 10);
    await this.#userRepository.saveUser(user);
    return { message: ErrorCode.PASS_UPDATED };
  }

  async updatePass(phoneNumber, { password, newPass }) {
    const user = await this.#userRepository.findByPhoneNumber(phoneNumber);
    if (!user || user.role.name === EnumRole.ADMIN)
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.USER_NOT_EXISTED,
      };

    const authenticated = await bcrypt.compare(password, user.password);
    if (!authenticated)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.UNAUTHENTICATED,
      };

    user.password = await bcrypt.hash(newPass, 10);

    await this.#userRepository.saveUser(user);
    return { message: ErrorCode.PASS_UPDATED };
  }

  async updatePassAdmin({ phoneNumber, password, newPass }) {
    const user = await this.#userRepository.findByPhoneNumber(phoneNumber);
    if (!user || user.role.name === EnumRole.USER)
      throw {
        status: StatusCode.HTTP_403_FORBIDDEN,
        message: ErrorCode.PRIVACY,
      };

    const authenticated = await bcrypt.compare(password, user.password);
    if (!authenticated)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.UNAUTHENTICATED,
      };

    user.password = await bcrypt.hash(newPass, 10);

    await this.#userRepository.saveUser(user);
    return { message: ErrorCode.PASS_UPDATED };
  }

  async updateInfo(phoneNumber, param, role) {
    if (role == EnumRole.ADMIN) {
      phoneNumber = param.phoneNumber;
    }

    const user = await this.#userRepository.findByPhoneNumber(phoneNumber);
    if (!user)
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.USER_NOT_EXISTED,
      };
    const username = param.username;
    const email = param.email;
    const identifyCard = param.identifyCard;
    Object.assign(user, { username, email, identifyCard });
    await this.#userRepository.saveUser(user);

    return { message: ErrorCode.UPDATE_INFO };
  }

  async updateStatus({ phoneNumber }) {
    const user = await this.#userRepository.findByPhoneNumber(phoneNumber);
    if (!user)
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.USER_NOT_EXISTED,
      };

    if (user.role.name === EnumRole.ADMIN)
      throw {
        status: StatusCode.HTTP_403_FORBIDDEN,
        message: ErrorCode.INSUFFICIENT_PERMISSION,
      };
    const status =
      user.status === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE;
    Object.assign(user, { status });
    await this.#userRepository.saveUser(user);

    return { message: ErrorCode.STATUS_UPDATED };
  }

  async getAllUsers() {
    const users = await this.#userRepository.getAllUsers();
    return { message: ErrorCode.SUCCESS, data: users };
  }

  async getCount() {
    const count = await this.#userRepository.getCount();
    return { message: ErrorCode.SUCCESS, data: count };
  }

  async getCountByMonth({ year }) {
    const count = await this.#userRepository.getUserCountByMonthAndRole(
      Number(year)
    );
    return { message: ErrorCode.SUCCESS, data: count };
  }
}

module.exports = UserService;
