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
      const result = await this.#userService.getUserById(req.userid);
      res.status(StatusCode.HTTP_200_OK).json({
        status: Status.SUCCESS,
        message: result.message,
        data: result.data,
      });
    } catch (err) {
      if (err.message === ErrorCode.USER_NOT_EXISTED) {
        res.status(StatusCode.HTTP_404_NOT_FOUND).json({
          status: Status.ERROR,
          message: ErrorCode.USER_NOT_EXISTED,
        });
      } else {
        console.error("Server error:", err);
        res.status(StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
          status: Status.ERROR,
          message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
      }
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
      if (
        err.message === ErrorCode.USER_ALREADY_EXISTS ||
        err.message === ErrorCode.ROLE_NOT_EXISTED
      ) {
        res.status(StatusCode.HTTP_400_BAD_REQUEST).json({
          status: Status.ERROR,
          message: err.message,
        });
      } else {
        console.error("Server error:", err);
        res.status(StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
          status: Status.ERROR,
          message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
      }
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
      console.error("Server error:", err);
      res.status(StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message,
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
      if (
        err.message === ErrorCode.UNAUTHENTICATED ||
        err.message === ErrorCode.USER_NOT_EXISTED
      ) {
        res.status(StatusCode.HTTP_400_BAD_REQUEST).json({
          status: Status.ERROR,
          message: err.message,
        });
      } else {
        console.error("Server error:", err);
        res.status(StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
          status: Status.ERROR,
          message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
      }
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
      res.status(StatusCode.HTTP_400_BAD_REQUEST).json({
        status: Status.ERROR,
        message: err.message,
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
      if (err.message === ErrorCode.USER_NOT_EXISTED) {
        res.status(StatusCode.HTTP_404_NOT_FOUND).json({
          status: Status.ERROR,
          message: ErrorCode.USER_NOT_EXISTED,
        });
      } else {
        console.error("Server error:", err);
        res.status(StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
          status: Status.ERROR,
          message: ErrorCode.INTERNAL_SERVER_ERROR,
        });
      }
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
      console.error("Server error:", err);
      res.status(StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message,
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
      console.error("Server error:", err);
      res.status(StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message,
      });
    }
  }
}

module.exports = UserController;
