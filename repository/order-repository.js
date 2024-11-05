const { Between } = require("typeorm");
const Order = require("../models/order");
const OrderMedicine = require("../models/order-medicine");
const AppDataSource = require("../utils/configs");
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
    return await this.#repository.count();
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

        let totalPrice = 0;

        for (const orderMed of orderMedicines) {
          orderMed.medicine.quantity -= orderMed.quantity;
          totalPrice += orderMed.medicine.price * orderMed.quantity;
          await transactionalEntityManager.save(Medicine, orderMed.medicine);
        }

        return {
          order: {
            ...savedOrder,
            orderMedicines: orderMedicines.map((orderMed) => ({
              medicine: orderMed.medicine,
              quantity: orderMed.quantity,
              id: orderMed.id,
            })),
          },
          totalPrice: totalPrice,
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

  async getAllOrderByPhoneNumber(phoneNumber) {
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

  async getCountByMonth(year) {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    const orders = await this.#repository.find({
      where: {
        createdAt: Between(start, end),
      },
      select: ["createdAt"],
    });

    const result = Array(12).fill(0);

    orders.forEach((order) => {
      const month = order.createdAt.getMonth();
      result[month] += 1;
    });

    return result;
  }
}

module.exports = OrderRepository;
