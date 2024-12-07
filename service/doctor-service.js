const EnumRole = require("../enum/enum-role.js");
const ErrorCode = require("../enum/error-code.js");
const StatusCode = require("../enum/status-code.js");
const dotenv = require("dotenv");
const DetailDoctorRepository = require("../repository/detailedDoctor-repository.js");

dotenv.config();

class DoctorService {
  #doctorRepository;

  constructor() {
    this.#doctorRepository = new DetailDoctorRepository();
  }

  async getAllDoctor() {
    const result = await this.#doctorRepository.getAllDoctor();

    return { message: ErrorCode.SUCCESS, data: result };
  }
}

module.exports = DoctorService;
