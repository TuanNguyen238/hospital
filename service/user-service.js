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
    const user = this.#userRepository.getUserById(id);
    if (!user) throw new Error(ErrorCode.USER_NOT_EXISTED);
    return user;
  }

  async createUser(user) {
    const checkUser = await this.#userRepository.findByPhoneNumber(
      user.phoneNumber
    );

    if (checkUser) throw new Error(ErrorCode.USER_ALREADY_EXISTS);

    user.password = await bcrypt.hash(user.password, 10);

    const userRole = await this.#roleRepository.getRole(EnumRole.USER);
    if (!userRole) throw new Error(ErrorCode.ROLE_NOT_EXISTED);
    user.roles = [userRole];

    await this.#userRepository.saveUser(user);

    return {
      message: ErrorCode.REGISTED,
    };
  }

  async forgotPass(obj) {
    const user = await this.#userRepository.findByPhoneNumber(obj.phoneNumber);

    if (!user) throw new Error(ErrorCode.USER_NOT_EXISTED);
    const isAdmin = user.roles.some((role) => role.name === EnumRole.ADMIN);
    if (isAdmin) throw new Error(ErrorCode.USER_NOT_EXISTED);

    user.password = await bcrypt.hash(obj.password, 10);

    await this.#userRepository.saveUser(user);

    return {
      message: ErrorCode.PASS_UPDATED,
    };
  }

  async updatePass(obj) {
    const user = await this.#userRepository.findByPhoneNumber(obj.phoneNumber);

    if (!user) throw new Error(ErrorCode.USER_NOT_EXISTED);
    const isAdmin = user.roles.some((role) => role.name === EnumRole.ADMIN);
    if (isAdmin) throw new Error(ErrorCode.USER_NOT_EXISTED);

    const authenticated = await bcrypt.compare(obj.password, user.password);

    if (!authenticated) throw new Error(ErrorCode.UNAUTHENTICATED);

    const hashedPassword = await bcrypt.hash(obj.newPass, 10);
    user.password = hashedPassword;

    await this.#userRepository.saveUser(user);

    return {
      message: ErrorCode.PASS_UPDATED,
    };
  }

  async updateInfo(obj) {
    const user = await this.#userRepository.findByPhoneNumber(obj.phoneNumber);

    if (!user) throw new Error(ErrorCode.USER_NOT_EXISTED);
    const isAdmin = user.roles.some((role) => role.name === EnumRole.ADMIN);
    if (isAdmin) throw new Error(ErrorCode.USER_NOT_EXISTED);

    user.username = obj.username;
    user.email = obj.email;
    user.identifyCard = obj.identifyCard;

    await this.#userRepository.saveUser(user);

    return {
      message: ErrorCode.UPDATE_INFO,
    };
  }

  async getAllUsers() {
    return this.#userRepository.getAllUsers();
  }
}

module.exports = UserService;
