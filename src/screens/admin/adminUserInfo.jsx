import '../../cssFolder/screens/admin/AdminUserInfoPage.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const AdminUserInfoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 1. Fixed Initial State: Added 'role'
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        phoneNo: '',
        city: '',
        zipCode: '',
        address: '',
        role: '' // Added this
    });

    const getUserInfo = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_URL}/users/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success) {
                const u = res.data.user;
                setUserInfo(u);
                
                // 2. Sync 'role' from DB to Form
                setFormData({
                    firstName: u.firstName || '',
                    middleName: u.middleName || '',
                    lastName: u.lastName || '',
                    phoneNo: u.phoneNo || '',
                    city: u.city || '',
                    zipCode: u.zipCode || '',
                    address: u.address || '',
                    role: u.role || 'user' // Default to user if undefined
                });
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
            if (error.response?.status === 404) navigate('/admin/dashboard/users');
        }
    };

    useEffect(() => {
        if (id) getUserInfo();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) setFile(selectedFile);
    };

    const handleUpdateDetails = async () => {
        console.log(import.meta.env.VITE_URL);
        
        try {
            const data = new FormData();
            // Append all text fields including 'role'
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (file) data.append('profilePic', file);

            const res = await axios.patch(`${import.meta.env.VITE_URL}/users/update/${id}`, data, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                alert("User updated successfully");
                setIsEditing(false);
                setFile(null);
                getUserInfo(); 
            }
        } catch (error) {
            alert(error.response?.data?.message || "Update failed");
        }
    };

    if (!userInfo) return <div className="loading">Loading User Data...</div>;

    return (
        <div className="profile-page-wrapper">
            <aside className="profile-sidebar">
                <div className="sidebar-header"><h3>Admin Actions</h3></div>
                <nav className="sidebar-nav">
                    <button className={activeTab === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>
                        👤 User Details
                    </button>
                    {/* <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
                        📦 User Orders
                    </button> */}
                    <button className="back-nav" onClick={() => navigate(-1)}>
                        ⬅ Back to Users
                    </button>
                </nav>
            </aside>

            <main className="profile-content">
                {activeTab === 'details' ? (
                    <section className="details-card">
                        <div className="avatar-management">
                            <div className="profile-img-container">
                                {file ? (
                                    <img src={URL.createObjectURL(file)} alt="Preview" />
                                ) : userInfo.profilePic ? (
                                    <img src={userInfo.profilePic} alt="User" />
                                ) : (
                                    <div className="avatar-placeholder">{userInfo.firstName?.[0]?.toUpperCase()}</div>
                                )}
                            </div>
                            <div className="avatar-controls">
                                <label className="upload-label">
                                    {file ? "New Image Selected" : "Change User Photo"}
                                    <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
                                </label>
                                {file && (
                                    <button type="button" className="cancel-upload-btn" onClick={() => setFile(null)}>Cancel Selection</button>
                                )}
                            </div>
                        </div>

                        <div className="info-form">
                            <div className="section-title-row">
                                <h2>Account Details ID <br/>({id})</h2>
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
                                    <label>Last Name</label>
                                    <input name="lastName" value={formData.lastName} onChange={handleInputChange} disabled={!isEditing} />
                                </div>
                                <div className="field">
                                    <label>Phone Number</label>
                                    <input name="phoneNo" value={formData.phoneNo} onChange={handleInputChange} disabled={!isEditing} />
                                </div>
                                <div className="field">
                                    <label>Email</label>
                                    <input value={userInfo.email} disabled className="disabled-field" />
                                </div>
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

                                {/* 3. Role Selection UI */}
                                <div className="field full-width">
                                    <label>User Role</label>
                                    <div className="radio-group">
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                name="role"
                                                value="user"
                                                checked={formData.role === 'user'}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                            />
                                            <span>User</span>
                                        </label>
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                name="role"
                                                value="admin"
                                                checked={formData.role === 'admin'}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                            />
                                            <span>Admin</span>
                                        </label>
                                    </div>
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
                        <h2>User Order History</h2>
                        <div className="empty-orders">
                            <p>No orders found for this user.</p>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default AdminUserInfoPage;