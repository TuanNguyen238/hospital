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
    reasonForVisit: {
      type: "varchar",
      length: 255,
    },
    diagnosis: {
      type: "varchar",
      length: 255,
    },
    examResult: {
      type: "varchar",
      length: 255,
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
