"use client";
import React, { Suspense, useEffect, useState, useContext } from "react";
import { ThemeContext } from "../Library/ThemeContext";
import CyberLoading from "../skeleton/CyberLoading";
const AddTournamentForm = React.lazy(() => import("./AddTournament")); 
const Table = React.lazy(() => import("./Table")); 


const Tournament = ({ tournaments }) => {
  // const [tournamentData] = useState(tournaments);
  const { isDarkMode } = useContext(ThemeContext);
  const [showAddTournamentForm, setShowAddTournamentForm] = useState(true);
  const date = new Date();
  const dateOnly = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const currentTime = date.getHours() * 100 + date.getMinutes();
  const now = dateOnly * 10000 + currentTime;

  // //getting adminData from Cache
  // useEffect(() => {
  //   console.log("tournament component mount....");
  // }, [tournaments]);

  const highlightText = isDarkMode ? "text-green-300" : "text-green-600";

  const columns = [
    {
      header: "ID",
      sortKey: "id",
      render: (t, idx) => (
        <span
          className={`font-mono ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          {(idx + 1).toString().padStart(2, "0")}
        </span>
      ),
    },
    {
      header: "Tournament Name",
      sortKey: "tournamentName",
      render: (t) => <span className="font-bold">{t.tournamentName}</span>,
    },
    {
      header: "Prize Pool",
      sortKey: "prizePool",
      render: (t) => (
        <span className={`${highlightText} font-mono`}>
          ₹ {t.prizePool?.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Status",
      sortKey: "dateTime",
      render: (t) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            t.dateTime > now
              ? isDarkMode
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-green-100 text-green-800 border-green-200"
              : isDarkMode
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-green-100 text-green-800 border-green-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              t.dateTime > now ? "bg-green-400" : "bg-green-400"
            }`}
          ></span>
          {t.dateTime > now ? "UPCOMING" : "COMPLETED"}
        </span>
      ),
    },
    {
      header: "Platform",
      sortKey: "platform",
      className: "hidden sm:table-cell",
      render: (t) => (
        <span className="font-mono text-xs uppercase tracking-wider border border-gray-700 px-2 py-1 rounded">
          {t.platform}
        </span>
      ),
    },
    {
      header: "Date",
      className: "hidden md:table-cell font-mono text-xs",
      sortKey: "dateTime",
      accessor: "date",
      render: (t) => t.date,
    },
    {
      header: "Time",
      className: "hidden lg:table-cell font-mono text-xs",
      sortKey: "dateTime",
      accessor: "time",
      render: (t) => t.time,
    },
    {
      header: "Action",
      className: "hidden lg:table-cell",
      render: () => (
        <div className="flex items-center gap-3">
          <button
            className={`text-xs font-bold uppercase tracking-wider hover:underline ${
              isDarkMode
                ? "text-green-400 hover:text-green-300"
                : "text-green-600 hover:text-green-800"
            }`}
          >
            [Edit]
          </button>
          <button
            className={`text-xs font-bold uppercase tracking-wider hover:underline ${
              isDarkMode
                ? "text-pink-500 hover:text-pink-400"
                : "text-red-600 hover:text-red-800"
            }`}
          >
            [Del]
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="font-mono">
      {showAddTournamentForm ? (
        <Suspense fallback={<CyberLoading />}>
        <Table
          title="Tournament_Explore"
          // subtitle="// SYSTEM_READY"
          themeColor="green"
          data={tournaments}
          columns={columns}
          containerClassName="h-[450px]"
          actions={
            <button
              className={`relative group overflow-hidden px-6 py-2 rounded-lg font-bold uppercase tracking-wider transition-all hover:scale-105 ${
                isDarkMode
                  ? "bg-green-950 border border-green-500 text-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                  : "bg-green-600 text-white hover:bg-green-700 shadow-lg"
              }`}
              onClick={() => setShowAddTournamentForm(!showAddTournamentForm)}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Initialize_New</span>
                <span className="text-lg">+</span>
              </span>
              {isDarkMode && (
                <div className="absolute inset-0 bg-green-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              )}
            </button>
          }
        />
        </Suspense>
      ) : (
        <Suspense fallback={<CyberLoading/>}>
          <AddTournamentForm onClose={setShowAddTournamentForm} />
        </Suspense>
      )}
    </div>
  );
};

export default Tournament;
