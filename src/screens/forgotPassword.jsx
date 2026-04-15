import '../cssFolder/screens/forgotPassword.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Regex for basic email validation
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const handleForgotPassword = async () => {
        // Test Case 1: Empty Field
        if (!email.trim()) {
            alert('Email is required to reset your password.');
            return;
        }

        // Test Case 2: Invalid Email Format
        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        try {
            setIsLoading(true); // Disable button & show loading
            
            const res = await axios.post(`${import.meta.env.VITE_URL}/users/forgotpassword`, { email });
            
            if (res.data.success) {
                alert(res.data.message || 'OTP sent to your email!');
                // Navigate to the verification page passing the email in the URL
                navigate(`/verify-otp/${encodeURIComponent(email)}`);
            } else {
                alert(res.data.message || 'Something went wrong.');
            }
        } catch (error) {
            // Test Case 3: Server/Network Error
            console.error("Forgot Password Error:", error);
            const errorMsg = error.response?.data?.message || "Server error. Please try again later.";
            alert(errorMsg);
        } finally {
            setIsLoading(false); // Re-enable button
        }
    };

    return (
        <div className="forgot-password-wrapper">
            <div className="auth-card">
                <header className="auth-header">
                    <h1>Reset Your Password</h1>
                    <p>Enter your registered email to receive a 4-digit verification code.</p>
                </header>

                <div className="form-container">
                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="name@example.com"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            disabled={isLoading}
                            required 
                        />
                    </div>

                    <button 
                        className={`auth-btn ${isLoading ? 'btn-loading' : ''}`} 
                        onClick={handleForgotPassword}
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending Code..." : "Send Verification OTP"}
                    </button>

                    <div className="auth-footer">
                        <button className="text-link-btn" onClick={() => navigate('/login')}>
                            ← Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;