const EnumRole = require("../enum/enum-role.js");
const User = require("../models/user.js");
const AppDataSource = require("../utils/configs.js");

class UserRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(User);
  }

  async getUserById(id) {
    return await this.#repository.findOne({
      where: { id: id },
      relations: ["role"],
    });
  }

  async saveUser(user) {
    await this.#repository.save(user);
  }

  async getAllUsers() {
    return await this.#repository.find({ relations: ["role"] });
  }

  async findByPhoneNumber(phoneNumber) {
    return await this.#repository.findOne({
      where: { phoneNumber: phoneNumber },
      relations: ["role"],
    });
  }

  async getCount(role) {
    return await this.#repository.count({
      where: { role: { name: role } },
    });
  }
}

module.exports = UserRepository;
