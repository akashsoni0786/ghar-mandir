
import { detectLanguage } from "@/utils/languageDetect";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transactionId: {},
  previous_path: "../",
  showMobFooter: { mobFooter: false, timeBanner: false },
  ipaddress: "",
  language: detectLanguage() ?? "en",
  subscriptionData: {},
  video_data: '',
  default_videoSource: "",
  default_thumbnail: "",
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
    updateDefaultVideo: (state, action) => {
      state.default_videoSource = action.payload.default_videoSource;
      state.default_thumbnail = action.payload.default_thumbnail;
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
  updateDefaultVideo,
} = commonSlice.actions;

export default commonSlice.reducer;
