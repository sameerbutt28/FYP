//PROFILE

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    const name = query.get('name');
    const email = query.get('email');
    const referralCode = query.get('referralCode');

    const [referrals, setReferrals] = useState([]);
    const [referralLink, setReferralLink] = useState('');
    const [newReferralCode, setNewReferralCode] = useState('');

    useEffect(() => {
        if (referralCode) {
            setReferralLink(`http://localhost:5173/register?referralCode=${referralCode}`);
        }
    }, [referralCode]);

    const fetchReferredUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/referred-users?referralCode=${referralCode}`);
            setReferrals(response.data.referredUsers || []);
        } catch (error) {
            console.error("Error fetching referred users:", error);
        }
    };

    useEffect(() => {
        if (referralCode) {
            fetchReferredUsers();
        }
    }, [referralCode]);

    const handleReferralSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/referral/link', 
                { referrerCode: newReferralCode }, 
                { withCredentials: true } 
            );
            alert(response.data);
            setNewReferralCode('');
        } catch (error) {
            console.error("Error linking referral:", error);
            alert("Error linking referral: " + error.response?.data || "Unknown error");
        }
    };

    return (
        <div style={styles.profileContainer}>
            <h1 style={styles.title}>User Profile</h1>
            <div style={styles.profileInfo}>
                <h2 style={styles.infoText}>Name: <span>{name}</span></h2>
                <h2 style={styles.infoText}>Email: <span>{email}</span></h2>
                <h2 style={styles.infoText}>Referral Code: <span>{referralCode}</span></h2>
                <h3 style={styles.linkText}>Referral Link: <a href={referralLink} style={styles.link}>{referralLink}</a></h3>
            </div>

            <form style={styles.referralForm} onSubmit={handleReferralSubmit}>
                <h3 style={styles.subtitle}>Enter Referral Code</h3>
                <input
                    type="text"
                    value={newReferralCode}
                    onChange={(e) => setNewReferralCode(e.target.value)}
                    placeholder="Referral Code"
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Submit</button>
            </form>

            <div style={styles.referralsSection}>
                <h3 style={styles.subtitle}>Referred Users:</h3>
                {referrals.length > 0 ? (
                    <table style={styles.referralsTable}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.tableCell}>Name</th>
                                <th style={styles.tableCell}>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {referrals.map((user, index) => (
                                <tr key={index} style={styles.tableRow}>
                                    <td style={styles.tableCell}>{user.name}</td>
                                    <td style={styles.tableCell}>{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={styles.noReferrals}>No referred users yet.</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    profileContainer: {
        maxWidth: '800px',
        margin: 'auto',
        padding: '20px',
        background: '#333',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '28px',
        marginBottom: '20px',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    profileInfo: {
        marginBottom: '20px',
    },
    infoText: {
        fontSize: '20px',
        margin: '10px 0',
    },
    linkText: {
        fontSize: '18px',
    },
    link: {
        color: '#1e90ff',
        textDecoration: 'underline',
    },
    referralForm: {
        marginBottom: '20px',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: '24px',
        margin: '15px 0',
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginRight: '10px',
        fontSize: '16px',
    },
    button: {
        padding: '10px 15px',
        border: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    referralsSection: {
        marginTop: '20px',
    },
    referralsTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '15px',
    },
    tableHeader: {
        backgroundColor: '#007bff',
        color: 'white',
    },
    tableCell: {
        padding: '10px',
        borderBottom: '1px solid #ccc',
        textAlign: 'left',
    },
    tableRow: {
        '&:hover': {
            backgroundColor: '#f1f1f1',
        },
    },
    noReferrals: {
        color: '#ccc',
        fontStyle: 'italic',
    },
};

export default Profile;







// LOGIN
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SectionTitle } from "../components";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../store";
import { loginUser, logoutUser } from "../features/auth/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginState = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (loginState) {
      localStorage.clear();
      store.dispatch(logoutUser());
    }
  }, []);

  // This will trigger the Google Sign-In process
  const handleGoogleSignIn = () => {
    window.open("http://localhost:3000/auth/google", "_self"); // Call the backend Google Auth route
  };

  return (
    <>
      <SectionTitle title="Login" path="Home | Login" />
      <div className="flex flex-col justify-center sm:py-12">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <div className="bg-dark border border-gray-600 shadow w-full rounded-lg divide-y divide-gray-200">
            <div className="px-5 py-7 text-center">
              {/* Google Sign-In Button */}
              <button
                onClick={handleGoogleSignIn}
                className="transition duration-200 bg-red-600 hover:bg-red-500 focus:bg-red-700 focus:shadow-sm focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">Sign in with Google</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 inline-block"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;





// HEADER
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaHeadphones } from "react-icons/fa6";
import { FaRegEnvelope } from "react-icons/fa6";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { FaHeart } from "react-icons/fa6";
import { AiFillShopping } from "react-icons/ai";
import { FaSun } from "react-icons/fa6";
import { FaMoon } from "react-icons/fa6";
import { FaWindowClose } from "react-icons/fa";

import "../styles/Header.css";
import { useDispatch, useSelector } from "react-redux";
import { changeMode } from "../features/auth/authSlice";
import { store } from "../store";
import axios from "axios";
import { clearWishlist, updateWishlist } from "../features/wishlist/wishlistSlice";

const Header = () => {
  const { amount } = useSelector((state) => state.cart);
  const { total } = useSelector((state) => state.cart);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [id, setId] = useState(localStorage.getItem("id"));
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.auth);

  const loginState = useSelector((state) => state.auth.isLoggedIn);


  const fetchWishlist = async () => {
    if (loginState) {
        try {
            const getResponse = await axios.get(`http://localhost:8080/user/${localStorage.getItem("id")}`);
            const userObj = getResponse.data;

            store.dispatch(updateWishlist({ userObj }));

        } catch (error) {
            console.error(error);
        }
    } else {
        store.dispatch(clearWishlist());
    }
};



  useEffect(() => {
    setIsLoggedIn(loginState);

      fetchWishlist();
    
  }, [loginState]);

  return (
    <>
      <div className="topbar border-b border-gray-800">
        <ul>
          <li>
            <FaHeadphones className="text-2xl max-sm:text-lg text-accent-content" />
            <span className="text-2xl max-sm:text-lg text-accent-content">
              +92-3181566195
            </span>
          </li>
          <li>
            <FaRegEnvelope className="text-2xl max-sm:text-lg text-accent-content" />{" "}
            <span className="text-2xl max-sm:text-lg text-accent-content">
sameermodemesh@gmail.com            </span>
          </li>
        </ul>
      </div>
      <div className="navbar bg-base-100 max-w-7xl mx-auto">
        <div className="flex-1">
          <Link
            to="/"
            className="btn btn-ghost normal-case text-2xl font-black text-accent-content"
          >
            <AiFillShopping />
ModeMesh
          </Link>
        </div>
        <div className="flex-none">
          <Link
            to="/search"
            className="btn btn-ghost btn-circle text-accent-content"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </Link>
          <button
            className="text-accent-content btn btn-ghost btn-circle text-xl"
            onClick={() => dispatch(changeMode())}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <Link
            to="/wishlist"
            className="btn btn-ghost btn-circle text-accent-content"
          >
            <FaHeart className="text-xl" />
          </Link>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </label>
            <div
              tabIndex={0}
              className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
            >
              <div className="card-body">
                <span className="font-bold text-lg text-accent-content">
                  {amount} Items
                </span>
                <span className="text-info text-accent-content">
                  Subtotal: ${total.toFixed(2)}
                </span>
                <div className="card-actions">
                  <Link
                    to="/cart"
                    className="btn bg-blue-600 btn-block text-white hover:bg-blue-500 text-base-content"
                  >
                    View cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {isLoggedIn && (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src="https://xsgames.co/randomusers/avatar.php?g=male" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link
                    to="/user-profile"
                    className="justify-between text-accent-content"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/order-history" className="text-accent-content">
                    Order history
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-accent-content">
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="navbar-bottom-menu border-y border-gray-800">
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
  
            {/* Page content here */}
            <label htmlFor="my-drawer" className="btn drawer-button">
              <HiMiniBars3BottomLeft className="text-4xl" />
            </label>
          </div>
          <div className="drawer-side z-10">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
                    
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content mt-4">
            <label htmlFor="my-drawer" className="btn drawer-button">
            <FaWindowClose className="text-3xl ml-auto" />
            </label>
              {/* Sidebar content here */}
              <li className="text-xl">
                <NavLink className="text-accent-content" to="/">
                  Home
                </NavLink>
              </li>
              <li className="text-xl">
                <NavLink className="text-accent-content" to="/shop">
                  Shop
                </NavLink>
              </li>
              <li className="text-xl">
                <NavLink className="text-accent-content" to="/about-us">
                  About us
                </NavLink>
              </li>
              <li className="text-xl">
                <NavLink className="text-accent-content" to="/contact">
                  Contact
                </NavLink>
              </li>
              {!isLoggedIn && (
                <>
                  <li className="text-xl">
                    <NavLink className="text-accent-content" to="/login">
                      Login
                    </NavLink>
                  </li>
                  <li className="text-xl">
                    <NavLink className="text-accent-content" to="/register">
                      Register
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="container text-2xl navlinks-container">
          <NavLink className="text-accent-content" to="/">
            Home
          </NavLink>
          <NavLink className="text-accent-content" to="/shop">
            Shop
          </NavLink>
          <NavLink className="text-accent-content" to="/about-us">
            About us
          </NavLink>
          <NavLink className="text-accent-content" to="/contact">
            Contact
          </NavLink>
          {!isLoggedIn && (
            <>
              <NavLink className="text-accent-content" to="/login">
                Login
              </NavLink>
              <NavLink className="text-accent-content" to="/register">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header; 





// APP
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
