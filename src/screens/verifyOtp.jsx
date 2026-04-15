import '../cssFolder/screens/verifyOtp.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const VerifyOtpPage = () => {
    const navigate = useNavigate();
    const { email } = useParams();
    
    const [activeTab, setActiveTab] = useState('verifyTab');
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Toggle Visibility States
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 4) {
            alert('Please enter a 4-digit OTP.');
            return;
        }
        try {
            setIsLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_URL}/users/verifyotp/${email}`, { otp });
            if (res.data.success) {
                alert(res.data.message);
                setActiveTab('resetTab');
            }
        } catch (error) {
            alert(error.response?.data?.message || "Invalid OTP.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleResetPassword = async () => {
        if (!password || !confirmPassword) {
            alert('All fields are required.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        try {
            setIsLoading(true);
            
            /* IMPORTANT FIX: 
               Check your backend controller. If it uses const { password } = req.body,
               change the key below to 'password'.
            */
            const res = await axios.post(`${import.meta.env.VITE_URL}/users/changepassword/${email}`, { 
                newpassword: password , // Ensure this matches your controller destructuring
                confirmPassword: confirmPassword
            });

            if (res.data.success) {
                alert("Password updated successfully!");
                navigate('/login');
            }
        } catch (error) {
            console.error("Reset Error:", error);
            // The 400 error message from your backend is shown here:
            alert(error.response?.data?.message || "Reset failed (400 Bad Request). Check backend console.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="verify-otp-wrapper">
            <div className="auth-card">
                {activeTab === 'verifyTab' ? (
                    <div className="tab-content">
                        <header className="auth-header">
                            <h1>Verify Account</h1>
                            <p>Enter code sent to: <strong>{email}</strong></p>
                        </header>
                        <div className="input-group">
                            <label>Security Code</label>
                            <input 
                                type="text" 
                                maxLength="4"
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                                placeholder="0000"
                            />
                        </div>
                        <button className="auth-btn" onClick={handleVerifyOtp} disabled={isLoading}>
                            {isLoading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </div>
                ) : (
                    <div className="tab-content">
                        <header className="auth-header">
                            <h1>New Password</h1>
                        </header>

                        {/* New Password Field */}
                        <div className="input-group password-field">
                            <label>New Password</label>
                            <div className="input-wrapper">
                                <input 
                                    type={showPass ? "text" : "password"} 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="••••••••"
                                />
                                <button 
                                    type="button" 
                                    className="toggle-eye" 
                                    onClick={() => setShowPass(!showPass)}
                                >
                                    {showPass ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="input-group password-field">
                            <label>Confirm Password</label>
                            <div className="input-wrapper">
                                <input 
                                    type={showConfirmPass ? "text" : "password"} 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    placeholder="••••••••"
                                />
                                <button 
                                    type="button" 
                                    className="toggle-eye" 
                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                >
                                    {showConfirmPass ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        <button className="auth-btn" onClick={handleResetPassword} disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VerifyOtpPage;