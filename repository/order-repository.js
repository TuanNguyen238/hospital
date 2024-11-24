const { Between } = require("typeorm");
const Order = require("../models/order");
const OrderMedicine = require("../models/order-medicine");
const AppDataSource = require("../utils/database");
const Medicine = require("../models/medicine");

class OrderRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(Order);
  }

  async findById(id) {
    return await this.#repository.findOneBy({ id: id });
  }

  async saveOrder(order) {
    return await this.#repository.save(order);
  }

  async getCount() {
    const result = await this.#repository
      .createQueryBuilder("order")
      .select("COUNT(order.id)", "totalOrders")
      .addSelect("SUM(order.totalPrice)", "totalRevenue")
      .addSelect("SUM(order.totalPrice - order.usedPoint)", "actualRevenue")
      .getRawOne();

    return {
      totalOrders: parseInt(result.totalOrders || 0, 10),
      totalPrice: parseFloat(result.totalRevenue || 0),
      discountedPrice: parseFloat(result.actualRevenue || 0),
    };
  }

  async createOrderWithTransaction(orderData, orderMedicinesData) {
    return await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        const savedOrder = await transactionalEntityManager.save(
          Order,
          orderData
        );
        const orderMedicines = orderMedicinesData.map((orderMed) => ({
          ...orderMed,
          order: savedOrder,
        }));

        await transactionalEntityManager.save(OrderMedicine, orderMedicines);

        const medicinesToUpdate = orderMedicines.map((orderMed) => {
          orderMed.medicine.quantity -= orderMed.quantity;
          return orderMed.medicine;
        });

        await transactionalEntityManager.save(Medicine, medicinesToUpdate);

        return {
          ...savedOrder,
          orderMedicines: orderMedicines.map((orderMed) => ({
            id: orderMed.id,
            medicine: orderMed.medicine,
            quantity: orderMed.quantity,
          })),
        };
      }
    );
  }

  async getAllOrder() {
    return await this.#repository.find({
      relations: [
        "client",
        "doctor",
        "orderMedicines",
        "orderMedicines.medicine",
      ],
      select: {
        client: { username: true },
        doctor: { username: true },
        orderMedicines: {
          id: true,
          quantity: true,
          medicine: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
      },
    });
  }

  async getDoctorOrderByPhoneNumber(phoneNumber) {
    return await this.#repository.find({
      where: [{ doctor: { phoneNumber: phoneNumber } }],
      relations: ["client", "orderMedicines", "orderMedicines.medicine"],
      select: {
        client: { username: true },
        orderMedicines: {
          id: true,
          quantity: true,
          medicine: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
      },
    });
  }

  async getClientOrderByPhoneNumber(phoneNumber) {
    return await this.#repository.find({
      where: [{ client: { phoneNumber: phoneNumber } }],
      relations: ["client", "orderMedicines", "orderMedicines.medicine"],
      select: {
        client: { username: true },
        orderMedicines: {
          id: true,
          quantity: true,
          medicine: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
      },
    });
  }

  async getCountByMonth(year) {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    const orders = await this.#repository.find({
      where: {
        createdAt: Between(start, end),
      },
    });

    const result = Array(12)
      .fill(null)
      .map(() => ({
        count: 0,
        totalPrice: 0,
        discountedPrice: 0,
      }));

    orders.forEach((order) => {
      const month = order.createdAt.getMonth();
      result[month].count += 1;
      result[month].totalPrice += parseFloat(order.totalPrice);
      const discounted =
        parseFloat(order.totalPrice) - parseFloat(order.usedPoint);
      result[month].discountedPrice += discounted;
    });

    return result;
  }

  async delete() {
    await this.#repository.delete({});
  }
}

module.exports = OrderRepository;
