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
}
module.exports = MedicineService;
