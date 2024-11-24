const express = require("express");
const UserMiddleware = require("../middleware/user-middleware.js");
const OrderController = require("../controller/order-controller.js");

const router = express.Router();
const orderController = new OrderController();

router.post("/create", UserMiddleware.authenticationTokenDoctor, (req, res) =>
  orderController.createOrder(req, res)
);
router.get("/", UserMiddleware.authenticationTokenDoctor, (req, res) =>
  orderController.getAllOrder(req, res)
);
router.get("/doctor", UserMiddleware.authenticationTokenDoctor, (req, res) =>
  orderController.getDoctorOrderByPhoneNumber(req, res)
);
router.get("/client", UserMiddleware.authenticationTokenUser, (req, res) =>
  orderController.getClientOrderByPhoneNumber(req, res)
);
router.get("/count", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  orderController.getCount(req, res)
);
router.post("/month", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  orderController.getCountByMonth(req, res)
);

router.post("/reset", UserMiddleware.authenticateTokenAdmin, (req, res) =>
  orderController.reset(req, res)
);

module.exports = router;
