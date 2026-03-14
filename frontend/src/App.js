// App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode'; // Import jwt_decode to decode the token
import { UserProvider } from './context/UserContext'; // Import the UserProvider from UserContext
import AboutUs from './components/AboutUs';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ContactUs from './components/ContactUs';
import CreateHabit from './components/CreateHabit';
import SetGoals from './components/SetGoals';
import UpdateHabit from './components/UpdateHabit';
import DeleteHabit from './components/DeleteHabit';
import SelectInterests from './components/Selectinterests';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import TrackProgress from './components/TrackProgress';
import AccountSettings from './components/AccountSettings';
import HabitSuggestions from './components/HabitSuggestions';
import ForgetPassword from './components/ForgetPassword';
import Logout from './components/Logout'; // Add Logout from main branch

function App() {
  const [user, setUser] = useState({ userId: '', username: '' });

  /*useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        console.log('Decoded token:', decodedToken); // Retain logging for debugging

        setUser({
          userId: decodedToken.userId,
          username: decodedToken.username,
        });

        // Save user to localStorage
        localStorage.setItem(
          'user',
          JSON.stringify({
            userId: decodedToken.userId,
            username: decodedToken.username,
          })
        );
      } catch (error) {
        console.error('Error decoding token:', error);
        setUser({ userId: '', username: '' }); // Reset user on token decode failure
      }
    } else {
      setUser({ userId: '', username: '' }); // Reset user if token is not available
    }
  }*/
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        setUser({
          userId: decodedToken.userId,
          username: decodedToken.username,
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        setUser({ userId: '', username: '' }); // Reset user on token decode failure
      }
    } else {
      setUser({ userId: '', username: '' }); // Reset user if token is not available
    }
  }, []);

  return (
    <UserProvider value={{ user, setUser }}>
   
      <Routes>
        <Route path="/" element={<Home />} /> {/* Default route for the home page */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/createHabit" element={<CreateHabit userId={user.userId} />} />
        <Route path="/setGoals/:habitId/:userId" element={<SetGoals />} />
        <Route path="/updateHabit/:habitId" element={<UpdateHabit />} />
        <Route path="/deleteHabit" element={<DeleteHabit />} />
        <Route path="/selectinterests" element={<SelectInterests />} />
        {/* Pass userId and username as props to Dashboard */}
        <Route path="/dashboard" element={<Dashboard userId={user.userId} username={user.username} />} />
        <Route path="/HabitSuggestions" element={<HabitSuggestions />} />
        <Route path="/trackProgress" element={<TrackProgress />} />
        <Route path="/accountSettings" element={<AccountSettings />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
      <Footer />
    </UserProvider>
  );
}

export default App;