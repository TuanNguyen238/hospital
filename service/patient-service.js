const ErrorCode = require("../enum/error-code.js");
const PatientRepository = require("../repository/patient-repository.js");
const UserRepository = require("../repository/user-repository.js");
const { formatDate } = require("../utils/const.js");
const RecordRepository = require("../repository/record-repository.js");
const StatusCode = require("../enum/status-code.js");
const { messaging } = require("firebase-admin");

class PatientService {
  #patientRepository;
  #userRepository;
  #recordRepository;

  constructor() {
    this.#patientRepository = new PatientRepository();
    this.#userRepository = new UserRepository();
    this.#recordRepository = new RecordRepository();
  }

  async createPatient(phoneNumber, obj) {
    const user = await this.#userRepository.findByPhoneNumber(phoneNumber);
    if (!user) {
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.USER_NOT_EXISTED,
      };
    }

    const savedPatient =
      await this.#patientRepository.createPatientWithTransaction(obj, user);

    return { message: ErrorCode.PATIENT_CREATED, data: savedPatient };
  }

  async updateInfo(phoneNumber, obj) {
    const patient =
      await this.#patientRepository.getPatientByPatientCodeAndPhoneNumber(
        obj.patientCode,
        phoneNumber
      );

    if (!patient)
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.PATIENT_NOT_EXISTED,
      };

    const savedPatient =
      await this.#patientRepository.updatePatientWithTransaction(patient, obj);

    return { message: ErrorCode.PATIENT_UPDATED, data: savedPatient };
  }

  async getPatientsByPhoneNumber(phoneNumber) {
    const patients = await this.#patientRepository.getPatientsByPhoneNumber(
      phoneNumber
    );

    const patientData = await Promise.all(
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

    return {
      message: ErrorCode.SUCCESS,
      data: patientData,
    };
  }

  async getPatientByPatientCode(phoneNumber, patientCode) {
    if (!patientCode)
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.PATIENT_NOT_EXISTED,
      };
    const patient =
      await this.#patientRepository.getPatientByPatientCodeAndPhoneNumber(
        patientCode,
        phoneNumber
      );

    if (!patient)
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.PATIENT_NOT_EXISTED,
      };

    return {
      message: ErrorCode.SUCCESS,
      data: patient,
    };
  }
}
module.exports = PatientService;
