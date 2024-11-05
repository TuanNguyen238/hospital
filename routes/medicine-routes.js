const express = require("express");
const MedicineController = require("../controller/medicine-controller.js");
const UserMiddleware = require("../middleware/user-middleware.js");

const router = express.Router();
const medicineController = new MedicineController();

router.get("/count", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  medicineController.getCount(req, res)
);
router.get("/month", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  medicineController.getCountByMonth(req, res)
);
router.post("/create", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  medicineController.createMedicine(req, res)
);
router.post("/import", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  medicineController.createMedicine(req, res)
);
router.get("/", UserMiddleware.authenticationTokenDoctor, (req, res) =>
  medicineController.getAllMedicine(req, res)
);
router.put("/updatestatus", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  medicineController.updateStatus(req, res)
);
router.put("/update", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  medicineController.updateMedicine(req, res)
);

module.exports = router;
