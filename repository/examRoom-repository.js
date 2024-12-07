const ExamRoom = require("../models/exam-room.js");
const AppDataSource = require("../utils/database.js");

class ExamRoomRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(ExamRoom);
  }

  async getExamRoomByField(examRoom) {
    return await this.#repository.findOneBy({
      examDate: examRoom.examDate,
      examTime: examRoom.examTime,
      roomNumber: examRoom.roomNumber,
    });
  }

  async saveExamRoom(examRoom) {
    return await this.#repository.save(examRoom);
  }

  async getAllExamRoom() {
    return await this.#repository.find();
  }

  async getRoomById(id) {
    return await this.#repository.findOne({
      where: { id: id },
    });
  }

  async getExamRoomsByDateAndDoctorType(examDate) {
    return await this.#repository
      .createQueryBuilder("examRoom")
      .leftJoinAndSelect("examRoom.doctor", "doctor")
      .where("examRoom.examDate = :examDate", { examDate })
      .andWhere("doctor.type = :type", { type: "PRESCRIPTION" })
      .getMany();
  }

  async getExamRoomsByDateTime(examDate, examTime) {
    return await this.#repository.find({
      where: {
        examDate: examDate,
        examTime: examTime,
      },
      relations: ["doctor.user"],
    });
  }

  async getCount() {
    return await this.#repository.count();
  }
}

module.exports = ExamRoomRepository;
