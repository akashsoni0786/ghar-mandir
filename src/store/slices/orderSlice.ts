import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  order_data: {},
  transaction_data: {},
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    updateOrderData: (state, action) => {
      state.order_data = action.payload.order_data;
    },
    updateOrderTransaction: (state, action) => {
      state.transaction_data = action.payload.transaction_data;
    },
    resetOrderData: (state, action) => {
      state.order_data = {};
      state.transaction_data = {};
    },
  },
});

export const { updateOrderData, updateOrderTransaction } = orderSlice.actions;

export default orderSlice.reducer;
