const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    address: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      postalCode: { type: Number, default: 0 },
      country: { type: String, default: "" },
    },
    cart: [
      {
        _id: false,
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    statics: {
      addToCart: async function (userId, prodId, sess) {
        let findFilter = { _id: userId, "cart.productId": prodId };
        const productInCart = await this.findOne(findFilter);

        let criteria = { $inc: { "cart.$.quantity": 1 } };
        if (!productInCart) {
          findFilter = { _id: userId };
          criteria = { $push: { cart: { productId: prodId, quantity: 1 } } };
        }

        return this.updateOne(findFilter, criteria, { session: sess });
      },
      deleteFromCart: async function (userId, prodId, sess) {
        let findFilter = {
          _id: userId,
          cart: { $elemMatch: { productId: prodId, quantity: { $gt: 1 } } },
        };
        const isManyQty = await this.findOne(findFilter);

        let criteria = { $inc: { "cart.$.quantity": -1 } };
        if (!isManyQty) {
          findFilter = { _id: userId };
          criteria = { $pull: { cart: { productId: prodId } } };
        }

        return this.updateOne(findFilter, criteria, { session: sess });
      },
    },
  }
);

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = User;
