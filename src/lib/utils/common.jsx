import { getCache, setCache, UpdateCache } from "./action-redis";
import { errorMessage } from "./alert";
import { getUpcomingTournament} from "../api/backend-api";
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
      if (rank ==1) {
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

export  const FormatDate = ({ dateNum }) => {
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
    if (hour >= 6 && hour < 12) return <SunDim className="inline w-4 h-4 mb-1 text-orange-400" />;
    if (hour >= 12 && hour < 18) return <SunMedium className="inline w-4 h-4 mb-1 text-yellow-500" />;
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

export const dateInLongFormat=(date)=>{
   // Split date into parts
  const [year, month, day] = date.split("-");

  // Remove colon from time
  const timeFormatted = time.replace(":", "");

  // Concatenate into desired format
  return `${year}${month}${day}${timeFormatted}`;
}