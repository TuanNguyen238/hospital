const AppDataSource = require("../utils/database.js");
const Medicine = require("../models/medicine.js");
const { In, Between } = require("typeorm");
const sharp = require("sharp");
const { cloudinary } = require("../utils/cloudinary.js");
class MedicineRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(Medicine);
  }

  async findById(id) {
    return await this.#repository.findOneBy({ id: id });
  }

  async findByIds(ids) {
    return await this.#repository.findBy({ id: In(ids) });
  }

  async findByName(name) {
    return await this.#repository.findOneBy({ name: name });
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

  async delete() {
    await this.#repository.delete({});
  }

  async getCountByMonth(year) {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    const medicines = await this.#repository.find({
      where: {
        createdAt: Between(start, end),
      },
      select: ["createdAt"],
    });

    const result = Array(12).fill(0);

    medicines.forEach((medicine) => {
      const month = medicine.createdAt.getMonth();
      result[month] += 1;
    });

    return result;
  }

  async getImageById(publicId) {
    const image = await cloudinary.api.resource(publicId);
    return image;
  }

  async uploadImage(imagePath) {
    const result = await cloudinary.uploader.upload(imagePath);
    console.log("Image uploaded:", result);
    return result.url;
  }

  async getImageByURL(imageURL) {
    const { resources } = await cloudinary.search
      .expression(`url:${imageURL}`)
      .max_results(1)
      .execute();

    return resources.length > 0 ? resources[0] : null;
  }
}

module.exports = MedicineRepository;
