const express = require("express");
const AuthenticationController = require("../controller/authentication-controller");
const UserMiddleware = require("../middleware/user-middleware");

const router = express.Router();
const authenticationController = new AuthenticationController();

router.post("/", (req, res) => authenticationController.authenticate(req, res));
router.post("/web", (req, res) => authenticationController.authWeb(req, res));
router.post("/introspect", UserMiddleware.authenticationTokenUser, (req, res) =>
  res.status(200).json("")
);
router.post("/refreshToken", (req, res) =>
  authenticationController.refreshToken(req, res)
);

module.exports = router;
