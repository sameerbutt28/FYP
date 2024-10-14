// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// // Create Auth Context
// export const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);

//     // Function to handle Google Login
//     const handleGoogleLogin = async (token) => {
//         try {
//             // Exchange the token for user details (you can call your backend here)
//             const response = await axios.post('http://localhost:3000/api/google-login', { token });
//             const { name, email, referralCode } = response.data;

//             // Set the user data in the context state
//             setUser({ name, email, referralCode });

//             // Optionally, save the user data to localStorage to persist login state across sessions
//             localStorage.setItem('user', JSON.stringify({ name, email, referralCode }));
//         } catch (error) {
//             console.error('Error during Google login:', error);
//         }
//     };

//     // Check for persisted login state on component mount
//     useEffect(() => {
//         const storedUser = JSON.parse(localStorage.getItem('user'));
//         if (storedUser) {
//             setUser(storedUser);
//         }
//     }, []);

//     // Logout Function
//     const handleLogout = () => {
//         setUser(null);
//         localStorage.removeItem('user');
//     };

//     return (
//         <AuthContext.Provider value={{ user, handleGoogleLogin, handleLogout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export default AuthProvider;
import React, { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '../features/auth/authSlice';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        // Check if user is already logged in
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (savedUser) {
            setUser(savedUser);
            dispatch(loginUser()); // Update state in Redux
        }
    }, [dispatch]);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Save user data to localStorage
        dispatch(loginUser()); // Update state in Redux
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user'); // Remove user data from localStorage
        dispatch(logoutUser()); // Update state in Redux
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
export default AuthProvider;
