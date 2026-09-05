"use client";

import React, { useState, useCallback, useEffect, useRef, use } from "react";
import axios from "axios";
import { UserContext } from "@/lib/contexts/user-context";
import { APICacheContext } from "@/lib/contexts/api-cache-context";
import { checkRateLimit } from "@/lib/utils/rate-limiter";
import { getSecureCookie } from "@/app/api/httpcookies/cookiesManagement";
import LZString from "lz-string";

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:8082/api"
).replace(/\/+$/, "");

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

// Sensitive endpoints that MUST NOT be cached
const NO_CACHE_ENDPOINTS = new Set([
  "users/verify",
  "users/register",
  "users/resetPassword",
  "users/confirm-reset",
  "users/updatePassword",
]);

/**
 * Utility: Extract clean endpoint path from input string or path
 */
const normalizeEndpoint = (endpoint) => {
  if (!endpoint) return "";
  return endpoint.replace(/^\/+/, "").split("?")[0];
};

/**
 * Utility: Fetch Auth Token fallback from Cookies safely
 */
const getAuthTokenFromCookie = async () => {
  if (typeof window === "undefined") return null;
  try {
    const cookieRes = await getSecureCookie("currentUser");
    if (cookieRes?.success && cookieRes.data) {
      const decompressed = LZString.decompressFromUTF16(cookieRes.data);
      if (!decompressed) return null;
      const user = JSON.parse(decompressed);
      return user?.token || user?.accessToken || null;
    }
  } catch (error) {
    console.debug("Cookie token extraction bypassed:", error);
  }
  return null;
};

/**
 * Pure JavaScript Fetcher (Free from React Hooks)
 */
const executeRequest = async (
  endpoint,
  {
    method = "GET",
    data = null,
    timeout = 10000,
    skipCache = false,
    token = null,
    cacheContext = null,
  } = {}
) => {
  const cleanEndpoint = normalizeEndpoint(endpoint);
  const fullUrl = `${BASE_URL}/${cleanEndpoint}`;

  // 1. Resolve Auth Token if missing
  let authToken = token;
  if (!authToken && !NO_CACHE_ENDPOINTS.has(cleanEndpoint)) {
    authToken = await getAuthTokenFromCookie();
  }

  // 2. Check Rate Limits
  if (!skipCache && method !== "GET") {
    const rateCheck = checkRateLimit(cleanEndpoint);
    if (!rateCheck.allowed) {
      const cacheKey = method === "GET" ? `${fullUrl}|${method}` : null;
      if (cacheKey && cacheContext) {
        const cached = cacheContext.getCache(cacheKey);
        if (cached) return cached;
      }

      throw {
        status: 429,
        message: `Rate limit exceeded. Retry after ${Math.ceil(
          rateCheck.retryAfter / 1000
        )}s`,
        noRetry: true,
      };
    }
  }

  // 3. Cache Checking for GET Requests
  const cacheKey =
    method === "GET" && !skipCache && !NO_CACHE_ENDPOINTS.has(cleanEndpoint)
      ? `${fullUrl}|${method}`
      : null;

  if (cacheKey && cacheContext) {
    const cachedData = cacheContext.getCache(cacheKey);
    if (cachedData !== undefined && cachedData !== null) {
      return cachedData;
    }
  }

  // 4. Execution with Retry Mechanism
  let lastError;
  const isRetryable = method === "GET"; // Restrict auto-retries to idempotent GET requests
  const maxAttempts = isRetryable ? MAX_RETRIES : 1;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await axios({
        url: fullUrl,
        method,
        data,
        timeout,
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),  //cuurent running code
        },
        // withCredentials: true,  //pending more secure...!!!
      });

      // Save to cache on success
      if (cacheKey && cacheContext) {
        cacheContext.setCache(cacheKey, response.data, 300000); // 5 mins TTL
      }

      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      lastError = { status: status || 500, message };

      // Prevent retry on 4xx Client Errors
      if (status && status >= 400 && status < 500) {
        lastError.noRetry = true;
        throw lastError;
      }

      if (attempt === maxAttempts - 1) break;

      const delay = RETRY_DELAY * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Custom React Hook for Component-Level API Handling
 */
