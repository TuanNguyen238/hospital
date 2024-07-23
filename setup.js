const AppDataSource = require("./utils/configs.js");
const User = require("./models/user.js");
const Role = require("./models/role.js");
const EnumRole = require("./enum/enum-role.js");

class Setup {
  #roleRepository;
  #userRepository;
  constructor() {
    this.#roleRepository = AppDataSource.getRepository(Role);
    this.#userRepository = AppDataSource.getRepository(User);
  }
  async setupDatabase() {
    try {
      await this.setupRole(EnumRole.ADMIN, "admin role");
      await this.setupRole(EnumRole.USER, "user role");

      await this.setupAdmin();
    } catch (err) {
      console.error("Error occurred:", err);
    }
  }

  async setupRole(name, description) {
    try {
      let role = await this.#roleRepository.findOneBy({ name: name });
      if (!role) {
        role = this.#roleRepository.create({
          name: name,
          description: description,
        });
        await this.#roleRepository.save(role);
        console.log(`${name} role created.`);
      }
    } catch (err) {
      console.error(`Error setup Role ${name}: ${err}`);
    }
  }

  async setupAdmin() {
    try {
      const users = await this.#userRepository.find();
      if (users.length === 0) {
        console.log("Users table does not exist or is empty. Seeding data...");
        let adminRole = await this.#roleRepository.findOneBy({
          name: EnumRole.ADMIN,
        });
        const usersData = [
          {
            username: "admin",
            email: "tuannguyen23823@gmail.com",
            password: "admin",
            phoneNumber: "0937837564",
            status: "active",
            roles: [adminRole],
          },
        ];
        await this.#userRepository.save(usersData);
        console.log("Users seeded.");
      } else {
        console.log("Users table already exists.");
      }
    } catch (err) {
      console.error(`Error setup Admin: ${err}`);
    }
  }
}

module.exports = Setup;
