const EnumRole = require("../enum/enum-role.js");
const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const dotenv = require("dotenv");
const DetailDoctorRepository = require("../repository/detailedDoctor-repository.js");
const RecordRepository = require("../repository/record-repository.js");
const ExamRoomRepository = require("../repository/examRoom-repository.js");
const { timeSlots } = require("../utils/const.js");

dotenv.config();

class DoctorService {
  #doctorRepository;
  #recordRepository;
  #examRoomRepository;

  constructor() {
    this.#doctorRepository = new DetailDoctorRepository();
    this.#recordRepository = new RecordRepository();
    this.#examRoomRepository = new ExamRoomRepository();
  }

  async getAllDoctor() {
    const result = await this.#doctorRepository.getAllDoctor();

    return { message: ErrorCode.SUCCESS, data: result };
  }

  async getSalaryForDoctor(phoneNumber, month) {
    try {
      const doctor = await this.#doctorRepository.getDoctorByPhoneNumber(
        phoneNumber
      );

      if (!doctor) {
        return {
          message: ErrorCode.DOCTOR_NOT_FOUND,
          data: {
            baseSalary: 0,
            patientsCount: 0,
            totalSalary: 0,
          },
        };
      }

      const result = await this.#recordRepository.getSalaryForDoctor(
        doctor,
        month
      );

      const doctorType = result?.doctorType || doctor.type;
      const patientsCount = parseInt(result?.totalPatients || "0", 10);

      let baseSalary = 0;
      let multiplier;

      switch (doctorType) {
        case "BASIC_INFO":
          baseSalary = 3000000;
          multiplier = 30000;
          break;
        case "HEART_ULTRASOUND":
          baseSalary = 5000000;
          multiplier = 50000;
          break;
        case "PRESCRIPTION":
          baseSalary = 4000000;
          multiplier = 40000;
          break;
        default:
          baseSalary = 0;
          multiplier = 0;
          break;
      }

      const totalSalary = baseSalary + patientsCount * multiplier;

      return {
        message: ErrorCode.SUCCESS,
        data: {
          baseSalary: baseSalary,
          patientsCount,
          totalSalary: totalSalary || baseSalary,
        },
      };
    } catch (error) {
      console.error("Error calculating salary for doctor:", error);
      throw error;
    }
  }

  async getScheduleForDoctor(phoneNumber, date) {
    try {
      const schedules = await this.#examRoomRepository.getDoctorSchedule(
        phoneNumber,
        date
      );
      const scheduleMap = timeSlots
        .map((timeSlot) => {
          const matchingSchedule = schedules.find(
            (schedule) => schedule.examRoom_examTime === timeSlot
          );
          if (!matchingSchedule) return null;

          return {
            time: timeSlot,
            roomNumber: matchingSchedule.examRoom_roomNumber,
            maxPatients: matchingSchedule.examRoom_maxPatients,
            currentPatients: matchingSchedule.examRoom_currentPatients,
          };
        })
        .filter((entry) => entry !== null);

      return {
        message: "SUCCESS",
        data: scheduleMap,
      };
    } catch (error) {
      console.error("Error processing doctor schedule:", error);
      throw error;
    }
  }
}

module.exports = DoctorService;
