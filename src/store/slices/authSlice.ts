import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authToken: "",
  username: "",
  mobile: "",
  countryCode: "",
  profileImage: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.authToken = action.payload.authToken;
      state.username = action.payload.username;
      state.mobile = action.payload.mobile;
      state.countryCode = action.payload.countryCode;
    },
    // You can add more reducers here
    logout: (state) => {
      state.authToken = "";
      state.username = "";
      state.mobile = "";
      state.countryCode = "";
      state.profileImage = "";
    },
    updateProfileImage: (state, action) => {
      state.profileImage = action.payload.profileImage;
    },
  },
});

export const { login, logout, updateProfileImage } = authSlice.actions;

export default authSlice.reducer;
