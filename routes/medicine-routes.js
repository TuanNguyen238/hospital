const express = require("express");
const MedicineController = require("../controller/medicine-controller.js");
const UserMiddleware = require("../middleware/user-middleware.js");
const multer = require("multer");
const upload = multer({ dest: "../uploads/" });

const router = express.Router();
const medicineController = new MedicineController();

router.get("/count", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  medicineController.getCount(req, res)
);
router.post("/month", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  medicineController.getCountByMonth(req, res)
);
router.post(
  "/create",
  UserMiddleware.authenticateTokenAdmin,
  upload.single("image"),
  (req, res) => medicineController.createMedicine(req, res)
);
router.post(
  "/import",
  UserMiddleware.authenticateTokenAdmin,
  upload.single("image"),
  (req, res) => medicineController.importMedicine(req, res)
);
router.get("/", (req, res) => medicineController.getAllMedicine(req, res));
router.put("/updatestatus", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  medicineController.updateStatus(req, res)
);
router.put(
  "/update",
  UserMiddleware.authenticateTokenAdmin,
  upload.single("image"),
  (req, res) => medicineController.updateMedicine(req, res)
);

module.exports = router;
