const express = require("express");
const RecordController = require("../controller/record-controller.js");
const UserMiddleware = require("../middleware/user-middleware.js");

const router = express.Router();
const recordController = new RecordController();

router.post("/book", UserMiddleware.authenticationTokenUser, (req, res) =>
  recordController.bookRecord(req, res)
);

module.exports = router;
