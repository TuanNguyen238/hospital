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

    const code = await this.#recordRepository.generateRecordCode();

    await this.#recordRepository.saveRecord({
      patient: patient,
      examRoom: randomRoom,
      reasonForVisit: reasonForVisit,
      paid: true,
      recordCode: code,
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

    const processedRecords = await this.processExamStatus(records);

    const dueRecords = processedRecords
      .filter((record) => record.status === "Đã tới hẹn")
      .sort((a, b) => {
        const timeA = new Date(`${a.examRoom.examDate}T${a.examRoom.examTime}`);
        const timeB = new Date(`${b.examRoom.examDate}T${b.examRoom.examTime}`);
        return timeB - timeA;
      });

    const upcomingRecords = processedRecords
      .filter((record) => record.status === "Chưa tới hẹn")
      .sort((a, b) => {
        const timeA = new Date(`${a.examRoom.examDate}T${a.examRoom.examTime}`);
        const timeB = new Date(`${b.examRoom.examDate}T${b.examRoom.examTime}`);
        return timeA - timeB;
      });

    const overdueRecords = processedRecords
      .filter((record) => record.status === "Đã trễ hẹn")
      .sort((a, b) => {
        const timeA = new Date(`${a.examRoom.examDate}T${a.examRoom.examTime}`);
        const timeB = new Date(`${b.examRoom.examDate}T${b.examRoom.examTime}`);
        return timeB - timeA;
      });

    return {
      message: ErrorCode.SUCCESS,
      data: [...dueRecords, ...upcomingRecords, ...overdueRecords],
    };
  }

  async processExamStatus(records) {
    const now = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    return records.map((record) => {
      const examDateTime = new Date(
        `${record.examRoom.examDate}T${record.examRoom.examTime}`
      );
      const timeDifference = examDateTime - now;

      let status;
      let timeUntilAppointment;

      if (timeDifference > 0) {
        status = "Chưa tới hẹn";
        const daysUntil = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hoursUntil = Math.floor(
          (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutesUntil = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );

        if (daysUntil > 0) {
          if (daysUntil >= 30) {
            const monthsUntil = Math.floor(daysUntil / 30);
            timeUntilAppointment = `${monthsUntil} tháng tới`;
          } else {
            timeUntilAppointment = `${daysUntil} ngày tới`;
          }
        } else if (hoursUntil > 0) {
          timeUntilAppointment = `${hoursUntil} giờ tới`;
        } else if (minutesUntil > 0) {
          timeUntilAppointment = `${minutesUntil} phút tới`;
        } else {
          timeUntilAppointment = "Đã tới giờ hẹn";
        }
      } else if (timeDifference === 0) {
        status = "Đã tới hẹn";
        timeUntilAppointment = "Đã tới giờ hẹn";
      } else {
        status = "Đã trễ hẹn";
        timeUntilAppointment = "Đã trễ hẹn";
      }

      return {
        ...record,
        status,
        timeUntilAppointment,
      };
    });
  }

  async getRecordByPatientCode({ patientCode }) {
    const result = await this.#recordRepository.getMedicalRecordsByPatientCode(
      patientCode
    );

    return {
      message: ErrorCode.SUCCESS,
      data: result,
    };
  }
}

module.exports = RecordService;
