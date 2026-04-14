import '../cssFolder/screens/signup.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    
    // NEW STATES
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ text: "", type: "" }); // type: "success" or "error"

    const [formValues, setFormValues] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Standard practice to prevent refresh
        setLoading(true);
        setStatusMessage({ text: "", type: "" }); // Reset messages

        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/users/signup`, formValues);

            if (res.data.success) {
                setStatusMessage({ text: res.data.message || "User created successfully!", type: "success" });
                // Delay navigation so user can actually see the success message
                setTimeout(() => {
                    navigate('/verify');
                }, 2000);
            }
        } catch (error) {
            // Grab the message from backend if it exists, otherwise use a generic one
            const errorMsg = error.response?.data?.message || "Something went wrong. Please try again.";
            setStatusMessage({ text: errorMsg, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            {/* 2. LOADING OVERLAY */}
            {loading && (
                <div className="loading-overlay">
                    <div className="loader"></div>
                    <p>Creating your account...</p>
                </div>
            )}

            <div className="signup-card">
                <div className="signup-form-section">
                    <div className="header">
                        <h1>Create Account</h1>
                        <p>Join us today! Please enter your details.</p>
                    </div>

                    {/* 3. STATUS MESSAGE POPUP/BANNER */}
                    {statusMessage.text && (
                        <div className={`status-banner ${statusMessage.type}`}>
                            {statusMessage.text}
                        </div>
                    )}

                    <form className="signup-form" onSubmit={handleSubmit}>
                        {/* ... your existing inputs ... */}
                        <div className="input-group">
                            <label htmlFor="firstName">First Name</label>
                            <input type="text" id="firstName" name="firstName" onChange={handleInputChange} placeholder="Enter your first name" value={formValues.firstName} required />
                        </div>

                        <div className="input-group">
                            <label htmlFor="middleName">Middle Name</label>
                            <input type="text" id="middleName" name="middleName" onChange={handleInputChange} placeholder="Enter your middle name" value={formValues.middleName} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input type="text" id="lastName" name="lastName" onChange={handleInputChange} placeholder="Enter your last name" value={formValues.lastName} required />
                        </div>

                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" name="email" onChange={handleInputChange} placeholder="name@company.com" value={formValues.email} required />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    onChange={handleInputChange}
                                    value={formValues.password}
                                    placeholder="••••••••"
                                    required
                                />
                                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button disabled={loading} type="submit" className="signup-btn">
                            {loading ? "Processing..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="footer-text">
                        <p>Already have an account? <Link to="/login">Log in</Link></p>
                    </div>
                </div>

                <div className="signup-visual-section">
                    <div className="overlay-content">
                        <h2>Start your shopping journey</h2>
                        <p>Experience the best products, personalized recommendations, and secure checkout right at your fingertips.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;