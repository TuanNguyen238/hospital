const MedicalRecord = require("../models/medical-record");
const AppDataSource = require("../utils/configs");

class RecordRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(MedicalRecord);
  }

  async getCountById(id) {
    return await this.#repository.count({
      where: { patient: { id: id } },
    });
  }
}

module.exports = RecordRepository;
