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
      relations: ["roles"],
    });
  }

  async createUser(user) {
    await this.#repository.save(user);
    return user.id;
  }

  async getAllUsers() {
    return await this.#repository.find({ relations: ["roles"] });
  }

  async findByPhoneNumber(phoneNumber) {
    return await this.#repository.findOne({
      where: { phoneNumber: phoneNumber },
      relations: ["roles"],
    });
  }
}

module.exports = UserRepository;
