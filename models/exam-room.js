const { EntitySchema } = require("typeorm");

const ExamRoom = new EntitySchema({
  name: "ExamRoom",
  tableName: "examRooms",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    examDate: {
      type: "date",
      nullable: false,
    },
    examTime: {
      type: "time",
      nullable: false,
    },
    roomNumber: {
      type: "int",
      nullable: false,
    },
    maxPatients: {
      type: "int",
      nullable: false,
      default: 0,
    },
    currentPatients: {
      type: "int",
      nullable: false,
      default: 0,
    },
  },
  relations: {
    medicalRecords: {
      target: "MedicalRecord",
      type: "one-to-many",
      inverseSide: "examRoom",
    },
    department: {
      target: "Department",
      type: "many-to-one",
      joinColumn: true,
    },
    doctor: {
      target: "DetailDoctor",
      type: "many-to-one",
      joinColumn: true,
    },
  },
});

module.exports = ExamRoom;
