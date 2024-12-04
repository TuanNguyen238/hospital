const EnumRole = require("../enum/enum-role");
const ErrorCode = require("../enum/error-code");
const Status = require("../enum/status");
const StatusCode = require("../enum/status-code");
const ExamRoomRepository = require("../repository/examRoom-repository");
const MedicineRepository = require("../repository/medicine-repository");
const PatientRepository = require("../repository/patient-repository");
const RecordRepository = require("../repository/record-repository");
const UserRepository = require("../repository/user-repository");
const { generateTimestampString } = require("../utils/const");
const fs = require("fs");

class RecordService {
  #recordRepository;
  #examRoomRepository;
  #patientRepository;
  #userRepository;
  #medicineRepository;

  constructor() {
    this.#recordRepository = new RecordRepository();
    this.#examRoomRepository = new ExamRoomRepository();
    this.#patientRepository = new PatientRepository();
    this.#userRepository = new UserRepository();
    this.#medicineRepository = new MedicineRepository();
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

    randomRoom.currentPatients++;
    this.#examRoomRepository.saveExamRoom(randomRoom);

    if (patient.status === Status.INACTIVE) {
      patient.status = Status.ACTIVE;
      await this.#patientRepository.savePatient(patient);
    }

    const result = await this.#recordRepository.saveRecord({
      patient: patient,
      examRoom: randomRoom,
      reasonForVisit: reasonForVisit,
      paid: true,
      recordCode: code,
      status: Status.UNFINISHED,
      orderNumber: randomRoom.currentPatients,
    });

    return { message: ErrorCode.RECORD_BOOKED, data: result };
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

  async getRecordByPatientCode(role, phoneNumber, patientCode) {
    if (role === EnumRole.USER) {
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
    }

    const result = await this.#recordRepository.getMedicalRecordsByPatientCode(
      patientCode
    );

    return {
      message: ErrorCode.SUCCESS,
      data: result,
    };
  }

  async getRecordsByPhoneNumber(phoneNumber) {
    const result = await this.#recordRepository.getRecordsByUserPhoneNumber(
      phoneNumber
    );

    return {
      message: ErrorCode.SUCCESS,
      data: result,
    };
  }

  async getRecords() {
    const result = await this.#recordRepository.getMedicalRecords();
    return {
      message: ErrorCode.SUCCESS,
      data: result,
    };
  }

  async createRecord(record, phoneNumber, file) {
    console.log(file);
    const doctor = await this.#userRepository.findByPhoneNumber(phoneNumber);
    if (!doctor)
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.USER_NOT_EXISTED,
      };

    const medicineIds = record.medicines.map((med) => med.medicineId);
    const medicines = await this.#medicineRepository.findByIds(medicineIds);

    if (medicines.length !== medicineIds.length) {
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.MEDICINE_NOT_EXISTED,
      };
    }

    const medicinesData = [];
    const errorMessages = [];

    for (const medicine of record.medicines) {
      const morning = parseInt(medicine.morning, 10);
      const afternoon = parseInt(medicine.afternoon, 10);
      const evening = parseInt(medicine.evening, 10);
      const days = parseInt(medicine.days, 10);
      const medicineData = medicines.find(
        (med) => med.id === medicine.medicineId
      );

      if (medicineData.status !== Status.ACTIVE)
        errorMessages.push({
          medicine: medicineData,
          message: ErrorCode.MEDICINE_DISABLED,
        });
      else if (medicineData.quantity < (morning + afternoon + evening) * days)
        errorMessages.push({
          medicine: medicineData,
          message: ErrorCode.INSUFFICIENT_STOCK,
        });
      else
        medicinesData.push({
          medicine: medicineData,
          morning: morning,
          afternoon: afternoon,
          evening: evening,
          days: days,
        });
    }
    if (errorMessages.length > 0) {
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.INVALID_REQUEST,
        data: errorMessages,
      };
    }

    const prescriptionData = {
      note: record.note,
      medicines: medicinesData,
    };

    let imageUrl = null;
    const name = generateTimestampString();

    if (file) {
      try {
        const processFile = async () => {
          await this.#recordRepository.deleteImage(name);
          const result = await this.#recordRepository.uploadImage(
            file.path,
            name
          );
          imageUrl = result;

          await fs.promises.access(file.path, fs.constants.F_OK);
          await fs.promises.unlink(file.path);
        };
        await processFile();
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }

    const detailedRecordsData = {
      weight: parseInt(record.weight),
      height: parseInt(record.height),
      bmi: parseFloat(record.bmi),
      heartRate: parseInt(record.heartRate),
      respiratoryRate: parseInt(record.respiratoryRate),
      bloodPressure: record.bloodPressure,
      spO2: parseInt(record.spO2),
      clinicalIndicator: record.clinicalIndicator,
      imageUrl: imageUrl,
    };

    const recordData = {
      id: record.id,
      examResult: record.examResult,
      diagnosis: record.diagnosis,
      doctor: doctor,
    };

    const result = await this.#recordRepository.createRecordWithTransaction(
      recordData,
      detailedRecordsData,
      prescriptionData
    );
    return { message: ErrorCode.RECORD_CREATED, data: result };
  }

  async getStaisticRecord() {
    const records = await this.#recordRepository.getStatisticRecord();
    let totalRevenue = 0;
    const monthRevenue = Array(12).fill(0);
    const dayRegisteredRevenue = Array(10).fill(0);
    const daySuccessfullRevenue = Array(10).fill(0);

    records.forEach((record) => {
      if (record.paid) {
        totalRevenue += 150000;

        const examDate = new Date(record.examRoom.examDate);
        const examMonth = examDate.getMonth();
        monthRevenue[examMonth] += 150000;

        const roomNumber = record.examRoom.roomNumber;
        const isSuccessfull = record.status === "Đã thực hiện";
        dayRegisteredRevenue[roomNumber - 1] += 150000;
        if (isSuccessfull) {
          daySuccessfullRevenue[roomNumber - 1] += 150000;
        }
      }
    });

    return {
      message: ErrorCode.SUCCESS,
      data: {
        totalRevenue,
        monthRevenue,
        dayRegisteredRevenue,
        daySuccessfullRevenue,
      },
    };
  }
}

module.exports = RecordService;
