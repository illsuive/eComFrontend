import { useState } from 'react'; // Import useState
import '../cssFolder/components/productCard.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart , removeFromCart , updateQuantity } from '../redux/slices/productSlice.js'
import axios from 'axios';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [count, setCount] = useState(0); // State to manage the product count
    
    const handleViewDetails = () => {
        navigate(`/product/${product._id}`);
    };

    // Increase count
    const increment = (e) => {
        e.stopPropagation(); // Prevents navigating to details page
        setCount(prev => prev + 1);
    };

    // Decrease count (Never goes below 0)
    const decrement = (e) => {
        e.stopPropagation(); // Prevents navigating to details page
        if (count > 0) {
            setCount(prev => prev - 1);
        }
    };
    // console.log(product._id);
    
    const handleAddToCart = async (e) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/cart/add-to-cart`, { productId: product._id }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            if (res.data.success) {
                dispatch(addToCart(product));
                alert(res.data.message);
                setCount(1);
                return;
            }
            alert(res.data.message);

        } catch (error) {
            console.log(error);
        }

    };

    const ProuctDetails = (id) => {
        navigate(`/product/${id}`);
    };

    return (
        <div className="product-card">
            <div className="product-card-image" onClick={handleViewDetails}>
                <img src={product.productImgs[0]?.url} alt={product.productName} loading="lazy" />
                {product.isNew && <span className="badge-new">New</span>}
                <div className="image-overlay">
                    <button className="overlay-btn" onClick={()=>ProuctDetails(product._id)}>
                        Quick View
                    </button>
                </div>
            </div>

            <div className="product-card-info">
                <div className="brand-category">
                    <span className="product-brand">{product.productBrand}</span>
                    <span className="dot">•</span>
                    <span className="product-category">{product.productCategory}</span>
                </div>

                <h2 className="product-title" onClick={handleViewDetails}>
                    {product.productName}
                </h2>

                <p className="product-description">
                    {product.productDescription.length > 60
                        ? `${product.productDescription.substring(0, 60)}...`
                        : product.productDescription}
                </p>

                <div className="product-card-footer">
                    <span className="product-price">${product.productPrice}</span>

                    {/* Conditional Rendering Logic */}
                    {count === 0 ? (
                        <button
                            className="add-to-cart-btn"
                            onClick={handleAddToCart}
                        >
                            <span className="cart-icon">Add to cart</span>
                        </button>
                    ) : (
                        <div className="quantity-controls">
                            <button className="qty-btn" onClick={decrement}>-</button>
                            <span className="qty-count">{count}</span>
                            <button className="qty-btn" onClick={increment}>+</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductCard;