import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    cart: [],
    isLoggedIn: false,
    token: "",
    tokenExpirationDate: null,
    method: JSON.parse(localStorage.getItem("method")) || "",
  },
  reducers: {
    getCart(state, action) {
      state.cart = action.payload;
    },
    login(state, action) {
      const { user, token, tokenExpirationDate } = action.payload;

      const expirationDate =
        tokenExpirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);

      state.user = user;
      state.token = token;
      state.isLoggedIn = !!token;
      state.tokenExpirationDate = expirationDate;

      localStorage.setItem(
        "userData",
        JSON.stringify({
          user,
          token,
          expiration: expirationDate.toISOString(),
          isLoggedIn: true,
        })
      );
    },
    logout(state) {
      state.user = {};
      state.token = "";
      state.isLoggedIn = false;
      state.tokenExpirationDate = null;

      localStorage.clear("userData");
    },
    addToCart(state, action) {
      const { id, product } = action.payload;
      const existingProduct = state.cart.find((p) => p._id === id);
      if (existingProduct) {
        existingProduct.quantity++;
        existingProduct.countInStock--;
      } else {
        state.cart.push({
          ...product,
          countInStock: product.countInStock - 1,
          quantity: 1,
        });
      }
    },
    removeFromCart(state, action) {
      const product = state.cart.find((p) => p._id === action.payload.id);

      if (!product) {
        return;
      }

      if (product.quantity > 1 && action.payload.query === true) {
        state.cart = state.cart.filter((p) => p._id !== action.payload.id);
        return;
      }

      if (product.quantity > 1) {
        product.quantity--;
      } else {
        state.cart = state.cart.filter((p) => p._id !== action.payload.id);
      }
      product.countInStock++;
    },
    clearCart(state) {
      state.cart = [];
    },
    updateUser(state, action) {
      state.user.address = action.payload;
    },
    savePaymentMethod(state, action) {
      state.method = action.payload;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
