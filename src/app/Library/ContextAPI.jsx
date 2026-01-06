'use client'
import React, { createContext, useState } from "react";
import { successMessage } from "./Alert";
import { deleteCache, getCache } from "./ActionRedis";

// Create Context
export const UserContext = createContext();

// Create Provider
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // store user data here
    // logout function
    const logout = async () => {
        user && await deleteCache("currentUser");
        setUser(null);
        successMessage("Logged out successfully");
        window.location.href = '/'; // Redirect to home page after logout
    };

    const getUserFromContext = async () => {
        if (user === null) {
            const data = await getCache("currentUser");
            if (data.status !== false) {
                setUser(data);
                return ;
            }
        }
        return ;
    }


    return (
        <UserContext.Provider value={{ user, setUser, logout, getUserFromContext }}>
            {children}
        </UserContext.Provider>
    );
};


