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
    return this.#examRoomRepository.getAvailableTimes(date);
  }
}
module.exports = ExamRoomService;
