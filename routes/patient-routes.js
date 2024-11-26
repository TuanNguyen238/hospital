const express = require("express");
const PatientController = require("../controller/patient-controller.js");
const UserMiddleware = require("../middleware/user-middleware.js");

const router = express.Router();
const patientController = new PatientController();

router.post("/create", UserMiddleware.authenticationTokenUser, (req, res) =>
  patientController.createPatient(req, res)
);
router.get("/current", UserMiddleware.authenticationTokenUser, (req, res) =>
  patientController.getPatientsByPhoneNumber(req, res)
);
router.get("/code", UserMiddleware.authenticationTokenUser, (req, res) =>
  patientController.getPatientsByPatientCode(req, res)
);
module.exports = router;
