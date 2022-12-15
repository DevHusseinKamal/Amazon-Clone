const { Router } = require("express");
const { body } = require("express-validator");

const router = Router();

const isAuth = require("../middlewares/check-auth");
const fileUpload = require("../middlewares/file-upload");
const productsController = require("../controllers/product");

router.get("/", productsController.getProducts);

router.get("/user", isAuth, productsController.getUserProducts);

router.get("/categories", productsController.getCategories);

router.get("/search", productsController.getSearchProducts);

router.get("/:prodId", productsController.getProduct);

router.post(
  "/",
  isAuth,
  fileUpload,
  [
    body("title").trim().isString().not().isEmpty(),
    body("category").trim().isString().not().isEmpty(),
    body("brand").trim().isString().not().isEmpty(),
    body("price").custom((value) => {
      if (+value < 10) {
        throw new Error("Price should be bigger than or equal 10.");
      }
      return true;
    }),
    body("countInStock").custom((value) => {
      if (+value === 0) {
        throw new Error("Should'nt be a zero.");
      }
      return true;
    }),
    body("description").trim().isString().not().isEmpty().isLength({ min: 6 }),
  ],
  productsController.createProduct
);

router.patch(
  "/:prodId",
  isAuth,
  [
    body("price").custom((value) => {
      if (+value < 10) {
        throw new Error("Price should be bigger than or equal 10.");
      }
      return true;
    }),
    body("countInStock").custom((value) => {
      if (+value === 0) {
        throw new Error("Should'nt be a zero.");
      }
      return true;
    }),
  ],
  productsController.updateProduct
);

router.patch(
  "/product/:prodId",
  isAuth,
  [body("rating").isNumeric(), body("comment").isString().not().isEmpty()],
  productsController.addReview
);

router.delete("/:prodId", isAuth, productsController.deleteProduct);

module.exports = router;
