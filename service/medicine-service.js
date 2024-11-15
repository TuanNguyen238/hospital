const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const Status = require("../enum/status.js");
const MedicineRepository = require("../repository/medicine-repository.js");

class MedicineService {
  #medicineRepository;

  constructor() {
    this.#medicineRepository = new MedicineRepository();
  }

  async getCount() {
    const count = await this.#medicineRepository.getCount();
    return { message: ErrorCode.SUCCESS, data: count };
  }

  async getCountByMonth() {
    const year = new Date().getFullYear();
    const count = await this.#medicineRepository.getCountByMonth(year);
    return { message: ErrorCode.SUCCESS, data: count };
  }

  async createMedicine(medicine, file) {
    console.log("MEDICINE: ", medicine);
    console.log("FILE: ", file);
    // if (medicine.id) {
    //   throw {
    //     status: StatusCode.HTTP_400_BAD_REQUEST,
    //     message: ErrorCode.INVALID_REQUEST,
    //   };
    // }

    // if (file) {
    //   const result = await cloudinary.uploader.upload(req.file.path, {
    //     folder: "medicine",
    //   });
    //   imageUrl = result.secure_url;
    // }

    // medicine.createdAt = new Date();

    // await this.#medicineRepository.saveMedicine(medicine);
    return { message: ErrorCode.MEDICINE_CREATED };
  }

  async importMedicine(req) {
    const medicinesArray = Object.values(req);

    const medicinesToSave = [];
    const errorMessages = [];

    medicinesArray.forEach((medicine) => {
      if (medicine.id) {
        errorMessages.push(medicine);
      } else
        medicinesToSave.push({
          ...medicine,
          createdAt: new Date(),
        });
    });

    const saveMedicine = await this.#medicineRepository.saveMedicine(
      medicinesToSave
    );

    if (errorMessages.length > 0) {
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.INVALID_REQUEST,
        data: errorMessages,
      };
    }

    return {
      message: ErrorCode.MEDICINE_IMPORTED,
      data: saveMedicine,
    };
  }

  async getAllMedicine() {
    const medicines = await this.#medicineRepository.getAllMedicine();
    return { message: ErrorCode.SUCCESS, data: medicines };
  }

  async updateStatus({ id }) {
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
    const status =
      medicine.status === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE;
    Object.assign(medicine, { status });
    await this.#medicineRepository.saveMedicine(medicine);
    return { message: ErrorCode.STATUS_UPDATED };
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
