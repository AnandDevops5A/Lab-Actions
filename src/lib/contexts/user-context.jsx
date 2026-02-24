'use client'
import React, { createContext, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { confirmMessage, simpleMessage, successMessage } from "../utils/alert";
import LZString from "lz-string";
// Create Context
export const UserContext = createContext();

/**
 * UserProvider - Manages global user state with optimized performance
 * Memoized callbacks prevent unnecessary child re-renders
 */
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();
  const MALIK=['917254831884', '7254831884'].includes(String(user?.contact));

    /**
     * Logout user and clear cache
     * Memoized to prevent unnecessary function re-creation
     */
      const logout = useCallback(async () => {
    try {
      if (user) {
      let response = await confirmMessage("Are you sure you want to logout?");
      if (response) {
        //remove user from local storage
        localStorage.removeItem("currentUser");
        setUser(null);
        successMessage("Logged out successfully!");
        router.push("/auth");
      } else {
        simpleMessage("Logout cancelled.");
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
            const compressed = localStorage.getItem("currentUser");
            const decompressed = LZString.decompressFromUTF16(compressed);
            const cachedData = decompressed;
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
        MALIK,
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
