import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialState = {
    isAuthenticated: false,
    user: null,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'LOGIN_SUCCESS':
        return { ...state, isAuthenticated: true, user: action.payload };
      case 'LOGOUT':
        return { ...state, isAuthenticated: false, user: null };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // Check for authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('/auth/check-token', { withCredentials: true });
        
        if (response.data.isAuthenticated) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
        }
      } catch (error) {
        console.log('Not authenticated');
      }
    };

    checkAuthStatus(); // Run the auth check on component mount
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
