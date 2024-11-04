const EnumRole = require("../enum/enum-role.js");
const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const MedicineRepository = require("../repository/medicine-repository.js");
const OrderRepository = require("../repository/order-repository.js");
const OrderMedicineRepository = require("../repository/orderMedicine-repository.js");
const RoleRepository = require("../repository/role-repository.js");
const UserRepository = require("../repository/user-repository.js");
const bcrypt = require("bcrypt");
const AppDataSource = require("../utils/configs.js");

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

    const clientId =
      order.clientId && order.clientId.trim() !== ""
        ? order.clientId
        : idUserCreate;

    let client = await this.#userRepository.findByPhoneNumber(clientId);
    if (!client) {
      const password = await bcrypt.hash(clientId, 10);
      const userRole = await this.#roleRepository.getRole(EnumRole.USER);

      if (!userRole) {
        throw {
          status: StatusCode.HTTP_400_BAD_REQUEST,
          message: ErrorCode.ROLE_NOT_EXISTED,
        };
      }

      client = await this.#userRepository.saveUser({
        username: clientId,
        email: `${clientId}@gmail.com`,
        password: password,
        phoneNumber: clientId,
        identifyCard: clientId,
        status: "active",
        role: userRole,
      });
    }

    const doctor = await this.#userRepository.findByPhoneNumber(idUserCreate);

    const medicineIds = order.medicines.map((med) => med.medicineId);
    const medicines = await this.#medicineRepository.findByIds(medicineIds);

    if (medicines.length !== medicineIds.length) {
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.MEDICINE_NOT_EXISTED,
      };
    }

    const orderMedicinesData = order.medicines.map((medicine) => {
      const medicineData = medicines.find(
        (med) => med.id === medicine.medicineId
      );
      return {
        medicine: medicineData,
        quantity: medicine.quantity,
      };
    });

    const savedOrder = await this.#orderRepository.createOrderWithTransaction(
      { client, doctor, createAt: new Date() },
      orderMedicinesData
    );

    return { message: ErrorCode.ORDER_CREATED, data: savedOrder };
  }

  async getAllOrder() {
    const orders = await this.#orderRepository.getAllOrder();

    const fullOrders = orders.map((order) => {
      const orderMedicines = order.orderMedicines.map((orderMedicine) => ({
        id: orderMedicine.medicine.id,
        name: orderMedicine.medicine.name,
        description: orderMedicine.medicine.description,
        quantity: orderMedicine.quantity,
        price: orderMedicine.medicine.price,
        total: orderMedicine.medicine.price * orderMedicine.quantity,
      }));

      const totalPrice = orderMedicines.reduce(
        (total, medicine) => total + medicine.total,
        0
      );

      return {
        ...order,
        totalPrice,
        orderMedicines,
      };
    });

    return {
      message: ErrorCode.SUCCESS,
      data: fullOrders,
    };
  }
}
module.exports = OrderService;
