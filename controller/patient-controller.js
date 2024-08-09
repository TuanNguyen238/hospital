const PatientService = require("../service/patient-service.js");

class PatientController {
  #patientService;

  constructor() {
    this.#patientService = new PatientService();
  }

  async createPatient(req, res) {
    try {
      const message = await this.#patientService.createPatient(req.body);
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getPatientByPhoneNumber(req, res) {
    try {
      const patients = await this.#patientService.getPatientByPhoneNumber(
        req.query.phoneNumber
      );
      res.status(200).json(patients);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = PatientController;
