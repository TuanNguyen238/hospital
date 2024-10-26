const ErrorCode = require("../enum/error-code.js");
const RelativeRepository = require("../repository/relative-repository.js");
const PatientRepository = require("../repository/patient-repository.js");
const UserRepository = require("../repository/user-repository.js");
const { formatDate } = require("../utils/const.js");
const RecordRepository = require("../repository/record-repository.js");

class PatientService {
  #patientRepository;
  #relativeRepository;
  #userRepository;
  #recordRepository;

  constructor() {
    this.#patientRepository = new PatientRepository();
    this.#relativeRepository = new RelativeRepository();
    this.#userRepository = new UserRepository();
    this.#recordRepository = new RecordRepository();
  }

  async createPatient(phoneNumber, obj) {
    let savedRelative = null;
    try {
      const relative = await this.#relativeRepository.createEntity(obj);
      savedRelative = await this.#relativeRepository.saveRelative(relative);
      const user = await this.#userRepository.findByPhoneNumber(phoneNumber);
      const code = await this.#patientRepository.generatePatientCode();
      const patient = await this.#patientRepository.createEntity(
        obj,
        code,
        savedRelative,
        user
      );
      await this.#patientRepository.savePatient(patient);
      return {
        message: ErrorCode.PATIENT_CREATED,
      };
    } catch (err) {
      if (savedRelative) {
        try {
          await this.#relativeRepository.delete(savedRelative.id);
        } catch (deleteError) {
          console.error(`Error deleting relative: ${deleteError}`);
        }
      }
      throw new Error(err);
    }
  }

  async getPatientsByPhoneNumber(phoneNumber) {
    const patients = await this.#patientRepository.getPatientsByPhoneNumber(
      phoneNumber
    );

    return await Promise.all(
      patients.map(async (patient) => {
        const recordCount = await this.#recordRepository.getCountById(
          patient.id
        );
        return {
          ...patient,
          dateOfBirth: formatDate(patient.dateOfBirth),
          recordCount: recordCount,
        };
      })
    );
  }
}
module.exports = PatientService;
