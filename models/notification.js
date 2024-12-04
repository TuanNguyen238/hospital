const { EntitySchema } = require("typeorm");

const Notification = new EntitySchema({
  name: "Notification",
  tableName: "notifcations",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    title: {
      type: "varchar",
      length: 255,
    },
    content: {
      type: "varchar",
      length: 255,
    },
    createdAt: {
      type: "date",
      nullable: false,
    },
  },
  relations: {
    medicalRecord: {
      target: "MedicalRecord",
      type: "many-to-one",
      joinColumn: true,
    },
  },
});

module.exports = Notification;
