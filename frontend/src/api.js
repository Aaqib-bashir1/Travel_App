
import axios from 'axios';
import { Access_Token, Refresh_Token } from './constants';
import {useLogin} from './LoginContext';
// Create an instance of axios with the base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});


// Request interceptor to add the Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(Access_Token); // Get the access token from localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Add the token to request headers
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh if expired
api.interceptors.response.use(
    
    (response) => {
        return response; // If the response is successful, return it
    },
    async (error) => {
        // If an error occurs (like token expiry), check if it's due to token expiration
        if (error.response && error.response.status === 401) {
            const refreshToken = localStorage.getItem(Refresh_Token); // Get the refresh token

            if (refreshToken) {
                try {
                    // Attempt to refresh the token using the refresh token
                    const res = await axios.post(`${import.meta.env.VITE_API_URL}api/users/token/refresh/`, { refresh: refreshToken });

                    // If successful, store the new tokens
                    const { access, refresh } = res.data;
                    localStorage.setItem(Access_Token, access);
                    localStorage.setItem(Refresh_Token, refresh);
                    
                    // Update the original request with the new access token
                    error.config.headers['Authorization'] = `Bearer ${access}`;

                    // Retry the original request with the new token
                    return axios(error.config);
                } catch (err) {
                    console.error("Error refreshing token:", err);
                    // If token refresh fails, log the user out
                    localStorage.removeItem(Access_Token);
                    localStorage.removeItem(Refresh_Token);
                    
                    
                    window.location.href = "/login"; // Redirect to login page
                    return Promise.reject(err);
                }
            } else {
                // If no refresh token exists, log the user out
                localStorage.removeItem(Access_Token);
                localStorage.removeItem(Refresh_Token);
                
                window.location.href = "/login"; // Redirect to login page
                return Promise.reject(error);
            }
        }
        // For other errors, just reject the promise
        return Promise.reject(error);
    }
);





export default api;

// import axios from 'axios';
// import { Access_Token, Refresh_Token } from './constants';
// import { } from './LoginContext'; // Import the context

// // Create an instance of axios with the base URL
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL, // base URL for your API
// });

// // Request interceptor to add the Authorization header
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem(Access_Token); // Get the access token from localStorage
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`; // Add the token to request headers
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor to handle token refresh if expired
// api.interceptors.response.use(
//   (response) => {
//     return response; // If the response is successful, return it
//   },
//   async (error) => {
//     if (error.response && error.response.status === 401) {
//       // Token expired or invalid, let's try refreshing the token
//       const refreshToken = localStorage.getItem(Refresh_Token); // Get the refresh token

//       if (refreshToken) {
//         try {
//           // Attempt to refresh the token using the refresh token
//           const res = await axios.post(`${import.meta.env.VITE_API_URL}users/token/refresh/`, { refresh: refreshToken });

//           // If successful, store the new tokens
//           const { access, refresh } = res.data;
//           localStorage.setItem(Access_Token, access);
//           localStorage.setItem(Refresh_Token, refresh);

         
          

//           // Retry the original request with the new access token
//           error.config.headers['Authorization'] = `Bearer ${access}`;

//           // Retry the original request with the new token
//           return axios(error.config);
//         } catch (err) {
//           console.error("Error refreshing token:", err);

//           // Return the error and allow the component to handle logging out
//           return Promise.reject(err);
//         }
//       } else {
//         // If no refresh token exists, just reject the error and let the component handle logout
        
//         return Promise.reject(error);
//       }
//     }
    
//     // For other errors, just reject the promise
//     return Promise.reject(error);
//   }
// );

// export default api;
