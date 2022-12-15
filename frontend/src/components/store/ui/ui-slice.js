import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isLoading: false,
    error: "",
  },
  reducers: {
    setLoading(state) {
      state.isLoading = true;
    },
    removeLoading(state) {
      state.isLoading = false;
    },
    setError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
