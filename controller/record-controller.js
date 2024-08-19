const RecordService = require("../service/record-service");

class RecordController {
  #recordService;

  constructor() {
    this.#recordService = new RecordService();
  }

  async bookRecord(req, res) {
    try {
      const record = await this.#recordService.bookRecord(req.body.patientCode);
      res.status(200).json(record);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = RecordController;
