import '../cssFolder/screens/productDetails.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDispatch , useSelector } from 'react-redux';
import { addToCart , updateQuantity } from '../redux/slices/productSlice'; // Uncomment when ready

const ProductDetailsPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.products.cart.items);
    const cartQuantity = cartItems.find(item => item.productId._id === id)?.quantity || 0;
    // console.log(cartQuantity);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_URL}/products/all`);
                const foundProduct = response.data.products.find(p => p._id === id);
                setProduct(foundProduct);
                if (foundProduct) {
                    setMainImage(foundProduct.productImgs[0].url);
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async() => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/cart/add-to-cart`, { productId: product._id }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            if (res.data.success) {
                dispatch(addToCart(product));
                alert(res.data.message);
                return;
            }
            alert(res.data.message);
        } catch (error) {
            console.log(error);
            alert('Failed to add product to cart.');
        }
    };

    const handleUpdateQuantity = async (id, type) => {
        try {
            const res = await axios.patch(`${import.meta.env.VITE_URL}/cart/update-quantity`,{productId: id, type}, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            if (res.data.success) {
                alert(res.data.message);
                dispatch(updateQuantity({ id , type }));
                return;
            }
            alert(res.data.message);
        } catch (error) {
            console.log(error);
            alert('Failed to update product quantity.');
        }
    }

    if (loading) return <div className="loader">Loading product details...</div>;
    if (!product) return <div className="error">Product not found!</div>;

    return (
        <div className="product-details-container">
            <div className="product-details-layout">
                
                {/* Left Side: Image Gallery */}
                <div className="product-image-section">
                    <div className="main-image-wrapper">
                        <img src={mainImage} alt={product.productName} className="main-product-image" />
                    </div>
                    <div className="thumbnail-list">
                        {product.productImgs.map((img, index) => (
                            <div 
                                key={img._id} 
                                className={`thumbnail-item ${mainImage === img.url ? 'active' : ''}`}
                                onClick={() => setMainImage(img.url)}
                            >
                                <img src={img.url} alt={`View ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Product Info */}
                <div className="product-info-section">
                    <span className="info-brand">{product.productBrand}</span>
                    <h1 className="info-title">{product.productName}</h1>
                    <span className="info-category">{product.productCategory}</span>
                    
                    <div className="info-price-row">
                        <span className="info-price">${product.productPrice}</span>
                        <span className="info-stock">In Stock</span>
                    </div>

                    <div className="info-description">
                        <h3>Description</h3>
                        <p>{product.productDescription}</p>
                    </div>

                    <div className="info-actions">
                        <div className="quantity-control-wrapper">
                            {/* You can add a local quantity state here if needed */}
                            <button className="qty-btn" onClick={() => handleUpdateQuantity(product._id, "decrement")}>-</button>
                            <span className="qty-value">{cartQuantity}</span>
                            <button className="qty-btn" onClick={() => handleUpdateQuantity(product._id, "increment")}>+</button>
                        </div>
                        
                        <button 
                            className="add-to-cart-large"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    </div>

                    <div className="additional-features">
                        <div className="feature-item">
                            <span>🚚</span>
                            <p>Free Delivery on orders over $50</p>
                        </div>
                        <div className="feature-item">
                            <span>🛡️</span>
                            <p>1 Year Brand Warranty</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;