const { EntitySchema } = require("typeorm");

const Role = new EntitySchema({
  name: "Role",
  tableName: "roles",
  columns: {
    name: {
      primary: true,
      type: "varchar",
      length: 255,
    },
    description: {
      type: "varchar",
      length: 255,
    },
  },
  relations: {
    user: {
      target: "User",
      type: "one-to-many",
      inverseSide: "roles",
    },
  },
});

module.exports = Role;
