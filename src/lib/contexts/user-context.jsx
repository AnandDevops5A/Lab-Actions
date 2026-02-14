'use client'
import React, { createContext, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { successMessage } from "../utils/alert";
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
        Swal.fire({
          title: "Are you sure?",
          text: "You want to go out!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, I do!",
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem("currentUser");
            setUser(null);
            successMessage("Logged out successfully");
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
          }
          return;
        });
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