export const useBackendAPI = (
  endpoint,
  method = "GET",
  data = null,
  options = {}
) => {
  const { skipCache = false, onError, revalidateInterval = 0 } = options;

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevalidating, setIsRevalidating] = useState(false);

  const isRevalidatingRef = useRef(false);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  // React 19 context extraction at HOOK top-level ONLY
  let cacheContext = null;
  let userContext = null;

  try {
    cacheContext = use(APICacheContext);
    userContext = use(UserContext);
  } catch (err) {
    // Context fallback when rendered outside providers
  }

  const token =
    userContext?.user?.token || userContext?.user?.accessToken || null;

  // Stable stringified payload to prevent unnecessary dependency updates
  const serializedData = JSON.stringify(data);

  const performFetch = useCallback(
    async ({ forceRefresh = false, isBackground = false } = {}) => {
      if (!endpoint) {
        setError({ status: 400, message: "Endpoint is required" });
        if (!isBackground) setIsLoading(false);
        return;
      }

      if (isBackground) {
        if (isRevalidatingRef.current) return;
        isRevalidatingRef.current = true;
        setIsRevalidating(true);
      } else {
        setIsLoading(true);
        setError(null);
      }

      try {
        const payloadData = serializedData ? JSON.parse(serializedData) : null;
        const responseData = await executeRequest(endpoint, {
          method,
          data: payloadData,
          skipCache: forceRefresh || skipCache,
          token,
          cacheContext,
        });

        setResult(responseData);
        setError(null);
      } catch (err) {
        const errorObj = {
          status: err?.status || 500,
          message: err?.message || "An unexpected error occurred",
        };

        if (!isBackground) {
          setError(errorObj);
          onErrorRef.current?.(errorObj);
        } else {
          console.error(`Background revalidation failed: ${endpoint}`, err);
        }
      } finally {
        if (isBackground) {
          isRevalidatingRef.current = false;
          setIsRevalidating(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [endpoint, method, serializedData, skipCache, token, cacheContext]
  );

  const mutate = useCallback(
    () => performFetch({ forceRefresh: true, isBackground: false }),
    [performFetch]
  );

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      performFetch({ forceRefresh: false, isBackground: false });
    }

    let intervalId = null;
    if (revalidateInterval > 0) {
      intervalId = setInterval(() => {
        performFetch({ forceRefresh: true, isBackground: true });
      }, revalidateInterval);
    }

    const handleBeforeUnload = () => {
      cacheContext?.clearCache?.();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [performFetch, revalidateInterval]);

  return {
    result,
    error,
    isLoading,
    isRevalidating,
    mutate,
    refresh: mutate,
    isEmpty: !result,
    isError: !!error,
  };
};

/**
 * Standalone imperative API Fetcher function
 */
export async function FetchBackendAPI(
  endpoint,
  { method = "POST", data = null, timeout = 15000, skipCache = false, token = null } = {}
) {
  if (!endpoint) {
    return { ok: false, error: "Endpoint is required", status: 400 };
  }

  try {
    const response = await executeRequest(endpoint, {
      method,
      data,
      timeout,
      skipCache,
      token,
    });

    return {
      ok: true,
      data: response,
      status: 200,
    };
  } catch (error) {
    return {
      ok: false,
      error: error?.message || "An unexpected error occurred",
      status: error?.status || 500,
    };
  }
}

/* ==========================================================================
   USER API FUNCTIONS
   ========================================================================== */

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

export const resetPassword = async (payload) => {
  return await FetchBackendAPI("users/updatePassword", {
    method: "POST",
    data: payload,
  });
};

export const confirmPasswordReset = async (payload) => {
  return await FetchBackendAPI("users/confirm-reset", {
    method: "PUT",
    data: payload,
  });
};

/* ==========================================================================
   TOURNAMENT API FUNCTIONS
   ========================================================================== */

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

export const updateTournament = async (updateData) => {
  return await FetchBackendAPI("tournament/update", {
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
  return await FetchBackendAPI("tournament/delete", {
    method: "DELETE",
    data: tournamentIds,
  });
};

export const getTournamentByIds = async (tournamentIds) => {
  return await FetchBackendAPI(`tournament/getTournamentsByIds/${tournamentIds}`, {
    method: "POST",
  });
};

export const deleteParticipantFromTournament = async (tournamentId, userIds) => {
  const userIdsParam = Array.isArray(userIds) ? userIds.join(",") : userIds;
  return await FetchBackendAPI("leaderboard/deleteJoiners", {
    method: "DELETE",
    data: { tournamentId, userIdsParam },
  });
};

export const getNextTournamentDetails = async () => {
  return await FetchBackendAPI("tournament/next", {
    method: "GET",
  });
};

/* ==========================================================================
   LEADERBOARD API FUNCTIONS
   ========================================================================== */

export const approveUserFromTournament = async (tournamentId, userId) => {
  return await FetchBackendAPI(
    `leaderboard/approve/${tournamentId}/user/${userId}`,
    { method: "PUT" }
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
    { method: "POST" }
  );
};

export const updateLeaderboardRank = async (tournamentId, userId, rank) => {
  return await FetchBackendAPI("leaderboard/updateRank", {
    method: "POST",
    data: { tournamentId, userId, rank },
  });
};

export const registerAllUsersForTournament = async (tournamentId, userIds) => {
  const userIdsParam = Array.isArray(userIds) ? userIds.join(",") : userIds;
  return await FetchBackendAPI(
    `leaderboard/registerAll/${tournamentId}/users/${userIdsParam}`,
    { method: "POST" }
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
  return await FetchBackendAPI("leaderboard/getJoiners", {
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
  updateData
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

export const getLastTournamentTopPlayers = async () => {
  return await FetchBackendAPI("leaderboard/lastTournamentTopPlayers", {
    method: "GET",
  });
};

/* ==========================================================================
   REVIEW API FUNCTIONS
   ========================================================================== */

export const getAllReviews = async () => {
  return await FetchBackendAPI("review/all", {
    method: "GET",
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