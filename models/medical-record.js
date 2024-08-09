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
      nullable: false,
    },
    examDate: {
      type: "timestamp",
      nullable: false,
    },
    examResult: {
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
    detailedRecord: {
      target: "DetailedRecord",
      type: "one-to-one",
      joinColumn: true,
    },
  },
});

module.exports = MedicalRecord;
