const express = require("express");
const UserController = require("../controller/user-controller.js");
const UserMiddleware = require("../middleware/user-middleware.js");

const router = express.Router();
const userController = new UserController();

router.get("/count", (req, res) => userController.getCount(req, res));
router.get("/", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  userController.getAllUsers(req, res)
);
router.get("/:id", (req, res) => userController.getUserById(req, res));
router.post("/", (req, res) => userController.createUser(req, res));
router.put("/forgotpass", (req, res) => userController.forgotPass(req, res));
router.put("/updatepass", UserMiddleware.authenticationTokenUser, (req, res) =>
  userController.updatePass(req, res)
);
router.put("/updateinfo", UserMiddleware.authenticationTokenUser, (req, res) =>
  userController.updateInfo(req, res)
);

module.exports = router;
