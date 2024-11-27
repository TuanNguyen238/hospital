const { In } = require("typeorm");
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

  async findRecordsByPatientCodes(patientCodes) {
    return await this.#repository.find({
      where: { patient: { patientCode: In(patientCodes) } },
      relations: ["patient", "examRoom"],
    });
  }
}

module.exports = RecordRepository;
