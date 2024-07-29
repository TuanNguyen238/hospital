const express = require("express");
const OtpController = require("../controller/otp-controller.js");

const router = express.Router();
const otpController = new OtpController();

router.post("/generate", (req, res) => otpController.createOtp(req, res));
router.post("/request", (req, res) => otpController.requestOtp(req, res));
router.post("/verify", (req, res) => otpController.verifyOtp(req, res));
router.get("/", (req, res) => otpController.getAllOtp(req, res));

module.exports = router;
