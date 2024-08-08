const express = require("express");
const MedicineController = require("../controller/medicine-controller.js");

const router = express.Router();
const medicineController = new MedicineController();

router.get("/count", (req, res) => medicineController.getCount(req, res));

module.exports = router;
