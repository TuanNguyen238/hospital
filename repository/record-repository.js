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

  async getMedicalRecordsByPatientCode(patientCode) {
    try {
      const medicalRecords = await this.#repository
        .createQueryBuilder("medicalRecord")
        .leftJoinAndSelect("medicalRecord.patient", "patient")
        .leftJoinAndSelect("medicalRecord.prescription", "prescription")
        .leftJoinAndSelect("medicalRecord.detailedRecord", "detailedRecord")
        .leftJoinAndSelect("medicalRecord.examRoom", "examRoom")
        .leftJoinAndSelect("prescription.dosages", "dosages")
        .leftJoinAndSelect("dosages.medicine", "medicine")
        .where("patient.patientCode = :patientCode", { patientCode })
        .getMany();

      return medicalRecords;
    } catch (error) {
      console.error("Error fetching medical records:", error);
      throw error;
    }
  }

  async getRecordsByUserPhoneNumber(phoneNumber) {
    try {
      const records = await this.#repository
        .createQueryBuilder("medicalRecord")
        .leftJoinAndSelect("medicalRecord.patient", "patient")
        .leftJoinAndSelect("medicalRecord.prescription", "prescription")
        .leftJoinAndSelect("medicalRecord.detailedRecord", "detailedRecord")
        .leftJoinAndSelect("medicalRecord.examRoom", "examRoom")
        .leftJoinAndSelect("prescription.dosages", "dosages")
        .leftJoinAndSelect("dosages.medicine", "medicine")
        .leftJoin("patient.user", "user")
        .where("user.phoneNumber = :phoneNumber", { phoneNumber })
        .getMany();

      return records;
    } catch (error) {
      console.error("Error fetching records by user phone number:", error);
      throw error;
    }
  }
}

module.exports = RecordRepository;
