const express = require("express");
const MedicineController = require("../controller/medicine-controller.js");
const UserMiddleware = require("../middleware/user-middleware.js");

const router = express.Router();
const medicineController = new MedicineController();

router.get("/count", (req, res) => medicineController.getCount(req, res));
router.post("/create", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  medicineController.createMedicine(req, res)
);
router.get("/", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  medicineController.getAllMedicine(req, res)
);
router.delete("/delete", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  medicineController.deleteMedicine(req, res)
);

module.exports = router;
