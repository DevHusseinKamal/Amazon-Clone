const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true, minLength: 6 },
    price: { type: Number, required: true, min: 10 },
    countInStock: { type: Number, required: true, min: 1 },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalRating: { type: Number, required: true, default: 0 },
    numOfReviews: { type: Number, required: true, default: 0 },
    reviews: [
      {
        _id: false,
        rating: Number,
        comment: String,
        userName: String,
        createdAt: Date,
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
