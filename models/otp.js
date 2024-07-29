const { EntitySchema } = require("typeorm");

const OtpEntity = new EntitySchema({
  name: "Otp",
  tableName: "otps",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    phoneNumber: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    otp: {
      type: "varchar",
      length: 6,
      nullable: false,
    },
    expireAt: {
      type: "timestamp",
      nullable: false,
    },
  },
});

module.exports = OtpEntity;
