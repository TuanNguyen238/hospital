const EnumRole = require("../enum/enum-role.js");
const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const MedicineRepository = require("../repository/medicine-repository.js");
const OrderRepository = require("../repository/order-repository.js");
const OrderMedicineRepository = require("../repository/orderMedicine-repository.js");
const RoleRepository = require("../repository/role-repository.js");
const UserRepository = require("../repository/user-repository.js");
const bcrypt = require("bcrypt");

class OrderService {
  #orderRepository;
  #orderMedicineRepository;
  #userRepository;
  #medicineRepository;
  #roleRepository;

  constructor() {
    this.#orderRepository = new OrderRepository();
    this.#orderMedicineRepository = new OrderMedicineRepository();
    this.#userRepository = new UserRepository();
    this.#medicineRepository = new MedicineRepository();
    this.#roleRepository = new RoleRepository();
  }

  async createOrder(order, idUserCreate) {
    if (order.id) {
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.INVALID_REQUEST,
      };
    }

    let clientId = idUserCreate;

    if (order.clientId && order.clientId.trim() !== "")
      clientId = order.clientId;

    let client = await this.#userRepository.findByPhoneNumber(clientId);
    if (!client) {
      const password = await bcrypt.hash(clientId, 10);
      const userRole = await this.#roleRepository.getRole(EnumRole.USER);

      if (!userRole)
        throw {
          status: StatusCode.HTTP_400_BAD_REQUEST,
          message: ErrorCode.ROLE_NOT_EXISTED,
        };

      client = await this.#userRepository.saveUser({
        username: clientId,
        email: clientId + "@gmail.com",
        password: password,
        phoneNumber: clientId,
        identifyCard: clientId,
        status: "active",
        role: userRole,
      });
    }
    client = await this.#userRepository.findByPhoneNumber(clientId);

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
      if (!medicineData) {
        throw {
          status: StatusCode.HTTP_400_BAD_REQUEST,
          message: ErrorCode.MEDICINE_NOT_EXISTED,
        };
      }
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

    const fullOrders = await Promise.all(
      orders.map(async (order) => {
        const orderMedicines =
          await this.#orderMedicineRepository.getAllOrderMedicine();

        // const medicinePromises = orderMedicines.map(async (orderMedicine) => {
        //   return {
        //     id: orderMedicine.id,
        //     name: orderMedicine.name,
        //     description: orderMedicine.description,
        //     quantity: orderMedicine.quantity,
        //     price: orderMedicine.price,
        //   };
        // });

        // const medicinesWithTotal = await Promise.all(medicinePromises);

        // const totalPrice = medicinesWithTotal.reduce((total, medicine) => {
        //   return total + medicine.total;
        // }, 0);

        return {
          ...order,
          orderMedicines: orderMedicines,
        };
      })
    );

    return {
      message: ErrorCode.SUCCESS,
      data: fullOrders,
    };
  }
}
module.exports = OrderService;
