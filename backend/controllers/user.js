const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const HttpError = require("../errors/http-error");
const Product = require("../models/product");
const User = require("../models/user");

const createToken = require("../util/createToken");

exports.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  let existsingUser;
  try {
    existsingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signnig up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existsingUser) {
    const error = new HttpError("Email exists, please pick another one.", 422);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Signnig up failed, please try again later.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name: name,
    email: email,
    password: hashedPassword,
  });
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signnig up failed, please try again later.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = createToken(createdUser.id);
  } catch (err) {
    const error = new HttpError(
      "Signnig up failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    name: createdUser.name,
    email: createdUser.email,
    address: createdUser.address,
    token,
  });
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  const { email, password } = req.body;

  let existsingUser;
  try {
    existsingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Login failed, please try again later.", 500);
    return next(error);
  }

  if (!existsingUser) {
    const error = new HttpError(
      "Email does not exists, please signup instead.",
      404
    );
    return next(error);
  }

  let isPasswordMatched;
  try {
    isPasswordMatched = await bcrypt.compare(password, existsingUser.password);
  } catch (err) {
    const error = new HttpError("Login failed, please try again later.", 500);
    return next(error);
  }

  if (!isPasswordMatched) {
    const error = new HttpError("Password is not correct.", 422);
    return next(error);
  }

  let token;
  try {
    token = createToken(existsingUser.id);
  } catch (err) {
    const error = new HttpError(
      "Signnig up failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    name: existsingUser.name,
    email: existsingUser.email,
    address: existsingUser.address,
    token,
  });
};

exports.getCart = async (req, res, next) => {
  let existsingUser;
  try {
    existsingUser = await User.findById(req.userId).populate("cart.productId");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  if (!existsingUser) {
    const error = new HttpError("Cannot find user by this id", 404);
    return next(error);
  }

  res.status(200).json({
    cart: existsingUser.cart.map((item) => {
      return {
        _id: item.productId.id,
        title: item.productId.title,
        image: item.productId.image,
        price: item.productId.price,
        description: item.productId.description,
        quantity: item.quantity,
      };
    }),
  });
};

exports.addToCart = async (req, res, next) => {
  const { prodId } = req.params;

  let existsingUser;
  try {
    existsingUser = await User.findById(req.userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  if (!existsingUser) {
    const error = new HttpError("Cannot find user by this id", 404);
    return next(error);
  }

  let existsingProduct;
  try {
    existsingProduct = await Product.findById(prodId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  if (!existsingProduct) {
    const error = new HttpError("Product don't exist.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await User.addToCart(req.userId, prodId, sess);
    await Product.updateOne(
      { _id: prodId },
      { $inc: { countInStock: -1 } },
      { session: sess }
    );

    await sess.commitTransaction();
    sess.endSession();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ message: "Cart updated." });
};

exports.deleteFromCart = async (req, res, next) => {
  const { prodId } = req.params;
  const { directDelete } = req.query;

  let existsingUser;
  try {
    existsingUser = await User.findById(req.userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  if (!existsingUser) {
    const error = new HttpError("Cannot find user by this id", 404);
    return next(error);
  }

  const quantity = existsingUser.cart.find(
    (item) => item.productId.toString() === prodId
  ).quantity;

  if (directDelete === "true") {
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();

      await User.updateOne(
        { _id: req.userId },
        { $pull: { cart: { productId: prodId } } },
        { session: sess }
      );
      await Product.updateOne(
        { _id: prodId },
        { $inc: { countInStock: quantity } },
        { session: sess }
      );

      await sess.commitTransaction();
      sess.endSession();
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, please try again later.",
        500
      );
      return next(error);
    }
  } else {
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();

      await User.deleteFromCart(req.userId, prodId, sess);
      await Product.updateOne(
        { _id: prodId },
        { $inc: { countInStock: 1 } },
        { session: sess }
      );

      await sess.commitTransaction();
      sess.endSession();
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, please try again later.",
        500
      );
      return next(error);
    }
  }

  res.status(200).json({ message: "Product removed from cart." });
};

exports.saveAddress = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  let existsingUser;
  try {
    existsingUser = await User.findById(req.userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  if (!existsingUser) {
    const error = new HttpError("Cannot find user by this id", 404);
    return next(error);
  }

  try {
    await User.updateOne(
      { _id: existsingUser._id },
      { $set: { address: req.body } }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ message: "User address is saved." });
};
