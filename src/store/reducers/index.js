import { combineReducers } from "redux";
import authReducer from "../slices/authSlice";
import checkoutSlice from "../slices/checkoutSlice";
import commonSlice from "../slices/commonSlice";
import orderSlice from "../slices/orderSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  checkout: checkoutSlice,
  common: commonSlice,
  order: orderSlice,
});

export default rootReducer;
