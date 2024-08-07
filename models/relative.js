const { EntitySchema } = require("typeorm");

const Relative = new EntitySchema({
  name: "Relative",
  tableName: "relatives",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    fullName: {
      type: "varchar",
      length: 255,
    },
    phoneNumber: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    address: {
      type: "varchar",
      length: 255,
    },
    relations: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
  },
  relations: {
    patient: {
      target: "Patient",
      type: "one-to-one",
      inverseSide: "relatives",
    },
  },
});

module.exports = Relative;
