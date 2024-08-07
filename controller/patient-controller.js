const PatientService = require("../service/patient-service.js");

class PatientController {
  #patientService;

  constructor() {
    this.#patientService = new PatientService();
  }

  async createPatient(req, res) {
    try {
      const obj = req.body;
      const message = await this.#patientService.createPatient(obj);
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getPatientById(req, res) {
    try {
      const id = req.body;
      const otps = await this.#patientService.getPatientById(id);
      res.status(200).json(otps);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = PatientController;
