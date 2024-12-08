const AppDataSource = require("../utils/database.js");
const DetailDoctor = require("../models/detailed-doctor.js");
const Status = require("../enum/status.js");

class DetailDoctorRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(DetailDoctor);
  }

  async saveDoctor(doctor) {
    await this.#repository.save(doctor);
  }

  async getDoctorById(id) {
    return await this.#repository.findOne({
      where: { id: id },
      relations: ["user"],
    });
  }

  async getAllDoctor() {
    return await this.#repository.find({
      relations: ["user"],
    });
  }

  async getDoctorByPhoneNumber(phoneNumber) {
    return await this.#repository.findOne({
      where: { user: { phoneNumber: phoneNumber } },
      relations: ["user"],
    });
  }
}

module.exports = DetailDoctorRepository;
