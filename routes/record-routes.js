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
router.post("/approve", UserMiddleware.authenticationTokenStaff, (req, res) =>
  recordController.approveRecord(req, res)
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
router.get("/id", UserMiddleware.authenticationTokenUser, (req, res) =>
  recordController.getRecordByID(req, res)
);
router.get("/recordCode", UserMiddleware.authenticationTokenUser, (req, res) =>
  recordController.getRecordByRecordCode(req, res)
);
router.get("/doctor", UserMiddleware.authenticationTokenDoctor, (req, res) =>
  recordController.getRecordsByDoctor(req, res)
);
router.get("/staff", UserMiddleware.authenticationTokenStaff, (req, res) =>
  recordController.getRecordsByStaff(req, res)
);
router.post(
  "/",
  UserMiddleware.authenticationTokenDoctor,
  upload.single("image"),
  (req, res) => recordController.createRecord(req, res)
);
router.post(
  "/flutterflow",
  UserMiddleware.authenticationTokenDoctor,
  upload.single("image"),
  (req, res) => recordController.updateFileRecord(req, res)
);
module.exports = router;
