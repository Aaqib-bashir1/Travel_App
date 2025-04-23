
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import api from "../api";
import { Refresh_Token, Access_Token } from "../constants";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);  // Tracks authorization status
  const [isRefreshing, setIsRefreshing] = useState(false);  // Prevent multiple refreshes
  const [refreshError, setRefreshError] = useState(false); // Track refresh errors

  useEffect(() => {
    // Run the authentication check when component mounts
    auth().catch(() => setIsAuthorized(false));
  }, []);

  // Function to refresh the access token
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(Refresh_Token);
    if (!refreshToken) {
      setIsAuthorized(false);
      return;
    }

    // Avoid multiple refresh requests
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(true);  // Mark refresh as in progress

    try {
      const res = await api.post('api/users/token/refresh/', { refresh: refreshToken });
      if (res.status === 200 && res.data.access) {
        localStorage.setItem(Access_Token, res.data.access);
        setIsAuthorized(true); // Mark as authorized after refreshing
      } else {
        setIsAuthorized(false); // If refresh fails, user is unauthorized
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      setRefreshError(true); // Mark as error to prevent further action
      setIsAuthorized(false);
    } finally {
      setIsRefreshing(false);  // Reset the refresh state once done
    }
  };

  // Function to check the user's authentication status
  const auth = async () => {
    const token = localStorage.getItem(Access_Token);
    if (!token) {
      setIsAuthorized(false); // No token means unauthorized
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;

      // If the token is expired, try refreshing it
      if (tokenExpiration < now) {
        console.log("Access token expired, attempting to refresh...");
        await refreshToken();
      } else {
        setIsAuthorized(true); // Token is valid, user is authorized
      }
    } catch (error) {
      // Handle any errors from jwtDecode, e.g., token being invalid or malformed
      console.error("Error decoding token:", error);
      setIsAuthorized(false);
    }
  };

  if (isAuthorized === null) {
    // Show loading indicator while checking authorization
    return <div>Loading...</div>;
  }

  if (refreshError) {
    // Show an error message if the refresh token failed
    return <div>Error: Unable to refresh session. Please log in again.</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
