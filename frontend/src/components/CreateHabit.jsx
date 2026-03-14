import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirecting
import './Habit.css'; // Make sure to adjust the CSS file to style the select and option
import './NavBar.css'; 
import { Link } from "react-router-dom";


const CreateHabit = () => {
  const [userId, setUserId] = useState('');
  const [habitName, setHabitName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]); // State to store categories

  const navigate = useNavigate(); // useNavigate hook for navigation

  // Fetch categories when the component mounts
  useEffect(() => {
    // Fetch the JWT token from localStorage or sessionStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode the JWT token to get user data
        const decoded = jwt_decode(token);
        setUserId(decoded.userId); // Assuming userId is part of the payload
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
        const result = response.data;  

        console.log('Categories Data:', result); 
        setCategories(result); 
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const habitData = {
      userId,
      habitName,
      description,
      frequency,
      categoryId,
    };

    console.log("habitData==",habitData)

    try {
      console.log('Sending request with data:', habitData);

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/habits/createhabit`, habitData);

      const result = response.data;  // Use response.data instead of response.ok
      console.log('API Response:', response);

      if (response.status === 201) {  // Check if response is created (status 201)
        console.log('Habit created:', result);
        // Redirect to the dashboard after successfully creating the habit
        navigate('/dashboard');
      } else {
        console.log('Error:', result.message);
      }
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  const handleCancel = () => {
    // Redirect to the dashboard without creating a habit
    navigate('/dashboard');
  };

  return (
    <div className="create-habit-container">
      <header className="navbar">
        <div className="logo">HABITFLOW</div>
        <nav className="nav-links">
          <Link to="/Home">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/createHabit">Create Habit</Link>
          <Link to="/logout">Logout</Link>

        </nav>
      </header>
      <div className="create-habit-content">
        <h2>Create Habit</h2>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Category:</label>
            <select
              style={{color:"grey"}}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option>Select category</option>
              {/* Dynamically populate categories */}
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label>Habit Name:</label>
            <input
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              placeholder="Enter Habit name"
              style={{ width: '300px' }}
            />
          </div>

          <div className="form-row">
            <label>Frequency:</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              style={{ width: '370px', color:'grey'}}
            >
              <option>Select</option>
              <option>daily</option>
              <option>weekly</option>
              <option>monthly</option>
            </select>
          </div>

          <div className="form-row">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '450px' }}
            ></textarea>
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-button">
              Save
            </button>
            <button type="button" className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHabit;