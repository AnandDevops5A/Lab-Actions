"use client";
import { useState, useEffect, useLayoutEffect, useCallback, useMemo, useContext, Suspense, lazy } from "react"; 
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
import { useSWRBackendAPI, getJoinersByTournamentIdList } from "../../lib/api/backend-api";
import { ThemeContext } from "../../lib/contexts/theme-context";
import CyberLoading from "../skeleton/CyberLoading";
import { transformTournaments } from "../../lib/utils/common";
import { dummyParticipants, dummyRevenue, dummyTournaments } from "../../lib/constants/dummy-data";
import Tournament from "./Tournament";
import { errorMessage } from "@/lib/utils/alert";

const Sidebar = dynamic(() => import('../../components/layout/sidebar'), {
  loading: () =>( <CyberLoading/>),
  ssr: false, // optional: disable SSR
});
const Settings = dynamic(() => import('./Settings'), {
  loading: () =>( <CyberLoading/>),
  ssr: false, // optional: disable SSR
});
const Report = dynamic(() => import('./Report'), {
  loading: () =>( <CyberLoading/>),
  ssr: false, // optional: disable SSR
});
const Revenue = dynamic(() => import('./Revenue'), {
  loading: () =>( <CyberLoading/>),
  ssr: false, // optional: disable SSR
});
const Management = dynamic(() => import('./Management'), {
  loading: () =>( <CyberLoading/>),
  ssr: false, // optional: disable SSR
});
const Participants = dynamic(() => import('./Participants'), {
  loading: () =>( <CyberLoading/>),
  ssr: false, // optional: disable SSR
});
const ManageParticipant = dynamic(() => import('./ManageParticipant'), {
  loading: () =>( <CyberLoading/>),
  ssr: false, // optional: disable SSR
});
const Reviews = dynamic(() => import('./Reviews'), {
  loading: () =>( <CyberLoading/>),
  ssr: false, // optional: disable SSR
});
const CompletedTournamentManager = dynamic(() => import('./CompletedTournamentManager'), {
  loading: () =>( <CyberLoading/>),
  ssr: false, // optional: disable SSR
});




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
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tournaments, setTournaments] = useState();
  const [participants, setParticipants] = useState();
    const [joiners, setJoiners]=useState([]);
  
  const { isDarkMode } = useContext(ThemeContext);
  // const [isLoading, setIsLoading] = useState(true)



  //send request to backend to get tournaments and participants data
  const { result, error, isLoading, mutate } = useSWRBackendAPI(
    "admin/data", //endpoint
    "GET", //method
    null, //data
    0 //revalidate in 10sec
  );

  useLayoutEffect(() => {
    if (window.innerWidth < 640) setSidebarOpen((prev) => !prev);
  }, []);


  //update joiner because tournament and users fetch from cache
  const updateJoiners = useCallback(async () => {
      console.log("get joiner called");
      if (!tournaments) {
        errorMessage("Tournaments not loaded yet.");
        return;
      }
      const ids = [...tournaments.filter(t => t.dateTime < Date.now()).map(t => t.id)];
      
      if (ids.length === 0) return;
  
      const response = await getJoinersByTournamentIdList(ids);
      if (response.ok) {
        setJoiners(response.data);
      }
      else errorMessage(response.error || "Failed to fetch joiners");
    }, [tournaments]);


  // populate data once fetched
  useEffect(() => {
    // console.log("Fetched admin data:", result);
    if (result && !error) {
      // console.log("Result fetched....");
      // console.log(transformTournaments(result.tournaments));
      setTournaments(transformTournaments(result.tournaments));
      setParticipants(result.users);
      setJoiners(result.leaderboard);
      // setRevenue(result.revenue);
      // console.log(tournaments);
    } else {
      setParticipants(dummyParticipants);
      setTournaments(dummyTournaments);
      // setRevenue(dummyRevenue);
    }
  }, [result]);


  const [revenue, setRevenue] = useState(dummyRevenue);

  // Statistics Cards Data
const COLORS = [
  { bg: "rgba(255, 99, 132, 0.6)", border: "rgba(255, 99, 132, 1)" },
  { bg: "rgba(54, 162, 235, 0.6)", border: "rgba(54, 162, 235, 1)" },
  { bg: "rgba(75, 192, 192, 0.6)", border: "rgba(75, 192, 192, 1)" },
  { bg: "rgba(255, 206, 86, 0.6)", border: "rgba(255, 206, 86, 1)" },
];

const safeTournaments = tournaments ?? [];

const tournamentData = {
  labels: safeTournaments.map(t => t.tournamentName),
  datasets: [
    {
      label: "Participants",
      data: safeTournaments.map(
        t => t.rankList ? Object.keys(t.rankList).length : (t.participants ?? 0)
      ),
      backgroundColor: safeTournaments.map((_, i) => COLORS[i % COLORS.length].bg),
      borderColor: safeTournaments.map((_, i) => COLORS[i % COLORS.length].border),
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

  // Sidebar menu items
  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    // { id: "tournaments", label: "Tournaments", icon: "🏆" },
    {id:"management", label:"Tournament", icon:"🏆"},
    { id: "completed-tournaments", label: "Manage Tournaments", icon: "🛠️" },
    { id: "participants", label: "Participants", icon: "👥" },
    { id: "manage-participants", label: "Manage Participants", icon: "🎮" },
    { id: "reviews", label: "Reviews", icon: "⭐" },
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
        {(activeTab !== "management") && <div className="animate-slideInUp bg-gray-950 border-b border-gray-800 p-4 md:p-6  top-0 z-30">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">
                Tournament Management Dashboard
              </h1>
              <p className="text-gray-400 text-xs md:text-sm">
                Welcome back! Here&apos;s your tournament overview
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
        </div>}

        {/* Content */}
        <div className="p-2 sm:p-6 ">
          {isLoading ? (
            // <AdminPageLoading activeTab={activeTab} />
            <CyberLoading/>
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
                <Tournament tournaments={tournaments} refreshData={mutate} />
              )}

              {activeTab === "management" && (
                <Management tournaments={tournaments} refreshData={mutate} />
              )}

              {activeTab === "completed-tournaments" && (
                <CompletedTournamentManager tournaments={tournaments} refreshData={mutate} joiners={joiners} updateJoiners={updateJoiners} />
              )}

              {activeTab === "participants" && (
                <Participants participants={participants} />
              )}

              {activeTab === "manage-participants" && (
                <ManageParticipant tournaments={tournaments} participants={participants} refreshData={mutate} />
              )}

              {activeTab === "reviews" && <Reviews />}

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
