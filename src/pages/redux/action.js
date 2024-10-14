// src/redux/actions.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userProfile: {},
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});

export const { setUserProfile } = profileSlice.actions;
export default profileSlice.reducer;

// Selector to get user profile
export const selectUserProfile = (state) => state.profile.userProfile;
