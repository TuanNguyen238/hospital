const ErrorCode = require("../enum/error-code");
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

  async bookRecord({ patientCode, examDate, examTime }) {
    const patient = await this.#patientRepository.getPatientByPatientCode(
      patientCode
    );

    const rooms = await this.#examRoomRepository.getExamRoomsByDateTime(
      examDate,
      examTime
    );

    const availableRooms = rooms.filter(
      (room) => room.currentPatients < room.maxPatients
    );

    if (availableRooms.length == 0)
      throw new Error(ErrorCode.EXAMROOM_NOT_AVAILABLE);

    const randomRoom =
      availableRooms[Math.floor(Math.random() * availableRooms.length)];

    await this.#recordRepository.saveRecord({
      patient: patient,
      examRoom: randomRoom,
    });

    randomRoom.currentPatients++;
    this.#examRoomRepository.saveExamRoom(randomRoom);

    return { patient: patient, room: randomRoom, rooms: availableRooms };
  }
}

module.exports = RecordService;
