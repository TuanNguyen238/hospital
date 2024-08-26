const { EntitySchema } = require("typeorm");

const Hospital = new EntitySchema({
  name: "Hospital",
  tableName: "hospitals",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    name: {
      type: "varchar",
      length: 255,
    },
    address: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
  },
  relations: {
    departments: {
      target: "Department",
      type: "one-to-many",
      inverseSide: "hospital",
    },
  },
});

module.exports = Hospital;
