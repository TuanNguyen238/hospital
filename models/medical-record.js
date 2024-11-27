const { EntitySchema } = require("typeorm");

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
  },
});

module.exports = MedicalRecord;
