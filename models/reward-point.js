const { EntitySchema } = require("typeorm");

const RewardPoint = new EntitySchema({
  name: "RewardPoint",
  tableName: "rewardPoints",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    point: {
      type: "int",
      default: 0,
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

module.exports = RewardPoint;
