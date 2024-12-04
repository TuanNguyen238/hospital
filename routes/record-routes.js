const express = require("express");
const RecordController = require("../controller/record-controller.js");
const UserMiddleware = require("../middleware/user-middleware.js");
const multer = require("multer");
const upload = multer({ dest: "../uploads/" });

const router = express.Router();
const recordController = new RecordController();

router.post("/book", UserMiddleware.authenticationTokenUser, (req, res) =>
  recordController.bookRecord(req, res)
);
router.get("/current", UserMiddleware.authenticationTokenUser, (req, res) =>
  recordController.getRecordByPhoneNumber(req, res)
);
router.get("/patientCode", UserMiddleware.authenticationTokenUser, (req, res) =>
  recordController.getRecordByPatientCode(req, res)
);
router.get("/phoneNumber", UserMiddleware.authenticationTokenUser, (req, res) =>
  recordController.getRecordsByPhoneNumber(req, res)
);
router.get("/", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  recordController.getRecords(req, res)
);
router.get("/statistic", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  recordController.getStatisticRecord(req, res)
);
router.post(
  "/",
  UserMiddleware.authenticationTokenDoctor,
  upload.single("image"),
  (req, res) => recordController.createRecord(req, res)
);
module.exports = router;
