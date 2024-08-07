const EnumRole = require("../enum/enum-role.js");
const ErrorCode = require("../enum/error-code.js");
const RelativeRepository = require("../repository/relative-repository.js");
const PatientRepository = require("../repository/patient-repository.js");

class PatientService {
  #patientRepository;
  #relativeRepository;

  constructor() {
    this.#patientRepository = new PatientRepository();
    this.#relativeRepository = new RelativeRepository();
  }

  async createPatient(obj) {
    const relative = {
      fullName: obj.fullNameRLT,
      phoneNumber: obj.phoneNumberRLT,
      address: obj.addressRLT,
      relations: obj.relations,
    };
    const id = await this.#relativeRepository.saveRelative(relative);
    console.log(id);
    const code = await this.#patientRepository.generatePatientCode();
    const patient = {
      fullName: obj.fullName,
      phoneNumber: obj.phoneNumber,
      address: obj.address,
      identifyCard: obj.identifyCard,
      dateOfBirth: obj.dateOfBirth,
      userId: obj.userId,
      relativesId: obj.relativesId,
      userId: id,
      patientCode: code,
    };
    console.log(patient);
    await this.#patientRepository.savePatient(patient);
    return {
      message: ErrorCode.PATIENT_CREATED,
    };
  }

  async getPatientById(id) {
    return this.#patientRepository.getPatientById(id);
  }
}
module.exports = PatientService;
