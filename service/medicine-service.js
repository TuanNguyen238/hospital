const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
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
    if (medicine.id) {
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.INVALID_REQUEST,
      };
    }

    medicine.createdAt = new Date();

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

  async deleteMedicine(data) {
    const { id } = data;
    if (!id) {
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.INVALID_REQUEST,
      };
    }
    const medicine = await this.#medicineRepository.findById(id);
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

  async updateMedicine({ id, name, description, level, price, quantity }) {
    const medicineData = await this.#medicineRepository.findById(id);
    if (!medicineData)
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.MEDICINE_NOT_EXISTED,
      };

    Object.assign(medicineData, { name, description, level, price, quantity });
    await this.#medicineRepository.saveMedicine(medicineData);

    return { message: ErrorCode.MEDICINE_UPDATED };
  }
}
module.exports = MedicineService;
