const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const Status = require("../enum/status.js");
const MedicineRepository = require("../repository/medicine-repository.js");
const fs = require("fs");
const { DEFAULT_MEDICINE } = require("../utils/const.js");

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

    if (medicine.id) {
      throw {
        status: StatusCode.HTTP_400_BAD_REQUEST,
        message: ErrorCode.INVALID_REQUEST,
      };
    }
    medicine.imageUrl = DEFAULT_MEDICINE;

    const image = await this.#medicineRepository.getImageById(medicine.name);
    if (image) medicine.imageUrl = image.url;
    else if (file) {
      try {
        const result = await this.#medicineRepository.uploadImage(
          file.path,
          medicine.name
        );
        medicine.imageUrl = result;

        await fs.promises.unlink(file.path);
        console.log("File đã được xóa:", file.path);
      } catch (err) {
        console.error("Lỗi trong quá trình xử lý file:", err);
      }
    }
    medicine.createdAt = new Date();

    await this.#medicineRepository.saveMedicine(medicine);
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

  async updateMedicine(
    { id, name, description, level, price, quantity },
    file
  ) {
    const medicineData = await this.#medicineRepository.findById(id);
    if (!medicineData)
      throw {
        status: StatusCode.HTTP_404_NOT_FOUND,
        message: ErrorCode.MEDICINE_NOT_EXISTED,
      };
    let imageUrl = medicineData.imageUrl;
    const image = await this.#medicineRepository.getImageById(name);
    if (image) imageUrl = image.url;
    else if (file) {
      try {
        const result = await this.#medicineRepository.uploadImage(
          file.path,
          name
        );
        imageUrl = result;

        await fs.promises.unlink(file.path);
        console.log("File đã được xóa:", file.path);
      } catch (err) {
        console.error("Lỗi trong quá trình xử lý file:", err);
      }
    }

    Object.assign(medicineData, {
      name,
      description,
      level,
      price,
      quantity,
      imageUrl,
    });
    await this.#medicineRepository.saveMedicine(medicineData);

    return { message: ErrorCode.MEDICINE_UPDATED };
  }
}
module.exports = MedicineService;
