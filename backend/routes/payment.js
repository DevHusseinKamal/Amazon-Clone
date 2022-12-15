const { Router } = require("express");

const router = Router();

const isAuth = require("../middlewares/check-auth");
const paymentController = require("../controllers/payment");

router.get("/stripe/:orderId", isAuth, paymentController.getStripe);

router.get("/paypal/:orderId", isAuth, paymentController.getPayPal);

module.exports = router;
