import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../cssFolder/screens/verify.css';

const VerifyPage = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleResend = async () => {
        setLoading(true);
        setMessage(""); // Reset message
        
        try {
            // Replace with your actual resend API call
            // await axios.post('http://localhost:3000/users/resend-verify', { email: userEmail });
            
            // Simulating API delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            setMessage("A new verification link has been sent!");
        } catch (error) {
            setMessage("Failed to resend. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verify-container">
            {/* Loading Overlay for the whole screen */}
            {loading && (
                <div className="loading-overlay">
                    <div className="loader"></div>
                    <p>Sending email...</p>
                </div>
            )}

            <div className="verify-card">
                <div className="email-icon-wrapper">
                    <div className="email-icon">📩</div>
                </div>
                
                <div className="verify-content">
                    <h1>Check your email</h1>
                    <p>
                        We’ve sent a verification link to your email address. 
                        Please click the link to activate your account.
                    </p>
                    
                    {/* Success/Error Message Display */}
                    {message && <p className={`status-msg ${message.includes('Failed') ? 'error' : 'success'}`}>{message}</p>}
                </div>

                <div className="action-section">
                    <button 
                        className="open-mail-btn" 
                        disabled={loading}
                        onClick={() => window.open('https://mail.google.com')}
                    >
                        Open Gmail
                    </button>
                    
                    <div className="resend-text">
                        <span>Didn't receive the email?</span>
                        <button 
                            className="resend-link" 
                            onClick={handleResend}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Click to resend"}
                        </button>
                    </div>
                </div>

                <div className="back-to-login">
                    <Link to="/login">← Back to login</Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyPage;