const express = require("express");
const AuthenticationController = require("../controller/authentication-controller");

const router = express.Router();
const authenticationController = new AuthenticationController();

router.post("/", (req, res) => authenticationController.authenticate(req, res));

module.exports = router;
