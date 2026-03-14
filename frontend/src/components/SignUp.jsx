import React, { useState } from 'react';
import './Login.css'; 
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for HTTP requests
import './NavBar.css'; // Include NavBar styling

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false); // Track if signup is successful

  const navigate = useNavigate(); // Add navigate to redirect to Login after successful signup

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      // Send signup request to backend
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, {
        firstName,
        lastName,
        username,
        email,
        password,
      });

      setSignupSuccess(true); // Mark signup as successful
      setError(''); // Clear any existing errors

      // Redirect to login page after signup
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Redirect after 2 seconds for a smooth transition
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup');
    }
  };

  return (
    <div className="login-page">

<header className="navbar">
      <div className="logo">HABITFLOW</div>
      <nav className="nav-links">
        <Link to="/Home">Home</Link>
        <Link to="/Login">Login</Link>
        <Link to="/contactUs">Contact</Link>
        <Link to="/about">About Us</Link>

      </nav>
    </header>
      {/* Signup Form */}
      <div className="login-container">
        <div className="background-image">
          <img src="./images/login_Image.jpg" alt="Background" />
        </div>
        <div className="login-box">
          <h2>SIGNUP</h2>
          <form onSubmit={handleSubmit}>
            {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
            {signupSuccess && <div style={{ color: 'green', marginBottom: '20px' }}>Signup successful! Redirecting to login...</div>}

            <div className="input-group-signup">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="input-group-signup">
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="input-group-signup">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group-signup">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group-signup">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group-signup">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {!signupSuccess && (
              <button type="submit" className="login-button">
                Signup
              </button>
            )}
          </form>

          <div style={{ marginTop: '15px', color: '#000000' }}>
            Already have an account? <Link to="/login" style={{ color: '#000000' }}>Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;