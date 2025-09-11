import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: "puja",
  package_data: {},
  address: {},
  total_amount: 0,
  cart_data: {},
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    updateSelectedPackage: (state, action) => {
      state.package_data = {
        ...state.package_data,
        ...action.payload.package_data,
      };
    },
    packageAddress: (state, action) => {
      state.address = action.payload.address;
    },
    updateTotalAmount: (state, action) => {
      state.total_amount = action.payload.total_amount;
    },
    addCartData: (state, action) => {
      state.cart_data = {
        ...state.cart_data,
        ...action.payload.addToCart,
      };
    },
    removeFromCartData: (state, action) => {
      const tempData = { ...state.cart_data };
      delete tempData[action.payload.cart_id];
      state.cart_data = tempData;
    },
    updateCartData: (state, action) => {
      const tempData = { ...state.cart_data };
      tempData[action.payload.cart_id] = {
        ...tempData[action.payload.cart_id],
        ...action.payload.cart_data,
      };
      state.cart_data = tempData;
    },
    resetCart: (state, action) => {
      state.cart_data = action.payload.cart_data;
    },
  },
});

export const {
  packageAddress,
  updateSelectedPackage,
  updateTotalAmount,
  addCartData,
  removeFromCartData,
  updateCartData,
  resetCart,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
