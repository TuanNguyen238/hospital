const { In } = require("typeorm");
const MedicalRecord = require("../models/medical-record");
const AppDataSource = require("../utils/database");
const Prescription = require("../models/prescription");
const Dosage = require("../models/dosage");
const { cloudinary } = require("../utils/cloudinary");
const DetailedRecord = require("../models/detailed-record");

class RecordRepository {
  #repository;

  constructor() {
    this.#repository = AppDataSource.getRepository(MedicalRecord);
  }

  async getCountById(id) {
    return await this.#repository.count({
      where: { patient: { id: id } },
    });
  }

  async saveRecord(record) {
    return await this.#repository.save(record);
  }

  async findRecordsByPatientCodes(patientCodes) {
    return await this.#repository.find({
      where: { patient: { patientCode: In(patientCodes) } },
      relations: ["patient", "examRoom"],
    });
  }

  async generateRecordCode() {
    const lastRecord = await this.#repository
      .createQueryBuilder("medicalRecords")
      .orderBy("medicalRecords.recordCode", "DESC")
      .getOne();

    if (!lastRecord) {
      return "R000000001";
    }

    const lastCode = parseInt(lastRecord.recordCode.replace("R", ""), 10);
    const newCode = lastCode + 1;
    return `R${newCode.toString().padStart(9, "0")}`;
  }

  async getMedicalRecordsByPatientCode(patientCode) {
    try {
      const medicalRecords = await this.#repository
        .createQueryBuilder("medicalRecord")
        .leftJoinAndSelect("medicalRecord.patient", "patient")
        .leftJoinAndSelect("medicalRecord.prescription", "prescription")
        .leftJoinAndSelect("medicalRecord.detailedRecord", "detailedRecord")
        .leftJoinAndSelect("medicalRecord.examRoom", "examRoom")
        .leftJoinAndSelect("prescription.dosages", "dosages")
        .leftJoinAndSelect("dosages.medicine", "medicine")
        .where("patient.patientCode = :patientCode", { patientCode })
        .getMany();

      return medicalRecords;
    } catch (error) {
      console.error("Error fetching medical records:", error);
      throw error;
    }
  }

  async getRecordsByUserPhoneNumber(phoneNumber) {
    try {
      const records = await this.#repository
        .createQueryBuilder("medicalRecord")
        .leftJoinAndSelect("medicalRecord.patient", "patient")
        .leftJoinAndSelect("medicalRecord.prescription", "prescription")
        .leftJoinAndSelect("medicalRecord.detailedRecord", "detailedRecord")
        .leftJoinAndSelect("medicalRecord.examRoom", "examRoom")
        .leftJoinAndSelect("prescription.dosages", "dosages")
        .leftJoinAndSelect("dosages.medicine", "medicine")
        .leftJoin("patient.user", "user")
        .where("user.phoneNumber = :phoneNumber", { phoneNumber })
        .getMany();

      return records;
    } catch (error) {
      console.error("Error fetching records by user phone number:", error);
      throw error;
    }
  }

  async getMedicalRecords() {
    try {
      const medicalRecords = await this.#repository
        .createQueryBuilder("medicalRecord")
        .leftJoinAndSelect("medicalRecord.patient", "patient")
        .leftJoinAndSelect("medicalRecord.prescription", "prescription")
        .leftJoinAndSelect("medicalRecord.detailedRecord", "detailedRecord")
        .leftJoinAndSelect("medicalRecord.examRoom", "examRoom")
        .leftJoinAndSelect("prescription.dosages", "dosages")
        .leftJoinAndSelect("dosages.medicine", "medicine")
        .getMany();

      return medicalRecords;
    } catch (error) {
      console.error("Error fetching medical records:", error);
      throw error;
    }
  }

  async createRecordWithTransaction(
    recordData,
    detailedRecordsData,
    prescriptionData
  ) {
    return await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        const savedPrescription = await transactionalEntityManager.save(
          Prescription,
          { note: prescriptionData.note }
        );

        const dosages = prescriptionData.medicines.map((med) => ({
          morning: med.morning,
          afternoon: med.afternoon,
          evening: med.evening,
          days: med.days,
          prescription: savedPrescription,
          medicine: med.medicine,
        }));

        const savedDosages = await transactionalEntityManager.save(
          Dosage,
          dosages
        );

        const savedDetailedRecord = await transactionalEntityManager.save(
          DetailedRecord,
          detailedRecordsData
        );

        const record = await this.#repository.findOne({
          where: { id: recordData.id },
          relations: [
            "patient",
            "prescription",
            "detailedRecord",
            "examRoom",
            "doctor",
          ],
        });
        record.examResult = recordData.examResult;
        record.diagnosis = recordData.diagnosis;
        record.prescription = savedPrescription;
        record.detailedRecord = savedDetailedRecord;
        record.doctor = recordData.doctor;

        const savedRecord = await transactionalEntityManager.save(
          MedicalRecord,
          record
        );

        return savedRecord;
      }
    );
  }

  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(
        `detailedRecord/${publicId}`
      );
      if (result.result === "ok")
        console.log(`Image with publicId "${publicId}" deleted successfully.`);
      else if (result.result === "not found")
        console.warn(`Image with publicId "${publicId}" not found.`);
      else
        console.error(
          `Failed to delete image with publicId "${publicId}":`,
          result
        );
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  }

  async uploadImage(imagePath, name) {
    const result = await cloudinary.uploader.upload(imagePath, {
      resource_type: "auto",
      folder: "detailedRecord",
      public_id: name,
    });
    console.log("Image uploaded:", result);
    return result.url;
  }
}

module.exports = RecordRepository;
