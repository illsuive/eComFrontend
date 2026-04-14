import '../cssFolder/screens/home.css';
import { useSelector } from 'react-redux';

const HomePage = () => {
    const user = useSelector((state) => state.user.user);

    return (
        <div className="home-wrapper">
            {/* 1. Hero Section: The "Hook" */}
            <header className="hero-banner">
                <div className="hero-overlay">
                    <div className="hero-content">
                        <span className="welcome-badge">
                            {user ? `Welcome back, ${user.firstName}!` : "New Season Now In"}
                        </span>
                        <h1>Innovative Tech for <br/> Modern Living</h1>
                        <p>Explore our curated collection of high-performance gadgets designed to elevate your daily routine.</p>
                        <div className="hero-actions">
                            <button className="btn-primary">Explore Collection</button>
                            <button className="btn-secondary">View Deals</button>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. Trust/Features Section: The "Why Us" */}
            <section className="features-bar">
                <div className="feature-item">
                    <i className="icon-shipping"></i>
                    <div>
                        <h4>Free Shipping</h4>
                        <p>On orders over $50</p>
                    </div>
                </div>
                <div className="feature-item">
                    <i className="icon-support"></i>
                    <div>
                        <h4>24/7 Support</h4>
                        <p>Expert help anytime</p>
                    </div>
                </div>
                <div className="feature-item">
                    <i className="icon-secure"></i>
                    <div>
                        <h4>Secure Payment</h4>
                        <p>100% protected checkout</p>
                    </div>
                </div>
            </section>

            {/* 3. Product Section (Existing logic, improved layout) */}
            <main className="main-content">
                <div className="section-header">
                    <h2>Trending Now</h2>
                    <p>Our top-rated products for this week.</p>
                </div>
                
                {/* Your Product Map would go here */}
                <div className="product-grid-placeholder">
                    {/* products.map(...) */}
                </div>
            </main>

            {/* 4. CTA / Newsletter Section: The "Retention" */}
            <section className="newsletter-cta">
                <div className="newsletter-card">
                    <h2>Join the Inner Circle</h2>
                    <p>Get exclusive early access to new drops and member-only discounts.</p>
                    <form className="subscribe-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Enter your email address" />
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default HomePage;