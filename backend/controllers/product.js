const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const HttpError = require("../errors/http-error");
const Product = require("../models/product");
const User = require("../models/user");

const deleteImage = require("../util/delete-image");

exports.getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.find();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later",
      500
    );
    return next(error);
  }
  res.status(200).json({ products });
};

exports.getUserProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.find({ creator: req.userId });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, please try again later",
      500
    );
    return next(error);
  }

  res.status(200).json({ products });
};

exports.getProduct = async (req, res, next) => {
  const { prodId } = req.params;

  let existingProduct;
  try {
    existingProduct = await Product.findById(prodId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingProduct) {
    const error = new HttpError("Cannot find product with this id.", 404);
    return next(error);
  }

  res.status(200).json({ product: existingProduct });
};

exports.getCategories = async (req, res, next) => {
  let products;
  try {
    products = await Product.find().select("category -_id");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  const categories = new Set(
    products.map((product) => {
      return product._doc.category;
    })
  );

  res.status(200).json({ categories: [...categories] });
};

exports.getSearchProducts = async (req, res, next) => {
  const PER_PAGE = 3;
  const page = req.query.page || 1;
  const perPage = req.query.perPage || PER_PAGE;
  const category = req.query.category || "";
  const rating = +req.query.rating || "";
  const price = req.query.price;
  const order = req.query.order;

  const categoryFilter = category && category !== "all" ? { category } : {};

  const ratingCriteria = { totalRating: { $gte: rating } };
  const ratingFilter = rating && rating !== "all" ? ratingCriteria : {};

  const prices = price.split("-");
  const priceCriteria = { price: { $gte: +prices[0], $lte: +prices[1] } };
  const priceFilter = price && price !== "all" ? priceCriteria : {};

  const filteredSort = {
    lowset: { price: 1 },
    highset: { price: -1 },
    toprated: { totalRating: -1 },
    newset: { createdAt: -1 },
  };
  const sortFilter = filteredSort[order] || { _id: -1 };

  const criteria = {
    ...categoryFilter,
    ...ratingFilter,
    ...priceFilter,
  };

  let products;
  let productsCount;
  try {
    products = await Product.find(criteria)
      .sort(sortFilter)
      .skip(PER_PAGE * (page - 1))
      .limit(PER_PAGE);
    productsCount = await Product.countDocuments(criteria);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    products,
    page,
    pages: Math.ceil(productsCount / perPage),
    productsCount,
  });
};

exports.createProduct = async (req, res, next) => {
  const { title, category, brand, description } = req.body;
  const price = +req.body.price;
  const countInStock = +req.body.countInStock;

  if (!req.file) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  const imageUrl = req.file.path.replace(/\\/g, "/");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  const product = new Product({
    title,
    image: imageUrl,
    brand,
    category,
    description,
    price,
    countInStock,
    creator: req.userId,
  });

  try {
    await product.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ message: "Product created!" });
};

exports.updateProduct = async (req, res, next) => {
  const { prodId } = req.params;
  const price = +req.body.price;
  const countInStock = +req.body.countInStock;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  let existingProduct;
  try {
    existingProduct = await Product.findById(prodId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingProduct) {
    const error = new HttpError("Cannot find product with this id.", 404);
    return next(error);
  }

  if (existingProduct.creator.toString() !== req.userId) {
    const error = new HttpError("Authorization failed.", 401);
    return next(error);
  }

  try {
    await Product.updateOne(
      { _id: prodId },
      {
        $set: {
          price: price,
          countInStock: existingProduct.countInStock + countInStock,
        },
      }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ message: "Product updated." });
};

exports.deleteProduct = async (req, res, next) => {
  const { prodId } = req.params;

  let existingProduct;
  try {
    existingProduct = await Product.findById(prodId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingProduct) {
    const error = new HttpError("Cannot find product with this id.", 404);
    return next(error);
  }

  if (existingProduct.creator.toString() !== req.userId) {
    const error = new HttpError("Authorization failed.", 401);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await User.updateMany(
      {},
      { $pull: { cart: { productId: prodId } } },
      { session: sess }
    );
    await Product.deleteOne({ _id: prodId }, { session: sess });

    await sess.commitTransaction();
    sess.endSession();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }
  deleteImage(existingProduct.image);

  res.status(200).json({ message: "Product deleted." });
};

exports.addReview = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  const { prodId } = req.params;

  let existingProduct;
  let existingUser;
  try {
    existingProduct = await Product.findById(prodId);
    existingUser = await User.findById(req.userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingProduct || !existingUser) {
    const error = new HttpError("Cannot find this with this id.", 404);
    return next(error);
  }

  const review = {
    ...req.body,
    userName: existingUser.name,
    createdAt: new Date(),
  };

  const ratings =
    existingProduct.reviews.reduce((acc, cur) => acc + cur.rating, 0) +
    review.rating;
  const totalRating = ratings / (existingProduct.numOfReviews + 1);

  try {
    await Product.updateOne(
      { _id: prodId },
      {
        $inc: { numOfReviews: 1 },
        $push: { reviews: review },
        $set: { totalRating: totalRating },
      }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ message: "Product updated." });
};
