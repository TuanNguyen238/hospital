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

module.exports = router;
