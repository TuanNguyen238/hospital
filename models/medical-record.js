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
    examinationDate: {
      type: "date",
      nullable: false,
    },
    diagnosis: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    examinationResult: {
      type: "varchar",
      length: 255,
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
  },
});

module.exports = MedicalRecord;
