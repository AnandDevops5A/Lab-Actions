"use client";
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { UserContext } from "@/lib/contexts/user-context"
import { APICacheContext } from "@/lib/contexts/api-cache-context"
import { checkRateLimit, ENDPOINT_RATE_LIMITS, DEFAULT_RATE_LIMIT } from "@/lib/utils/rate-limiter"
import { use } from "react";
import { getSecureCookie } from "@/app/api/httpcookies/cookiesManagement";
import LZString from "lz-string";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL) || "http://localhost:8082";
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // ms

// Endpoints that should NOT be cached (sensitive data, authentication, etc.)
const NO_CACHE_ENDPOINTS = [
  "users/verify",      // Login - returns tokens
  "users/register",    // Registration - sensitive data
  "users/resetPassword", // Password reset
  "users/confirm-reset", // Confirm password reset
  "users/updatePassword", // Password updates
];

/**
 * Generic fetcher with retry logic, timeout, rate limiting, and context caching
 */
const createFetcher = (cacheContext, explicitToken = null) => {
  return async (url, method = "GET", data = null, timeout = 10000, skipCache = false) => {
    let lastError;

    // Extract endpoint name for cache and rate limiting FIRST
    const urlObj = new URL(url);
    const endpoint = urlObj.pathname.replace(`${urlObj.origin}/`, "");

    // Get token from context - but skip for authentication endpoints
    let token = null;
    if (!NO_CACHE_ENDPOINTS.includes(endpoint) && typeof window !== 'undefined') {
      try {
        // Fallback: Try to read from cookie if not provided explicitly
        const cookieRes = await getSecureCookie("currentUser");
        if (cookieRes?.success && cookieRes.data) {
          const decompressed = LZString.decompressFromUTF16(cookieRes.data);
          const user = JSON.parse(decompressed);
          token = user?.token || user?.accessToken;
        }
      } catch (error) {
        console.debug("Could not get token from cookie fallback");
      }
    }

    // Check rate limit using standalone rate limiter
    if (!skipCache) {
      const rateLimitCheck = checkRateLimit(endpoint);

      if (!rateLimitCheck.allowed) {
        console.warn(
          `Rate limit exceeded for ${endpoint}. Retry after ${rateLimitCheck.retryAfter}ms`
        );
        
        // Try to return cached data if available
        const cacheKey = method === "GET" ? [url, method].join("|") : null;
        if (cacheKey && cacheContext) {
          const cached = cacheContext.getCache(cacheKey);
          if (cached) {
            console.info(`Returning cached data for ${endpoint}`);
            return cached;
          }
        }

        throw {
          status: 429,
          message: `Rate limit exceeded. Retry after ${Math.ceil(rateLimitCheck.retryAfter / 1000)}s`,
          noRetry: true,
        };
      }
    }

    // Check cache for GET requests
    let cacheKey = null;
    if (method === "GET" && !skipCache && cacheContext && !NO_CACHE_ENDPOINTS.includes(endpoint)) {
      cacheKey = [url, method].join("|");
      const cached = cacheContext.getCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await axios({
          url,
          method,
          data,
          timeout,
          headers: { 
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          },
        });

        // Cache successful GET responses
        if (method === "GET" && cacheKey && cacheContext && !NO_CACHE_ENDPOINTS.includes(endpoint)) {
          cacheContext.setCache(cacheKey, response.data, 300000); // 5 minute TTL
        }

        return response.data;
      } catch (error) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        lastError = { status, message };

        // Don't retry on 4xx client errors (401, 403, 404, etc.)
        if (status && status >= 400 && status < 500) {
          lastError.noRetry = true;
          throw lastError;
        }

        if (attempt === MAX_RETRIES - 1) break;
        
        const delay = RETRY_DELAY * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  };
};

/**
 * Custom hook for API calls with context caching
 * Automatically clears cache on page refresh/reload
 */
