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
    return await this.#repository.find();
  }

  async createEntity(client, doctor) {
    return this.#repository.create({
      client: client,
      doctor: doctor,
      createdAt: new Date(),
    });
  }
}

module.exports = OrderRepository;
