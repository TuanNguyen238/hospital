const Order = require("../models/order");
const OrderMedicine = require("../models/order-medicine");
const AppDataSource = require("../utils/configs");

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

        return savedOrder;
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
}

module.exports = OrderRepository;
