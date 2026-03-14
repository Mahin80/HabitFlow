import React, { useState, useEffect } from 'react';
import './Habit.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateHabit = () => {
    const { habitId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        habitName: '',
        description: '',
        frequency: '',
        categoryId: ''
    
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch habit details
    useEffect(() => {
        const fetchHabitDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/habits/habitDetails/${habitId}`);
                const habit = response.data;
                setFormData({
                    habitName: habit.habitName || '',
                    description: habit.description || '',
                    frequency: habit.frequency || '',
                    categoryId: habit.categoryId || '',
                    
                });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching habit details:', err);
                setError('Failed to fetch habit details.');
                setLoading(false);
            }
        };

        fetchHabitDetails();
    }, [habitId]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/habits/updatehabit/${habitId}`, formData);
            console.log('Habit updated successfully:', response.data);
            alert('Habit updated successfully.');
            navigate('/dashboard');
        } catch (err) {
            console.error('Error updating habit:', err);
            setError('Failed to update habit.');
        }
    };

    // Handle cancel button
    const handleCancel = () => {
        navigate('/dashboard');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="create-habit-container">
            <div className="create-habit-content">
                <h2>
                    Update Habit <span className="icon"></span>
                </h2>
                <hr style={{ width: '330px', marginLeft: '180px', marginBottom: '40px' }} />
                <div className="quote">
                    "Success is the sum of small efforts, repeated day in and day out." – Robert Collier
                </div>

                <form className="form-container" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="habitName"
                            value={formData.habitName}
                            onChange={handleChange}
                            placeholder="Enter Habit name"
                            style={{ width: '300px' }}
                        />
                    </div>

                    <div className="form-row">
                        <label>Frequency:</label>
                        <select
                            name="frequency"
                            value={formData.frequency}
                            onChange={handleChange}
                            style={{ width: '370px', color: 'gray' }}
                        >
                            <option value="">Select</option>
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
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

export default UpdateHabit;