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

  async deleteMedicine(id) {
    const medicine = await this.#medicineRepository.getMedicineById(id);
    if (!medicine) throw new Error(ErrorCode.MEDICINE_NOT_EXISTED);
    await this.#medicineRepository.deleteMedicine(id);
    return {
      message: ErrorCode.MEDICINE_DELETED,
    };
  }

  async updateMedicine({ id, name, description }) {
    const medicine = await this.#medicineRepository.findById(id);
    if (!medicine) throw new Error(ErrorCode.MEDICINE_NOT_EXISTED);

    Object.assign(medicine, { name, description });
    await this.#medicineRepository.saveMedicine(medicine);

    return {
      message: ErrorCode.MEDICINE_UPDATED,
    };
  }
}
module.exports = MedicineService;
