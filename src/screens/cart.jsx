import '../cssFolder/screens/cart.css'
import { useSelector } from 'react-redux'
import CartCard from '../components/cartCard.jsx'
import { useNavigate } from 'react-router-dom'

const CartPage = () => {
    
    // console.log(user);
    
    // 1. Getting data from the nested Redux structure we fixed
    const cartItems = useSelector((state) => state.products.cart.items);
    const totalAmt = useSelector((state) => state.products.cart.totalPrice);
    const navigate = useNavigate();

    // 2. Empty Cart UI: Keeps the user engaged instead of a blank screen
    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="empty-cart-wrapper">
                <div className="empty-cart-content">
                    <span className="empty-cart-icon">🛒</span>
                    <h2>Your cart is empty!</h2>
                    <p>Add some items to the cart to see them here.</p>
                    <button 
                        className="continue-shopping-btn" 
                        onClick={() => navigate('/products')}
                    >
                        Explore Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page-container">
            <header className="cart-header">
                <h1>Shopping Cart</h1>
                <p>You have {cartItems.length} items in your bag</p>
            </header>

            <div className="cart-main-layout">
                {/* 3. Left Side: The List of Product Cards */}
                <section className="cart-items-section">
                    <div className="cart-items-grid">
                        {cartItems.map((item) => (
                            <CartCard key={item._id} item={item} />
                        ))}
                    </div>
                </section>

                {/* 4. Right Side: Pricing and Checkout Summary */}
                <aside className="cart-summary-sidebar">
                    <div className="summary-card">
                        <h3>Order Summary</h3>
                        
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${totalAmt.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Estimated Shipping</span>
                                <span className="free-text">FREE</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax (GST)</span>
                                <span>$0.00</span>
                            </div>
                        </div>

                        <hr className="summary-divider" />

                        <div className="summary-total">
                            <strong>Total Amount</strong>
                            <strong>${totalAmt.toFixed(2)}</strong>
                        </div>

                        <button className="checkout-now-btn"onClick={() => navigate('/address')}>
                            Proceed to Checkout
                        </button>

                        <div className="payment-badges" >
                            <p>We accept Secure Payments</p>
                            {/* Icons would go here */}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default CartPage;