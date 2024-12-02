const Role = require("../models/role.js");
const AppDataSource = require("../utils/database.js");

class RoleRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(Role);
  }

  async getRole(name) {
    return await this.#repository.findOneBy({ name: name });
  }

  async getAllRoles() {
    return await this.#repository.find();
  }

  async createRole(role) {
    await this.#repository.save(role);
  }

  createEntity(name, description) {
    return this.#repository.create({
      name: name,
      description: description,
    });
  }
}

module.exports = RoleRepository;
