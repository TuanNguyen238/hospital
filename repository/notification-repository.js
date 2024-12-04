const Notification = require("../models/notification.js");
const AppDataSource = require("../utils/database.js");

class NotificationRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(Notification);
  }

  async saveNotification(notification) {
    await this.#repository.save(notification);
  }

  async getAllNotification() {
    return await this.#repository.find({
      relations: ["medicalRecord"],
    });
  }
}

module.exports = NotificationRepository;
