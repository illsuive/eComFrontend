import { Link } from 'react-router-dom';
import '../cssFolder/screens/orderSucces.css';
import { useSelector} from 'react-redux'
 
const OrderSuccessPage = () => {
    const user = useSelector((state) => state.user.user);
    console.log(user);
    return (
        <div className="order-success-container">
            <div className="success-card">
                <div className="success-icon">
                    <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                
                <h1>Order Placed Successfully!</h1>
                <p>Thank you for your purchase. Your order has been confirmed and will be shipped shortly.</p>
                
                <div className="order-actions">
                    <Link to="/" className="home-btn">
                        Continue Shopping
                    </Link>
                    <Link to={`/profile/${user._id}`} className="orders-link">
                        View My Orders
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;