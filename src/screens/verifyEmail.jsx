import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../cssFolder/screens/verifyEmail.css';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    // Status can be: 'verifying', 'success', or 'error'
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Please wait while we verify your email...');

    const verifyEmail = async () => {
        try {
            // Using your existing endpoint logic
            const response = await axios.post(`${import.meta.env.VITE_URL}/users/verify`, {}, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            
            setStatus('success');
            setMessage(response.data.message || "Email verified successfully!");
            
            // Redirect after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
            
        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage(error.response?.data?.message || 'Verification failed. The link may be expired.');
        }
    };

    useEffect(() => {
        if (token) {
            verifyEmail();
        } else {
            setStatus('error');
            setMessage("Invalid verification link.");
        }
    }, [token]);

    return (
        <div className="verify-email-container">
            <div className={`verify-email-card ${status}`}>
                <div className="status-icon">
                    {status === 'verifying' && <div className="loader"></div>}
                    {status === 'success' && <span className="check-mark">✓</span>}
                    {status === 'error' && <span className="cross-mark">✕</span>}
                </div>

                <h1>{status.charAt(0).toUpperCase() + status.slice(1)}</h1>
                <p className="status-message">{message}</p>

                {status === 'success' && (
                    <p className="redirect-text">Redirecting you to login in a few seconds...</p>
                )}

                {(status === 'success' || status === 'error') && (
                    <Link to="/login" className="back-btn">
                        Go to Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;