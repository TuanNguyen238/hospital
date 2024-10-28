const ErrorCode = require("../enum/error-code.js");
const MedicineRepository = require("../repository/medicine-repository.js");

class MedicineService {
  #medicineRepository;

  constructor() {
    this.#medicineRepository = new MedicineRepository();
  }

  async getCount() {
    const count = await this.#medicineRepository.getCount();
    return {
      message: ErrorCode.SUCCESS,
      data: count,
    };
  }

  async createMedicine(medicine) {
    await this.#medicineRepository.saveMedicine(medicine);
    return { message: ErrorCode.MEDICINE_CREATED };
  }

  async getAllMedicine() {
    const medicines = await this.#medicineRepository.getAllMedicine();
    return {
      message: ErrorCode.SUCCESS,
      data: medicines,
    };
  }

  async deleteMedicine(id) {
    const medicine = await this.#medicineRepository.getMedicineById(id);
    if (!medicine)
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.MEDICINE_NOT_EXISTED,
      };
    await this.#medicineRepository.deleteMedicine(id);
    return {
      message: ErrorCode.MEDICINE_DELETED,
    };
  }

  async updateMedicine({ id, name, description }) {
    const medicine = await this.#medicineRepository.findById(id);
    if (!medicine)
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.MEDICINE_NOT_EXISTED,
      };

    Object.assign(medicine, { name, description });
    await this.#medicineRepository.saveMedicine(medicine);

    return { message: ErrorCode.MEDICINE_UPDATED };
  }
}
module.exports = MedicineService;
