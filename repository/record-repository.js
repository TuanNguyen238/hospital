const MedicalRecord = require("../models/medical-record");
const AppDataSource = require("../utils/database");

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

  async saveRecord(record) {
    await this.#repository.save(record);
  }
}

module.exports = RecordRepository;
