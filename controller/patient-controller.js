const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const Status = require("../enum/status.js");
const PatientService = require("../service/patient-service.js");

class PatientController {
  #patientService;

  constructor() {
    this.#patientService = new PatientService();
  }

  async createPatient(req, res) {
    try {
      const result = await this.#patientService.createPatient(
        req.sub,
        req.body
      );
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

  async udpatePatient(req, res) {
    try {
      const result = await this.#patientService.updateInfo(req.sub, req.body);
      res.status(StatusCode.HTTP_200_OK).json({
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

  async getPatientsByPhoneNumber(req, res) {
    try {
      const result = await this.#patientService.getPatientsByPhoneNumber(
        req.sub
      );
      res.status(StatusCode.HTTP_200_OK).json({
        status: "success",
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

  async deletedPatientByid(req, res) {
    try {
      const id = req.headers["id"];
      const result = await this.#patientService.deletePatientById(id);
      res.status(StatusCode.HTTP_200_OK).json({
        status: "success",
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

module.exports = PatientController;
