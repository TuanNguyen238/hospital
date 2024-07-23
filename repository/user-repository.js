const User = require("../models/user.js");
const AppDataSource = require("../utils/configs.js");
const Role = require("../models/role.js");
const EnumRole = require("../enum/enum-role.js");

class UserRepository {
  constructor() {
    this.repository = AppDataSource.getRepository(User);
    this.roleRepository = AppDataSource.getRepository(Role);
  }

  async getUserById(id) {
    return await this.repository.findOneBy({ id: id });
  }

  async createUser(user) {
    const userRole = await this.roleRepository.findOneBy({
      name: EnumRole.USER,
    });
    if (!userRole) {
      throw new Error("USER role not found in the database");
    }
    user.roles = [userRole];
    await this.repository.save(user);
    return user.roles;
  }

  async getAllUsers() {
    return await this.repository.find();
  }
}

module.exports = UserRepository;
