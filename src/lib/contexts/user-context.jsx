'use client'
import React, { createContext, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { confirmMessage, successMessage } from "../utils/alert";
// Create Context
export const UserContext = createContext();

/**
 * UserProvider - Manages global user state with optimized performance
 * Memoized callbacks prevent unnecessary child re-renders
 */
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    /**
     * Logout user and clear cache
     * Memoized to prevent unnecessary function re-creation
     */
      const logout = useCallback(async () => {
    try {
      if (user) {
      let response = await confirmMessage("Are you sure you want to logout?");
      if (response) {
        localStorage.removeItem("currentUser");
        setUser(null);
        successMessage("Logged out successfully!");
        router.push("/auth");
      } else {
        successMessage("Logout cancelled.");
      }
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [user, router]);

    /**
     * Fetch user from cache or return early if already loaded
     * Memoized to prevent recreation on every render
     */
    const getUserFromContext = useCallback(async () => {
        // Early return if user already exists
        if (user !== null) {
            return user;
        }

        try {
            // const cachedData = await getCache("currentUser");
            const cachedData = JSON.parse(localStorage.getItem("currentUser"));
            // console.log("cachedData:", cachedData);
            if (cachedData) {
                setUser(cachedData);
                return cachedData;
            }
        } catch (error) {
            console.error("Error fetching user from context:", error);
        }
        return null;
    }, [user]);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        user,
        setUser,
        logout,
        getUserFromContext,
    }), [user, logout, getUserFromContext]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};
