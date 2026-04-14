import '../../cssFolder/screens/admin/adminUsers.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const getAllUsers = async () => {
        console.log(import.meta.env.VITE_URL);
        
        try {
            const res = await axios.get(`${import.meta.env.VITE_URL}/users/allusers`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success) {
                setUsers(res.data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    useEffect(() => {
        getAllUsers();
    }, []);

    const filteredUsers = users.filter(user => 
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const userEdit = (id) => {
        navigate(`/admin/dashboard/users/${id}`);
    }

    const userOrder = (id) => {
        navigate(`/admin/dashboard/orders/${id}`);
    }

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div>
                    <h1>User Management</h1>
                    <p>Total Users: {users.length}</p>
                </div>
                <div className="admin-actions">
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </header>

            <div className="user-list-container">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <div key={user._id} className="user-card">
                            
                            {/* Left Section: Avatar & Role */}
                            <div className="user-profile-section">
                                <div className="avatar-container">
                                    {user.profilePic ? (
                                        <img src={user.profilePic} alt={user.firstName} className="user-img" />
                                    ) : (
                                        <div className="avatar-letter">
                                            {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                                        </div>
                                    )}
                                    <span className={`role-tag ${user.role}`}>
                                        {user.role}
                                    </span>
                                </div>

                                {/* Middle Section: Name & Email */}
                                <div className="user-details">
                                    <h3 className="user-name">{user.firstName} {user.lastName}</h3>
                                    <p className="user-email">{user.email}</p>
                                </div>
                            </div>

                            {/* Right Section: Buttons */}
                            <div className="user-actions">
                                <button className="btn-orders" onClick={()=> userOrder(user._id)}>View Orders</button>
                                <button className="btn-edit" onClick={() => userEdit(user._id)}>
                                    Edit User
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-users">
                        <p>No users found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsersPage;