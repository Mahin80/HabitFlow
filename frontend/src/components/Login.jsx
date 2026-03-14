import React, { useState, useEffect } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Person, Lock } from '@mui/icons-material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const rememberData = JSON.parse(localStorage.getItem('rememberMe'));
    if (rememberData) {
      setEmail(rememberData.email || '');
      setPassword(rememberData.password || '');
      setRememberMe(true);
    }
  }, []);

  const validateEmail = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
      if (response.status === 200) {
        const { token, hasSelectedInterests } = response.data;

        localStorage.setItem('token', token);
       // localStorage.setItem('userId', userId);

        if (rememberMe) {
          localStorage.setItem('rememberMe', JSON.stringify({ email, password }));
        } else {
          localStorage.removeItem('rememberMe');
        }


        navigate(hasSelectedInterests ? '/dashboard' : '/selectinterests');
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };


  return (
    <div className="login-page">
      
      <div className="login-container">
      <header className="navbar">
      <div className="logo">HABITFLOW</div>
      <nav className="nav-links">
        <Link to="/Home">Home</Link>
        <Link to="/Login">Login</Link>
        <Link to="/contactUs">Contact</Link>
        <Link to="/about">About Us</Link>

      </nav>
    </header>
        <div className="background-image">
          <img src="/images/login_Image.jpg" alt="Background" />
        </div>
        <div className="login-box">
         
          <h2>LOGIN</h2>


          <form onSubmit={handleLogin}>
            {error && <div style={{ color: 'purple', marginBottom: '20px' }}>{error}</div>}
            <div className="input-group">
              <Person
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#ccc',
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <Lock className="icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="options">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />{' '}
                Remember me
              </label>
              <Link to="/forgetpassword"  style={{color:'#000000'}}>Forgot Password?</Link>
            </div>
            <div className="account">
              Don't have an account? <Link to="/signup" style={{color:'#000000'}}>SignUp</Link>
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


export default Login;