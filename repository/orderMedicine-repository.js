const OrderMedicine = require("../models/order-medicine");
const AppDataSource = require("../utils/database");

class OrderMedicineRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(OrderMedicine);
  }

  async findById(id) {
    return await this.#repository.findOneBy({ id: id });
  }

  async saveOrderMedicine(orderMedicine) {
    return await this.#repository.save(orderMedicine);
  }

  async getAllOrderMedicine() {
    return await this.#repository.find({ relations: ["medicine"] });
  }

  async delete() {
    await this.#repository.delete({});
  }
}

module.exports = OrderMedicineRepository;
