const { Router } = require("express");
const { body } = require("express-validator");

const router = Router();

const isAuth = require("../middlewares/check-auth");
const userController = require("../controllers/user");

router.get("/cart", isAuth, userController.getCart);

router.post(
  "/signup",
  [
    body("name").trim().isString().not().isEmpty().isString(),
    body("email").trim().isString().isEmail().normalizeEmail(),
    body("password").trim().isString().isLength({ min: 6 }).isAlphanumeric(),
    body("confirmPassword")
      .isString()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords has to be matched!");
        }
        return true;
      }),
  ],
  userController.createUser
);

router.post(
  "/login",
  [
    body("email").trim().isString().isEmail().normalizeEmail(),
    body("password").trim().isString().isLength({ min: 6 }).isAlphanumeric(),
  ],
  userController.login
);

router.post("/:prodId", isAuth, userController.addToCart);

router.patch(
  "/shipping",
  isAuth,
  [
    body("address").trim().isString().not().isEmpty().isLength({ min: 10 }),
    body("city").trim().isString().not().isEmpty(),
    body("postalCode")
      .isNumeric()
      .custom((value) => {
        if (value.toString().length < 6) {
          throw new Error("Postal code should be at least 6 numbers.");
        }
        return true;
      }),
    body("country").trim().isString().not().isEmpty(),
  ],
  userController.saveAddress
);

router.delete("/:prodId", isAuth, userController.deleteFromCart);

module.exports = router;
