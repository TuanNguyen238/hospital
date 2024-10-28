const ErrorCode = require("../enum/error-code");
const StatusCode = require("../enum/status-code");
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

  async bookRecord({ patientCode, examDate, examTime, reasonForVisit }) {
    const patient = await this.#patientRepository.getPatientByPatientCode(
      patientCode
    );

    if (!patient) {
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.PATIENT_NOT_EXISTED,
      };
    }

    const rooms = await this.#examRoomRepository.getExamRoomsByDateTime(
      examDate,
      examTime
    );

    const availableRooms = rooms.filter(
      (room) => room.currentPatients < room.maxPatients
    );

    if (availableRooms.length == 0)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.EXAMROOM_NOT_AVAILABLE,
      };

    const randomRoom =
      availableRooms[Math.floor(Math.random() * availableRooms.length)];

    await this.#recordRepository.saveRecord({
      patient: patient,
      examRoom: randomRoom,
      reasonForVisit: reasonForVisit,
    });

    randomRoom.currentPatients++;
    this.#examRoomRepository.saveExamRoom(randomRoom);

    return { message: ErrorCode.RECORD_BOOKED };
  }
}

module.exports = RecordService;
