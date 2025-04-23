
import React from 'react';
import { useEffect } from 'react';
import Form from "../components/Form";  // Import the Form component
import { useLogin } from "../LoginContext"; // Import the useLogin hook

function Login() {
    const { setIsLoggedIn } = useLogin(); // Ensure this is inside the Login component

  
    useEffect(() => {
      setIsLoggedIn(false); // Ensure the user is logged out when visiting the login page
    }, [setIsLoggedIn]);
  
  const handleLoginSuccess = () => {
    
    setIsLoggedIn(true);
  };

  return (
    <Form 
      route="api/users/login/" 
      method="Login" 
      onSuccess={handleLoginSuccess} // Pass the success handler to the Form component
    />
  );
}

export default Login;

