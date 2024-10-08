const { EntitySchema } = require("typeorm");

const Medicine = new EntitySchema({
  name: "Medicine",
  tableName: "medicines",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    name: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    description: {
      type: "varchar",
      length: 255,
    },
  },
  relations: {
    dosages: {
      target: "Dosage",
      type: "one-to-many",
      inverseSide: "medicine",
    },
  },
});

module.exports = Medicine;
