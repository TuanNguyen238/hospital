const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const MedicineRepository = require("../repository/medicine-repository.js");
const OrderRepository = require("../repository/order-repository.js");
const OrderMedicineRepository = require("../repository/orderMedicine-repository.js");
const UserRepository = require("../repository/user-repository.js");

class OrderService {
  #orderRepository;
  #orderMedicineRepository;
  #userRepository;
  #medicineRepository;

  constructor() {
    this.#orderRepository = new OrderRepository();
    this.#orderMedicineRepository = new OrderMedicineRepository();
    this.#userRepository = new UserRepository();
    this.#medicineRepository = new MedicineRepository();
  }

  async createOrder(order, idUserCreate) {
    if (order.id) {
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.INVALID_REQUEST,
      };
    }

    const clientId = idUserCreate;

    if (order.clientId) clientId = order.clientId;

    if (!Array.isArray(order.medicines) || order.medicines.length === 0) {
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.INVALID_REQUEST,
      };
    }

    const client = await this.#userRepository.findByPhoneNumber(clientId);
    const doctor = await this.#userRepository.findByPhoneNumber(idUserCreate);

    const savedOrder = await this.#orderRepository.saveOrder({
      client: client,
      doctor: doctor,
      createAt: new Date(),
    });
    for (const medicine of order.medicines) {
      const medicineData = await this.#medicineRepository.findById(
        medicine.medicineId
      );
      console.log(medicineData);
      await this.#orderMedicineRepository.saveOrderMedicine({
        order: savedOrder,
        medicine: medicineData,
        quantity: medicine.quantity,
      });
    }
    return { message: ErrorCode.ORDER_CREATED };
  }

  async getAllOrder() {
    const orders = await this.#orderRepository.getAllOrder();
    return {
      message: ErrorCode.SUCCESS,
      data: orders,
    };
  }
}
module.exports = OrderService;
