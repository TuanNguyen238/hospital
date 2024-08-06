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
}

module.exports = PatientRepository;
