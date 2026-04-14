import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import '../cssFolder/components/header.css';
import { setUser } from '../redux/slices/userSlices.js';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const user = useSelector((state) => state.user.user);
    const isAuthenticated = !!localStorage.getItem('token');

    const handleLogout = async (e) => {
        e.preventDefault(); // Stop Link from navigating when clicking logout
        e.stopPropagation(); 
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_URL}/users/logout`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.removeItem('token');
            dispatch(setUser(null));
            navigate('/login');
            closeMenu();
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo" onClick={() => navigate('/')}>
                    <span className="logo-icon">🛍️</span>
                    <span className="logo-text">Shop<span className="text-primary">Flow</span></span>
                </div>

                <nav className={`nav-menu ${isMenuOpen ? 'show' : ''}`}>
                    <ul className="nav-list">
                        <li><NavLink to="/" end onClick={closeMenu}>Home</NavLink></li>
                        <li><NavLink to="/products" onClick={closeMenu}>Products</NavLink></li>
                        {/* <li><NavLink to="/categories" onClick={closeMenu}>Categories</NavLink></li> */}
                        
                        {/* ✅ ADMIN DASHBOARD LINK */}
                        {user?.role === 'admin' && (
                            <li>
                                <NavLink to="/admin/dashboard/add-products" onClick={closeMenu} className="admin-link">
                                    Dashboard
                                </NavLink>
                            </li>
                        )}
                    </ul>
                    
                    <div className="nav-actions">
                        <button className="btn-cart" onClick={() => { navigate('/cart'); closeMenu(); }}>
                            <span className="cart-icon">🛒</span>
                            <span className="cart-text">Cart</span>
                        </button>

                        {isAuthenticated && user ? (
                            <div className="user-profile-wrapper">
                                <Link to={`/profile/${user._id}`} onClick={closeMenu} className="profile-nav-link">
                                    <div className="user-info">
                                        <div className="avatar">
                                            {user.profilePic ? (
                                                <img src={user.profilePic} alt="profile" />
                                            ) : (
                                                <span>{user.firstName?.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div className="user-details">
                                            <span className="user-name">{user.firstName}</span>
                                            <span className="user-role">{user.role}</span>
                                        </div>
                                    </div>
                                </Link>
                                {/* Moved logout outside the Link to prevent accidental navigation */}
                                <button className="btn-logout" onClick={handleLogout}>Log Out</button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <button className="btn-login" onClick={() => { navigate('/login'); closeMenu(); }}>Log In</button>
                                <button className="btn-signup" onClick={() => { navigate('/signup'); closeMenu(); }}>Join</button>
                            </div>
                        )}
                    </div>
                </nav>

                <button className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;