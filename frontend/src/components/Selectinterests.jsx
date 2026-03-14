import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls
import jwt_decode from "jwt-decode"; // Import jwt-decode for decoding the token
import "./SelectInterests.css";

const SelectInterests = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [userId, setUserId] = useState(null);

  const interests = [
    "Reading", "Exercise", "Cooking", "Traveling", "Music", "Technology", "Art & Design",
    "Gaming", "Mental Well-being", "Photography", "Sports", "Fashion", "Writing",
    "Languages", "Social Media", "Movies & TV Shows", "Volunteering", "Pets & Animals",
    "Science", "Cooking & Baking", "Yoga & Meditation", "Gardening", "Outdoor Adventures",
    "Business & Entrepreneurship"
  ];

  // Fetch user ID from the token when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUserId(decoded.userId); // Assuming the token contains userId
      } catch (error) {
        console.error("Error decoding token:", error);
        alert("Invalid token. Please log in again.");
        redirectToLogin();
      }
    } else {
      alert("Please log in to continue.");
      redirectToLogin();
    }
  }, []);

  // Utility function for redirecting to login
  const redirectToLogin = () => {
    window.location.href = "/login";
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = async () => {
    if (!userId) {
      alert("User ID not found. Please log in again.");
      redirectToLogin();
      return;
    }

    if (selectedInterests.length === 0) {
      alert("Please select at least one interest.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/interests/save`, {
        userId,
        selectedInterests,
      });

      if (response.status === 201) {
        alert("Interests saved successfully!");
        // Redirect to the user dashboard
        window.location.href = "/dashboard";
      } else {
        alert("Failed to save interests. Please try again.");
      }
    } catch (error) {
      console.error("Error saving interests:", error);
      const apiMessage = error?.response?.data?.message;
      alert(apiMessage || "An error occurred while saving your interests.");
    }
  };

  return (
    <div className="app">
      <main className="interestsPage">
        <h2>
          Select your <span className="highlight">Interests</span> 🎯
        </h2>
        <div className="interestsGrid">
          {interests.map((interest) => (
            <button
              key={interest}
              className={`interestBtn ${selectedInterests.includes(interest) ? "selectedBtn" : ""}`}
              onClick={() => toggleInterest(interest)}
            >
              {interest}
            </button>
          ))}
        </div>
        <button className="saveBtn" onClick={handleSave}>
          Save
        </button>
      </main>
    </div>
  );
};

export default SelectInterests;
