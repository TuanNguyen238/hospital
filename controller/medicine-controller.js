const MedicineService = require("../service/medicine-service");

class MedicineController {
  #medicineService;

  constructor() {
    this.#medicineService = new MedicineService();
  }

  async getCount(req, res) {
    try {
      const count = await this.#medicineService.getCount();
      res.status(200).json({ message: count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createMedicine(req, res) {
    try {
      const message = await this.#medicineService.createMedicine(req.body);
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAllMedicine(req, res) {
    try {
      const medicines = await this.#medicineService.getAllMedicine();
      res.status(200).json(medicines);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteMedicine(req, res) {
    try {
      const message = await this.#medicineService.deleteMedicine(req.query.id);
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = MedicineController;
