import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // Import the necessary components
import {
  About,
  Cart,
  Contact,
  HomeLayout,
  Landing,
  Login,
  Register,
  Profile,
  Shop,
  SingleProduct,
  Wishlist,
  Search,
  ThankYou,
  OrderHistory,
} from "./pages";
import AdminDashboard from "./pages/AdminDashboard";
import { landingLoader } from "./pages/Landing";
import { singleProductLoader } from "./pages/SingleProduct";
import { shopLoader } from "./pages/Shop";
import { ToastContainer } from "react-toastify";

// Define the router
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
        loader: landingLoader,
      },
      {
        path: "shop",
        element: <Shop />,
        loader: shopLoader,
      },
      {
        path: "shop/product/:id",
        element: <SingleProduct />,
        loader: singleProductLoader,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "about-us",
        element: <About />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
      {
        path: "profile", // Updated path for Profile page
        element: <Profile />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "thank-you",
        element: <ThankYou />,
      },
      {
        path: "order-history",
        element: <OrderHistory />,
      },
      {
        path: "user-profile", // Add a specific route for user profile
        element: <Profile />,
      },
      {
        path: "admin-dashboard",  // Path for the Admin Dashboard page
        element: <AdminDashboard />,  // Component to render for this route
    }
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
