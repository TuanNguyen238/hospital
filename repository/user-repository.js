const { Between } = require("typeorm");
const EnumRole = require("../enum/enum-role.js");
const User = require("../models/user.js");
const AppDataSource = require("../utils/database.js");

class UserRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(User);
  }

  async getUserById(id) {
    return await this.#repository.findOne({
      where: { id: id },
      relations: ["role"],
    });
  }

  async saveUser(user) {
    return await this.#repository.save(user);
  }

  async getAllUsers() {
    return await this.#repository.find({ relations: ["role"] });
  }

  async findByPhoneNumber(phoneNumber) {
    return await this.#repository.findOne({
      where: { phoneNumber: phoneNumber },
      relations: ["role"],
    });
  }

  async getCount(role) {
    const roles = [EnumRole.USER, EnumRole.DOCTOR, EnumRole.ADMIN];
    const result = {};
    let total = 0;

    for (const role of roles) {
      const count = await this.#repository.count({
        where: { role: { name: role } },
      });
      result[role] = count;
      total += count;
    }

    result.total = total;

    return result;
  }

  async getUserCountByMonthAndRole(year) {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    const users = await this.#repository.find({
      where: {
        createdAt: Between(start, end),
      },
      select: ["createdAt"],
      relations: ["role"],
    });

    const userCount = {
      user: Array(12).fill(0),
      doctor: Array(12).fill(0),
      admin: Array(12).fill(0),
    };

    users.forEach((user) => {
      const month = user.createdAt.getMonth();
      const roleName = user.role?.name;

      if (roleName === EnumRole.USER) userCount.user[month] += 1;
      else if (roleName === EnumRole.DOCTOR) userCount.doctor[month] += 1;
      else if (roleName === EnumRole.ADMIN) userCount.admin[month] += 1;
    });

    return {
      user: userCount.user,
      doctor: userCount.doctor,
      admin: userCount.admin,
    };
  }
}

module.exports = UserRepository;
