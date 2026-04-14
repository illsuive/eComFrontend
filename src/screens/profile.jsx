import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../redux/slices/userSlices.js';
import '../cssFolder/screens/profile.css';
import { useNavigate, useParams } from 'react-router-dom';

const Profile = () => {
    const { id } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // order data
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const [file, setFile] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        phoneNo: '',
        address: '',
        zipCode: '',
        city: '',
    });

    // Sync form with Redux state on load or when user data changes

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) setFile(selectedFile);
    };

    const handleUpdateDetails = async () => {
        try {
            // Double check ID exists
            if (!user?._id) {
                alert("User ID not found. Please log in again.");
                return;
            }

            const dataToSend = new FormData();
            Object.keys(formData).forEach(key => dataToSend.append(key, formData[key]));
            if (file) dataToSend.append('profilePic', file);

            // Check if your backend route includes '/api' or specific keywords
            const url = `${import.meta.env.VITE_URL}/users/update/${user._id}`;

            const res = await axios.patch(url, dataToSend, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' },
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                setIsEditing(false);
                setFile(null);
                alert("Profile Updated!");
            }
        } catch (err) {
            console.error("Full Error Object:", err); // Look at this in the console!
            alert(`Update failed: ${err.response?.status} - ${err.response?.data?.message || "Route not found"}`);
        }
    };

    // const handleRemoveImage = async () => {
    // // 1. Ask for confirmation so users don't click it by mistake
    // if (!window.confirm("Are you sure you want to remove your profile picture?")) return;

    // try {
    //     const res = await axios.delete('http://localhost:3000/users/', {
    //         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    //     });

    //     if (res.data.success) {
    //         // 2. Update Redux so the header and profile update instantly
    //         dispatch(setUser(res.data.user)); 
    //         // 3. Clear any local file preview
    //         setFile(null);
    //         alert("Profile picture removed.");
    //     }
    // } catch (err) {
    //     console.error("Removal failed", err);
    //     alert("Could not remove image. Please try again.");
    // }
    // };

    // 1. Fixed name and added missing 'await'

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                middleName: user.middleName || '',
                lastName: user.lastName || '',
                phoneNo: user.phoneNo || '',
                address: user.address || '',
                zipCode: user.zipCode || '',
                city: user.city || '',
            });
        }
    }, [user]);

    const fetchAllOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_URL}/orders/fetch-orders`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            if (res.data.success) {
                setOrders(res.data.orders);
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.error("Fetch orders error:", error);
            alert('Failed to fetch orders.');
        } finally {
            setLoading(false);
        }
    };

    const ProuctDetails = (id) => {
        navigate(`/product/${id}`);
    };

    useEffect(() => {
        if (activeTab === 'orders') {
            fetchAllOrders();
        }
    }, [activeTab]);

    if (!user) return <div className="loader">Loading...</div>;

    return (
        <div className="profile-page-wrapper">
            <aside className="profile-sidebar">
                <div className="sidebar-header"><h3>My Account</h3></div>
                <nav className="sidebar-nav">
                    <button className={activeTab === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>👤 Profile Details</button>
                    <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>📦 My Orders</button>
                    <button className="logout-nav" onClick={() => navigate('/login')}>🚪 Logout</button>
                </nav>
            </aside>

            <main className="profile-content">
                {activeTab === 'details' ? (
                    <section className="details-card">
                        <div className="avatar-management">
                            <div className="profile-img-container">
                                {file ? (
                                    <img src={URL.createObjectURL(file)} alt="Preview" />
                                ) : user.profilePic ? (
                                    <img src={user.profilePic} alt="User" />
                                ) : (
                                    <div className="avatar-placeholder">{user.firstName[0]?.toUpperCase()}</div>
                                )}
                            </div>
                            <div className="avatar-controls">
                                <label className="upload-label">
                                    {file ? "Image Ready" : "Change Image"}
                                    <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
                                </label>

                                {/* --- REMOVE BUTTON LOGIC --- */}
                                {user.profilePic && !file && (
                                    <button
                                        type="button"
                                        className="remove-img-btn"
                                    // onClick={handleRemoveImage}
                                    >
                                        Remove Current
                                    </button>
                                )}

                                {/* If they selected a new file but haven't saved, show a 'Cancel' option */}
                                {file && (
                                    <button
                                        type="button"
                                        className="cancel-upload-btn"
                                        onClick={() => setFile(null)}
                                    >
                                        Cancel Selection
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="info-form">
                            <div className="section-title-row">
                                <h2>Account Settings</h2>
                                <button className="edit-toggle" onClick={() => setIsEditing(!isEditing)}>
                                    {isEditing ? 'Cancel' : 'Edit Details'}
                                </button>
                            </div>

                            <div className="input-group">
                                <div className="field">
                                    <label>First Name</label>
                                    <input name="firstName" value={formData.firstName} onChange={handleInputChange} disabled={!isEditing} />
                                </div>
                                <div className="field">
                                    <label>Middle Name</label>
                                    <input name="middleName" value={formData.middleName} onChange={handleInputChange} disabled={!isEditing} />
                                </div>
                                <div className="field">
                                    <label>Last Name</label>
                                    <input name="lastName" value={formData.lastName} onChange={handleInputChange} disabled={!isEditing} />
                                </div>
                                <div className="field">
                                    <label>Phone Number</label>
                                    <input name="phoneNo" value={formData.phoneNo} onChange={handleInputChange} disabled={!isEditing} />
                                </div>
                                <div className="field">
                                    <label>Email (Verified)</label>
                                    <input value={user.email} disabled className="disabled-field" />
                                </div>

                                {/* New City and ZipCode Fields */}
                                <div className="field">
                                    <label>City</label>
                                    <input name="city" value={formData.city} onChange={handleInputChange} disabled={!isEditing} />
                                </div>
                                <div className="field">
                                    <label>Zip Code</label>
                                    <input name="zipCode" value={formData.zipCode} onChange={handleInputChange} disabled={!isEditing} />
                                </div>

                                <div className="field full-width">
                                    <label>Complete Address</label>
                                    <textarea name="address" value={formData.address} onChange={handleInputChange} disabled={!isEditing} />
                                </div>
                            </div>

                            {(isEditing || file) && (
                                <button className="update-btn" onClick={handleUpdateDetails}>
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </section>
                ) : (
                    <section className="orders-card">
                        <h2>Order History</h2>
                        {loading ? (
                            <p>Loading orders...</p>
                        ) : orders.length > 0 ? (
                            <div className="orders-list">
                                {orders.map((order) => (
                                    <div key={order._id} className="order-item">
                                        <p>Order ID: {order._id}</p>
                                        <p>Status: {order.status}</p>
                                        <p>Total: ${order.amount}</p>
                                        {
                                            order.products.map((product) => (
                                                <div key={product._id} onClick={()=> ProuctDetails(product.productId._id)} >
                                                    
                                                    <img src={product.productId.productImgs[0].url} alt={product.productId.productName} />
                                                    <p >{product.productId.productName} - ${product.productId.productPrice} x {product.quantity}</p>
                                                    <p>{product.description}</p>
                                                </div>
                                                
                                            ))
                                        }
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-orders">
                                <p>No orders found.</p>
                                <button className="shop-now-btn" onClick={() => navigate('/')}>Shop Now</button>
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
};

export default Profile;