const { EntitySchema } = require("typeorm");

const Patient = new EntitySchema({
  name: "Patient",
  tableName: "patients",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    patientCode: {
      type: "varchar",
      length: 20,
      unique: true,
      nullable: false,
    },
    fullName: {
      type: "varchar",
      length: 255,
    },
    phoneNumber: {
      type: "varchar",
      length: 20,
      unique: true,
      nullable: false,
    },
    address: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    identifyCard: {
      type: "varchar",
      length: 12,
      nullable: true,
    },
    dateOfBirth: {
      type: "date",
      nullable: false,
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: true,
    },
    medicalRecords: {
      target: "MedicalRecord",
      type: "one-to-many",
      inverseSide: "patients",
    },
    relatives: {
      target: "Relative",
      type: "one-to-one",
      joinColumn: true,
    },
  },
});

module.exports = Patient;
