const RewardPoint = require("../models/reward-point.js");
const AppDataSource = require("../utils/configs.js");

class RewardPointRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(RewardPoint);
  }

  async saveRewardPoint(rewardPoint) {
    await this.#repository.save(rewardPoint);
  }
  async getRewardPointByPhoneNumber(phoneNumber) {
    return await this.#repository.findOne({
      where: { user: { phoneNumber: phoneNumber } },
      relations: ["user"],
    });
  }
}

module.exports = RewardPointRepository;
