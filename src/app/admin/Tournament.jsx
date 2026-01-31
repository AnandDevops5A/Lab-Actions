"use client";
import React, { useState, useContext, useMemo, useCallback } from "react";
import { ThemeContext } from "../../lib/contexts/theme-context";
import CyberLoading from "../skeleton/CyberLoading";
import dynamic from "next/dynamic";
import { errorMessage, successMessage, confirmMessage } from "../../lib/utils/alert";
import { FetchBackendAPI } from "../../lib/api/backend-api";


const Table = dynamic(() => import('./Table'), {
  loading: () =>( <CyberLoading/>),
  ssr: false, // optional: disable SSR
});

const AddTournamentForm = dynamic(() => import('./AddTournament'), {
  loading: () => <CyberLoading/>,
  ssr: false, // optional: disable SSR
});



const Tournament = ({ tournaments, refreshData }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [showAddTournamentForm, setShowAddTournamentForm] = useState(true);
  const date = new Date();
  const dateOnly = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const currentTime = date.getHours() * 100 + date.getMinutes();
  const now = dateOnly * 10000 + currentTime;


  const highlightText = isDarkMode ? "text-green-300" : "text-green-600";

  const performDeletion = useCallback(async (id) => {
    try {
      const response = await fetch(`http://localhost:8082/tournament/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const msg = typeof responseData === 'string' ? responseData : (responseData?.message || "Tournament deleted successfully");
        successMessage(msg);
        if (refreshData) refreshData();
      } else {
        errorMessage("Failed to delete tournament.");
      }
    } catch (error) {
      console.error("Error deleting tournament:", error);
      errorMessage("An error occurred while deleting the tournament.");
    }
  }, [refreshData]);

  const deleteTournament = useCallback((id) => async () => {
    const confirmed = await confirmMessage("This action cannot be undone.", "Delete Tournament");
    if (confirmed) {
      await performDeletion(id);
    }
  }, [performDeletion]);

  const columns = useMemo(() => [
    {
      header: "ID",
      sortKey: "id",
      render: (t, idx) => (
        <span
          className={`Rusty Attack ${isDarkMode ? "text-white" : "text-gray-900"}`}
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
        <span className={`${highlightText} Rusty Attack`}>
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
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : "bg-amber-100 text-amber-800 border-amber-200"
              : isDarkMode
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-green-100 text-green-800 border-green-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              t.dateTime > now ? "bg-amber-400" : "bg-green-400"
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
        <span className="Rusty Attack text-xs uppercase tracking-wider border border-gray-700 px-2 py-1 rounded">
          {t.platform}
        </span>
      ),
    },
    {
      header: "Date",
      className: "hidden md:table-cell Rusty Attack text-xs",
      sortKey: "dateTime",
      accessor: "date",
      render: (t) => t.date,
    },
    {
      header: "Time",
      className: "hidden lg:table-cell Rusty Attack text-xs",
      sortKey: "dateTime",
      accessor: "time",
      render: (t) => t.time,
    },
    {
      header: "Action",
      className: "hidden lg:table-cell",
      render: (t) => (
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
          {t.dateTime > now && (<button
            className={`text-xs font-bold uppercase tracking-wider hover:underline ${
              isDarkMode
                ? "text-pink-500 hover:text-pink-400"
                : "text-red-600 hover:text-red-800"
            }`}
            onClick={deleteTournament(t.id)}
          >
            [Del]
          </button>)}
        </div>
      ),
    },
  ], [isDarkMode, highlightText, now, deleteTournament]);

  return (
    <div className="Rusty Attack">
      {showAddTournamentForm ? (
      
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

      ) : (
          <AddTournamentForm onClose={setShowAddTournamentForm} refreshData={refreshData}/>
      )}
    </div>
  );
};

export default Tournament;



