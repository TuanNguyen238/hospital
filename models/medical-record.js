const { EntitySchema } = require("typeorm");
const Status = require("../enum/status");

const MedicalRecord = new EntitySchema({
  name: "MedicalRecord",
  tableName: "medicalRecords",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    recordCode: {
      type: "varchar",
      length: 20,
      unique: true,
      nullable: false,
    },
    reasonForVisit: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    diagnosis: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    examResult: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    paid: {
      type: "boolean",
      default: false,
      nullable: false,
    },
    status: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    orderNumber: {
      type: "int",
      nullable: true,
    },
  },
  relations: {
    patient: {
      target: "Patient",
      type: "many-to-one",
      joinColumn: true,
    },
    prescription: {
      target: "Prescription",
      type: "one-to-one",
      joinColumn: true,
    },
    detailedRecord: {
      target: "DetailedRecord",
      type: "one-to-one",
      joinColumn: true,
    },
    examRoom: {
      target: "ExamRoom",
      type: "many-to-one",
      joinColumn: true,
    },
    doctor: {
      target: "User",
      type: "many-to-one",
      joinColumn: true,
      nullable: true,
    },
  },
});

module.exports = MedicalRecord;
