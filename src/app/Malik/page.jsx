"use client";
import { useState, useEffect, useLayoutEffect, useCallback, useMemo, useContext } from "react"; 
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
import { ThemeContext } from "../Library/ThemeContext";

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
  const [activeTab, setActiveTab] = useState("tournaments");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tournaments, setTournaments] = useState();
  const [participants, setParticipants] = useState();
  const { isDarkMode } = useContext(ThemeContext);
  // const [isLoading, setIsLoading] = useState(true)

  const transformTournaments = useCallback((tournaments) => {
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
  }, []);

  //send request to backend to get tournaments and participants data
  const { result, error, isLoading } = useSWRBackendAPI(
    "admin/data", //endpoint
    "GET", //method
    null, //data
    0 //revalidate in 10sec
  );

  useLayoutEffect(() => {
    if (window.innerWidth < 640) setSidebarOpen((prev) => !prev);
  }, []);
  // populate data once fetched
  useEffect(() => {
    // console.log("Fetched admin data:", result);
    if (result && !error) {
      // console.log("Result fetched....");
      console.log(transformTournaments(result.tournaments));
      setTournaments(transformTournaments(result.tournaments));
      setParticipants(result.users);
      // setRevenue(result.revenue);
    } else {
      setParticipants(dummyParticipants);
      setTournaments(dummyTournaments);
      // setRevenue(dummyRevenue);
    }
  }, [result]);

  const dummyTournaments = useMemo(() => ([
    {
      id: 1,
      tournamentName: "Dummy Series 1",
      prizePool: 50000,
      dateTime: 202501151800,
      entryFee: 50,
      platform: "PC",
      participants: 67,
    },

    {
      id: 2,
      tournamentName: "Dummy Series 2",
      prizePool: 60000,
      dateTime: 202502101900,
      entryFee: 75,
      platform: "Mobile",
      participants: 67,
    },
    {
      id: 3,
      tournamentName: "Championship Clash",
      prizePool: 75000,
      active: false,
      dateTime: 202503051700,
      entryFee: 100,
      platform: "PC",
      participants: 90,
    },
    {
      id: 4,
      tournamentName: "Battle Royale Cup",
      prizePool: 40000,
      dateTime: 202504201830,
      entryFee: 60,
      platform: "Console",
      participants: 56,
    },
    {
      id: 5,
      tournamentName: "Legends Invitational",
      prizePool: 90000,
      dateTime: 202505151600,
      entryFee: 120,
      platform: "PC",
      participants: 67,
    },
    {
      id: 6,
      tournamentName: "Pro Gamer League",
      prizePool: 55000,
      active: false,
      dateTime: 202506101930,
      entryFee: 80,
      platform: "Mobile",
      participants: 90,
    },
    {
      id: 7,
      tournamentName: "Ultimate Showdown",
      prizePool: 100000,
      dateTime: 202507251700,
      entryFee: 150,
      platform: "Console",
      participants: 87,
    },
    {
      id: 8,
      tournamentName: "Arena Masters",
      prizePool: 30000,
      dateTime: 202508121830,
      entryFee: 40,
      platform: "PC",
      participants: 37,
    },
    {
      id: 9,
      tournamentName: "Victory Cup",
      prizePool: 65000,
      active: false,
      dateTime: 202509051900,
      entryFee: 90,
      platform: "Mobile",
      participants: 35,
    },
    {
      id: 10,
      tournamentName: "Elite Gamers Series",
      prizePool: 85000,
      dateTime: 202510151800,
      entryFee: 110,
      platform: "PC",
      participants: 70,
    },
    {
      id: 11,
      tournamentName: "Grand Finals",
      prizePool: 120000,
      dateTime: 202511201930,
      entryFee: 200,
      platform: "Console",
      participants: 50,
    },
  ]), []);

  const dummyParticipants = useMemo(() => ([
    {
      id: 1,
      username: "John Doe",
      email: "john@example.com",
      callSign: "JD123",
      contact: 1234567890,
      accessKey: "AK987654321",
      joiningDate: 20230510,
      investAmount: 1000,
      winAmount: 500,
      withdrawAmount: 200,
      balanceAmount: 1300,
      totalPlay: 50,
      totalWin: 30,
      totallosses: 20,
      active: false,
    },

    {
      id: 2,
      username: "Alice Smith",
      email: "alice@example.com",
      callSign: "AS456",
      contact: 9876543210,
      accessKey: "AK123456789",
      joiningDate: 20230615,
      investAmount: 1500,
      winAmount: 700,
      withdrawAmount: 300,
      balanceAmount: 1900,
      totalPlay: 60,
      totalWin: 35,
      totallosses: 25,
      active: true,
    },

    {
      id: 3,
      username: "Bob Johnson",
      email: "bob@example.com",
      callSign: "BJ789",
      contact: 9123456780,
      accessKey: "AK246813579",
      joiningDate: 20230720,
      investAmount: 2000,
      winAmount: 1200,
      withdrawAmount: 500,
      balanceAmount: 2700,
      totalPlay: 80,
      totalWin: 50,
      totallosses: 30,
      active: true,
    },
    {
      id: 4,
      username: "Charlie Brown",
      email: "charlie@example.com",
      callSign: "CB321",
      contact: 9988776655,
      accessKey: "AK564738291",
      joiningDate: 20230805,
      investAmount: 800,
      winAmount: 400,
      withdrawAmount: 100,
      balanceAmount: 1100,
      totalPlay: 40,
      totalWin: 20,
      totallosses: 20,
      active: true,
    },
    {
      id: 5,
      username: "Diana Prince",
      email: "diana@example.com",
      callSign: "DP654",
      contact: 8765432109,
      accessKey: "AK987123654",
      joiningDate: 20230912,
      investAmount: 2500,
      winAmount: 1500,
      withdrawAmount: 600,
      balanceAmount: 3400,
      totalPlay: 90,
      totalWin: 55,
      totallosses: 35,
      active: false,
    },
    {
      id: 6,
      username: "Ethan Hunt",
      email: "ethan@example.com",
      callSign: "EH987",
      contact: 7654321098,
      accessKey: "AK192837465",
      joiningDate: 20231001,
      investAmount: 1200,
      winAmount: 800,
      withdrawAmount: 400,
      balanceAmount: 1600,
      totalPlay: 55,
      totalWin: 32,
      totallosses: 23,
      active: true,
    },
    {
      id: 7,
      username: "Fiona Green",
      email: "fiona@example.com",
      callSign: "FG741",
      contact: 6543210987,
      accessKey: "AK111222333",
      joiningDate: 20231118,
      investAmount: 1800,
      winAmount: 900,
      withdrawAmount: 350,
      balanceAmount: 2350,
      totalPlay: 70,
      totalWin: 40,
      totallosses: 30,
      active: true,
    },
    {
      id: 8,
      username: "George King",
      email: "george@example.com",
      callSign: "GK852",
      contact: 5432109876,
      accessKey: "AK444555666",
      joiningDate: 20231225,
      investAmount: 2200,
      winAmount: 1100,
      withdrawAmount: 500,
      balanceAmount: 2800,
      totalPlay: 75,
      totalWin: 45,
      totallosses: 30,
      active: false,
    },
    {
      id: 9,
      username: "Hannah Lee",
      email: "hannah@example.com",
      callSign: "HL963",
      contact: 4321098765,
      accessKey: "AK777888999",
      joiningDate: 20240110,
      investAmount: 900,
      winAmount: 450,
      withdrawAmount: 200,
      balanceAmount: 1150,
      totalPlay: 45,
      totalWin: 25,
      totallosses: 20,
      active: true,
    },
    {
      id: 10,
      username: "Ian Scott",
      email: "ian@example.com",
      callSign: "IS159",
      contact: 3210987654,
      accessKey: "AK000111222",
      joiningDate: 20240214,
      investAmount: 3000,
      winAmount: 2000,
      withdrawAmount: 800,
      balanceAmount: 4200,
      totalPlay: 100,
      totalWin: 65,
      totallosses: 35,
      active: true,
    },
    {
      id: 11,
      username: "Julia Adams",
      email: "julia@example.com",
      callSign: "JA753",
      contact: 2109876543,
      accessKey: "AK333444555",
      joiningDate: 20240305,
      investAmount: 1600,
      winAmount: 700,
      withdrawAmount: 300,
      balanceAmount: 2000,
      totalPlay: 65,
      totalWin: 38,
      totallosses: 27,
      active: true,
    },
  ]), []);


  const [revenue, setRevenue] = useState([
    { month: "Jan", amount: 45000, registrations: 250 },
    { month: "Feb", amount: 52000, registrations: 280 },
    { month: "Mar", amount: 48000, registrations: 240 },
    { month: "Apr", amount: 61000, registrations: 320 },
    { month: "May", amount: 75000, registrations: 410 },
    { month: "Jun", amount: 82000, registrations: 480 },
  ]);

  // Statistics Cards Data
  // const tournamentData = {
  //   labels: tournaments.map((t) => t.tournamentName),
  //   datasets: [
  //     {
  //       label: "Participants",
  //       data: tournaments.map((t) => t.participants),
  //       backgroundColor: [
  //         "rgba(255, 99, 132, 0.6)",
  //         "rgba(54, 162, 235, 0.6)",
  //         "rgba(75, 192, 192, 0.6)",
  //         "rgba(255, 206, 86, 0.6)",
  //       ],
  //       borderColor: [
  //         "rgba(255, 99, 132, 1)",
  //         "rgba(54, 162, 235, 1)",
  //         "rgba(75, 192, 192, 1)",
  //         "rgba(255, 206, 86, 1)",
  //       ],
  //       borderWidth: 2,
  //       borderRadius: 8,
  //     },
  //   ],
  // };


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

  // Sidebar menu items
  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "tournaments", label: "Tournaments", icon: "🏆" },
    { id: "participants", label: "Participants", icon: "👥" },
    { id: "revenue", label: "Accounts Analysis", icon: "💰" },
    { id: "reports", label: "Reports", icon: "📄" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  // console.log(result);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
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
              <span className="bg-linear-to-r from-orange-500 to-red-500 px-4 md:px-6 py-2 rounded-lg font-bold hover:shadow-lg hover:shadow-orange-500/50 hover:scale-110 transition text-sm md:text-base">
                Export 📝
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-6 ">
          {isLoading ? (
            <AdminPageLoading activeTab={activeTab} />
          ) : (
            <>
              {activeTab === "overview" && (
                <Overview
                  tournaments={tournaments}
                  participants={participants}
                  revenue={revenue}
                  // tournamentData={tournamentData}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
