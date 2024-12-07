const express = require("express");
const UserMiddleware = require("../middleware/user-middleware");
const DoctorController = require("../controller/doctor-controller");

const router = express.Router();
const doctorController = new DoctorController();

router.get("/", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  doctorController.getAllDoctor(req, res)
);

module.exports = router;
