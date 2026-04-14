import '../../cssFolder/screens/admin/adminOrderData.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

const AdminOrderDataPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id || id === 'undefined') {
                setError("No valid Order ID found in the URL.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const res = await axios.get(`${import.meta.env.VITE_URL}/orders/fetch-order/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (res.data.success) {
                    setOrder(res.data.order);
                } else {
                    setError(res.data.message || "Failed to fetch order.");
                }
            } catch (err) {
                setError(err.response?.data?.message || "An error occurred while fetching the order.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return (
        <div className="admin-status-container">
            <div className="spinner"></div>
            <p>Fetching secure order data...</p>
        </div>
    );

    if (error || !order) return (
        <div className="admin-status-container">
            <div className="error-box">
                <h2>⚠️ Error</h2>
                <p>{error || "Order data is unavailable."}</p>
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        </div>
    );

    // Note: If your backend returns an array, we keep .map(). 
    // If it returns a single object, remove the .map() wrapper.
    return (
        <div className="admin-order-page-wrapper">
            <header className="order-page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>← Back to Orders</button>
                <h1>Order Management</h1>
            </header>

            {order.map((orderItem) => (
                <div key={orderItem._id} className="order-details-card">
                    
                    {/* Section 1: Order Summary */}
                    <section className="order-summary-section">
                        <div className="summary-info">
                            <h3>Order ID: <span>#{orderItem._id}</span></h3>
                            <p className={`status-badge ${orderItem.status.toLowerCase()}`}>
                                Status: <strong>{orderItem.status}</strong>
                            </p>
                        </div>
                        <div className="summary-price">
                            <p className="total-label">Total Amount</p>
                            <h2>{orderItem.currency} {orderItem.amount}</h2>
                        </div>
                    </section>

                    <hr />

                    {/* Section 2: Customer Information */}
                    <section className="customer-info-section">
                        <h4>Customer Details</h4>
                        <div className="customer-grid">
                            <p><strong>Name:</strong> {orderItem.userId.firstName} {orderItem.userId.lastName}</p>
                            <p><strong>User ID:</strong> {orderItem.userId._id}</p>
                        </div>
                    </section>

                    <hr />

                    {/* Section 3: Product List */}
                    <section className="products-section">
                        <h4>Items Ordered</h4>
                        <div className="products-list">
                            {orderItem.products.map((item) => (
                                <div key={item._id} className="product-item-row">
                                    <div className="product-img-container">
                                        <img 
                                            src={item.productId.productImgs[0]?.url} 
                                            alt={item.productId.productName} 
                                        />
                                    </div>
                                    <div className="product-details">
                                        <p className="product-name">{item.productId.productName}</p>
                                        <p className="product-meta">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="product-price">
                                        <p>{orderItem.currency} {item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            ))}
        </div>
    );
};

export default AdminOrderDataPage;