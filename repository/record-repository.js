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

  async generateRecordCode() {
    const lastRecord = await this.#repository
      .createQueryBuilder("medicalRecords")
      .orderBy("medicalRecords.recordCode", "DESC")
      .getOne();

    if (!lastRecord) {
      return "R000000001";
    }

    const lastCode = parseInt(lastRecord.recordCode.replace("R", ""), 10);
    const newCode = lastCode + 1;
    return `R${newCode.toString().padStart(9, "0")}`;
  }
}

module.exports = RecordRepository;
