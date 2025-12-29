"use client";
import React, { useState } from "react";
import AddTournamentForm from "./AddTournament";
import { useSWRBackendAPI } from "../Library/API";
import CyberpunkError from "../Components/CyberpunkError";
import { SkeletonTable } from "../skeleton/Skeleton";

  const Tournament =  ({tournaments}) => {
  const [showAddTournamentForm, setAddTournamentForm] = useState(true);
  function transformTournaments(tournaments) {
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
  }

  //use swr 
  // const { result, error, isLoading } =  useSWRBackendAPI(
  //   "tournament/all", //endpoint
  //   "GET", //method
  //   null, //data
  //   0 //revalidate
  // );
  // const tournaments = transformTournaments(result);
  // console.log(tournaments);
  // if (error) return <CyberpunkError message={"failed to load"}/>;
  // if (isLoading)
  //   return (
  //     <div className="space-y-6">
  //       <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
  //       <SkeletonTable />
  //     </div>
  //   );

  //use fetch method
  // const users = await useFetchBackendAPI("users");
  // if (error) return <CyberpunkError message={"failed to load"} />;
  


    return (
      

    <div className="space-y-6">
      {showAddTournamentForm ? (
        <>
          {" "}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold">
              Tournament Management
            </h2>
            <button
              className="bg-linear-to-r from-orange-500 to-red-500 px-4 md:px-6 py-2 rounded-lg font-bold hover:shadow-lg transition text-sm md:text-base cursor-pointer hover:scale-102"
              onClick={() => setAddTournamentForm(!showAddTournamentForm)}
            >
              + New Tournament
            </button>
          </div>
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-x-auto shadow-lg">
            <table className="w-full text-xs md:text-sm">
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300">
                    Id
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300">
                    Tournament Name
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300">
                    Prize Pool
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300 hidden sm:table-cell">
                    Plateform
                  </th>

                  <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300 hidden md:table-cell">
                    Date
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300 hidden lg:table-cell">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {tournaments.map((t, idx) => (
                  <tr
                    key={t.id || idx}
                    className={idx % 2 === 0 ? "bg-gray-750" : "bg-gray-800"}
                  >
                    <td className="px-3 md:px-6 py-3 md:py-4 font-semibold text-white">
                      {t.id}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-300">
                      {t.tournamentName}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 font-bold text-green-400  sm:table-cell">
                      ₹ {t.prizePool}
                    </td>
                    {/* <td className="px-3 md:px-6 py-3 md:py-4">
                      <span
                        className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold ${
                          t.status === "Active"
                            ? "bg-green-500/20 text-green-400"
                            : t.status === "Upcoming"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td> */}
                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-300 hidden md:table-cell text-xs md:text-sm">
                      {t.platform}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-300 hidden md:table-cell text-xs md:text-sm">
                      {t.date}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-300 hidden md:table-cell text-xs md:text-sm">
                      {t.time}
                    </td>
                    {/* <td className="px-3 md:px-6 py-3 md:py-4 space-x-1 md:space-x-2 hidden lg:table-cell">
                      <button className="text-blue-400 hover:text-blue-300 font-bold text-xs md:text-sm">
                        Edit
                      </button>
                      <button className="text-red-400 hover:text-red-300 font-bold text-xs md:text-sm">
                        Delete
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <AddTournamentForm onClose={setAddTournamentForm} />
      )}
    </div>
  );
};

export default Tournament;
