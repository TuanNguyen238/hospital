const { EntitySchema } = require("typeorm");

const Token = new EntitySchema({
  name: "token",
  tableName: "tokens",
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
  },
  relations: {
    user: {
      target: "User",
      type: "one-to-one",
      joinColumn: true,
    },
  },
});

module.exports = Token;
