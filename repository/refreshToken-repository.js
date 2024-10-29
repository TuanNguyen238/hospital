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

  async findByUser(user) {
    return await this.#repository.findOneBy({
      user: user,
    });
  }

  async findRefreshToken(user, refreshToken) {
    return await this.#repository.findOneBy({
      user: user,
      token: refreshToken,
    });
  }

  async deleteByToken(token) {
    await this.#repository.delete({
      token: token,
    });
  }
}

module.exports = RefreshTokenRepository;
