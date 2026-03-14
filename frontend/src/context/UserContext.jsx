// UserContext.js
import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Check localStorage for existing user data
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null; // Parse the saved user or set it to null
    });

    const saveUser = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData)); // Save user to localStorage
        setUser(userData); // Update state
    };

    return (
        <UserContext.Provider value={{ user, setUser: saveUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);