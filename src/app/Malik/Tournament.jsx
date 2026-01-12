"use client";
import React, { Suspense, useEffect, useState } from "react";
import { SkeletonCard } from "../skeleton/Skeleton";
const AddTournamentForm = React.lazy(() => import("./AddTournament")); 

const Tournament = ({ tournaments }) => {
  // const [tournamentData] = useState(tournaments);
  const [showAddTournamentForm, setShowAddTournamentForm] = useState(true);
  const date = new Date();
  const dateOnly = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const currentTime = date.getHours() * 100 + date.getMinutes();
  const now = dateOnly * 10000 + currentTime;

  //getting adminData from Cache
  useEffect(() => {
    console.log("tournament component mount....");
  }, [tournaments]);

  return (
    <div className="space-y-6">
      {showAddTournamentForm ? (
        <>
          {" "}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold">
              Tournament Management
            </h2>
            <span
              className="bg-linear-to-br from-purple-500 to-green-500 px-4 md:px-6 py-2 rounded-lg font-bold hover:shadow-lg transition text-sm md:text-base cursor-pointer hover:scale-105"
              onClick={() => setShowAddTournamentForm(!showAddTournamentForm)}
            >
              + New Tournament
            </span>
          </div>
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-x-auto shadow-lg h-[500px]">
            <table className="w-full text-xs md:text-sm">
              <thead className="bg-gray-900 border-b border-gray-700 sticky top-0">
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
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300">
                    Status
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
                   <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300 hidden lg:table-cell">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {tournaments ?(tournaments.map((t, idx) => (
                  <tr
                    key={t.id || idx}
                    className={idx % 2 === 0 ? "bg-gray-750" : "bg-gray-800"}
                  >
                    <td className="px-3 md:px-6 py-3 md:py-4 font-semibold text-white">
                      {idx + 1}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-300">
                      {t.tournamentName}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 font-bold text-green-400  sm:table-cell">
                      ₹ {t.prizePool}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span
                        className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold ${
                          t.dateTime > now
                            ? " text-blue-400"
                            : " text-green-400 "
                        }`}
                      >
                        {t.dateTime > now ? "⏰" : "✅"}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-300 hidden md:table-cell text-xs md:text-sm">
                      {t.platform}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-300 hidden md:table-cell text-xs md:text-sm">
                      {t.date}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-300 hidden md:table-cell text-xs md:text-sm">
                      {t.time}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 space-x-1 md:space-x-2 hidden lg:table-cell">
                      <span className="text-blue-400 hover:text-blue-300 font-bold text-xs md:text-sm">
                        Edit
                      </span>
                      <span className="text-red-400 hover:text-red-300 font-bold text-xs md:text-sm">
                        Delete
                      </span>
                    </td>
                  </tr>
                ))): "No tournaments found"
                
                }
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <Suspense fallback={<SkeletonCard />}>
          <AddTournamentForm onClose={setShowAddTournamentForm} />
        </Suspense>
      )}
    </div>
  );
};

export default Tournament;
