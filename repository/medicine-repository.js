const AppDataSource = require("../utils/configs");
const Medicine = require("../models/medicine.js");

class MedicineRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(Medicine);
  }

  async findByName(name) {
    return await this.#repository.findOne({ where: { name } });
  }

  async getCount() {
    return await this.#repository.count();
  }

  async saveMedicine(medicine) {
    return await this.#repository.save(medicine);
  }

  async getAllMedicine() {
    return await this.#repository.find();
  }

  async deleteMedicine(id) {
    await this.#repository.delete({ id: id });
  }

  async getMedicineById(id) {
    return await this.#repository.findOneBy({ id: id });
  }
}

module.exports = MedicineRepository;
