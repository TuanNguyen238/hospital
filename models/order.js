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
    usedPoint: {
      type: "decimal",
      precision: 10,
      scale: 2,
      default: 0,
    },
    totalPrice: {
      type: "decimal",
      precision: 10,
      scale: 2,
      default: 0,
    },
  },
  relations: {
    client: {
      target: "User",
      type: "many-to-one",
      joinColumn: true,
    },
    doctor: {
      target: "User",
      type: "many-to-one",
      joinColumn: true,
      nullable: false,
    },
    orderMedicines: {
      target: "OrderMedicine",
      type: "one-to-many",
      inverseSide: "order",
    },
  },
});

module.exports = Order;
