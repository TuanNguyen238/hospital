const ExamRoom = require("../models/exam-room.js");
const AppDataSource = require("../utils/configs.js");

class ExamRoomRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(ExamRoom);
  }

  async getExamRoomByField(examRoom) {
    return await this.#repository.findOneBy({
      examDate: examRoom.examDate,
      examTime: examRoom.examTime,
      maxPatients: examRoom.maxPatients,
      roomNumber: examRoom.roomNumber,
    });
  }

  async saveExamRoom(examRoom) {
    return await this.#repository.save(examRoom);
  }

  async getAllExamRoom() {
    return await this.#repository.find();
  }
}

module.exports = ExamRoomRepository;
