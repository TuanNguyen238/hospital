const ExamRoomRepository = require("../repository/examRoom-repository");
const PatientRepository = require("../repository/patient-repository");
const RecordRepository = require("../repository/record-repository");

class RecordService {
  #recordRepository;
  #examRoomRepository;
  #patientRepository;

  constructor() {
    this.#recordRepository = new RecordRepository();
    this.#examRoomRepository = new ExamRoomRepository();
    this.#patientRepository = new PatientRepository();
  }

  async bookRecord(patientCode, examDate, examTime) {
    const patient = await this.#patientRepository.getPatientByPatientCode(
      patientCode
    );

    return { patient: patient };
  }
}

module.exports = RecordService;
