const express = require("express");
const NotificationController = require("../controller/notification-controller");

const router = express.Router();
const notificationController = new NotificationController();

router.get("/", (req, res) =>
  notificationController.getAllNotification(req, res)
);

module.exports = router;
