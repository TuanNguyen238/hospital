const Order = require("../models/order");
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

  async getAllOrder() {
    return await this.#repository.find({
      relations: [
        "client",
        "doctor",
        "orderMedicines",
        "orderMedicines.medicine",
      ],
      select: {
        client: { name: true },
        doctor: { name: true },
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
