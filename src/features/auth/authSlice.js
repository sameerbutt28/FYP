import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  userId: localStorage.getItem('id') || null,
  isLoggedIn: localStorage.getItem('id') ? true : false,
  darkMode: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.isLoggedIn = true;
      state.userId = action.payload.id; // Set user ID from the payload
      localStorage.setItem('id', action.payload.id); // Persist user ID in local storage
      toast.success("You have successfully logged in!");
    },
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.userId = null; // Clear user ID on logout
      localStorage.removeItem('id'); // Remove user ID from local storage
      toast.success("You have successfully logged out.");
    },
    changeMode: (state) => {
      state.darkMode = !state.darkMode;
      document.querySelector('html').setAttribute('data-theme', state.darkMode ? "dark" : "winter");
    },
  },
});

// Export the action creators
export const { loginUser, logoutUser, changeMode } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
