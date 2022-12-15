const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    orderItems: [
      {
        _id: false,
        title: { type: String, required: true },
        image: { type: String, required: true },
        quantity: { type: Number, required: true },
        description: { type: String, required: true, minLength: 6 },
        price: { type: Number, required: true, min: 10 },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: Number, required: true },
      country: { type: String, required: true },
      name: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date, default: new Date() },
    isDelivered: { type: Boolean, default: false },
    delivededAt: { type: Date, default: new Date() },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
