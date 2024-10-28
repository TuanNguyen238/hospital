const ErrorCode = require("../enum/error-code");
const Status = require("../enum/status");
const StatusCode = require("../enum/status-code");
const RecordService = require("../service/record-service");

class RecordController {
  #recordService;

  constructor() {
    this.#recordService = new RecordService();
  }

  async bookRecord(req, res) {
    try {
      const result = await this.#recordService.bookRecord(req.body);
      res.status(StatusCode.HTTP_201_CREATED).json({
        status: Status.SUCCESS,
        message: result.message,
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(err.status || StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  }
}

module.exports = RecordController;
