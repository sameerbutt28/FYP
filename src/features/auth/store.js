import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Adjust the import path based on your project structure

const store = configureStore({
  reducer: {
    auth: authReducer, // Include the authReducer to manage authentication state
  },
});

export default store;
