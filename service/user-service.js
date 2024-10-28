const EnumRole = require("../enum/enum-role.js");
const ErrorCode = require("../enum/error-code.js");
const RoleRepository = require("../repository/role-repository.js");
const UserRepository = require("../repository/user-repository.js");
const bcrypt = require("bcrypt");

class UserService {
  #userRepository;
  #roleRepository;

  constructor() {
    this.#userRepository = new UserRepository();
    this.#roleRepository = new RoleRepository();
  }

  async getUserById(id) {
    const user = await this.#userRepository.getUserById(id);
    if (!user) throw new Error(ErrorCode.USER_NOT_EXISTED);
    return { message: ErrorCode.SUCCESS, data: user };
  }

  async createUser(user) {
    const checkUser = await this.#userRepository.findByPhoneNumber(
      user.phoneNumber
    );
    if (checkUser) throw new Error(ErrorCode.USER_ALREADY_EXISTS);

    user.password = await bcrypt.hash(user.password, 10);
    const userRole = await this.#roleRepository.getRole(user.role);
    if (!userRole) throw new Error(ErrorCode.ROLE_NOT_EXISTED);

    user.role = userRole;
    await this.#userRepository.saveUser(user);
    return { message: ErrorCode.REGISTED };
  }

  async forgotPass({ phoneNumber, password }) {
    const user = await this.#userRepository.findByPhoneNumber(phoneNumber);

    if (!user || user.role.name !== EnumRole.USER)
      throw new Error(ErrorCode.USER_NOT_EXISTED);

    user.password = await bcrypt.hash(password, 10);
    await this.#userRepository.saveUser(user);
    return { message: ErrorCode.PASS_UPDATED };
  }

  async updatePass(phoneNumber, { password, newPass }) {
    const user = await this.#userRepository.findByPhoneNumber(phoneNumber);
    if (!user || user.role.name === EnumRole.ADMIN)
      throw new Error(ErrorCode.USER_NOT_EXISTED);

    const authenticated = await bcrypt.compare(password, user.password);
    if (!authenticated) throw new Error(ErrorCode.UNAUTHENTICATED);

    user.password = await bcrypt.hash(newPass, 10);

    await this.#userRepository.saveUser(user);
    return { message: ErrorCode.PASS_UPDATED };
  }

  async updatePassAdmin({ phoneNumber, newPass }) {
    const user = await this.#userRepository.findByPhoneNumber(phoneNumber);
    if (!user || user.role.name === EnumRole.USER)
      throw new Error(ErrorCode.PRIVACY);

    user.password = await bcrypt.hash(newPass, 10);

    await this.#userRepository.saveUser(user);
    return { message: ErrorCode.PASS_UPDATED };
  }

  async updateInfo(phoneNumber, { username, email, identifyCard }) {
    const user = await this.#userRepository.findByPhoneNumber(phoneNumber);
    if (!user || user.role.name !== EnumRole.USER)
      throw new Error(ErrorCode.USER_NOT_EXISTED);

    Object.assign(user, { username, email, identifyCard });
    await this.#userRepository.saveUser(user);

    return { message: ErrorCode.UPDATE_INFO };
  }

  async getAllUsers() {
    const users = await this.#userRepository.getAllUsers();
    return { message: ErrorCode.SUCCESS, data: users };
  }

  async getCountUser() {
    const count = await this.#userRepository.getCount(EnumRole.USER);
    return { message: ErrorCode.SUCCESS, data: count };
  }

  async getCountDoctor() {
    const count = await this.#userRepository.getCount(EnumRole.DOCTOR);
    return { message: ErrorCode.SUCCESS, data: count };
  }
}

module.exports = UserService;
