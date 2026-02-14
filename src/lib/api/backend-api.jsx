import useSWR from "swr";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

/**
 * Generic fetcher with retry logic and timeout
 */
const fetcher = async (url, method = "GET", data = null, timeout = 10000) => {
  let lastError;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const options = {
        method,
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        ...(data && { body: JSON.stringify(data) }),
      };

      const response = await fetch(url, options);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt))
        );
      }
    }
  }
  throw lastError || new Error("Max retries exceeded");
};

/**
 * Custom SWR hook with optimized caching and deduplication
 */
export const useSWRBackendAPI = (
  endpoint,
  method = "GET",
  data = null,
  refreshInterval = 0,
) => {
  if (!endpoint) {
    throw new Error("Endpoint is required");
  }

  const url = `${BASE_URL}/${endpoint}`;
  const cacheKey = data
    ? [url, method, JSON.stringify(data)]
    : [url, method];

  const { data: result, error, isLoading, mutate } = useSWR(
    cacheKey,
    () => fetcher(url, method, data),
    {
      refreshInterval,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
      focusThrottleInterval: 30000,
      errorRetryCount: 2,
      errorRetryInterval: 5000,
    },
  );

  return {
    result,
    error,
    isLoading,
    mutate,
    isEmpty: !result,
    isError: !!error,
  };
};

/**
 * Backend API call with advanced error handling and retries
 */
export async function FetchBackendAPI(
  endpoint,
  { method = "POST", data = null, revalidate = 0, timeout = 15000 } = {},
) {
  if (!endpoint) throw new Error("Endpoint is required");

  const url = `${BASE_URL}/${endpoint}`;

  try {
    const response = await fetcher(url, method, data, timeout);
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
  
  return await FetchBackendAPI("users/getUsersByIds/"+userIds, {
    method: "POST",
  });
};

export const getAllUsers = async () => {
  return await FetchBackendAPI("users/all", {
    method: "POST",
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
    method: "POST",
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


export const getTournamentByIds = async (tournamentIds) => {
  return await FetchBackendAPI(`tournament/getTournamentsByIds/${tournamentIds}`, {
    method: "POST",
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

export const getUserTournaments = async (userId) => {
  return await FetchBackendAPI(`leaderboard/user/${userId}`, {
    method: "POST",
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

export const getHisJoinedTouenament = async (userId) => {
  return await FetchBackendAPI(`leaderboard/user/${userId}`, {
    method: "POST",
  });
};
export const joinTournament = async (form) => {
  return await FetchBackendAPI("leaderboard/register", {
    method: "POST",
    data: form,
  });
};

export const getUserTournamentDetails = async (userId) => {
  return await FetchBackendAPI(`leaderboard/user/${userId}`, {
    method: "POST",
  });
};



export const getJoinersByTournamentId = async (tournamentId) => {
  // it 
  return await FetchBackendAPI(`leaderboard/getJoiners/${tournamentId}`, {
    method: "POST",
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





// Seed leaderboard with sample entries
export const seedLeaderboard = async (listofuserId,tournamentId, count = 20) => {
  return await FetchBackendAPI(`leaderboard/seed/${listofuserId}/${tournamentId}/${count}`, {
    method: "POST",
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
    method: "POST",
  });
};

export const getReviewsByUserId = async (userId) => {
  return await FetchBackendAPI(`review/user/${userId}`, {
    method: "POST",
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