import { createSlice } from "@reduxjs/toolkit";
import { ratingAverage } from "../../../util/rating-average";

const filterHandler = (state, id) => state.filter((item) => item._id !== id);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    userProducts: [],
    product: {},
    categories: [],
  },
  reducers: {
    getProducts(state, action) {
      if (action.payload.isAdmin) {
        state.userProducts = action.payload.products;
        return;
      }
      state.products = action.payload.products;
    },
    getProduct(state, action) {
      state.product = action.payload;
    },
    getCategories(state, action) {
      state.categories = action.payload;
    },
    resetProduct(state) {
      state.product = {};
    },
    updateReviews(state, action) {
      const { prodId, review } = action.payload;
      const existingProduct = state.products.find(
        (product) => product._id === prodId
      );
      const totalRating = ratingAverage(existingProduct, review.rating);

      existingProduct.totalRating = totalRating;
      existingProduct.numOfReviews++;
      existingProduct.reviews.push(review);

      state.product.totalRating = totalRating;
      state.product.numOfReviews++;
      state.product.reviews.push(review);
    },
    updateProductStock(state, action) {
      const { id, quantity, opt, single } = action.payload;

      const product = state.products.find((p) => p._id === id);
      if (quantity) {
        product.countInStock += quantity;
        return;
      }
      if (opt === "+" || single) {
        product.countInStock--;
        state.product.countInStock--;
        return;
      }
      if (opt === "-") {
        product.countInStock++;
      }
    },
    removeProduct(state, action) {
      state.products = filterHandler(state.products, action.payload);
      state.userProducts = filterHandler(state.userProducts, action.payload);
    },
  },
});

export const productActions = productSlice.actions;

export default productSlice;
