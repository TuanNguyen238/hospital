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
    quantity: {
      type: "int",
      nullable: false,
    },
    dosageMorning: {
      type: "int",
      nullable: true,
    },
    dosageAfternoon: {
      type: "int",
      nullable: true,
    },
    dosageEvening: {
      type: "int",
      nullable: true,
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
      inverseSide: "prescriptions",
    },
    medicines: {
      target: "Medicine",
      type: "many-to-many",
      joinTable: {
        name: "prescriptions_medicines",
        joinColumn: {
          name: "prescription_id",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "medicine_id",
          referencedColumnName: "id",
        },
      },
    },
  },
});

module.exports = Prescription;