export const useBackendAPI = (
  endpoint,
  method = "GET",
  data = null,
  options = {}
) => {
  const { skipCache = false, onError = null } = options;
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  let cacheContext = null;
  let userContext = null;
  let token = null;

  if (typeof window !== 'undefined') {
    try {
      cacheContext = use(APICacheContext);
      userContext = use(UserContext);
      // Only get token for non-auth endpoints
      if (!NO_CACHE_ENDPOINTS.includes(endpoint)) {
        token = userContext?.user?.token || userContext?.user?.accessToken;
      }
    } catch (err) {
      console.debug("Context not available in component");
    }
  }

  const refreshData = useCallback(async () => {
    if (!endpoint) {
      setError(new Error("Endpoint is required"));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fetcher = createFetcher(cacheContext, token);
      const url = `${BASE_URL}/${endpoint}`;
      const data_result = await fetcher(url, method, data, 10000, skipCache);
      setResult(data_result);
    } catch (err) {
      const errorObj = {
        status: err.status || 500,
        message: err.message || "Unknown error occurred",
      };
      setError(errorObj);
      onError?.(errorObj);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, method, data, cacheContext, token, skipCache, onError]);

  // Load data on mount and when endpoint/method changes
  useEffect(() => {
    refreshData();
    
    // Clear cache on page visibility change (tab focus)
    const handleVisibilityChange = () => {
      if (!document.hidden && !skipCache) {
        // Optionally refresh when tab becomes visible
        // Uncomment line below if you want auto-refresh on tab focus
        // refreshData();
      }
    };

    // Detect page reload/refresh - clear cache
    const handleBeforeUnload = () => {
      if (cacheContext) {
        cacheContext.clearCache();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [refreshData, skipCache, cacheContext]);

  return {
    result,
    error,
    isLoading,
    mutate: refreshData,
    isEmpty: !result,
    isError: !!error,
    refresh: refreshData, // Alias for mutate
  };
};

/**
 * Backend API call with advanced error handling, rate limiting, and context caching
 */
export async function FetchBackendAPI(
  endpoint,
  { method = "POST", data = null, timeout = 15000, skipCache = false, token = null } = {},
) {
  if (!endpoint) throw new Error("Endpoint is required");

  const url = `${BASE_URL}/${endpoint}`;

  let cacheContext = null;
  if (typeof window !== 'undefined') {
    try {
      cacheContext = use(APICacheContext);
    } catch (error) {
      console.debug("APICacheContext not available");
    }
  }

  try {
    const fetcher = createFetcher(cacheContext, token);
    const response = await fetcher(url, method, data, timeout, skipCache);
    return {
      ok: true,
      data: response,
      status: 200,
    };
  } catch (error) {
    const errorMessage = error?.message || "Unknown error occurred";
    return {
      ok: false,
      error: errorMessage,
      status: error?.status || 500,
    };
  }
}

//user API functions
export const getUsersByIds = async (userIds) => {
  return await FetchBackendAPI(`users/getUsersByIds/${userIds}`, {
    method: "GET",
  });
};

export const getAllUsers = async () => {
  return await FetchBackendAPI("users/all", {
    method: "GET",
  });
};

export const resetPassword=async(payload)=>{
  return await FetchBackendAPI("users/updatePassword",{
    method:"POST",
    data:payload
  });
};

export const confirmPasswordReset = async (payload) => {
  // This endpoint is an assumption for the new functionality
  return await FetchBackendAPI("users/confirm-reset", {
    method: "PUT",
    data: payload,
  });
};




//tournament ApI functions
export const getAllTournaments = async () => {
  return await FetchBackendAPI("tournament/all", {
    method: "GET",
  });
};

export const getUpcomingTournament = async () => {
  return await FetchBackendAPI("tournament/upcoming", {
    method: "GET",
  });
};

export const updateTournament=async(updateData)=>{
  return await FetchBackendAPI(`tournament/update`, {
    method: "PUT",
    data: updateData,
  });
};

export const deleteTournamentById = async (tournamentId) => {
  return await FetchBackendAPI(`tournament/delete/${tournamentId}`, {
    method: "DELETE",
  });
};

export const deleteTournamentsByIds = async (tournamentIds) => {
  return await FetchBackendAPI(`tournament/delete`, {
    method: "DELETE",
    data: tournamentIds,
  });
}


export const getTournamentByIds = async (tournamentIds) => {
  return await FetchBackendAPI(`tournament/getTournamentsByIds/${tournamentIds}`, {
    method: "POST",
  });
};



// delete participants from tournament
export const deleteParticipantFromTournament = async (tournamentId, userIds) => {
  const userIdsParam = userIds.join(",");
  return await FetchBackendAPI(`leaderboard/deleteJoiners`, {
    method: "DELETE",
    data: { tournamentId, userIdsParam },
  });
};








// Leaderboard API functions


export const approveUserFromTournament = async (tournamentId, userId) => {
  return await FetchBackendAPI(
    `leaderboard/approve/${tournamentId}/user/${userId}`,
  );
};


export const getTopNLeaderboard = async (tournamentId, n) => {
  return await FetchBackendAPI(`leaderboard/${tournamentId}/top/${n}`, {
    method: "GET",
  });
};


export const updateLeaderboardScore = async (tournamentId, userId, score) => {
  return await FetchBackendAPI(
    `leaderboard/updateScore/${tournamentId}/${userId}/${score}`,
    { method: "POST" },
  );
};

export const updateLeaderboardRank = async (tournamentId, userId, rank) => {
  return await FetchBackendAPI(`leaderboard/updateRank`, {
    method: "POST",
    data: { tournamentId, userId, rank },
  });
};

export const registerAllUsersForTournament = async (tournamentId, userIds) => {
  const userIdsParam = userIds.join(",");
  return await FetchBackendAPI(
    `leaderboard/registerAll/${tournamentId}/users/${userIdsParam}`,
    { method: "POST" },
  );
};


export const joinTournament = async (form) => {
  return await FetchBackendAPI("leaderboard/register", {
    method: "POST",
    data: form,
  });
};

export const getUserTournamentDetails = async (userId) => {
  return await FetchBackendAPI(`leaderboard/user/${userId}`, {         
    method: "GET",
  });
};



export const getJoinersByTournamentId = async (tournamentId) => {
  return await FetchBackendAPI(`leaderboard/getJoiners/${tournamentId}`, {
    method: "GET",
  });
};

export const getJoinersByTournamentIdList = async (tournamentIds) => {
  //it return all the leaderboard related to this tournament list
  return await FetchBackendAPI(`leaderboard/getJoiners`, {
    method: "POST",
    data: tournamentIds,
  });
};

export const approveParticipantForTournament = async (participantId) => {
  return await FetchBackendAPI(`leaderboard/approve/${participantId}`, {
    method: "PUT",
  });
};

export const updateParticipantTournamentStatus = async (
  participantId,
  updateData,
) => {
  return await FetchBackendAPI(`leaderboard/update/${participantId}`, {
    method: "PUT",
    data: updateData,
  });
};

export const getAllLeaderBoard = async () => {
  return await FetchBackendAPI("leaderboard/all", {
    method: "GET",
  });
};





//review Apis

export const getAllReviews = async () => {
  return await FetchBackendAPI("review/all", {
    method: "POST",
  });
};


export const addNewReview = async (review) => {
  return await FetchBackendAPI("review/add", {
    method: "POST",
    data: review,
  });
};

export const getReviewsByTournamentId = async (tournamentId) => {
  return await FetchBackendAPI(`review/tournament/${tournamentId}`, {
    method: "GET",
  });
};

export const getReviewsByUserId = async (userId) => {
  return await FetchBackendAPI(`review/user/${userId}`, {
    method: "GET",
  });
};

export const deleteReview = async (reviewId) => {
  return await FetchBackendAPI(`review/delete/${reviewId}`, {
    method: "DELETE",
  });
};


export const addAdminReply = async (row) => {
  return await FetchBackendAPI("review/admin-reply", {
          method: "PUT",
          data: { reviewId: row.id, adminReply: row.adminReply },
        });
      };