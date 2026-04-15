import '../../cssFolder/screens/admin/adminOrders.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null); // Track which order is open

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_URL}/orders/fetch-all-orders`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const toggleOrder = (id) => {
        setExpandedOrder(expandedOrder === id ? null : id);
    };

    if (loading) return <div className="admin-loader">Securely fetching records...</div>;

    return (
        <div className="admin-orders-container">
            <header className="dashboard-header">
                <div>
                    <h1>Order Ledger</h1>
                    <p>{orders.length} transactions recorded</p>
                </div>
                <div className="status-legend">
                    <span className="dot paid"></span> Paid 
                    <span className="dot pending"></span> Pending
                </div>
            </header>

            <div className="orders-table-wrapper">
                {/* Table Header */}
                <div className="table-row head">
                    <span>Order ID</span>
                    <span>Customer</span>
                    <span>Date</span>
                    <span>Amount</span>
                    <span>Status</span>
                    <span>Action</span>
                </div>

                {/* Orders List */}
                {orders.map((order) => (
                    <div key={order._id} className={`order-row-group ${expandedOrder === order._id ? 'is-open' : ''}`}>
                        <div className="table-row main-data" onClick={() => toggleOrder(order._id)}>
                            <span className="id-cell">#{order._id.slice(-6).toUpperCase()}</span>
                            <span className="name-cell">{order.userId.firstName} {order.userId.lastName}</span>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                            <span className="price-cell">${order.amount.toFixed(2)}</span>
                            <span>
                                <span className={`badge ${order.status.toLowerCase()}`}>{order.status}</span>
                            </span>
                            <span>
                                <button className="expand-btn">{expandedOrder === order._id ? 'Close' : 'View'}</button>
                            </span>
                        </div>

                        {/* Collapsible Details Area */}
                        {expandedOrder === order._id && (
                            <div className="order-details-drawer">
                                <div className="drawer-grid">
                                    <div className="contact-info">
                                        <h5>Contact Details</h5>
                                        <p>{order.userId.email}</p>
                                        <p>User ID: {order.userId._id}</p>
                                    </div>
                                    <div className="product-snapshot">
                                        <h5>Ordered Items ({order.products.length})</h5>
                                        <div className="mini-product-list">
                                            {order.products.map(p => (
                                                <div key={p._id} className="mini-p-item">
                                                    <img src={p.productId.productImgs[0]?.url} alt="" />
                                                    <div>
                                                        <p><strong>{p.productId.productName}</strong></p>
                                                        <p>Qty: {p.quantity} × ${p.price}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOrdersPage;