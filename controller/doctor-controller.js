const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const Status = require("../enum/status.js");
const DoctorService = require("../service/doctor-service.js");

class DoctorController {
  #doctorService;

  constructor() {
    this.#doctorService = new DoctorService();
  }

  async getAllDoctor(req, res) {
    try {
      const result = await this.#doctorService.getAllDoctor();
      res.status(StatusCode.HTTP_200_OK).json({
        status: Status.SUCCESS,
        message: result.message,
        data: result.data,
      });
    } catch (err) {
      console.log("Error:", err);
      res.status(err.status || StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getSalaryForDoctor(req, res) {
    try {
      const month = req.headers["month"];
      const result = await this.#doctorService.getSalaryForDoctor(
        req.sub,
        month
      );
      res.status(StatusCode.HTTP_200_OK).json({
        status: Status.SUCCESS,
        message: result.message,
        data: result.data,
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(err.status || StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getScheduleForDoctor(req, res) {
    try {
      const result = await this.#doctorService.getScheduleForDoctor(
        req.sub,
        req.body.date
      );
      res.status(StatusCode.HTTP_200_OK).json({
        status: Status.SUCCESS,
        message: result.message,
        data: result.data,
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

module.exports = DoctorController;
