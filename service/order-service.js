const EnumRole = require("../enum/enum-role.js");
const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const Status = require("../enum/status.js");
const MedicineRepository = require("../repository/medicine-repository.js");
const OrderRepository = require("../repository/order-repository.js");
const OrderMedicineRepository = require("../repository/orderMedicine-repository.js");
const RoleRepository = require("../repository/role-repository.js");
const UserRepository = require("../repository/user-repository.js");
const bcrypt = require("bcrypt");

class OrderService {
  #orderRepository;
  #userRepository;
  #medicineRepository;
  #roleRepository;
  #orderMedicineRepository;

  constructor() {
    this.#orderRepository = new OrderRepository();
    this.#userRepository = new UserRepository();
    this.#medicineRepository = new MedicineRepository();
    this.#roleRepository = new RoleRepository();
    this.#orderMedicineRepository = new OrderMedicineRepository();
  }

  async createOrder(order, idUserCreate) {
    if (order.id) {
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.INVALID_REQUEST,
      };
    }

    const clientId =
      order.clientId && order.clientId.trim() !== "" && order.clientId != null
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

    client = await this.#userRepository.findByPhoneNumber(clientId);

    const doctor = await this.#userRepository.findByPhoneNumber(idUserCreate);

    const medicineIds = order.medicines.map((med) => med.medicineId);
    const medicines = await this.#medicineRepository.findByIds(medicineIds);

    if (medicines.length !== medicineIds.length) {
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.MEDICINE_NOT_EXISTED,
      };
    }

    const orderMedicinesData = [];
    const errorMessages = [];

    for (const medicine of order.medicines) {
      const medicineData = medicines.find(
        (med) => med.id === medicine.medicineId
      );

      if (medicineData.status !== Status.ACTIVE)
        errorMessages.push({
          medicine: medicineData,
          message: ErrorCode.MEDICINE_DISABLED,
        });
      else if (medicineData.quantity < medicine.quantity)
        errorMessages.push({
          medicine: medicineData,
          message: ErrorCode.INSUFFICIENT_STOCK,
        });
      else
        orderMedicinesData.push({
          medicine: medicineData,
          quantity: medicine.quantity,
        });
    }
    if (errorMessages.length > 0) {
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.INVALID_REQUEST,
        data: errorMessages,
      };
    }

    const result = await this.#orderRepository.createOrderWithTransaction(
      { client, doctor },
      orderMedicinesData
    );

    return { message: ErrorCode.ORDER_CREATED, data: result };
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

    return { message: ErrorCode.SUCCESS, data: fullOrders };
  }

  async getAllOrderByPhoneNumber(phoneNumber) {
    const orders = await this.#orderRepository.getAllOrderByPhoneNumber(
      phoneNumber
    );

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

    return { message: ErrorCode.SUCCESS, data: fullOrders };
  }

  async getCount() {
    const count = await this.#orderRepository.getCount();
    return { message: ErrorCode.SUCCESS, data: count };
  }

  async getCountByMonth() {
    const year = new Date().getFullYear();
    const count = await this.#orderRepository.getCountByMonth(year);
    return { message: ErrorCode.SUCCESS, data: count };
  }

  async reset({ pass }) {
    if (pass != "23823")
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.UNAUTHENTICATED,
      };
    await this.#orderMedicineRepository.delete();
    await this.#medicineRepository.delete();

    await this.#orderRepository.delete();
    return { message: ErrorCode.RESET_ORDER_MEDICINE };
  }
}
module.exports = OrderService;
