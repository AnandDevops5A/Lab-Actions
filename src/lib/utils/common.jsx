import { getCache, setCache } from "./client-cache";
import { errorMessage } from "./alert";
import {
  getUpcomingTournament,
  getUserTournamentDetails,
} from "../api/backend-api";
import { SunDim, SunMedium, Sunset } from "lucide-react";

/**
 * Calculate winning rewards and stats for tournaments
 * Optimized with early returns and efficient data structures
 */
export function calculateWinAndReward(tournamentList) {
  if (!tournamentList || !Array.isArray(tournamentList)) {
    return new Map();
  }

  const REWARD_MAP = { 1: 500, 2: 200, 3: 100 };
  const userStats = new Map();

  for (const tournament of tournamentList) {
    const rankList = tournament.rankList || {};
    for (const [userId, rank] of Object.entries(rankList)) {
      const reward = REWARD_MAP[rank] || 0;

      if (!userStats.has(userId)) {
        userStats.set(userId, { reward: 0, wins: 0 });
      }

      const stats = userStats.get(userId);
      stats.reward += reward;
      if (rank === 1) {
        stats.wins += 1;
      }
    }
  }

  return userStats;
}

/**
 * Transform tournament data with date/time formatting
 * Uses lazy date parsing for performance
 */
export const transformTournaments = (tournaments) => {
  if (!tournaments || !Array.isArray(tournaments)) {
    return [];
  }

  return tournaments.map((tournament) => {
    if (!tournament.dateTime) {
      return {
        ...tournament,
        date: "TBA",
        time: "TBA",
      };
    }

    const dtStr = tournament.dateTime.toString();
    if (dtStr.length < 12) {
      return { ...tournament, date: "N/A", time: "N/A" };
    }

    const [year, month, day, hour, minute] = [
      dtStr.substring(0, 4),
      dtStr.substring(4, 6),
      dtStr.substring(6, 8),
      dtStr.substring(8, 10),
      dtStr.substring(10, 12),
    ];

    return {
      ...tournament,
      date: `${day}-${month}-${year}`,
      time: `${hour}:${minute}`,
    };
  });
};

/**
 * Set upcoming tournaments in cache with fallback
 * Better error handling and cache management
 */
export const setUpcomingTournamentCache = async () => {
  try {
    const cached = await getCache("upcomingTournament");

    if (cached?.status && cached?.data?.length > 0) {
      return cached.data;
    }

    const response = await getUpcomingTournament();

    if (!response.ok) {
      errorMessage("Server Down. Please try again later.");
      return [];
    }

    if (response.data?.length === 0) {
      return [];
    }

    await setCache("upcomingTournament", response.data);
    return response.data;
  } catch (error) {
    console.error("Cache tournament error:", error);
    errorMessage("Something went wrong while caching tournaments");
    return [];
  }
};

/**
 * Format current timestamp as YYYYMMDDHHMM string
 * Memoized helper for consistent time formatting
 */
export const getCurrentTime = (() => {
  const pad = (n) => (n < 10 ? "0" + n : n);
  return () => {
    const now = new Date();
    return (
      `${now.getFullYear()}` +
      `${pad(now.getMonth() + 1)}` +
      `${pad(now.getDate())}` +
      `${pad(now.getHours())}` +
      `${pad(now.getMinutes())}`
    );
  };
})();

/**
 * Format datetime number to readable date and time strings
 * @param {number} dateTime - DateTime in YYYYMMDDHHMM format
 * @returns {object} { date: 'DD/MM/YYYY', time: 'HH:MM' }
 */
export const formatDateTimeAsText = (dateTime) => {
  if (!dateTime) {
    return { date: "TBA", time: "TBA" };
  }

  const dateStr = dateTime.toString();
  if (dateStr.length < 12) {
    return { date: "N/A", time: "N/A" };
  }

  const [year, month, day, hour, minute] = [
    dateStr.slice(0, 4),
    dateStr.slice(4, 6),
    dateStr.slice(6, 8),
    dateStr.slice(8, 10),
    dateStr.slice(10, 12),
  ];

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
  let listOfInvest = cacheRes?.status ? cacheRes.data : [];

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
    if (cacheRes?.status && cacheRes?.data) {
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
    if (cacheRes && cacheRes.data) {
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
