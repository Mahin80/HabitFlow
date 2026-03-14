import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import './TrackProgress.css';
import './NavBar.css'; 
import { Link } from "react-router-dom";


const TrackProgress = () => {
  const [userId, setUserId] = useState('');
  const [habitsByFrequency, setHabitsByFrequency] = useState({
    daily: [],
    weekly: [],
    monthly: [],
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Fetch data when the page loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUserId(decoded.userId); // Decode and set userId from the token
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    const fetchHabits = async (frequency) => {
      setIsDataLoaded(false);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/habits/${frequency}?userId=${userId}`
        );
        
        setHabitsByFrequency((prevState) => ({
          ...prevState,
          [frequency]: response.data,
        }));

        console.log(`Fetched ${frequency} habits:`, response.data);
      } catch (error) {
        console.error(`Error fetching ${frequency} habits:`, error);
      }
      setIsDataLoaded(true);
    };

    if (userId) {
      fetchHabits('daily');
      fetchHabits('weekly');
      fetchHabits('monthly');
    }
  }, [userId]);

  // Calculate streak (consecutive days)
  const calculateStreak = (habitProgresses) => {
    let streak = 0;
    let maxStreak = 0;
    
    for (let i = habitProgresses.length - 1; i >= 0; i--) {
      if (habitProgresses[i].isCompleted) {
        streak++;
        maxStreak = Math.max(streak, maxStreak);
      } else {
        streak = 0;
      }
    }

    return maxStreak;
  };

  // Render progress bars for each habit (with x and y axes)
  const renderGraph = (habitProgresses, frequency) => {
    const axisLabels = frequency === 'daily' ? 'Days' : frequency === 'weekly' ? 'Weeks' : 'Months';

    return (
      <div className="graph-container">
        {/* Y-Axis Label */}
        <div className="y-axis-label">Completion Rate (%)</div>

        {/* X and Y axis */}
        <div className="axis-line x-axis"></div>
        <div className="axis-line y-axis"></div>
        
        {/* Graph bars */}
        {habitProgresses.map((progress, index) => {
          const progressHeight = (progress.isCompleted ? 100 : 0);
          return (
            <div
              key={index}
              className="progress-bar"
              style={{
                height: `${progressHeight}%`, // Set bar height based on completion
                backgroundColor: progress.isCompleted ? '#A965FF' : '#615D66',
                border: '1px solid white' // Adding white outline to bars
              }}
            >
              {/* X-Axis numbering */}
              <div className="x-axis-number">{index + 1}</div>
            </div>
          );
        })}

        {/* X-Axis Label */}
        <div className="x-axis-label">{axisLabels}</div>
      </div>
    );
  };

  return (
    <div className="track-progress-page">
      <header className="navbar">
        <div className="logo">HABITFLOW</div>
        <nav className="nav-links">
          <Link to="/Home">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/trackProgress">Track Progress</Link>
          <Link to="/logout">Logout</Link>

        </nav>
      </header>
      <main className="main-body">
        {/* Daily Section */}
        <section className="section daily">
          <h2>Daily Habits</h2>
          {isDataLoaded && habitsByFrequency.daily.map((habit) => {
            return (
              <div key={habit.habitId} className="habit-container">
                <div className="habit-name" style={{ borderColor: '#fff', backgroundColor: '#1A1A1D', textAlign: 'left' }}>
                  <h3>{habit.habitName}</h3>
                </div>
                {/* Render separate graph for each habit */}
                {renderGraph(habit.HabitProgresses, 'daily')}
                <p>Streak Counter: {calculateStreak(habit.HabitProgresses)} days</p>
              </div>
            );
          })}
        </section>

        {/* Weekly Section */}
        <section className="section weekly">
          <h2>Weekly Habits</h2>
          {isDataLoaded && habitsByFrequency.weekly.map((habit) => {
            return (
              <div key={habit.habitId} className="habit-container">
                <div className="habit-name" style={{ borderColor: '#fff', backgroundColor: '#2E2E33', textAlign: 'left' }}>
                  <h3>{habit.habitName}</h3>
                </div>
                {/* Render separate graph for each habit */}
                {renderGraph(habit.HabitProgresses, 'weekly')}
                <p>Streak Counter: {calculateStreak(habit.HabitProgresses)} days</p>
              </div>
            );
          })}
        </section>

        {/* Monthly Section */}
        <section className="section monthly">
          <h2>Monthly Habits</h2>
          {isDataLoaded && habitsByFrequency.monthly.map((habit) => {
            return (
              <div key={habit.habitId} className="habit-container">
                <div className="habit-name" style={{ borderColor: '#fff', backgroundColor: '#404044', textAlign: 'left' }}>
                  <h3>{habit.habitName}</h3>
                </div>
                {/* Render separate graph for each habit */}
                {renderGraph(habit.HabitProgresses, 'monthly')}
                <p>Streak Counter: {calculateStreak(habit.HabitProgresses)} days</p>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default TrackProgress;
