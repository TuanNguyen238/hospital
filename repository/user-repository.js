const User = require("../models/user.js");
const AppDataSource = require("../utils/configs.js");
const Role = require("../models/role.js");
const EnumRole = require("../enum/enum-role.js");

class UserRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(User);
  }

  async getUserById(id) {
    return await this.#repository.findOneBy({ id: id });
  }

  async createUser(user) {
    await this.#repository.save(user);
    return user.id;
  }

  async getAllUsers() {
    return await this.#repository.find({ relations: ["roles"] });
  }

  async existsByUsername(username) {
    return (
      (await this.#repository.count({
        where: { username: username },
      })) > 0
    );
  }
}

module.exports = UserRepository;
