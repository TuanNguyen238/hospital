const AppDataSource = require("../utils/configs.js");
const Relative = require("../models/relative.js");

class RelativeRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(Relative);
  }

  async saveRelative(relative) {
    const new_relative = await this.#repository.save(relative);
    return new_relative.id;
  }

  async createEntity(obj) {
    return await this.#repository.create({
      fullName: obj.fullNameRLT,
      phoneNumber: obj.phoneNumberRLT,
      address: obj.addressRLT,
    });
  }
}

module.exports = RelativeRepository;
