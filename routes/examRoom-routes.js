const express = require("express");
const UserMiddleware = require("../middleware/user-middleware.js");
const ExamRoomcontroller = require("../controller/examRoom-controller.js");

const router = express.Router();
const examRoomcontroller = new ExamRoomcontroller();

router.post("/create", UserMiddleware.authenticationTokenDoctor, (req, res) =>
  examRoomcontroller.createExamRoom(req, res)
);
module.exports = router;
