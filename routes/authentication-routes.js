const express = require("express");
const AuthenticationController = require("../controller/authentication-controller");
const UserMiddleware = require("../middleware/user-middleware");
const StatusCode = require("../enum/status-code");
const Status = require("../enum/status");
const ErrorCode = require("../enum/error-code");

const router = express.Router();
const authenticationController = new AuthenticationController();

router.post("/", (req, res) => authenticationController.authenticate(req, res));
router.post("/logout", (req, res) => authenticationController.logout(req, res));
router.post("/web", (req, res) => authenticationController.authWeb(req, res));
router.post("/introspect", UserMiddleware.authenticationTokenUser, (req, res) =>
  res.status(StatusCode.HTTP_200_OK).json({
    status: Status.SUCCESS,
    message: ErrorCode.SUCCESS,
  })
);

module.exports = router;
