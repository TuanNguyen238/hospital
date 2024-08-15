const ExamRoom = require("../models/exam-room.js");
const AppDataSource = require("../utils/configs.js");
const { timeSlots } = require("../utils/const.js");

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

  async getAvailableTimes(date) {
    const examRooms = await this.#repository.findBy({
      examDate: date,
    });

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

module.exports = ExamRoomRepository;
