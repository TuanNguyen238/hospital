const ErrorCode = require("../enum/error-code.js");
const ExamRoomRepository = require("../repository/examRoom-repository.js");

class ExamRoomService {
  #examRoomRepository;

  constructor() {
    this.#examRoomRepository = new ExamRoomRepository();
  }

  async createExamRoom(examRoom) {
    const room = await this.#examRoomRepository.getExamRoomByField(examRoom);

    if (room) throw new Error(ErrorCode.EXAMROOM_EXISTED);

    await this.#examRoomRepository.saveExamRoom(examRoom);
    return {
      message: ErrorCode.EXAMROOM_CREATED,
    };
  }

  async getAllExamRoom() {
    return this.#examRoomRepository.getAllExamRoom();
  }

  async getAvailableTimes(date) {
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

    return availableTimes.filter((availableTime) => availableTime.count > 0);
  }
}
module.exports = ExamRoomService;
