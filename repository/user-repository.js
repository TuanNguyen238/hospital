const { Repository } = require("typeorm");
const User = require("../models/user.js");
const AppDataSource = require("../utils/configs.js");
const Role = require("../models/role.js");
const EnumRole = require("../enum/enum-role.js");

class UserRepository {
  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async getUserById(id) {
    return await this.repository.findOneBy({ id: id });
  }

  async createUser(user) {
    const role = AppDataSource.getRepository(Role).findOneBy({
      name: EnumRole.USER,
    });
    user.roles = [role];
    await this.repository.save(user);
    return user.id;
  }

  async getAllUsers() {
    return await this.repository.find();
  }
}

module.exports = UserRepository;
