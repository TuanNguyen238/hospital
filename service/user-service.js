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
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    const userRole = await this.#roleRepository.getRole(EnumRole.USER);
    if (!userRole) throw new Error(ErrorCode.ROLE_NOT_EXISTED);
    user.roles = [userRole];

    return this.#userRepository.createUser(user);
  }

  async getAllUsers() {
    return this.#userRepository.getAllUsers();
  }
}

module.exports = UserService;
