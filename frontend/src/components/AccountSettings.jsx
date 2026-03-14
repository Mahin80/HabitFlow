import React, { useState, useEffect } from 'react';
import './NavBar.css'; 
import { Link } from "react-router-dom";
import jwt_decode from 'jwt-decode';
import axios from 'axios';

const AccountSettings = () => {
    const [userId, setUserId] = useState('');
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwt_decode(token);
                setUserId(decoded.userId);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }

        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/account-setting/${userId}`);
                setFormData({
                    firstname: response.data.firstname,
                    lastname: response.data.lastname,
                    username: response.data.username,
                    email: response.data.email,
                });
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        if (userId) fetchUserInfo();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/account-setting/${userId}`, formData);
            alert(response.data.message);
        } catch (error) {
            console.error('Error updating user info:', error);
            alert('Failed to update account settings.');
        } finally {
            setLoading(false);
        }
    };

    return (

        <div>
      <header className="navbar">
          <div className="logo">HABITFLOW</div>
          <nav className="nav-links">
            <Link to="/Home">Home</Link>
            <Link to ="/accountsettings">Account settings</Link>
            <Link to="/Logout">Logout</Link>
          

          </nav>
        </header>
        <div
            style={{
                backgroundColor: '#0d0d0d',
                color: 'white',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
            }}
        >
            <h2 style={{ color: 'white', marginBottom: '20px' }}>Account Information</h2>
            <form
                onSubmit={handleSubmit}
                style={{
                    width: '50%',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '10px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                }}
            >
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    style={{
                        backgroundColor: '#333',
                        color: 'white',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '5px',
                    }}
                />
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleInputChange}
                            style={{
                                backgroundColor: '#333',
                                color: 'white',
                                border: 'none',
                                padding: '10px',
                                borderRadius: '5px',
                            }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            style={{
                                backgroundColor: '#333',
                                color: 'white',
                                border: 'none',
                                padding: '10px',
                                borderRadius: '5px',
                            }}
                        />
                    </div>
                </div>
                <label>User Name</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    style={{
                        backgroundColor: '#333',
                        color: 'white',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '5px',
                    }}
                />
                <p
                    onClick={() => setShowPasswordFields((prev) => !prev)}
                    style={{ color: '#A965FF', cursor: 'pointer', textDecoration: 'underline', margin: '10px 0' }}
                >
                    Change Password
                </p>
                {showPasswordFields && (
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                            <label>Old Password</label>
                            <input
                                type="password"
                                name="oldPassword"
                                onChange={handleInputChange}
                                style={{
                                    backgroundColor: '#333',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px',
                                    borderRadius: '5px',
                                }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                onChange={handleInputChange}
                                style={{
                                    backgroundColor: '#333',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px',
                                    borderRadius: '5px',
                                }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                onChange={handleInputChange}
                                style={{
                                    backgroundColor: '#333',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px',
                                    borderRadius: '5px',
                                }}
                            />
                        </div>
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        backgroundColor: '#A965FF',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '10px',
                    }}
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
            
        </div>

    </div>
    );
};

export default AccountSettings;