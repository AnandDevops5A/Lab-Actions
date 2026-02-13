import { getCache, setCache, UpdateCache } from "./action-redis";
import { errorMessage} from "./alert";
import {getUpcomingTournament, getUserTournamentDetails } from "../api/backend-api";
import { SunDim, SunMedium, Sunset } from "lucide-react";

export function calulateWinAndReward(tournamentList) {
  const rewardMap = { 1: 500, 2: 200, 3: 100 };
  //calculate rewards
  let userStats = new Map();
  // console.log(tournamentList);

  for (const tournament of tournamentList || []) {
    const rankList = tournament.rankList || {};
    for (const [userId, rank] of Object.entries(rankList)) {
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

  if (data && data.status && data.length > 0) {
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

export const getCurrentTime = () => {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  // console.log(year, month, day, hours, minutes);
  return `${year}${month < 10 ? "0" + month : month}${day<10?"0"+day:day}${hours<10?"0"+hours:hours}${minutes<10?"0"+minutes:minutes}`;
};

export const formatDateTimeAsText = (dateTime) => {
  const dateStr = dateTime.toString();
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  const hour = dateStr.slice(8, 10);
  const minute = dateStr.slice(10, 12);

  return {
    date: `${day}/${month}/${year}`,
    time: `${hour}:${minute}`,
  };
};

//with svg of sun
export const FormatDate = ({ dateNum }) => {
  if (!dateNum) return <span className="text-gray-400">TBA</span>;

  const str = dateNum.toString();
  if (str.length < 12) return <span>{str}</span>;

  // Extract parts
  const year = str.substring(0, 4);
  const month = str.substring(4, 6);
  const day = str.substring(6, 8);
  const hour = parseInt(str.substring(8, 10), 10);
  const minute = str.substring(10, 12);

  // Determine Icon
  const getIcon = () => {
    if (hour >= 6 && hour < 12)
      return <SunDim className="inline w-4 h-4 mb-1 text-orange-400" />;
    if (hour >= 12 && hour < 18)
      return <SunMedium className="inline w-4 h-4 mb-1 text-yellow-500" />;
    return <Sunset className="inline w-4 h-4 mb-1 text-orange-500" />;
  };

  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap">
      <span className="font-medium">{`${day}/${month}/${year}`}</span>
      {getIcon()}
      <span className="opacity-80">{`${hour}:${minute}`}</span>
    </span>
  );
};

export const dateInLongFormat = (date, time) => {
  // Split date into parts
  const [year, month, day] = date.split("-");

  // Remove colon from time
  const timeFormatted = time.replace(":", "");

  // Concatenate into desired format
  return `${year}${month}${day}${timeFormatted}`;
};

export async function generateRandomNumberForQR(
  tournamentId,
  userId,
  min = 1,
  max = 50,
) {
  const cacheKey = `invest4tournaments:${tournamentId}`;

  // 1. Fetch the existing tournament list from cache
  const cacheRes = await getCache(cacheKey);
  let listOfInvest = cacheRes.status ? cacheRes.data : [];

  // 2. CHECK FOR EXISTING USER (Requirement: return invest if available)
  const existingUser = listOfInvest.find((u) => u.userId === userId);

  if (existingUser) {
    // If they already have a number, just give it back
    if (existingUser.invest !== 0) return existingUser.invest;
    // If they were added but somehow have 0, we continue to assignment
  }

  // 3. COLLECT ALL USED NUMBERS (Requirement: no duplicate invest amount)
  const takenNumbers = new Set(listOfInvest.map((item) => item.invest));

  // 4. CHECK AVAILABILITY
  const totalPossible = max - min + 1;
  if (takenNumbers.size >= totalPossible) {
    console.error("Tournament is full. No unique numbers left.");
    return null;
  }

  // 5. GENERATE UNIQUE NUMBER
  let num;
  do {
    num = Math.floor(Math.random() * totalPossible) + min;
  } while (takenNumbers.has(num));

  // 6. UPDATE THE LIST (Requirement: no duplicate user records)
  if (existingUser) {
    existingUser.invest = num;
  } else {
    listOfInvest.push({
      userId: userId,
      invest: num,
      isComplete: false,
    });
  }

  // 7. SAVE ENTIRE UPDATED LIST BACK TO CACHE
  // Use 36000 (10 hours) as you requested
  await setCache(cacheKey, listOfInvest, 36000);

  return num;
}

export async function fetchUserTournaments(userId) {
  if (!userId) return null;
  try {
    const cacheKey = `userTournamentDetails:${userId}`;
    const cacheRes = await getCache(cacheKey);
    if (cacheRes.status && cacheRes.data) {
      return cacheRes.data;
    }
    const response = await getUserTournamentDetails(userId);
    if (response.ok) {
      await setCache(cacheKey, response.data, 3600);
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user tournaments:", error);
    return null;
  }
}

export const fetchUpcomingTournament = async () => {
  try {
    const cacheRes = await getCache("upcomingTournament");  
    if (cacheRes.status && cacheRes.data) {
      return cacheRes.data;
    }
    const response = await getUpcomingTournament();
    if (response.ok) {
      await setCache("upcomingTournament", response.data, 3600);
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching upcoming tournaments:", error);
    return null;
  }
};


