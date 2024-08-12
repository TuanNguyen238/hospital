const ExamRoomService = require("../service/examRoom-service.js");

class ExamRoomcontroller {
  #examRoomService;

  constructor() {
    this.#examRoomService = new ExamRoomService();
  }

  async createExamRoom(req, res) {
    try {
      const message = await this.#examRoomService.createExamRoom(req.body);
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAllExamRoom(req, res) {
    try {
      const examroom = await this.#examRoomService.getAllExamRoom();
      res.status(200).json(examroom);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = ExamRoomcontroller;
