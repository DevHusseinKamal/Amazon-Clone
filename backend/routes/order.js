const { Router } = require("express");
const { body } = require("express-validator");

const router = Router();

const isAuth = require("../middlewares/check-auth");
const orderController = require("../controllers/order");

router.post(
  "/",
  isAuth,
  [
    body("orderItems").isArray().not().isEmpty(),
    body("shippingAddress").isObject().not().isEmpty(),
    body("paymentMethod").isString().not().isEmpty(),
    body("itemsPrice").isNumeric(),
    body("shippingPrice").isNumeric(),
    body("totalPrice").isNumeric(),
  ],
  orderController.createOrder
);

router.get("/", isAuth, orderController.getOrders);

router.post(
  "/invoice",
  isAuth,
  [body("orderId").not().isEmpty().isMongoId()],
  orderController.getInvoice
);

router.get("/:orderId", isAuth, orderController.getOrder);

module.exports = router;
