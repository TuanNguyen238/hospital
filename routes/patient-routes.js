const express = require("express");
const PatientController = require("../controller/patient-controller.js");

const router = express.Router();
const patientController = new PatientController();

router.post("/create", (req, res) => patientController.createPatient(req, res));

module.exports = router;
