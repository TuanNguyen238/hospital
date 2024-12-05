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

  async updatePatientWithTransaction(patient, obj) {
    return await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        const relativeRepository = AppDataSource.getRepository(Relative);
        const existingRelative = await relativeRepository.findOne({
          where: { id: patient.relative.id },
        });

        existingRelative.fullName =
          obj.fullNameRLT || existingRelative.fullName;
        existingRelative.phoneNumber =
          obj.phoneNumberRLT || existingRelative.phoneNumber;
        existingRelative.address = obj.addressRLT || existingRelative.address;
        existingRelative.relations =
          obj.relations || existingRelative.relations;

        const updatedRelative = await transactionalEntityManager.save(
          Relative,
          existingRelative
        );

        patient.fullName = obj.fullName || patient.fullName;
        patient.phoneNumber = obj.phoneNumberPatient || patient.phoneNumber;
        patient.address = obj.address || patient.address;
        patient.identifyCard = obj.identifyCard || patient.identifyCard;
        patient.dateOfBirth = obj.dateOfBirth || patient.dateOfBirth;
        patient.gender = obj.gender || patient.gender;
        patient.relative = updatedRelative;

        const updatedPatient = await transactionalEntityManager.save(
          Patient,
          patient
        );

        return updatedPatient;
      }
    );
  }

  async getPatientsByPhoneNumber(phoneNumber) {
    return await this.#repository.find({
      where: { user: { phoneNumber: phoneNumber } },
      relations: ["relative"],
    });
  }

  async getPatientByPatientCodeAndPhoneNumber(patientCode, phoneNumber) {
    return await this.#repository.findOne({
      where: {
        patientCode: patientCode,
        user: { phoneNumber: phoneNumber },
      },
      relations: ["relative"],
    });
  }

  async savePatient(patient) {
    await this.#repository.save(patient);
  }

  async deletePatientById(id) {
    await this.#repository.delete({ id: id });
  }

  async getPatientById(id) {
    return await this.#repository.findOne({ where: { id } });
  }
}

module.exports = PatientRepository;
