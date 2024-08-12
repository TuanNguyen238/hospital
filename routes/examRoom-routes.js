const express = require("express");
const UserMiddleware = require("../middleware/user-middleware.js");
const ExamRoomcontroller = require("../controller/examRoom-controller.js");

const router = express.Router();
const examRoomcontroller = new ExamRoomcontroller();

router.post("/create", UserMiddleware.authenticationTokenUser, (req, res) =>
  examRoomcontroller.createPatient(req, res)
);
module.exports = router;
