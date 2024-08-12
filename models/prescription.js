const { EntitySchema } = require("typeorm");

const Prescription = new EntitySchema({
  name: "Prescription",
  tableName: "prescriptions",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    note: {
      type: "varchar",
      length: "255",
      nullable: true,
    },
  },
  relations: {
    medicalRecord: {
      target: "MedicalRecord",
      type: "one-to-one",
      inverseSide: "prescription",
    },
    dosages: {
      target: "Dosage",
      type: "one-to-many",
      inverseSide: "prescription",
    },
  },
});

module.exports = Prescription;
