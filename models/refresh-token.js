const { EntitySchema } = require("typeorm");

const RefreshToken = new EntitySchema({
  name: "RefreshToken",
  tableName: "refreshTokens",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    token: {
      type: "varchar",
      length: 255,
    },
    expiresAt: {
      type: "timestamp",
      nullable: false,
    },
    createdAt: {
      type: "timestamp",
      nullable: false,
    },
  },
  relations: {
    user: {
      target: "User",
      type: "one-to-one",
      joinColumn: true,
    },
  },
});

module.exports = Role;
