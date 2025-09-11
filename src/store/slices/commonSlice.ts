import { videoSource } from "@/commonvaribles/constant_variable";
import { detectLanguage } from "@/utils/languageDetect";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transactionId: {},
  previous_path: "../",
  showMobFooter: { mobFooter: false, timeBanner: false },
  ipaddress: "",
  language: detectLanguage() ?? "en",
  subscriptionData: {},
  video_data: videoSource,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    transactionIdUpdate: (state, action) => {
      state.transactionId = action.payload.transactionId;
    },
    updatePreviousPath: (state, action) => {
      state.previous_path = action.payload.previous_path;
    },
    updateMobFooter: (state, action) => {
      state.showMobFooter = action.payload.showMobFooter;
    },
    updateIpAddress: (state, action) => {
      state.ipaddress = action.payload.ipaddress;
    },
    updateLanguage: (state, action) => {
      state.language = action.payload.language;
    },
    updateSubscriptionData: (state, action) => {
      state.subscriptionData = action.payload.subscriptionData;
    },
    updateVideo: (state, action) => {
      state.video_data = action.payload.video_data;
    },
  },
});

export const {
  transactionIdUpdate,
  updatePreviousPath,
  updateMobFooter,
  updateIpAddress,
  updateLanguage,
  updateSubscriptionData,
  updateVideo,
} = commonSlice.actions;

export default commonSlice.reducer;
