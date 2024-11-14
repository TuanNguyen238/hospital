const AppDataSource = require("../utils/database.js");
const Relative = require("../models/relative.js");

class RelativeRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(Relative);
  }

  async saveRelative(relative) {
    return await this.#repository.save(relative);
  }

  async createEntity(obj) {
    return await this.#repository.create({
      fullName: obj.fullNameRLT,
      phoneNumber: obj.phoneNumberRLT,
      address: obj.addressRLT,
      relations: obj.relations,
    });
  }

  async delete(id) {
    await this.#repository.delete({ id: id });
  }
}

module.exports = RelativeRepository;
