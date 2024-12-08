const express = require("express");
const UserMiddleware = require("../middleware/user-middleware");
const DoctorController = require("../controller/doctor-controller");

const router = express.Router();
const doctorController = new DoctorController();

router.get("/", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  doctorController.getAllDoctor(req, res)
);
router.get("/salary", UserMiddleware.authenticationTokenDoctor, (req, res) =>
  doctorController.getSalaryForDoctor(req, res)
);
router.post("/schedule", UserMiddleware.authenticationTokenDoctor, (req, res) =>
  doctorController.getScheduleForDoctor(req, res)
);

module.exports = router;
