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
    morning: {
      type: "int",
      default: 0,
    },
    afternoon: {
      type: "int",
      default: 0,
    },
    evening: {
      type: "int",
      default: 0,
    },
    days: {
      type: "int",
      default: 0,
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
