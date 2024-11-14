const Token = require("../models/token.js");
const AppDataSource = require("../utils/database.js");

class TokenRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(Token);
  }

  async saveToken(token) {
    await this.#repository.save(token);
  }

  async findByUser(user) {
    return await this.#repository.findOneBy({
      user: user,
    });
  }

  async findToken(user, token) {
    return await this.#repository.findOneBy({
      user: user,
      token: token,
    });
  }

  async deleteByToken(token) {
    await this.#repository.delete({
      token: token,
    });
  }
}

module.exports = TokenRepository;
