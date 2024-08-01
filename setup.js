const EnumRole = require("./enum/enum-role.js");
const UserRepository = require("./repository/user-repository.js");
const RoleRepository = require("./repository/role-repository.js");
const bcrypt = require("bcrypt");

class Setup {
  #roleRepository;
  #userRepository;

  constructor() {
    this.#roleRepository = new RoleRepository();
    this.#userRepository = new UserRepository();
  }

  async setupDatabase() {
    try {
      await this.setupRole(EnumRole.ADMIN, "admin role");
      await this.setupRole(EnumRole.USER, "user role");
      await this.setupRole(EnumRole.DOCTOR, "doctor role");

      await this.setupAdmin();
    } catch (err) {
      console.error("Error occurred:", err);
    }
  }

  async setupRole(name, description) {
    try {
      let role = await this.#roleRepository.getRole(name);
      if (!role) {
        role = this.#roleRepository.createEntity(name, description);
        await this.#roleRepository.createRole(role);
        console.log(`${name} role created.`);
      }
    } catch (err) {
      console.error(`Error setup Role ${name}: ${err}`);
    }
  }

  async setupAdmin() {
    try {
      const users = await this.#userRepository.getAllUsers();
      if (users.length === 0) {
        console.log("Users table does not exist or is empty. Seeding data...");
        let adminRole = await this.#roleRepository.getRole(EnumRole.ADMIN);

        const hashedPassword = await bcrypt.hash("admin", 10);

        const usersData = [
          {
            username: "admin",
            email: "tuannguyen23823@gmail.com",
            password: hashedPassword,
            phoneNumber: "0937837564",
            status: "active",
            role: adminRole,
          },
        ];
        await this.#userRepository.saveUser(usersData);
        console.log("Users seeded.");
      } else console.log("Users table already exists.");
    } catch (err) {
      console.error(`Error setup Admin: ${err}`);
    }
  }
}

module.exports = Setup;
