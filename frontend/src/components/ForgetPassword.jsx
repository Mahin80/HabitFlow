import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgetPassword.css'; // Use your existing CSS

const ForgetPassword = () => {
  const [stage, setStage] = useState(1); // Stage 1: Enter username, Stage 2: Enter new password
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); // For displaying error messages
  const [successMessage, setSuccessMessage] = useState(''); // For success feedback
  const navigate = useNavigate();

  // Function to handle "Reset" button click
  const handleResetClick = async () => {
    if (!username.trim()) {
      setError('Please enter a username!');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/password/forgot-password`, {
        username, // Send `username` 
      });

      if (response.status === 200) {
        setError('');
        setSuccessMessage('Username verified. Proceed to reset your password.');
        setStage(2); // Move to stage 2
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error verifying username. Please try again.');
    }
  };

  // Function to handle "Submit" button click for password reset
  const handlePasswordSubmit = async () => {
    if (newPassword.trim().length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/password/reset-password`, {
        username, // Send `username` instead of `userId`
        newPassword,
      });

      if (response.status === 200) {
        setError('');
        alert('Password reset successfully!');
        navigate('/login'); // Redirect to login page
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password. Please try again.');
    }
  };

  return (
    <div className="forget-password-container">
      {stage === 1 && (
        <div className="reset-stage">
          <h2>Forget Password</h2>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleResetClick}>Reset</button>
        </div>
      )}
      {stage === 2 && (
        <div className="password-stage">
          <h2>Reset Password</h2>
          {error && <p className="error-message">{error}</p>}
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handlePasswordSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
