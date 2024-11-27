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

    const patientRecords = await Promise.all(
      patients.map(async (patient) => {
        const patientRecordList = records.filter(
          (record) => record.patient.patientCode === patient.patientCode
        );

        if (patientRecordList.length > 0) {
          const sanitizedRecords = patientRecordList.map((record) => {
            const { patient, ...rest } = record;
            return rest;
          });

          const processedRecords = await this.processExamStatus(
            sanitizedRecords
          );

          return {
            patient,
            records: processedRecords,
          };
        }
        return null;
      })
    );

    const filteredRecords = patientRecords.filter(Boolean);

    return { message: ErrorCode.SUCCESS, data: filteredRecords };
  }

  async processExamStatus(records) {
    const now = new Date();
    return records.map((record) => {
      const examDateTime = new Date(
        `${record.examRoom.examDate}T${record.examRoom.examTime}`
      );
      const timeDifference = examDateTime - now;
      const paidStatus = record.paid ? "Đã thanh toán" : "Chưa thanh toán";

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
        paidStatus,
      };
    });
  }
}

module.exports = RecordService;
