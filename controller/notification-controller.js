const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const Status = require("../enum/status.js");
const NotificationService = require("../service/notification-service.js");

class NotificationController {
  #notifcationService;

  constructor() {
    this.#notifcationService = new NotificationService();
  }

  async getAllNotification(req, res) {
    try {
      const result = await this.#notifcationService.getAllNotification();
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

  async getNotificationByPhoneNumber(req, res) {
    try {
      const result =
        await this.#notifcationService.getNotificationByPhoneNumber(req.sub);
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

  async checkAndCreateNotifications(req, res) {
    try {
      await this.#notifcationService.checkAndCreateNotifications();
      res.status(StatusCode.HTTP_200_OK).json({
        status: Status.SUCCESS,
        message: "Notifications checked and created successfully",
      });
    } catch (err) {
      res.status(StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message || "Error occurred",
      });
    }
  }
}

module.exports = NotificationController;
