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
        window.location.href = '/'; // Redirect to home page after logout
        user && await deleteCache("currentUser");
        setUser(null);
        successMessage("Logged out successfully");
    };

    const getUserFromContext = async () => {
        if (user === null) {
            const udata = await getCache("currentUser");
            if (udata.status) {
                setUser(udata.data);
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


