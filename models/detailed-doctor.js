const { EntitySchema } = require("typeorm");

const DetailDoctor = new EntitySchema({
  name: "DetailDoctor",
  tableName: "detailDoctors",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    type: {
      type: "enum",
      enum: ["BASIC_INFO", "HEART_ULTRASOUND", "PRESCRIPTION"],
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

module.exports = DetailDoctor;
