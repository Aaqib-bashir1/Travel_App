
// import { useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import api from '../api';  // Your axios instance
// import { Access_Token, Refresh_Token } from '../constants';
// import { useLogin } from "../LoginContext";  // Import useLogin to manage login state

// function Logout() {
//   const navigate = useNavigate();
//   const { setIsLoggedIn } = useLogin();  // Access the setIsLoggedIn function from context
//   const [loading, setLoading] = useState(true);  // Loading state to show the user is being logged out
//   const [error, setError] = useState(null);      // For error handling
//   const [success, setSuccess] = useState(false); // To show success message

//   // Function to handle logout
//   const logoutUser = async () => {
//     setLoading(true);
//     try {
//       const refreshToken = localStorage.getItem(Refresh_Token);

//       // Only send the request if the refresh token is available
//       if (refreshToken) {
//         console.log("Logging out with refreshToken:", refreshToken);
        
//         // Send the refresh token as part of the JSON body
//         const response = await api.post('api/users/logout/', { refresh: refreshToken });

//         if (response.status === 200) {
//           setSuccess(true);  // Set success state
//           setTimeout(() => {
//             // Clear tokens from localStorage
//             localStorage.removeItem(Access_Token);
//             localStorage.removeItem(Refresh_Token);
//             // Update the internal login state to false
//             // Trigger a re-render (logout user and redirect)
//             navigate('/login');
//           }, 2000);  // Redirect after 2 seconds
//         } else {
//           setError('Failed to log out. Please try again later.');
//         }
//       } else {
//         setError('No refresh token found. Please log in again.');
//       }
//     } catch (err) {
//       setError('An error occurred while logging out. Please try again.');
//       console.error('Logout Error:', err);
//     } finally {
//       setLoading(false);  // End loading after logout attempt
//     }
//   };

//   // Call logout when the component mounts
//   useEffect(() => {
//     logoutUser();
//     setIsLoggedIn(false); 
//   }, [navigate]);

//   // Render different states
//   if (loading) {
//     return <div>Logging out... Please wait.</div>;  // Show loading message
//   }

//   if (error) {
//     return <div style={{ color: 'red' }}>{error}</div>;  // Show error message if any
//   }

//   if (success) {
//     return <div>Logout Successful! Redirecting...</div>;  // Show success message before redirect
//   }

//   return null; // Optionally return nothing if you don't need to render anything else
// }

// export default Logout;
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';
import { Access_Token, Refresh_Token } from '../constants';
import { useLogin } from '../LoginContext';
import LoadingSpinner from '../LoadingSpinner'; // Assume a loading spinner component

function Logout() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useLogin();
  const [status, setStatus] = useState({
    loading: true,
    error: null,
    success: false,
  });
  
  const logoutUser = async () => {
    try {
      const refreshToken = localStorage.getItem(Refresh_Token);

      // Only send the request if the refresh token is available
      if (refreshToken) {
        await api.post('api/users/logout/', { refresh: refreshToken });
      }

      // Clear tokens and update state
      localStorage.removeItem(Access_Token);
      localStorage.removeItem(Refresh_Token);
      setIsLoggedIn(false);

      setStatus({ loading: false, error: null, success: true });
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setStatus({
        loading: false,
        error: err.response?.data?.message || 'An error occurred while logging out. Please try again.',
        success: false,
      });
    }
  };

  useEffect(() => {
    logoutUser();
  }, []);

  const handleRetry = () => {
    setStatus({ loading: true, error: null, success: false });
    logoutUser();
  };

  if (status.loading) {
    return (
      <div className="logout-loading">
        <LoadingSpinner />
        <p>Logging out...</p>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="logout-error">
        <p>{status.error}</p>
        <div className="logout-actions">
          <button onClick={handleRetry}>Retry Logout</button>
          <button onClick={() => navigate('/')}>Return Home</button>
        </div>
      </div>
    );
  }

  if (status.success) {
    return (
      <div className="logout-message">
        <p>Logout successful! Redirecting to login page...</p>
      </div>
    );
  }

  return null;
}

export default Logout;