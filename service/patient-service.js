const ErrorCode = require("../enum/error-code.js");
const PatientRepository = require("../repository/patient-repository.js");
const UserRepository = require("../repository/user-repository.js");
const { formatDate } = require("../utils/const.js");
const StatusCode = require("../enum/status-code.js");
const Status = require("../enum/status.js");

class PatientService {
  #patientRepository;
  #userRepository;
  constructor() {
    this.#patientRepository = new PatientRepository();
    this.#userRepository = new UserRepository();
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
    const patientData = await this.#patientRepository.getPatientsByPhoneNumber(
      phoneNumber
    );

    const formattedData = patientData.map((patient) => ({
      ...patient,
      dateOfBirth: formatDate(patient.dateOfBirth),
    }));

    return {
      message: ErrorCode.SUCCESS,
      data: formattedData,
    };
  }

  async deletePatientById(id) {
    const patientData = await this.#patientRepository.getPatientById(id);
    if (!patientData)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.PATIENT_NOT_EXISTED,
      };

    if (patientData.status === Status.ACTIVE)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.PATIENT_NOT_AVAILABLE,
      };

    await this.#patientRepository.deletePatientById(id);

    return {
      message: ErrorCode.PATIENT_DELETED,
    };
  }
}
module.exports = PatientService;
