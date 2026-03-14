import React, { useState } from 'react';
import './Habit.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const SetGoals = () => {
  const {userId, habitId} = useParams();
  const [formData, setFormData] = useState({
    goal: '',
    progressTrack: '',
    startDate: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) =>{
    const {name,value} = e.target;
    setFormData((prevData) =>({
      ...prevData,
      [name] : value,
    }))
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/habits/setGoal/${habitId}/${userId}` ,{
        goal: formData.goal,
        progressTrack: formData.progressTrack
      });
      alert("Goal set successfully!");
      navigate("/dashboard")
      setFormData({ goal: '', progressTrack: '', startDate: '' }); // Reset form
    } catch (error) {
      console.error('Error setting goal:', error);
    }
  }
  return (
    <div className="create-habit-container">
      <div className="create-habit-content">
        <h2>Set Goals <span className="icon"></span></h2>
        <hr style={{width:"330px", marginLeft:"180px", marginBottom:"40px"}}/>
        <div className="quote">"The Journey of a thousand miles begins with one step." – Leo Tzu</div>

        <form className="form-container" onSubmit={handleSubmit}>
          {/* <div className="form-row">
            <label>Habit Name:</label>
            <input type="text" placeholder="Enter Habit name" style={{width:"300px"}}/>

          </div> */}

          <div className="form-row">
            <label>Goal:</label>
            <input type="text" name="goal" placeholder="Enter Goal" value={formData.goal} onChange={handleInputChange} style={{width:"300px"}}/>
          </div>

          <div className="form-row">
            <label>No. Of Days To Track:</label>
            <input
              type="text"
              name="progressTrack"
              placeholder="Enter days to track"
              value={formData.progressTrack}
              onChange={handleInputChange}
              style={{ width: '300px' }}
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-button">Save</button>
            <button type="button" className="cancel-button" onClick={() => setFormData({ goal: '', progressTrack: '', startDate: '' })}>
              Cancel
            </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default SetGoals;