const MedicalRecord = require("../models/medical-record.js");
const Notification = require("../models/notification.js");
const AppDataSource = require("../utils/database.js");

class NotificationRepository {
  #repository;
  #recordRepository;

  constructor() {
    this.#repository = AppDataSource.getRepository(Notification);
    this.#recordRepository = AppDataSource.getRepository(MedicalRecord);
  }

  async saveNotification(notification) {
    await this.#repository.save(notification);
  }

  async getAllNotification() {
    return await this.#repository.find({
      relations: ["medicalRecord"],
    });
  }

  async getNotificationsByPhoneNumber(phoneNumber) {
    try {
      const notifications = await this.#repository
        .createQueryBuilder("notification")
        .leftJoinAndSelect("notification.medicalRecord", "medicalRecord")
        .leftJoinAndSelect("medicalRecord.patient", "patient")
        .leftJoinAndSelect("patient.user", "user")
        .where("user.phoneNumber = :phoneNumber", { phoneNumber })
        .select([
          "notification.id",
          "notification.title",
          "notification.content",
          "notification.createdAt",
          "medicalRecord.id",
        ])
        .orderBy("notification.createdAt", "DESC")
        .getMany();
      const enhancedNotifications = notifications.map((notification) => ({
        ...notification,
        medicalRecordId: notification.medicalRecord?.id,
        medicalRecord: undefined,
      }));
      return enhancedNotifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw new Error("Failed to fetch notifications.");
    }
  }

  async getExistingNotificationsByRecords(records) {
    if (!records || records.length === 0) {
      console.log("No records provided to check notifications.");
      return [];
    }
    const recordIds = records.map((record) => record.id);
    return await this.#repository
      .createQueryBuilder("notification")
      .leftJoin("notification.medicalRecord", "medicalRecord")
      .addSelect("medicalRecord.id")
      .where(
        "medicalRecord.id IN (:...recordIds) AND notification.title = :title",
        {
          recordIds,
          title: "Thông báo tới hẹn",
        }
      )
      .getMany();
  }

  async getRecordsWithUpcomingExam() {
    return await this.#recordRepository
      .createQueryBuilder("medicalRecord")
      .leftJoinAndSelect("medicalRecord.examRoom", "examRoom")
      .where("examRoom.examDate BETWEEN :start AND :end", {
        start: new Date(new Date().getTime() + 7 * 60 * 60 * 1000),
        end: new Date(new Date().getTime() + 31 * 60 * 60 * 1000),
      })
      .getMany();
  }
}

module.exports = NotificationRepository;
