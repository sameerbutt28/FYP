import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../../features/cart/cartSlice";
import wishlistReducer from "../../features/wishlist/wishlistSlice";
import authReducer from "../../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
  },
});
// src/redux/store.js
// src/redux/store.js
// src/redux/store.js
// import { configureStore } from "@reduxjs/toolkit";
// import cartReducer from "/home/sammer/Desktop/ModeMesh/Clothing-Ecommerce-Shop-In-React-JSON-Server/src/features/cart/cartSlice.js"; // Adjusted path
// import wishlistReducer from "/home/sammer/Desktop/ModeMesh/Clothing-Ecommerce-Shop-In-React-JSON-Server/src/features/wishlist/wishlistSlice.js"; // Adjusted path
// import authReducer from "/home/sammer/Desktop/ModeMesh/Clothing-Ecommerce-Shop-In-React-JSON-Server/src/features/auth/authSlice.js        "; // Ensure auth slice is imported

// export const store = configureStore({
//     reducer: {
//         cart: cartReducer,
//         wishlist: wishlistReducer,
//         auth: authReducer, // Ensure auth reducer is included
//     },
// });


