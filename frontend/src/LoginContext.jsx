// // import React, { createContext, useState, useContext } from 'react';

// // // Create LoginContext to manage authentication state globally
// // const LoginContext = createContext();

// // export const LoginProvider = ({ children }) => {
// //   const [isLoggedIn, setIsLoggedIn] = useState(true);

// //   // We don't need to check for a token here if you're managing login state manually

// //   return (
// //     <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
// //       {children}
// //     </LoginContext.Provider>
// //   );
// // };

// // // Custom hook to access login state
// // export const useLogin = () => {
// //   return useContext(LoginContext);
// // };
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { Access_Token } from './constants';

// const LoginContext = createContext();

// export const LoginProvider = ({ children }) => {
//   // Lazy initialization based on token presence in localStorage
//   const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem(Access_Token)));

//   useEffect(() => {
//     const checkLoginStatus = () => {
//       const token = localStorage.getItem(Access_Token);
//       setIsLoggedIn(Boolean(token));
//     };

//     // Listen for storage events to sync state across browser tabs
//     window.addEventListener('storage', checkLoginStatus);
//     return () => window.removeEventListener('storage', checkLoginStatus);
//   }, []);

//   return (
//     <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
//       {children}
//     </LoginContext.Provider>
//   );
// };

// export const useLogin = () => {
//   const context = useContext(LoginContext);
//   if (!context) {
//     throw new Error('useLogin must be used within a LoginProvider');
//   }
//   return context;
// };
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Access_Token, Refresh_Token } from './constants';

// Create LoginContext
const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  // Initialize login state based on the presence of an access token
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem(Access_Token));
  });

  // Sync login state across browser tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === Access_Token) {
        setIsLoggedIn(Boolean(localStorage.getItem(Access_Token)));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoginContext.Provider>
  );
};

// Custom hook to access login state
export const useLogin = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error('useLogin must be used within a LoginProvider');
  }
  return context;
};