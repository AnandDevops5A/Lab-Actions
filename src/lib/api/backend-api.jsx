import useSWR from "swr";
const BASE_URL = "http://localhost:8082";

// Generic fetcher function
const fetcher = async (url, method = "GET", data = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(data && { body: JSON.stringify(data) }),
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return response.json();
};

// Custom SWR hook
export const useSWRBackendAPI = (
  endpoint,
  method = "GET",
  data = null,
  refreshInterval = 0,
) => {
  const url = `${BASE_URL}/${endpoint}`;

  const {
    data: result,
    error,
    isLoading,
    mutate,
  } = useSWR(
    [url, method, data], // key (unique per request)
    () => fetcher(url, method, data), // fetcher function
    {
      refreshInterval, // ⏱ auto revalidate every X ms (e.g., 60000 = 60s)
      revalidateOnFocus: true, // refetch when window regains focus
      revalidateOnReconnect: false, // refetch when network reconnects
    },
  );

  return { result, error, isLoading, mutate };
};

// ✅ BackendAPI with revalidate support
export async function FetchBackendAPI(
  endpoint,
  { method = "POST", data = null, revalidate = 0 } = {},
) {
  if (!endpoint) throw new Error("Endpoint is required");

  const url = `${BASE_URL}/${endpoint}`;
  // console.log(url,method)
  // console.log(data)

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(data && { body: JSON.stringify(data) }),
    next: { revalidate }, // ISR-style caching for Next.js App Router
  };
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorDetails = await response.text().catch(() => "");
      let serverMessage = "";
      try {
        const json = JSON.parse(errorDetails);
        serverMessage = json.error || json.message || "";
      } catch (e) {
        serverMessage = errorDetails;
      }
      throw new Error(
        serverMessage ||
          `Request failed: ${response.status} ${response.statusText}`,
      );
    }
    const text = await response.text();
    let respon;
    try {
      respon = text ? JSON.parse(text) : {};
    } catch (e) {
      respon = text;
    }
    return { data: respon, status: response.status, ok: true };
  } catch (error) {
    console.error(`[BackendAPI] ${method} ${url} →`, error);
    return { error: error.message, status: error.status, ok: false };
  }
}

// Leaderboard API functions
export const getUpcomingTournamentsLeaderboard = async (tournamentIds) => {
  //check in cache first
  const response = await FetchBackendAPI("leaderboard/getJoiners", {
    method: "POST",
    data: tournamentIds,
  });
  return response.data;
};

export const approveUserFromTournament = async (tournamentId, userId) => {
  return await FetchBackendAPI(
    `leaderboard/approve/${tournamentId}/user/${userId}`,
  );
};

export const getLeaderboard = async (tournamentId) => {
  return await FetchBackendAPI(`leaderboard/${tournamentId}`, {
    method: "POST",
  });
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

export const getUpcomingTournament = async () => {
  return await FetchBackendAPI("tournament/upcoming", {
    method: "GET",
  });
};

export const deleteTournamentById = async (tournamentId) => {
  return await FetchBackendAPI(`tournament/delete/${tournamentId}`, {
    method: "DELETE",
  });
};

export const getJoinersByTournamentId = async (tournamentId) => {
  return await FetchBackendAPI(`leaderboard/getJoiners/${tournamentId}`, {
    method: "POST",
  });
};

export const getJoinersByTournamentIdList = async (tournamentIds) => {
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
