const AppDataSource = require("../utils/database.js");
const Patient = require("../models/patient.js");
const Relative = require("../models/relative.js");

class PatientRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(Patient);
  }

  async generatePatientCode() {
    const lastPatient = await this.#repository
      .createQueryBuilder("patients")
      .orderBy("patients.patientCode", "DESC")
      .getOne();

    if (!lastPatient) {
      return "BN00000001";
    }

    const lastCode = parseInt(lastPatient.patientCode.replace("BN", ""), 10);
    const newCode = lastCode + 1;
    return `BN${newCode.toString().padStart(8, "0")}`;
  }

  async createPatientWithTransaction(obj, user) {
    return await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        const relativeRepository = AppDataSource.getRepository(Relative);
        const relative = relativeRepository.create({
          fullName: obj.fullNameRLT,
          phoneNumber: obj.phoneNumberRLT,
          address: obj.addressRLT,
          relations: obj.relations,
        });
        const savedRelative = await transactionalEntityManager.save(
          Relative,
          relative
        );

        const code = await this.generatePatientCode();
        const patient = this.#repository.create({
          fullName: obj.fullName,
          phoneNumber: obj.phoneNumberPatient,
          address: obj.address,
          identifyCard: obj.identifyCard,
          dateOfBirth: obj.dateOfBirth,
          gender: obj.gender,
          patientCode: code,
          relative: savedRelative,
          user: user,
        });
        const savedPatient = await transactionalEntityManager.save(
          Patient,
          patient
        );

        return savedPatient;
      }
    );
  }

  async getPatientsByPhoneNumber(phoneNumber) {
    return await this.#repository.findBy({
      user: { phoneNumber: phoneNumber },
    });
  }

  async getPatientByPatientCode(patientCode) {
    return await this.#repository.findOneBy({
      patientCode: patientCode,
    });
  }
}

module.exports = PatientRepository;
