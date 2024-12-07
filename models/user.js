const { EntitySchema } = require("typeorm");
const Status = require("../enum/status");

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    username: {
      type: "varchar",
      length: 255,
    },
    email: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    password: {
      type: "varchar",
      length: 255,
    },
    phoneNumber: {
      type: "varchar",
      length: 20,
      unique: true,
      nullable: false,
    },
    identifyCard: {
      type: "varchar",
      length: "12",
      nullable: true,
    },
    status: {
      type: "varchar",
      length: 20,
      default: Status.ACTIVE,
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    role: {
      target: "Role",
      type: "many-to-one",
      joinColumn: true,
    },
    patient: {
      target: "Patient",
      type: "one-to-many",
      inverseSide: "users",
    },
    token: {
      target: "token",
      type: "one-to-one",
      inverseSide: "users",
    },
    detailDoctors: {
      target: "DetailDoctor",
      type: "one-to-many",
      inverseSide: "user",
    },
  },
});

module.exports = User;
