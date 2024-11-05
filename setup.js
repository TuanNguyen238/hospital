const EnumRole = require("./enum/enum-role.js");
const UserRepository = require("./repository/user-repository.js");
const RoleRepository = require("./repository/role-repository.js");
const bcrypt = require("bcrypt");
const MedicineRepository = require("./repository/medicine-repository.js");
const Status = require("./enum/status.js");

class Setup {
  #roleRepository;
  #userRepository;
  #medicineRepository;

  constructor() {
    this.#roleRepository = new RoleRepository();
    this.#userRepository = new UserRepository();
    this.#medicineRepository = new MedicineRepository();
  }

  async setupDatabase() {
    try {
      await this.setupRole(EnumRole.ADMIN, "admin role");
      await this.setupRole(EnumRole.USER, "user role");
      await this.setupRole(EnumRole.DOCTOR, "doctor role");
      await this.setupAdmin();

      await this.setupMedicine();
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

        const usersData1 = {
          username: "Tuan Nguyen",
          email: "tuannguyen23823@gmail.com",
          password: hashedPassword,
          phoneNumber: "0937837564",
          role: adminRole,
        };

        const usersData2 = {
          username: "Thuy Duyen",
          email: "lethithuyduyen230803@gmail.com",
          password: hashedPassword,
          phoneNumber: "0943640913",
          role: adminRole,
        };

        await this.#userRepository.saveUser(usersData1);
        await this.#userRepository.saveUser(usersData2);
        console.log("Users seeded.");
      } else console.log("Users table already exists.");
    } catch (err) {
      console.error(`Error setup Admin: ${err}`);
    }
  }

  async setupMedicine() {
    try {
      const medicines = [
        {
          name: "Aspirin",
          description:
            "A pain reliever and anti-inflammatory drug that helps prevent blood clots, used in the prevention of heart attacks and strokes.",
          level: 1,
          price: 5000.0,
          quantity: 5,
          createdAt: new Date(new Date().setMonth(new Date().getMonth() - 10)),
        },
        {
          name: "Atorvastatin (Lipitor)",
          description:
            "A statin medication that lowers cholesterol levels, reducing the risk of atherosclerosis and heart disease.",
          level: 1,
          price: 5000.0,
          createdAt: new Date(new Date().setMonth(new Date().getMonth() - 3)),
        },
        {
          name: "Lisinopril",
          description:
            "An ACE inhibitor that lowers blood pressure and is used in the treatment of heart failure.",
          level: 1,
          price: 5000.0,
          quantity: 5,
          createdAt: new Date(new Date().setMonth(new Date().getMonth() - 4)),
        },
        {
          name: "Metoprolol (Lopressor, Toprol XL)",
          description:
            "A beta-blocker that reduces heart rate and blood pressure, used to treat angina and heart failure.",
          level: 1,
          price: 5000.0,
          createdAt: new Date(new Date().setMonth(new Date().getMonth() - 3)),
        },
        {
          name: "Amlodipine (Norvasc)",
          description:
            "A calcium channel blocker that helps relax blood vessels and lower blood pressure, used in the treatment of hypertension and angina.",
          level: 1,
          price: 5000.0,
          createdAt: new Date(new Date().setMonth(new Date().getMonth() - 3)),
        },
        {
          name: "Losartan (Cozaar)",
          description:
            "An angiotensin II receptor blocker (ARB) used to treat high blood pressure and heart failure.",
          level: 1,
          price: 5000.0,
          createdAt: new Date(new Date().setMonth(new Date().getMonth() - 2)),
        },
        {
          name: "Warfarin (Coumadin)",
          description:
            "An anticoagulant that helps prevent blood clots, often used in conditions like atrial fibrillation or after heart valve surgery.",
          level: 1,
          price: 5000.0,
          quantity: 5,
          createdAt: new Date(new Date().setMonth(new Date().getMonth() - 4)),
        },
        {
          name: "Clopidogrel (Plavix)",
          description:
            "An antiplatelet drug that prevents platelets from clumping together, reducing the risk of clots in conditions like coronary artery disease.",
          level: 1,
          price: 5000.0,
          createdAt: new Date(new Date().setMonth(new Date().getMonth() - 4)),
        },
        {
          name: "Digoxin",
          description:
            "Used to treat heart failure and atrial fibrillation, this drug increases the force of heart contractions and helps control heart rate.",
          level: 1,
          price: 5000.0,
          createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
        {
          name: "Nitroglycerin",
          description:
            "A vasodilator used to treat acute chest pain (angina) and to prevent angina attacks by relaxing blood vessels.",
          level: 1,
          price: 5000.0,
          quantity: 4,
          createdAt: new Date(),
        },
      ];

      for (const medicine of medicines) {
        const existingMedicine = await this.#medicineRepository.findByName(
          medicine.name
        );
        if (!existingMedicine) {
          await this.#medicineRepository.saveMedicine(medicine);
          console.log(`${medicine.name} seeded.`);
        }
      }
    } catch (err) {
      console.error(`Error setup Medicine: ${err}`);
    }
  }
}

module.exports = Setup;
