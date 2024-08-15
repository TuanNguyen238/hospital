const RefreshToken = require("../models/refresh-token.js");
const AppDataSource = require("../utils/configs.js");

class RefreshTokenRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(RefreshToken);
  }

  async saveRefreshToken(refreshToken) {
    await this.#repository.save(refreshToken);
  }
}

module.exports = RefreshTokenRepository;
