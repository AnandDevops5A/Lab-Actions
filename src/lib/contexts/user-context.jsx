'use client'
import React, { createContext, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { confirmMessage, simpleMessage, successMessage } from "../utils/alert";
import LZString from "lz-string";
import { deleteSecureCookie, getSecureCookie } from "@/app/api/httpcookies/cookiesManagement";
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
       await deleteSecureCookie("currentUser");
       setUser(null);
       successMessage("Logged out successfully!");
    router.push(MALIK ? "/auth" : "/");
    } else {
      simpleMessage("Logout cancelled.");
    }
    } }catch (error) {
      console.error("Logout error:", error);
    }
  }, [user, router]);

    /**
     * Fetch user from cache or return early if already loaded
     * Memoized to prevent recreation on every render
     */
    const getUserFromContext = useCallback(async () => {
      if (user !== null) return user;
  
      try {
          const compressed = await getSecureCookie("currentUser");
          if (!compressed?.success || !compressed.data) return null;
  
          const decompressed = LZString.decompressFromUTF16(compressed.data);
          if (!decompressed) return null;
  
          const userData = JSON.parse(decompressed);
          
          // Ensure you update state correctly
          setUser(userData); 
          return userData;
      } catch (error) {
          console.error("Failed to parse user data:", error);
          return null;
      }
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
