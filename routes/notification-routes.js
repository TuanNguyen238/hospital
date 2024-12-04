const express = require("express");
const NotificationController = require("../controller/notification-controller");
const UserMiddleware = require("../middleware/user-middleware");

const router = express.Router();
const notificationController = new NotificationController();

router.get("/", (req, res) =>
  notificationController.getAllNotification(req, res)
);
router.get("/current", UserMiddleware.authenticationTokenUser, (req, res) =>
  notificationController.getNotificationByPhoneNumber(req, res)
);
router.get("/auto", (req, res) =>
  notificationController.checkAndCreateNotifications(req, res)
);

module.exports = router;
