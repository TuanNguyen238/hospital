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

  async bookRecord(
    phoneNumber,
    { patientCode, examDate, examTime, reasonForVisit }
  ) {
    const patient =
      await this.#patientRepository.getPatientByPatientCodeAndPhoneNumber(
        patientCode,
        phoneNumber
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

    if (rooms.length == 0)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.EXAMROOM_NOT_EXISTED,
      };

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
      paid: true,
    });

    randomRoom.currentPatients++;
    this.#examRoomRepository.saveExamRoom(randomRoom);

    return { message: ErrorCode.RECORD_BOOKED };
  }

  async getRecordByPhoneNumber(phoneNumber) {
    const patients = await this.#patientRepository.getPatientsByPhoneNumber(
      phoneNumber
    );

    const patientCodes = patients.map((patient) => patient.patientCode);

    const records = await this.#recordRepository.findRecordsByPatientCodes(
      patientCodes
    );

    const patientRecords = patients
      .map((patient) => {
        const patientRecordList = records.filter(
          (record) => record.patient.patientCode === patient.patientCode
        );

        if (patientRecordList.length > 0) {
          const sanitizedRecords = patientRecordList.map((record) => {
            const { patient, ...rest } = record;
            return rest;
          });

          return {
            patient,
            records: sanitizedRecords,
          };
        }
        return null;
      })
      .filter(Boolean);

    return { message: ErrorCode.SUCCESS, data: patientRecords };
  }
}

module.exports = RecordService;
