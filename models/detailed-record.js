const { EntitySchema } = require("typeorm");

const DetailedRecord = new EntitySchema({
  name: "DetailedRecord",
  tableName: "detailedRecords",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    weight: {
      type: "float",
    },
    height: {
      type: "float",
    },
    bmi: {
      type: "float",
    },
    heartRate: {
      type: "int",
    },
    respiratoryRate: {
      type: "int",
    },
    bloodPressure: {
      type: "varchar",
      length: 20,
    },
    spO2: {
      type: "int",
    },
  },
  relations: {
    medicalRecord: {
      target: "MedicalRecord",
      type: "one-to-one",
      inverseSide: "detailedRecord",
    },
  },
});

module.exports = DetailedRecord;
