const ErrorCode = require("../enum/error-code");
const Status = require("../enum/status");
const StatusCode = require("../enum/status-code");
const OrderService = require("../service/order-service");

class OrderController {
  #orderService;

  constructor() {
    this.#orderService = new OrderService();
  }

  async createOrder(req, res) {
    try {
      const result = await this.#orderService.createOrder(req.body);
      res.status(StatusCode.HTTP_201_CREATED).json({
        status: Status.SUCCESS,
        message: result.message,
      });
    } catch (err) {
      console.log("Error:", err);
      res.status(err.status || StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getAllOrder(req, res) {
    try {
      const result = await this.#orderService.getAllOrder();
      res.status(StatusCode.HTTP_200_OK).json({
        status: Status.SUCCESS,
        message: result.message,
        data: result.data,
      });
    } catch (err) {
      console.log("Error:", err);
      res.status(err.status || StatusCode.HTTP_500_INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: err.message || ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  }
}

module.exports = OrderController;