const AppDataSource = require("../utils/configs.js");
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
}

module.exports = RelativeRepository;
