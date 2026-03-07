'use client'
import React, { createContext, useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { confirmMessage, errorMessage, simpleMessage, successMessage } from "../utils/alert";
import LZString from "lz-string";
import { deleteSecureCookie, getSecureCookie } from "@/app/api/httpcookies/cookiesManagement";
import { clearRateLimit } from "@/lib/utils/rate-limiter";
import { fetchUserTournaments } from "../utils/common";
// Create Context
export const UserContext = createContext({});

/**
 * UserProvider - Manages global user state with optimized performance
 * Memoized callbacks prevent unnecessary child re-renders
 */
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userJoinedTournaments, setUserJoinedTournaments] = useState([]);
    const router = useRouter();
  const MALIK=['917254831884', '7254831884'].includes(String(user?.contact));

  const refreshUserTournaments = useCallback(async (force = false, providedUser = null) => {
    const targetUser = providedUser || user;
    // only run when we have a valid user id
    if (!targetUser?.id) return;
    try {
      const data = await fetchUserTournaments(targetUser.id, force);
      if (data) {
        console.debug("User tournaments refreshed");
        setUserJoinedTournaments(data);
      }
    } catch (error) {
      errorMessage("Failed to fetch user tournaments. Please try again later.");
      console.error("Error fetching user tournaments:", error);
    }
  }, [user?.id]);

  // whenever the user object becomes available or changes we auto‑fetch their tournaments
  useEffect(() => {
    if (user?.id) {
      refreshUserTournaments();
    } else {
      // clear when user logs out
      setUserJoinedTournaments([]);
    }
  }, [user?.id, refreshUserTournaments]);


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
       
       // Clear API cache and rate limits on logout
       if (typeof window !== 'undefined') {
         try {
           localStorage.removeItem("api_cache");
           clearRateLimit(); // Clear all rate limits
         } catch (error) {
           console.debug("Could not clear API cache/rate limits");
         }
       }
       
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
        userJoinedTournaments,
        refreshUserTournaments,
        MALIK,
        setUser,
        logout,
        getUserFromContext,
    }), [user, userJoinedTournaments, refreshUserTournaments, MALIK, logout, getUserFromContext]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};
