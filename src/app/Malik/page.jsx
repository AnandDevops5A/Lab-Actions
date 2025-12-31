"use client";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import dynamic from "next/dynamic";
import Overview from "./Overview";
import Tournament from "./Tournament";
import Participants from "./Participants";
import Revenue from "./Revenue";
import Report from "./Report";
import Settings from "./Settings";
import Sidebar from "./Sidebar";
import AdminPageLoading from "./AdminPageLoading";
import { useSWRBackendAPI } from "../Library/API";
import CyberpunkError from "../Components/CyberpunkError";
import Swal from "sweetalert2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("participants");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // const [isLoading, setIsLoading] = useState(true)

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

  //send request to backend to get tournaments and participants data
  const { result, error, isLoading } = useSWRBackendAPI(
    "admin/data", //endpoint
    "GET", //method
    null, //data
    10000 //revalidate
  );

  // populate data once fetched
  useEffect(() => {

    console.log("Fetched admin data:", result);
    if (result) {
      console.log(result);
      console.log(transformTournaments(result.users));
      setTournaments(transformTournaments(result.tournaments));
      setParticipants(result.users);
      // setRevenue(result.revenue);
    
    }
  }, [result]);


  useEffect(() => {
    if (window.innerWidth < 640) setSidebarOpen((prev) => !prev);
  }, [activeTab]);

  const [tournaments, setTournaments] = useState([
    {
      id: 1,
      name: "BGMI Elite Series",
      participants: 250,
      prize: 50000,
      status: "Active",
      date: "2025-01-15",
    },
    {
      id: 2,
      name: "Spring Championship",
      participants: 180,
      prize: 75000,
      status: "Upcoming",
      date: "2025-02-10",
    },
    {
      id: 3,
      name: "Winter Cup 2024",
      participants: 420,
      prize: 150000,
      status: "Completed",
      date: "2024-12-20",
    },
    {
      id: 4,
      name: "Regional Qualifier",
      participants: 95,
      prize: 25000,
      status: "Active",
      date: "2025-01-20",
    },
    {
      id: 5,
      name: "start month",
      participants: 105,
      prize: 35000,
      status: "Active",
      date: "2025-02-15",
    },
  ]);

  const [participants, setParticipants] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      tournaments: 5,
      winRate: 65,
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane@example.com",
      tournaments: 3,
      winRate: 72,
      status: "Active",
    },
    {
      id: 3,
      name: "Bob Smith",
      email: "bob@example.com",
      tournaments: 2,
      winRate: 48,
      status: "Inactive",
    },
    {
      id: 4,
      name: "Alex Johnson",
      email: "alex@example.com",
      tournaments: 8,
      winRate: 78,
      status: "Active",
    },
    {
      id: 5,
      name: "Sarah Williams",
      email: "sarah@example.com",
      tournaments: 4,
      winRate: 58,
      status: "Active",
    },
  ]);

  const [revenue, setRevenue] = useState([
    { month: "Jan", amount: 45000, registrations: 250 },
    { month: "Feb", amount: 52000, registrations: 280 },
    { month: "Mar", amount: 48000, registrations: 240 },
    { month: "Apr", amount: 61000, registrations: 320 },
    { month: "May", amount: 75000, registrations: 410 },
    { month: "Jun", amount: 82000, registrations: 480 },
  ]);

  // Statistics Cards Data

  const tournamentData = {
    labels: tournaments.map((t) => t.name),
    datasets: [
      {
        label: "Participants",
        data: tournaments.map((t) => t.participants),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const revenueData = {
    labels: revenue.map((r) => r.month),
    datasets: [
      {
        label: "Revenue ($)",
        data: revenue.map((r) => r.amount),
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        borderColor: "rgba(76, 175, 80, 1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "rgba(76, 175, 80, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const registrationData = {
    labels: revenue.map((r) => r.month),
    datasets: [
      {
        label: "New Registrations",
        data: revenue.map((r) => r.registrations),
        backgroundColor: "rgba(156, 39, 176, 0.6)",
        borderColor: "rgba(156, 39, 176, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#666",
          font: { size: 12, weight: "bold" },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.05)" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "tournaments", label: "Tournaments", icon: "🏆" },
    { id: "participants", label: "Participants", icon: "👥" },
    { id: "revenue", label: "Accounts Analysis", icon: "💰" },
    { id: "reports", label: "Reports", icon: "📄" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  // console.log(result);
  if (error) return (Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Something went wrong!",
    footer: '<a href="/">Go to home</a>'
  }));

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {/* Main Content */}
      <div
        className={`flex-1 ${sidebarOpen ? "md:ml-64" : "md:ml-16 "
          } transition-all duration-300 w-full pt-15 pl-16 sm:pl-0`}
      >
        {/* Header */}
        <div className="bg-gray-950 border-b border-gray-800 p-4 md:p-6  top-0 z-30">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">
                Tournament Management Dashboard
              </h1>
              <p className="text-gray-400 text-xs md:text-sm">
                Welcome back! Here's your tournament overview
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-4">
              <input
                type="date"
                className="bg-gray-800 border border-gray-700 rounded px-3 md:px-4 py-2 text-white text-xs md:text-sm"
              />
              <button className="bg-linear-to-r from-orange-500 to-red-500 px-4 md:px-6 py-2 rounded-lg font-bold hover:shadow-lg hover:shadow-orange-500/50 hover:scale-110 transition text-sm md:text-base">
                Export 📝
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-6 ">


          {error ? (isLoading ? (
            <AdminPageLoading activeTab={activeTab} />
          ) : (
            <>
              {activeTab === "overview" && (
                <Overview
                  tournaments={tournaments}
                  participants={participants}
                  revenue={revenue}
                  tournamentData={tournamentData}
                  chartOptions={chartOptions}
                  revenueData={revenueData}
                  registrationData={registrationData}
                />
              )}

              {activeTab === "tournaments" && (
                <Tournament tournaments={tournaments} />
              )}

              {activeTab === "participants" && (
                <Participants participants={participants} />
              )}

              {activeTab === "revenue" && (
                <Revenue
                  revenueData={revenueData}
                  registrationData={registrationData}
                  chartOptions={chartOptions}
                />
              )}

              {activeTab === "reports" && <Report />}

              {activeTab === "settings" && <Settings />}
            </>
          )) : null}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
