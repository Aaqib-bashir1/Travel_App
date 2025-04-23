
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Access_Token, Refresh_Token } from "../constants";
import "../styles/Form.css";
import { useLogin } from "../LoginContext"; 

function Form({ route, method, onSuccess }) {
    // States for registration fields
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // For registration only
    
    // States for email verification
    const [otp, setOtp] = useState(""); // For email verification

    // States for loading, error handling, and error message
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // New error message state
    const navigate = useNavigate();

    const name = method === "Register" ? "Register" : method === "Verify" ? "Verify Email" : "Login";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(""); // Clear error message before validation

        // Regex to check if the phone number is in the correct format (+<country_code><phone_number>)
        const phoneRegex = /^\+\d{1,14}$/;

        // Check if phone number matches the expected format (only for Register)
        if (method === "Register" && !phoneRegex.test(phone_number)) {
            setErrorMessage("Please enter a valid phone number (e.g., +1234567890).");
            setLoading(false);
            return;
        }

        // Password and confirm password validation for registration
        if (method === "Register" && password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            setLoading(false);
            return;
        }

        // Client-side email validation
        if (method === "Register" && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
            setErrorMessage("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        // Client-side password validation
        if (method === "Register" && password.length < 6) {
            setErrorMessage("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }

        try {
            const formData = {
                email,
                password,
                ...(method === "Register" && {
                    username,
                    phone_number,
                    first_name,
                    last_name,
                    confirmPassword
                }),
                ...(method === "Verify" && { otp })
            };

            // Send data to the server based on the method
            const res = await api.post(route, formData);

            if (method === "Register") {
                // Register logic (store tokens, redirect to verify email)
                navigate("/email-verify"); // Redirect to email verification page
            } else if (method === "Login") {
                onSuccess();
                localStorage.setItem(Access_Token, res.data.access);
                localStorage.setItem(Refresh_Token, res.data.refresh);
                navigate("/"); // Redirect to home page after login
            } else if (method === "Verify") {
                // After successful verification, redirect to login
                navigate("/login");
            }
        // } catch (error) {
        //     console.error("Error during form submission:", error.response ? error.response.data : error.message);
        //     setErrorMessage("An error occurred: " + (error.response ? error.response.data : error.message));
        }catch (error) {
                console.error("Error during form submission:", error);
            
                // Check if the error is from the API response
                const errorMessage = error.response
                    ? error.response.data
                        ? error.response.data.detail || "An unexpected error occurred."
                        : "An unexpected error occurred."
                    : error.message || "An unexpected error occurred.";
            
                setErrorMessage(errorMessage);
            
                
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>

            {/* Error message displayed above the form */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            {/* Conditionally render form fields based on method */}

            {/* Email Input (Common for all methods) */}
            <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value).toLowerCase() }
                placeholder="Email"
                required
            />
            {
                method === "Login" && (
                    <input
                        className="form-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                )
            }
            {/* Registration Specific Fields */}
            {method === "Register" && (
                <>
                    <input
                        className="form-input"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />

                    <input
                        className="form-input"
                        type="text"
                        value={phone_number}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Phone Number"
                        required
                    />

                    <input
                        className="form-input"
                        type="text"
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        required
                    />

                    <input
                        className="form-input"
                        type="text"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        required
                    />

                    <input
                        className="form-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />

                    <input
                        className="form-input"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                    />
                </>
            )}

            {/* Email Verification Specific Fields */}
            {method === "Verify" && (
                <input
                    className="form-input"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                />
            )}

            {/* Submit Button */}
            <button type="submit" className="form-button" disabled={loading}>
                {loading ? "Processing..." : name}
            </button>

            {/* Loading Spinner (optional) */}
            {loading && <div className="loading-spinner">Loading...</div>}
        </form>
    );
}

export default Form;
