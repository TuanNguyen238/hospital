const Role = require("../models/role");
const AppDataSource = require("../utils/configs");

class RoleRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(Role);
  }

  async getRole(name) {
    return await this.#repository.findOneBy({ name: name });
  }
}

module.exports = RoleRepository;
