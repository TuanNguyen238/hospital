const EnumRole = require("./enum/enum-role.js");
const UserRepository = require("./repository/user-repository.js");
const RoleRepository = require("./repository/role-repository.js");
const bcrypt = require("bcrypt");
const MedicineRepository = require("./repository/medicine-repository.js");

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

        const usersData = {
          username: "admin",
          email: "tuannguyen23823@gmail.com",
          password: hashedPassword,
          phoneNumber: "0937837564",
          status: "active",
          role: adminRole,
        };
        await this.#userRepository.saveUser(usersData);
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
        },
        {
          name: "Atorvastatin (Lipitor)",
          description:
            "A statin medication that lowers cholesterol levels, reducing the risk of atherosclerosis and heart disease.",
        },
        {
          name: "Lisinopril",
          description:
            "An ACE inhibitor that lowers blood pressure and is used in the treatment of heart failure.",
        },
        {
          name: "Metoprolol (Lopressor, Toprol XL)",
          description:
            "A beta-blocker that reduces heart rate and blood pressure, used to treat angina and heart failure.",
        },
        {
          name: "Amlodipine (Norvasc)",
          description:
            "A calcium channel blocker that helps relax blood vessels and lower blood pressure, used in the treatment of hypertension and angina.",
        },
        {
          name: "Losartan (Cozaar)",
          description:
            "An angiotensin II receptor blocker (ARB) used to treat high blood pressure and heart failure.",
        },
        {
          name: "Warfarin (Coumadin)",
          description:
            "An anticoagulant that helps prevent blood clots, often used in conditions like atrial fibrillation or after heart valve surgery.",
        },
        {
          name: "Clopidogrel (Plavix)",
          description:
            "An antiplatelet drug that prevents platelets from clumping together, reducing the risk of clots in conditions like coronary artery disease.",
        },
        {
          name: "Digoxin",
          description:
            "Used to treat heart failure and atrial fibrillation, this drug increases the force of heart contractions and helps control heart rate.",
        },
        {
          name: "Nitroglycerin",
          description:
            "A vasodilator used to treat acute chest pain (angina) and to prevent angina attacks by relaxing blood vessels.",
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
