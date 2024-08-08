const MedicineService = require("../service/medicine-service");

class MedicineController {
  #medicineService;

  constructor() {
    this.#medicineService = new MedicineService();
  }

  async getCount(req, res) {
    try {
      const message = await this.#medicineService.getCount();
      res.status(200).json({ message: count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = MedicineController;
