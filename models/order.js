const { EntitySchema } = require("typeorm");

const Order = new EntitySchema({
  name: "Order",
  tableName: "orders",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    client: {
      target: "User",
      type: "many-to-one",
      joinColumn: true,
      nullable: true,
    },
    doctor: {
      target: "User",
      type: "many-to-one",
      joinColumn: true,
      nullable: false,
    },
    medicines: {
      target: "Medicine",
      type: "many-to-many",
      joinColumn: true,
    },
    orderMedicines: {
      target: "OrderMedicine",
      type: "one-to-many",
      inverseSide: "order",
    },
  },
});

module.exports = Order;
