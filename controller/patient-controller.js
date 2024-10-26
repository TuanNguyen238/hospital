const PatientService = require("../service/patient-service.js");

class PatientController {
  #patientService;

  constructor() {
    this.#patientService = new PatientService();
  }

  async createPatient(req, res) {
    try {
      const message = await this.#patientService.createPatient(
        req.sub,
        req.body
      );
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getPatientsByPhoneNumber(req, res) {
    try {
      const patients = await this.#patientService.getPatientsByPhoneNumber(
        req.sub
      );
      res.status(200).json(patients);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = PatientController;
