const { EntitySchema } = require("typeorm");
const Status = require("../enum/status");

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
    level: {
      type: "int",
      default: 1,
    },
    price: {
      type: "decimal",
      precision: 10,
      scale: 2,
      default: 0,
    },
    quantity: {
      type: "int",
      default: 0,
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    status: {
      type: "varchar",
      length: 20,
      default: Status.ACTIVE,
    },
    imageUrl: {
      type: "varchar",
      length: 255,
      nullable: true,
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
