import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../cssFolder/screens/login.css';
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../redux/slices/userSlices.js';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            console.log(import.meta.env.VITE_URL);
            
            const res = await axios.post(`${import.meta.env.VITE_URL}/users/login`, credentials);
            if (res.data.success) {
                localStorage.setItem('token', res.data.user.token);
                navigate('/');
                dispatch(setUser(res.data.user));
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {loading && (
                <div className="loading-overlay">
                    <div className="loader"></div>
                </div>
            )}

            <div className="login-card">
                <div className="login-form-section">
                    <div className="login-header">
                        <h1>Welcome Back</h1>
                        <p>Please enter your details to sign in.</p>
                    </div>

                    {error && <div className="error-banner">{error}</div>}

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email" style={{ color: 'black' }}>Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="name@company.com"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <div className="label-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label htmlFor="password" style={{ color: 'black', fontWeight: '700' }}>Password</label>
                                <Link
                                    to="/forgot-password"
                                    id="forgot-link"
                                    style={{ color: 'black', fontWeight: '700', fontSize: '0.8rem', textDecoration: 'underline' }}
                                >
                                    Forgot?
                                </Link>
                            </div>
                            <div className="password-wrapper" style={{ position: 'relative', width: '100%' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        color: 'black',
                                        fontWeight: '600',
                                        width: '100%',
                                        paddingRight: '60px' // Space for the toggle button
                                    }}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'black',
                                        fontWeight: '800',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading}
                            style={{
                                backgroundColor: '#2d2d2d',
                                color: 'white',
                                width: '100%',
                                fontWeight: '700',
                                marginTop: '15px'
                            }}
                        >
                            {loading ? "Signing in..." : "Login"}
                        </button>
                    </form>

                    <div className="footer-text">
                        <p>Don't have an account? <Link to="/signup" style={{ color: 'black' }}>Sign up for free</Link></p>
                    </div>
                </div>

                <div className="login-visual-section">
                    <div className="visual-content">
                        <h2>Shop Top Brands</h2>
                        <p>Access exclusive deals, track your orders, and shop with confidence.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;