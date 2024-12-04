const EnumRole = require("../enum/enum-role.js");
const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const NotificationRepository = require("../repository/notification-repository.js");

class NotificationService {
  #notificationRepository;
  constructor() {
    this.#notificationRepository = new NotificationRepository();
  }

  async getAllNotification() {
    const result = await this.#notificationRepository.getAllNotification();
    return { message: ErrorCode.SUCCESS, data: result };
  }
}

module.exports = NotificationService;
