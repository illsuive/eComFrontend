import { NavLink } from 'react-router-dom';
import '../cssFolder/components/footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section brand-info">
                    <div className="footer-logo">
                        <span className="logo-icon">🛍️</span>
                        <span className="logo-text">ShopFlow</span>
                    </div>
                    <p className="brand-description">
                        Your one-stop destination for the best products and deals online.
                    </p>
                </div>

                {/* Tracking Links Section */}
                <div className="footer-section tracking-links">
                    <h4>Platform</h4>
                    <ul>
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/products">All Products</NavLink></li>
                        <li><NavLink to="/cart">Cart</NavLink></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Support</h4>
                    <ul>
                        <li><NavLink to="/terms">Terms</NavLink></li>
                        <li><NavLink to="/privacy">Privacy</NavLink></li>
                        <li><NavLink to="/contact">Contact</NavLink></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Office</h4>
                    <p>Noida, Uttar Pradesh</p>
                    <p className="contact-email">support@shopflow.com</p>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} ShopFlow. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;