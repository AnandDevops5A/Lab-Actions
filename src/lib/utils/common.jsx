import { getCache, setCache, UpdateCache } from "./action-redis";
import { errorMessage } from "./alert";
import { getUpcomingTournament, FetchBackendAPI } from "../api/backend-api";

export function calulateWinAndReward(tournamentList) {
  const rewardMap = { 1: 500, 2: 200, 3: 100 };
  //calculate rewards
  let userStats = new Map();

  for (const tournament of tournamentList || []) {
    const rankList = tournament.rankList || {};
    for (const userId in rankList) {
      if (Object.prototype.hasOwnProperty.call(rankList, userId)) {
        const rank = rankList[userId];
        let reward = rewardMap[rank] || 0;

        let stats = userStats.get(userId);
        if (!stats) {
          stats = { reward: 0, wins: 0 };
          userStats.set(userId, stats);
        }

        stats.reward += reward;
        if (rank == 1) {
          stats.wins += 1;
        }
      }
    }
  }
  return userStats;
}

export const transformTournaments = (tournaments) => {
  if (!tournaments || !Array.isArray(tournaments)) return [];
  return tournaments.map((t) => {
    const dtStr = t.dateTime ? t.dateTime.toString() : "";
    if (dtStr.length < 12) return { ...t, date: "N/A", time: "N/A" };
    // ensure it's a string // Extract parts
    const year = dtStr.substring(0, 4);
    const month = dtStr.substring(4, 6);
    const day = dtStr.substring(6, 8);
    const hour = dtStr.substring(8, 10);
    const minute = dtStr.substring(10, 12);
    // Format date and time
    const date = `${day}-${month}-${year}`;
    // e.g. "2025-12-20"
    const time = `${hour}:${minute}`;
    // e.g. "07:00"
    return { ...t, date, time };
  });
};

export const setUpcomingTournamentCache = async () => {
  const d = await getCache("upcomingTournament");
  const data = d.data;

  // console.log("get upcomming when new user", data);

  if (data&&data.status && data.length > 0) {
    // successMessage("Cache hit")
    // setUpcomingTournament(data);
    return;
  }
  const response = await getUpcomingTournament();
  // console.log("upcoming tournament fetch..");
  if (!response.ok) {
    errorMessage("Server Down. Please try again later.");
    return;
  } else if (response.data?.length === 0) {
    // setUpcomingTournament([]);
    return;
  }
  //
  const cachingStatus = await setCache("upcomingTournament", response?.data);
  if (!cachingStatus.status) {
    const againCaching = await UpdateCache(
      "upcomingTournament",
      response?.data,
    );
    if (!againCaching.status) {
      errorMessage("Something went wrong");
    }
  }
  // setUpcomingTournament(response?.data);
  // console.log(response?.data);
};



