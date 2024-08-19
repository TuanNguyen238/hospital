const express = require("express");
const RecordController = require("../controller/record-controller.js");

const router = express.Router();
const recordController = new RecordController();

router.post("/book", (req, res) => recordController.bookRecord(req, res));

module.exports = router;
