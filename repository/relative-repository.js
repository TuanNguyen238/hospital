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
}

module.exports = RelativeRepository;
