import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user data from localStorage and navigate to login
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  return null; // No UI for the logout component
}

export default Logout;