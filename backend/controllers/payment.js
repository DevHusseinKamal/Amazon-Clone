const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const HttpError = require("../errors/http-error");
const Order = require("../models/order");

const buyProduct = async (orderId, userId) => {
  let existingOrder;
  try {
    existingOrder = await Order.findById(orderId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    throw error;
  }

  if (!existingOrder) {
    const error = new HttpError("Cannot find order by this id.", 404);
    throw error;
  }

  if (existingOrder.creator.toString() !== userId) {
    const error = new HttpError("Authorization failed.", 401);
    throw error;
  }

  return existingOrder;
};

exports.getStripe = async (req, res, next) => {
  const { orderId } = req.params;

  let existingOrder;
  try {
    existingOrder = await buyProduct(orderId, req.userId);
  } catch (err) {
    return next(err);
  }

  try {
    await Order.updateOne(
      { _id: orderId },
      { $set: { isPaid: true, paidAt: new Date() } }
    );
    await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: existingOrder.orderItems.map((item) => {
        return {
          price_data: {
            currency: "usd",
            unit_amount: item.price * item.quantity,
            product_data: {
              name: item.title,
              description: item.description,
            },
          },
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      success_url: req.protocol + "://" + req.get("host") + `/checkout/success`,
      cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ message: "Order paid." });
};

exports.getPayPal = async (req, res, next) => {
  const { orderId } = req.params;

  try {
    await buyProduct(orderId, req.userId);
  } catch (err) {
    return next(err);
  }

  try {
    await Order.updateOne(
      { _id: orderId },
      { $set: { isPaid: true, paidAt: new Date() } }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ message: "Order paid." });
};
