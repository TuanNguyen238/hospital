const { EntitySchema } = require("typeorm");

const Department = new EntitySchema({
  name: "Department",
  tableName: "departments",
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
  },
  relations: {
    hospital: {
      target: "Hospital",
      type: "many-to-one",
      joinColumn: true,
    },
    examRooms: {
      target: "ExamRoom",
      type: "one-to-many",
      inverseSide: "department",
    },
  },
});

module.exports = Department;
