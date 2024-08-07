const EnumRole = require("../enum/enum-role.js");
const ErrorCode = require("../enum/error-code.js");
const RelativeRepository = require("../repository/relative-repository.js");
const PatientRepository = require("../repository/patient-repository.js");
const UserRepository = require("../repository/user-repository.js");

class PatientService {
  #patientRepository;
  #relativeRepository;
  #userRepository;

  constructor() {
    this.#patientRepository = new PatientRepository();
    this.#relativeRepository = new RelativeRepository();
    this.#userRepository = new UserRepository();
  }

  async createPatient(obj) {
    const relative = {
      fullName: obj.fullNameRLT,
      phoneNumber: obj.phoneNumberRLT,
      address: obj.addressRLT,
      relations: obj.relations,
    };
    const savedRelative = await this.#relativeRepository.saveRelative(relative);
    const user = await this.#userRepository.findByPhoneNumber(
      obj.phoneNumberUser
    );
    console.log(savedRelative);
    console.log(user);
    const code = await this.#patientRepository.generatePatientCode();
    const patient = {
      fullName: obj.fullName,
      phoneNumber: obj.phoneNumber,
      address: obj.address,
      identifyCard: obj.identifyCard,
      dateOfBirth: obj.dateOfBirth,
      patientCode: code,
      relative: savedRelative,
      user: user,
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
