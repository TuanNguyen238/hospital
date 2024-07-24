const EnumRole = require("../enum/enum-role.js");
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
    return this.#userRepository.getUserById(id);
  }

  async createUser(user) {
    if (await this.#userRepository.existsByUsername(user.username))
      throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    const userRole = await this.#roleRepository.getRole(EnumRole.USER);
    if (!userRole) throw new Error("USER role not found in the database");
    user.roles = [userRole];

    return this.#userRepository.createUser(user);
  }

  async getAllUsers() {
    return this.#userRepository.getAllUsers();
  }
}

module.exports = UserService;
