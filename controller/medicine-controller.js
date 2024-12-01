const ErrorCode = require("../enum/error-code");
const Status = require("../enum/status");
const StatusCode = require("../enum/status-code");
const MedicineService = require("../service/medicine-service");

class MedicineController {
  #medicineService;

  constructor() {
    this.#medicineService = new MedicineService();
  }

  async getCount(req, res) {
    try {
      const result = await this.#medicineService.getCount();
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

  async getCountByMonth(req, res) {
    try {
      const result = await this.#medicineService.getCountByMonth(req.body);
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

  async createMedicine(req, res) {
    try {
      console.log(req.file);
      const result = await this.#medicineService.createMedicine(
        req.body,
        req.file
      );
      res.status(StatusCode.HTTP_201_CREATED).json({
        status: Status.SUCCESS,
        message: result.message,
      });
    } catch (err) {
      console.log("Error:", err);
      res.status(err.status || StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async importMedicine(req, res) {
    try {
      const result = await this.#medicineService.importMedicine(
        req.body,
        req.file
      );
      res.status(StatusCode.HTTP_201_CREATED).json({
        status: Status.SUCCESS,
        message: result.message,
        data: result.data,
      });
    } catch (err) {
      console.log("Error:", err);
      res.status(err.status || StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message || ErrorCode.INTERNAL_SERVER_ERROR,
        data: err.data || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getAllMedicine(req, res) {
    try {
      const result = await this.#medicineService.getAllMedicine();
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

  async updateStatus(req, res) {
    try {
      const result = await this.#medicineService.updateStatus(req.body);
      res.status(StatusCode.HTTP_200_OK).json({
        status: Status.SUCCESS,
        message: result.message,
      });
    } catch (err) {
      console.log("Error:", err);
      res.status(err.status || StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateMedicine(req, res) {
    try {
      const result = await this.#medicineService.updateMedicine(
        req.body,
        req.file
      );
      res.status(StatusCode.HTTP_200_OK).json({
        status: Status.SUCCESS,
        message: result.message,
      });
    } catch (err) {
      console.log("Error:", err);
      res.status(err.status || StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  }
}

module.exports = MedicineController;
