const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const Status = require("../enum/status.js");
const UserService = require("../service/user-service.js");

class UserController {
  #userService;

  constructor() {
    this.#userService = new UserService();
  }

  async getAllUsers(req, res) {
    try {
      const result = await this.#userService.getAllUsers();
      res.status(StatusCode.HTTP_200_OK).json({
        status: Status.SUCCESS,
        message: result.message,
        data: result.data,
      });
    } catch (err) {
      res.status(StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getUserById(req, res) {
    try {
      console.log(req.userId);
      const result = await this.#userService.getUserById(req.userId);
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

  async createUser(req, res) {
    try {
      const result = await this.#userService.createUser(req.body);
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

  async forgotPass(req, res) {
    try {
      const result = await this.#userService.forgotPass(req.body);
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

  async updatePass(req, res) {
    try {
      const result = await this.#userService.updatePass(req.sub, req.body);
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

  async updatePassAdmin(req, res) {
    try {
      const result = await this.#userService.updatePassAdmin(req.body);
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

  async updateInfo(req, res) {
    try {
      const result = await this.#userService.updateInfo(req.sub, req.body);
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

  async getCountUser(req, res) {
    try {
      const result = await this.#userService.getCountUser();
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

  async getCountDoctor(req, res) {
    try {
      const result = await this.#userService.getCountDoctor();
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
}

module.exports = UserController;
