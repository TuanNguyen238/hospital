const { EntitySchema } = require("typeorm");

const OrderMedicine = new EntitySchema({
  name: "OrderMedicine",
  tableName: "order_medicines",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    quantity: {
      type: "int",
      default: 1,
    },
  },
  relations: {
    order: {
      target: "Order",
      type: "many-to-one",
      joinColumn: true,
    },
    medicine: {
      target: "Medicine",
      type: "many-to-one",
      joinColumn: true,
    },
  },
});

module.exports = OrderMedicine;
