const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const DetailDoctorRepository = require("../repository/detailedDoctor-repository.js");
const ExamRoomRepository = require("../repository/examRoom-repository.js");
const { timeSlots } = require("../utils/const.js");

class ExamRoomService {
  #examRoomRepository;
  #doctorRepository;

  constructor() {
    this.#examRoomRepository = new ExamRoomRepository();
    this.#doctorRepository = new DetailDoctorRepository();
  }

  async createExamRoom(examRoom) {
    const doctor = await this.#doctorRepository.getDoctorById(examRoom.doctor);
    console.log(doctor);
    if (!doctor)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.USER_NOT_EXISTED,
      };

    const room = await this.#examRoomRepository.getExamRoomByField(examRoom);

    if (room)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.EXAMROOM_EXISTED,
      };

    examRoom.doctor = doctor;

    await this.#examRoomRepository.saveExamRoom(examRoom);
    return { message: ErrorCode.EXAMROOM_CREATED };
  }

  async updateExamRoom(obj) {
    const room = await this.#examRoomRepository.getRoomById(obj.id);

    if (!room)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.EXAMROOM_NOT_EXISTED,
      };

    if (obj.maxPatients < room.currentPatients)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.MAX_PATIENT_ERROR,
      };

    room.maxPatients = obj.maxPatients;
    await this.#examRoomRepository.saveExamRoom(room);
    return { message: ErrorCode.EXAMROOM_UPDATED };
  }

  async getAllExamRoom() {
    const examRoom = await this.#examRoomRepository.getAllExamRoom();
    return { message: ErrorCode.SUCCESS, data: examRoom };
  }

  async getAvailableTimes({ examDate }) {
    const examRooms =
      await this.#examRoomRepository.getExamRoomsByDateAndDoctorType(examDate);
    const availableTimes = timeSlots.map((time) => {
      const matchingExamRooms = examRooms.filter(
        (room) => room.examTime === time
      );

      const availableSlots = matchingExamRooms.reduce(
        (total, room) => total + (room.maxPatients - room.currentPatients),
        0
      );

      return {
        time: time.substring(0, 5),
        count: availableSlots,
      };
    });

    const times = availableTimes.filter(
      (availableTime) => availableTime.count > 0
    );
    return { message: ErrorCode.SUCCESS, data: times };
  }

  async getCount() {
    const count = await this.#examRoomRepository.getCount();
    return { message: ErrorCode.SUCCESS, data: count };
  }
}
module.exports = ExamRoomService;
