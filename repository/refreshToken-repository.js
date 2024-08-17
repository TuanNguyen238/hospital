const RefreshToken = require("../models/refresh-token.js");
const AppDataSource = require("../utils/configs.js");

class RefreshTokenRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(RefreshToken);
  }

  async saveRefreshToken(refreshToken) {
    const existingToken = await this.#repository.findOne({
      where: { user: refreshToken.user },
    });

    if (existingToken) {
      existingToken.token = refreshToken.token;
      await this.#repository.save(existingToken);
    } else await this.#repository.save(refreshToken);
  }

  async findRefreshToken(phoneNumber, refreshToken) {
    return await this.#repository.findOneBy({
      user: { phoneNumber: phoneNumber },
      token: refreshToken,
    });
  }
}

module.exports = RefreshTokenRepository;
