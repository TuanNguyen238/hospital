const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const ExamRoomRepository = require("../repository/examRoom-repository.js");
const { timeSlots } = require("../utils/const.js");

class ExamRoomService {
  #examRoomRepository;

  constructor() {
    this.#examRoomRepository = new ExamRoomRepository();
  }

  async createExamRoom(examRoom) {
    const room = await this.#examRoomRepository.getExamRoomByField(examRoom);

    if (room)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.EXAMROOM_EXISTED,
      };

    await this.#examRoomRepository.saveExamRoom(examRoom);
    return { message: ErrorCode.EXAMROOM_CREATED };
  }

  async getAllExamRoom() {
    const examRoom = await this.#examRoomRepository.getAllExamRoom();
    return { message: ErrorCode.SUCCESS, data: examRoom };
  }

  async getAvailableTimes({ date }) {
    const examRooms = await this.#examRoomRepository.getExamRoomsByDate(date);

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
