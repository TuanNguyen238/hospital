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
    prescription: {
      target: "Prescription",
      type: "many-to-many",
      inverseSide: "medicines",
    },
  },
});

module.exports = Medicine;
