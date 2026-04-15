import '../../cssFolder/screens/admin/adminOrders.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' // Added for navigation

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_URL}/orders/fetch-all-orders`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                setOrders(response.data.orders)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching orders:', error)
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    if (loading) return <div className="loader-container">Loading orders...</div>
    if (orders.length === 0) return <div className="no-data">No orders found.</div>

    return (
        <div className="admin-orders-container">
            <header className="page-header">
                <h1>Order Management</h1>
                <p>Total Orders: {orders.length}</p>
            </header>

            <div className="orders-list">
                {orders.map(order => (
                    <div key={order._id} className="order-card">
                        
                        {/* 1. Order Top Bar */}
                        <div className="order-card-header">
                            <div>
                                <span className="order-label">ORDER ID</span>
                                <h3>#{order._id.slice(-8).toUpperCase()}</h3>
                            </div>
                            <div className="order-meta">
                                <span className={`status-badge ${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                                <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* 2. Customer & Financial Summary */}
                        <div className="order-info-grid">
                            <div className="info-group">
                                <h4>Customer</h4>
                                <p><strong>{order.userId.firstName} {order.userId.lastName}</strong></p>
                                <p className="sub-text">{order.userId.email}</p>
                            </div>
                            <div className="info-group">
                                <h4>Payment</h4>
                                <p className="amount-highlight">${order.amount.toFixed(2)}</p>
                                <p className="sub-text">Total Price</p>
                            </div>
                         
                        </div>

                        {/* 3. Mini Product Preview */}
                        <div className="order-items-preview">
                            <h4>Items ({order.products.length})</h4>
                            <div className="items-scroll-row">
                                {order.products.map(item => (
                                    <div key={item._id} className="mini-item-card">
                                        <img 
                                            src={item.productId.productImgs[0]?.url} 
                                            alt={item.productId.productName} 
                                        />
                                        <div className="mini-item-details">
                                            <p className="item-name">{item.productId.productName}</p>
                                            <p className="item-qty">Qty: {item.quantity} × ${item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminOrdersPage;