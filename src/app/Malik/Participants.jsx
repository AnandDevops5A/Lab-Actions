"use client";
import React, { Suspense, useContext, useMemo, useRef, useState } from "react";
import { ThemeContext } from "../Library/ThemeContext";
// import Table from "./Table";
import { SkeletonCard } from "../skeleton/Skeleton";
import CyberLoading from "../skeleton/CyberLoading";
const ViewParticipation = React.lazy(() => import("./AddTournament")); 
const Table = React.lazy(() => import("./Table")); 

const Participants = ({ participants = [] }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const highlightText = isDarkMode ? "text-cyan-300" : "text-blue-600";
  const inputref=useRef(null);
  // const search=useRef(null);
  const [search, setSearch]=useState(null);
  const columns = [
    {
      header: "User_ID",
      sortKey: "username",
      render: (p) => (
        <div className="flex items-center">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
              isDarkMode
                ? "bg-gray-800 text-cyan-400"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {p.username ? p.username.charAt(0).toUpperCase() : "?"}
          </div>
          <span
            className={`font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {p.username}
          </span>
        </div>
      ),
    },
    {
      header: "Attendance",
      sortKey: "totalPlay",
      render: (p) => (
        <span className="font-mono">
          {String(p.totalPlay || 0).padStart(3, "0")}
        </span>
      ),
    },
    {
      header: "Invested",
      sortKey: "investAmount",
      render: (p) => (
        <span className={`${highlightText} font-mono`}>
          ₹{p.investAmount?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      header: "Earnings",
      sortKey: "winAmount",
      render: (p) => (
        <span
          className={`${
            isDarkMode ? "text-green-400" : "text-green-600"
          } font-mono`}
        >
          ₹{p.winAmount?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      header: "Win_Rate",
      render: (p) => {
        const total = p.totalPlay || 0;
        const wins =
          p.totalPlay && p.totallosses != null ? total - p.totallosses : 0;
        const winRate = total > 0 ? (wins / total) * 100 : 0;
        return (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 w-24 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                style={{ width: `${winRate}%` }}
              />
            </div>
            <span
              className={`text-xs font-bold ${
                isDarkMode ? "text-cyan-400" : "text-blue-600"
              }`}
            >
              {winRate.toFixed(0)}%
            </span>
          </div>
        );
      },
    },
    {
      header: "Status",
      sortKey: "active",
      render: (p) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
          ${
            p.active
              ? isDarkMode
                ? "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]"
                : "bg-green-100 text-green-800 border-green-200"
              : isDarkMode
              ? "bg-red-500/10 text-red-400 border-red-500/20"
              : "bg-red-100 text-red-800 border-red-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              p.active ? "bg-green-400 animate-pulse" : "bg-red-400"
            }`}
          ></span>
          {p.active ? "ONLINE" : "OFFLINE"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (p) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedParticipant(p)}
            className={`text-xs font-bold uppercase tracking-wider hover:underline ${
              isDarkMode
                ? "text-cyan-400 hover:text-cyan-300"
                : "text-blue-600 hover:text-blue-800"
            }`}
          >
            [View]
          </button>
          <button
            className={`text-xs font-bold uppercase tracking-wider hover:underline ${
              isDarkMode
                ? "text-pink-500 hover:text-pink-400"
                : "text-red-600 hover:text-red-800"
            }`}
          >
            [Ban]
          </button>
        </div>
      ),
    },
  ];

 const player= useMemo(()=>{
    console.log("usememo run admin ");
    console.log(search);
    
  },[search,participants])
  console.log("participant component mount");

  return (
    <>
    <Suspense fallback={<CyberLoading />}>
      <Table
        title="Participant_Examine"
        // subtitle="// ACCESSING SECURE RECORDS..."
        themeColor="cyan"
        data={participants}
        columns={columns}
        containerClassName="h-[450px]"
        actions={
          <div className="relative group">
            <div
              className={`absolute -inset-0.5 bg-linear-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-200 ${
                !isDarkMode && "hidden"
              }`}
            ></div>
            <input
            ref={inputref}
              onChange={(e)=>setSearch(e.target.value)}
              type="text"
              placeholder="SEARCH_ID..."
              className={`relative w-full sm:w-64 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 transition-all
                ${
                  isDarkMode
                    ? "bg-gray-900 text-cyan-100 border border-gray-700 focus:border-cyan-500 focus:ring-cyan-500/20 placeholder-gray-600"
                    : "bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
            />
          </div>
        }
      /></Suspense>
      {selectedParticipant && (
        <Suspense fallback={<CyberLoading />}>
        <ViewParticipation
          data={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
        /></Suspense>
      )}
    </>
  );
};

export default Participants;
