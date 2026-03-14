import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "./HabitSuggestions.css"
import { Link } from "react-router-dom";

const HabitSuggestions = () => {
  const [userId, setUserId] = useState("");
  const [habits, setHabits] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    // Fetch and decode token to get userId
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUserId(decoded.userId); // Set the userId from the decoded token
      } catch (err) {
        console.error("Error decoding token:", err);
        setError("Failed to authenticate. Please log in again.");
        return;
      }
    } else {
      setError("No authentication token found. Please log in.");
      return;
    }

    if (userId) {
      const fetchHabits = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/suggesthabit/${userId}`
          );
          
          setHabits(response.data.categoryHabits);
          console.log("Response data:", response.data.categoryHabits);
          setError(null); // Clear previous errors
        } catch (err) {
          setError("Failed to load habit suggestions. Please try again later.");
        }
      };
  
      fetchHabits();
    }
  }, [userId]);

  const handleAddHabit = async (habit) => {
    try {
      const { habitName, habitDescription, frequency, categoryId } = habit;

      const response = await axios.post(
        "http://localhost:5000/api/habits/createhabit",
        {
          userId,
          habitName,
          description: habitDescription,
          frequency: frequency || "daily", // Default frequency if not provided
          categoryId: categoryId || 1, // Default category ID if not provided
        }
      );

      setSuccessMessage(
        `Habit "${response.data.habitName}" added successfully!`
      );
      setTimeout(() => setSuccessMessage(null), 3000); // Clear message after 3 seconds
    } catch (err) {
      console.error("Failed to add habit:", err);
      setError("Failed to add habit. Please try again.");
    }
  };
  return (
    
    <div
    
      style={{
        backgroundColor: "#121212",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        
      }}
    >

    <header className="navbar">
      <div className="logo">HABITFLOW</div>
      <nav className="nav-links">
        <Link to="/Home">Home</Link>
        
        <Link to="/habitsuggestions">Suggest Habit</Link>
        <Link to="/dashboard">DashBoard</Link>
        <Link to="/Logout">Logout</Link>

      </nav>
    </header>
      <h1 style={{ textAlign: "center", marginBottom: "30px" ,color:"white",marginTop:"40px"}}>
        Habit Suggestions
        <div style={{ width: "60%", height: "2px",backgroundColor: "#A965FF", margin: "25px auto 0 auto",
    }}
  ></div>
      </h1>

    <h3 style={{textAlign:"center",paddingBottom:"30px",color:"#615D66"}}>Based on your interests, we suggest these habits to help you reach your goals!</h3>


      {error && (
        <p
          style={{
            color: "#fff",
            backgroundColor: "#A965FF",
            textAlign: "center",
            padding: "10px",
            borderRadius: "5px",
            width: "50%",
            margin: "10px auto",
          }}
        >
          {error}
        </p>
      )}
      {successMessage && (
        <p
          style={{
            color: "#fff",
            backgroundColor: "#A965FF",
            textAlign: "center",
            padding: "10px",
            borderRadius: "5px",
            width: "50%",
            margin: "20px auto",
          }}
        >
          {successMessage}
        </p>
      )}
  
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        {Object.entries(habits).map(([category, habitList]) =>
          ["Health & Fitness", "Hobbies", "Productivity"].includes(category) ? (
            <div
              key={category}
              style={{
                backgroundColor: "#1e1e1e",
                borderRadius: "12px",
                padding: "20px",
                width: "300px",
                textAlign: "center",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  color: "#A965FF",
                  borderBottom: "1px solid #333",
                  paddingBottom: "10px",
                  marginBottom: "20px",
                }}
              >
                {category}
              </h2>
              {habitList.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {habitList.map((habit) => (
                    <div
                      key={habit.habitName}
                      style={{
                        backgroundColor: "#292929",
                        padding: "10px 15px",
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "#fff",
                      }}
                    >
                      <span>
                       {habit.habitName}
                      </span>
                      <button
                        style={{
                          backgroundColor: "#A965FF",
                          width:"20%",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "5px 10px",
                          cursor: "pointer",
                          fontSize: "14px",
                          transition: "background-color 0.3s ease",
                        }}
                        onClick={() => handleAddHabit(habit)}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No habits available in this category.</p>
              )}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
  



};

export default HabitSuggestions;
