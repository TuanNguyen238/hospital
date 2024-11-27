const EnumRole = require("../enum/enum-role.js");
const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const Status = require("../enum/status.js");
const MedicineRepository = require("../repository/medicine-repository.js");
const OrderRepository = require("../repository/order-repository.js");
const OrderMedicineRepository = require("../repository/orderMedicine-repository.js");
const RewardPointRepository = require("../repository/rewardPoint-repository.js");
const UserRepository = require("../repository/user-repository.js");
const bcrypt = require("bcrypt");

class OrderService {
  #orderRepository;
  #userRepository;
  #medicineRepository;
  #orderMedicineRepository;
  #rewardRepository;

  constructor() {
    this.#orderRepository = new OrderRepository();
    this.#userRepository = new UserRepository();
    this.#medicineRepository = new MedicineRepository();
    this.#orderMedicineRepository = new OrderMedicineRepository();
    this.#rewardRepository = new RewardPointRepository();
  }

  async createOrder(order, idUserCreate) {
    if (order.id) {
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.INVALID_REQUEST,
      };
    }

    const isClient =
      order.clientId && order.clientId.trim() !== "" && order.clientId != null;
    const clientId = isClient ? order.clientId : idUserCreate;

    const point = await this.#rewardRepository.getRewardPointByPhoneNumber(
      clientId
    );
    if (!point)
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.USER_NOT_EXISTED,
      };

    const client = point.user;

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

    if (order.point > point.point)
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.REWARDPOINT_NOT_ENOUGH,
      };

    const usedPoint = order.point ? order.point : 0;
    const totalPrice = orderMedicinesData.reduce((total, orderMed) => {
      return total + orderMed.medicine.price * orderMed.quantity;
    }, 0);
    const createdAt = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);

    const result = await this.#orderRepository.createOrderWithTransaction(
      { client, doctor, usedPoint, totalPrice, createdAt },
      orderMedicinesData
    );

    point.point -= order.point;
    if (isClient) point.point += totalPrice * 0.005;
    await this.#rewardRepository.saveRewardPoint(point);

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

      return {
        ...order,
        orderMedicines,
      };
    });

    return { message: ErrorCode.SUCCESS, data: fullOrders };
  }

  async getDoctorOrderByPhoneNumber(phoneNumber) {
    const orders = await this.#orderRepository.getDoctorOrderByPhoneNumber(
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

      return {
        ...order,
        orderMedicines,
      };
    });

    return { message: ErrorCode.SUCCESS, data: fullOrders };
  }

  async getClientOrderByPhoneNumber(phoneNumber) {
    const orders = await this.#orderRepository.getClientOrderByPhoneNumber(
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

      // const totalPrice = orderMedicines.reduce(
      //   (total, medicine) => total + medicine.total,
      //   0
      // );

      return {
        ...order,
        // totalPrice,
        orderMedicines,
      };
    });

    return { message: ErrorCode.SUCCESS, data: fullOrders };
  }

  async getCount() {
    const count = await this.#orderRepository.getCount();
    return { message: ErrorCode.SUCCESS, data: count };
  }

  async getCountByMonth({ year }) {
    const count = await this.#orderRepository.getCountByMonth(Number(year));
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
