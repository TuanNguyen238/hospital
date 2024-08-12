const { EntitySchema } = require("typeorm");

const Dosage = new EntitySchema({
  name: "Dosage",
  tableName: "dosages",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    timeOfDay: {
      type: "enum",
      enum: ["morning", "afternoon", "evening"],
      nullable: false,
    },
    quantity: {
      type: "int",
      nullable: false,
    },
  },
  relations: {
    prescription: {
      target: "Prescription",
      type: "many-to-one",
      joinColumn: true,
    },
    medicine: {
      target: "Medicine",
      type: "many-to-one",
      joinColumn: true,
    },
  },
});

module.exports = Dosage;
