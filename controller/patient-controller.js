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

  async getPatientByUserId(req, res) {
    try {
      const id = req.body;
      const patients = await this.#patientService.getPatientByUserId(id);
      res.status(200).json(patients);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = PatientController;
