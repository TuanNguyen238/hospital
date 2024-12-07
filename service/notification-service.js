const EnumRole = require("../enum/enum-role.js");
const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const NotificationRepository = require("../repository/notification-repository.js");
const { formatDate } = require("../utils/const.js");

class NotificationService {
  #notificationRepository;
  constructor() {
    this.#notificationRepository = new NotificationRepository();
  }

  async getAllNotification() {
    const result = await this.#notificationRepository.getAllNotification();
    return { message: ErrorCode.SUCCESS, data: result };
  }

  async getNotificationByPhoneNumber(phoneNumber) {
    const result =
      await this.#notificationRepository.getNotificationsByPhoneNumber(
        phoneNumber
      );

    const enhancedResult = await Promise.all(
      result.map(async (notification) => {
        const relativeTime = await this.#calculateRelativeTime(
          notification.createdAt
        );
        return {
          ...notification,
          relativeTime,
        };
      })
    );

    return { message: ErrorCode.SUCCESS, data: enhancedResult };
  }

  async #calculateRelativeTime(createdAt) {
    const now = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    const createdDate = new Date(createdAt);

    const yearDiff = now.getFullYear() - createdDate.getFullYear();
    const monthDiff = now.getMonth() - createdDate.getMonth() + yearDiff * 12;
    const dayDiff = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));

    if (yearDiff > 0) return `${yearDiff} năm trước`;
    if (monthDiff > 0) return `${monthDiff} tháng trước`;
    if (dayDiff > 0) return `${dayDiff} ngày trước`;
    return "Đã tới hẹn";
  }

  async checkAndCreateNotifications() {
    try {
      const records =
        await this.#notificationRepository.getRecordsWithUpcomingExam();

      const existingNotifications =
        await this.#notificationRepository.getExistingNotificationsByRecords(
          records
        );

      const notificationsToCreate = [];
      const now = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);

      for (const record of records) {
        if (!record.id || !record.examRoom || !record.examRoom.examDate) {
          console.error("Invalid record or missing examRoom/examDate:", record);
          continue;
        }
        const examRoom = record.examRoom;
        const examDate = new Date(examRoom.examDate);
        const oneDayBefore = new Date(examDate);
        oneDayBefore.setDate(examDate.getDate() - 1);

        if (now >= oneDayBefore && now < examDate) {
          const alreadyExists = existingNotifications.some(
            (notification) =>
              notification.medicalRecord?.id === record.id &&
              notification.title === "Thông báo tới hẹn"
          );

          if (!alreadyExists) {
            notificationsToCreate.push(this.#createNotification(record));
          }
        }
      }

      if (notificationsToCreate.length > 0) {
        await this.#notificationRepository.saveNotification(
          notificationsToCreate
        );
        console.log(notificationsToCreate);
        console.log(`Đã tạo ${notificationsToCreate.length} thông báo`);
      } else {
        console.log("Không có thông báo mới cần tạo.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  #createNotification(record) {
    const examRoom = record.examRoom;

    return {
      title: "Thông báo tới hẹn",
      content: `Thông báo tự động trước 1 ngày diễn ra cuộc hẹn vào ngày ${formatDate(
        examRoom.examDate
      )}`,
      createdAt: new Date(new Date().getTime() + 7 * 60 * 60 * 1000),
      medicalRecord: record,
    };
  }
}

module.exports = NotificationService;
