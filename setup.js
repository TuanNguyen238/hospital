const EnumRole = require("./enum/enum-role.js");
const UserRepository = require("./repository/user-repository.js");
const RoleRepository = require("./repository/role-repository.js");
const bcrypt = require("bcrypt");
const MedicineRepository = require("./repository/medicine-repository.js");
const path = require("path");
const fs = require("fs");
const { setDefaultMedicineUrl, DEFAULT_MEDICINE } = require("./utils/const.js");
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
      await this.setupRoles();
      await this.setupAdmin();

      await this.setupMedicine();
    } catch (err) {
      console.error("Error occurred:", err);
    }
  }

  async setupRoles() {
    try {
      const roles = [
        { name: EnumRole.ADMIN, description: "admin role" },
        { name: EnumRole.USER, description: "user role" },
        { name: EnumRole.DOCTOR, description: "doctor role" },
        { name: EnumRole.STAFF, description: "staff role" },
      ];

      const existingRoles = await this.#roleRepository.getAllRoles();
      const existingRoleNames = new Set(existingRoles.map((role) => role.name));

      const newRoles = roles.filter(
        (role) => !existingRoleNames.has(role.name)
      );

      if (newRoles.length > 0) {
        await this.#roleRepository.createRole(newRoles);
        console.log(`${newRoles.length} roles created.`);
      } else console.log("All roles already exist.");
    } catch (err) {
      console.error("Error setting up roles:", err);
    }
  }

  async setupAdmin() {
    try {
      const users = await this.#userRepository.getAllUsers();
      if (users.length === 0) {
        console.log("Users table does not exist or is empty. Seeding data...");
        const adminRole = await this.#roleRepository.getRole(EnumRole.ADMIN);

        const hashedPassword = await bcrypt.hash("admin", 10);

        const usersData = [
          {
            username: "Tuan Nguyen",
            email: "tuannguyen23823@gmail.com",
            password: hashedPassword,
            phoneNumber: "0937837564",
            role: adminRole,
            createdAt: new Date(2024, 5, 1),
          },
          {
            username: "Thuy Duyen",
            email: "lethithuyduyen230803@gmail.com",
            password: hashedPassword,
            phoneNumber: "0943640913",
            role: adminRole,
            createdAt: new Date(2024, 6, 5),
          },
        ];

        await this.#userRepository.saveUser(usersData);
        console.log("Users seeded.");
      } else console.log("Users table already exists.");
    } catch (err) {
      console.error(`Error setting up Admin: ${err}`);
    }
  }

  async setupMedicine() {
    try {
      const publicId = "default_medicine";
      let image = await this.#medicineRepository.getImageById(publicId);

      if (image) setDefaultMedicineUrl(image.url);
      else {
        const imagePath = path.resolve(
          __dirname,
          "./assets/default_medicine.jpg"
        );

        if (!fs.existsSync(imagePath)) {
          console.error(
            "File default_medicine.jpg không tồn tại tại đường dẫn:",
            imagePath
          );
          throw new Error("File default_medicine.jpg không tồn tại.");
        } else {
          const uploadedImage = await this.#medicineRepository.uploadImage(
            imagePath,
            publicId
          );
          setDefaultMedicineUrl(uploadedImage);
        }
      }

      const medicines = [
        {
          name: "Aspirin",
          description:
            "A pain reliever and anti-inflammatory drug that helps prevent blood clots, used in the prevention of heart attacks and strokes.",
          level: 1,
          price: 5000.0,
          quantity: 50,
          createdAt: new Date(new Date().setMonth(new Date().getMonth() - 10)),
          imageUrl: DEFAULT_MEDICINE.value,
        },
        {
          name: "Atorvastatin (Lipitor)",
          description:
            "A statin medication that lowers cholesterol levels, reducing the risk of atherosclerosis and heart disease.",
          level: 1,
          price: 5000.0,
          quantity: 50,
          createdAt: new Date(new Date().setMonth(new Date().getMonth() - 3)),
          imageUrl: DEFAULT_MEDICINE.value,
        },
        {
          name: "Lisinopril",
          description:
            "An ACE inhibitor that lowers blood pressure and is used in the treatment of heart failure.",
          level: 1,
          price: 5000.0,
          quantity: 50,
          createdAt: new Date(new Date().setMonth(new Date().getMonth() - 4)),
          imageUrl: DEFAULT_MEDICINE.value,
        },
        {
          name: "Metoprolol (Lopressor, Toprol XL)",
          description:
            "A beta-blocker that reduces heart rate and blood pressure, used to treat angina and heart failure.",
          level: 1,
          price: 5000.0,
          quantity: 50,
          createdAt: new Date(new Date().setMonth(new Date().getMonth() - 3)),
          imageUrl: DEFAULT_MEDICINE.value,
        },
        {
          name: "Amlodipine (Norvasc)",
          description:
            "A calcium channel blocker that helps relax blood vessels and lower blood pressure, used in the treatment of hypertension and angina.",
          level: 1,
          price: 5000.0,
          quantity: 50,
          createdAt: new Date(new Date().setMonth(new Date().getMonth() - 3)),
          imageUrl: DEFAULT_MEDICINE.value,
        },
        {
          name: "Losartan (Cozaar)",
          description:
            "An angiotensin II receptor blocker (ARB) used to treat high blood pressure and heart failure.",
          level: 1,
          price: 5000.0,
          quantity: 50,
          createdAt: new Date(new Date().setMonth(new Date().getMonth() - 2)),
          imageUrl: DEFAULT_MEDICINE.value,
        },
        {
          name: "Warfarin (Coumadin)",
          description:
            "An anticoagulant that helps prevent blood clots, often used in conditions like atrial fibrillation or after heart valve surgery.",
          level: 1,
          price: 5000.0,
          quantity: 5,
          quantity: 50,
          createdAt: new Date(new Date().setMonth(new Date().getMonth() - 4)),
          imageUrl: DEFAULT_MEDICINE.value,
        },
        {
          name: "Clopidogrel (Plavix)",
          description:
            "An antiplatelet drug that prevents platelets from clumping together, reducing the risk of clots in conditions like coronary artery disease.",
          level: 1,
          price: 5000.0,
          quantity: 50,
          createdAt: new Date(new Date().setMonth(new Date().getMonth() - 4)),
          imageUrl: DEFAULT_MEDICINE.value,
        },
        {
          name: "Digoxin",
          description:
            "Used to treat heart failure and atrial fibrillation, this drug increases the force of heart contractions and helps control heart rate.",
          level: 1,
          price: 5000.0,
          quantity: 50,
          createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          imageUrl: DEFAULT_MEDICINE.value,
        },
        {
          name: "Nitroglycerin",
          description:
            "A vasodilator used to treat acute chest pain (angina) and to prevent angina attacks by relaxing blood vessels.",
          level: 1,
          price: 5000.0,
          quantity: 50,
          createdAt: new Date(new Date().getTime() + 7 * 60 * 60 * 1000),
          imageUrl: DEFAULT_MEDICINE.value,
        },
      ];
      const existingMedicines = await this.#medicineRepository.findByNames(
        medicines.map((medicine) => medicine.name)
      );

      const existingNames = new Set(existingMedicines.map((med) => med.name));
      const newMedicines = medicines.filter(
        (medicine) => !existingNames.has(medicine.name)
      );

      if (newMedicines.length > 0) {
        await this.#medicineRepository.saveMedicine(newMedicines);
        console.log("Medicines seeded.");
      } else {
        console.log("All medicines already exist.");
      }
    } catch (err) {
      console.error(`Error setting up medicines: ${err}`);
    }
  }
}

module.exports = Setup;
