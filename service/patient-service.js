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
    const relative = await this.#relativeRepository.createEntity(obj);
    const id = await this.#relativeRepository.saveRelative(relative);
    const code = await this.#patientRepository.generatePatientCode();
    const patient = {
      fullName: obj.fullName,
      phoneNumber: obj.phoneNumber,
      address: obj.address,
      identifyCard: obj.identifyCard,
      dateOfBirth: obj.dateOfBirth,
    };
    patient.relativesId = id;
    patient.patientCode = code;
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
