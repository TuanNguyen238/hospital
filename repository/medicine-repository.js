const AppDataSource = require("../utils/database.js");
const Medicine = require("../models/medicine.js");
const { In, Between } = require("typeorm");
const { cloudinary } = require("../utils/cloudinary.js");
const path = require("path");
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
    try {
      const image = await cloudinary.api.resource(publicId);
      console.log("Image found:", image);
      return image;
    } catch (err) {
      if (err.http_code === 404) {
        console.error(`Image with publicId ${publicId} not found.`);
      } else {
        console.error("Error retrieving image:", err);
      }
      return null; // Nếu không tìm thấy ảnh hoặc có lỗi khác
    }
  }

  async uploadImage(imagePath) {
    const imageName = path.basename(imagePath, path.extname(imagePath));
    const result = await cloudinary.uploader.upload(imagePath, {
      resource_type: "auto",
      folder: "medicine",
      public_id: imageName,
    });
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
