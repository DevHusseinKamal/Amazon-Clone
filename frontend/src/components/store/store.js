import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./user/user-slice";
import productSlice from "./product/product-slice";
import uiSlice from "./ui/ui-slice";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    products: productSlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
