const express = require("express");
const MedicineController = require("../controller/medicine-controller.js");

const router = express.Router();
const medicineController = new MedicineController();

router.post("/count", (req, res) => medicineController.getCount(req, res));

module.exports = router;
