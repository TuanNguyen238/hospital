const AppDataSource = require("../utils/configs.js");
const Patient = require("../models/patient.js");

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

  async savePatient(patient) {
    await this.#repository.save(patient);
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

  async createEntity(obj, code, savedRelative, user) {
    return this.#repository.create({
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
  }
}

module.exports = PatientRepository;
