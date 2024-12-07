const express = require("express");
const UserController = require("../controller/user-controller.js");
const UserMiddleware = require("../middleware/user-middleware.js");

const router = express.Router();
const userController = new UserController();

router.get("/count", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  userController.getCount(req, res)
);
router.post("/month", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  userController.getCountByMonth(req, res)
);
router.get("/", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  userController.getAllUsers(req, res)
);
router.get("/current", UserMiddleware.authenticationTokenUser, (req, res) =>
  userController.getUserById(req, res)
);
router.get("/point", UserMiddleware.authenticationTokenUser, (req, res) =>
  userController.getPointByPhoneNumber(req, res)
);
router.post("/find", UserMiddleware.authenticationTokenStaff, (req, res) =>
  userController.findUser(req, res)
);
router.post("/", (req, res) => userController.createUser(req, res));
router.post("/doctor", UserMiddleware.authenticationTokenDoctor, (req, res) =>
  userController.doctorCreateUser(req, res)
);
router.post(
  "/createDoctor",
  UserMiddleware.authenticateTokenAdmin,
  (req, res) => userController.adminCreateDoctor(req, res)
);
router.post("/createStaff", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  userController.adminCreateStaff(req, res)
);
router.put("/forgotpass", (req, res) => userController.forgotPass(req, res));

router.put("/updatepass", UserMiddleware.authenticationTokenUser, (req, res) =>
  userController.updatePass(req, res)
);
router.put(
  "/updatepassadmin",
  UserMiddleware.authenticateTokenAdmin,
  (req, res) => userController.updatePassAdmin(req, res)
);
router.put("/updateinfo", UserMiddleware.authenticationTokenUser, (req, res) =>
  userController.updateInfo(req, res)
);
router.put("/updatestatus", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  userController.updateStatus(req, res)
);
module.exports = router;
