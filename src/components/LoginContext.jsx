// import { createContext, useState } from 'react';

// // Create the LoginContext
// export const LoginContext = createContext();

// // Create a provider component
// export const LoginProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize with false

//   const login = () => setIsLoggedIn(true);  // Function to log in
//   const logout = () => setIsLoggedIn(false); // Function to log out

//   return (
//     <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
//       {children}
//     </LoginContext.Provider>
//   );
// };

import { createContext, useState } from 'react';

// Create the LoginContext
export const LoginContext = createContext();

// Create a provider component
export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize with false

  const login = () => setIsLoggedIn(true);  // Function to log in
  const logout = () => setIsLoggedIn(false); // Function to log out

  return (
    <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};
