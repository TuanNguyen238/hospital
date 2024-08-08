const ErrorCode = require("../enum/error-code.js");
const MedicineRepository = require("../repository/medicine-repository.js");

class MedicineService {
  #medicineRepository;

  constructor() {
    this.#medicineRepository = new MedicineRepository();
  }

  async getCount() {
    return await this.#medicineRepository.getCount();
  }

  async createMedicine(medicine) {
    await this.#medicineRepository.saveMedicine(medicine);
    return {
      message: ErrorCode.MEDICINE_CREATED,
    };
  }

  async getAllMedicine() {
    return await this.#medicineRepository.getAllMedicine();
  }
}
module.exports = MedicineService;
