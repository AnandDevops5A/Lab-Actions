"use client";
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
  useLayoutEffect,
  useRef,
} from "react";
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
import { Clock, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Overview from "./Overview";
import {
  useBackendAPI,
  getJoinersByTournamentIdList,
  getAllTournaments,
  FetchBackendAPI,
} from "../../lib/api/backend-api";
import { ThemeContext } from "../../lib/contexts/theme-context";
import CyberLoading from "../skeleton/CyberLoading";
import { transformTournaments } from "../../lib/utils/common";
// import Tournament from "./Tournament";
import { errorMessage, successMessage } from "@/lib/utils/alert";
import Sidebar from "@/components/layout/sidebar";
import { UserContext } from "@/lib/contexts/user-context";

const Tournament = dynamic(() => import("./Tournament"), {
  loading: () => <CyberLoading />,
  ssr: false, // optional: disable SSR
});
const Settings = dynamic(() => import("./Settings"), {
  loading: () => <CyberLoading />,
  ssr: false, // optional: disable SSR
});
const Report = dynamic(() => import("./Report"), {
  loading: () => <CyberLoading />,
  ssr: false, // optional: disable SSR
});
const Revenue = dynamic(() => import("./Revenue"), {
  loading: () => <CyberLoading />,
  ssr: false, // optional: disable SSR
});
const Management = dynamic(() => import("./Management"), {
  loading: () => <CyberLoading />,
  ssr: false, // optional: disable SSR
});
const Participants = dynamic(() => import("./Participants"), {
  loading: () => <CyberLoading />,
  ssr: false, // optional: disable SSR
});
const ManageParticipant = dynamic(() => import("./ManageParticipant"), {
  loading: () => <CyberLoading />,
  ssr: false, // optional: disable SSR
});
const Reviews = dynamic(() => import("./Reviews"), {
  loading: () => <CyberLoading />,
  ssr: false, // optional: disable SSR
});
const CompletedTournamentManager = dynamic(
  () => import("./CompletedTournamentManager"),
  {
    loading: () => <CyberLoading />,
    ssr: false, // optional: disable SSR
  },
);

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
  Filler,
);

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tournaments, setTournaments] = useState([]);
  const [joiners, setJoiners] = useState([]);
  const { user, MALIK } = useContext(UserContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [revalidationInterval, setRevalidationInterval] = useState(10000);
  const [customIntervalInput, setCustomIntervalInput] = useState("10");

  const router = useRouter();

  // //send request to backend to get tournaments and participants data
  const { result, isLoading, mutate, isRevalidating } = useBackendAPI(
    "admin/data", //endpoint
    "GET", //method
    null, //data
    {
      revalidateInterval: revalidationInterval,
    },
  );

  const handleSetInterval = useCallback(() => {
    const newInterval = parseInt(customIntervalInput, 10);
    if (!isNaN(newInterval) && newInterval > 0) {
      setRevalidationInterval(newInterval * 1000);
      successMessage(`Refresh interval set to ${newInterval} seconds.`);
    } else {
      errorMessage("Please enter a valid positive number for the interval.");
    }
  }, [customIntervalInput]);

  //set participants if participants formed or not
  const participants = useMemo(() => {
    if (result?.users) {
      return result.users;
    }
    return null;
  }, [result]);

  //update tournament when add new or delete tournament
  const updateTournaments = useCallback(async () => {
    const response = await getAllTournaments();
    if (response.ok) {
      setTournaments(transformTournaments(response.data));
    } else errorMessage(response.error || "Failed to fetch tournaments");
  }, []);

  //update joiner because tournament and users fetch from cache
  const updateJoiners = useCallback(async () => {
    if (!tournaments) {
      errorMessage("Tournaments not loaded yet.");
      return;
    }

    const ids = [
      ...tournaments.filter((t) => t.dateTime < Date.now()).map((t) => t.id),
    ];

    if (ids.length === 0) return;

    const response = await getJoinersByTournamentIdList(ids);
    if (response.ok) {
      setJoiners(response.data);
    } else errorMessage(response.error || "Failed to fetch joiners");
  }, [tournaments]);

  // Authentication and Authorization check
  useLayoutEffect(() => {
    if (!MALIK) {
      router.replace("/");
    }
  }, [user, router]);

  // Initial population of joiners from SWR result
  useEffect(() => {
    if (result?.tournaments) {
      setTournaments(transformTournaments(result.tournaments));
    }
    if (result?.leaderboard) {
      setJoiners(result.leaderboard);
    }
  }, [result?.leaderboard, result?.tournaments]);

  
  const { investmentData, registrationData } = useMemo(() => {
    const monthlyData = {};

    (joiners || []).forEach((joiner) => {
      if (!joiner.time) return;

      const timeStr = joiner.time.toString();
      if (timeStr.length < 6) return;

      const monthKey = timeStr.substring(0, 6); // YYYYMM

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { investment: 0, registrations: 0 };
      }

      if (joiner.investAmount) {
        monthlyData[monthKey].investment += joiner.investAmount;
      }
      monthlyData[monthKey].registrations += 1;
    });

    const sortedKeys = Object.keys(monthlyData).sort();

    const labels = sortedKeys.map((key) => {
      const year = key.substring(0, 4);
      const month = key.substring(4, 6);
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString("default", {
        month: "short",
        year: "numeric",
      });
    });

    const investmentValues = sortedKeys.map(
      (key) => monthlyData[key].investment,
    );
    const registrationValues = sortedKeys.map(
      (key) => monthlyData[key].registrations,
    );

    const investmentChartData = {
      labels,
      datasets: [
        {
          label: "Monthly Investment (₹)",
          data: investmentValues,
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

    const registrationChartData = {
      labels,
      datasets: [
        {
          label: "New Tournament Registrations",
          data: registrationValues,
          backgroundColor: "rgba(156, 39, 176, 0.6)",
          borderColor: "rgba(156, 39, 176, 1)",
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };

    return {
      investmentData: investmentChartData,
      registrationData: registrationChartData,
    };
  }, [joiners]);

  const chartOptions = useMemo(
    () => ({
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
    }),
    [],
  );

  // Sidebar menu items
  const menuItems = useMemo(
    () => [
      { id: "overview", label: "Overview", icon: "📊" },
      // { id: "tournaments", label: "Tournaments", icon: "🏆" },
      { id: "management", label: "Tournament", icon: "🏆" },
      { id: "completed-tournaments", label: "Manage Tournaments", icon: "🛠️" },
      { id: "participants", label: "Participants", icon: "👥" },
      { id: "manage-participants", label: "Manage Participants", icon: "🎮" },
      { id: "reviews", label: "Reviews", icon: "⭐" },
      { id: "revenue", label: "Accounts Analysis", icon: "💰" },
      { id: "reports", label: "Reports", icon: "📄" },
      { id: "settings", label: "Settings", icon: "⚙️" },
    ],
    [],
  );


  return (
    <div className="flex min-h-screen bg-gray-900 text-slate-100">
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
        className={`flex-1 ${
          sidebarOpen ? "md:ml-64" : "md:ml-16 "
        } transition-all duration-300 w-full pt-15 pl-16 sm:pl-0`}
      >
        {/* Header */}
        {activeTab !== "management" && (
          <div className="animate-slideInUp bg-gray-950 border-b border-gray-800 p-4 md:p-6  top-0 z-30">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-100 mb-1">
                  Tournament Management Dashboard
                  {isRevalidating && (
                    <span className="ml-4 inline-flex items-center gap-2 text-sm text-green-400">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {/* Updating... */}
                    </span>
                  )}
                </h1>
                <p className="text-gray-400 text-xs md:text-sm">
                  Welcome back! Here&apos;s your tournament overview
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-4">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={customIntervalInput}
                    onChange={(e) => setCustomIntervalInput(e.target.value)}
                    placeholder="10"
                    className="bg-gray-800 border border-gray-700 rounded px-3 md:px-4 py-2 text-slate-100 text-xs md:text-sm w-20 text-center"
                  />
                  <span className="text-gray-400 text-sm">sec</span>
                </div>
                <button
                  onClick={handleSetInterval}
                  className="bg-linear-to-r from-orange-500 to-red-500 px-4 md:px-6 py-2 rounded-lg font-bold hover:shadow-lg hover:shadow-orange-500/50 hover:scale-110 transition text-sm md:text-base flex items-center justify-center"
                >
                  Save <Clock className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-2 sm:p-6 ">
          {isLoading ? (
            // <AdminPageLoading activeTab={activeTab} />
            <CyberLoading />
          ) : (
            <>
              {activeTab === "overview" && (
                <Overview
                  tournaments={tournaments}
                  participants={participants}
                  joiners={joiners}
                  chartOptions={chartOptions}
                  isRevalidating={isRevalidating}
                />
              )}

              {
                //  activeTab === "tournaments" && (
                //     <Tournament tournaments={tournaments} mutate={mutate} />
                //   )
              }

              {activeTab === "management" && (
                <Management
                  tournaments={tournaments}
                  refreshData={updateTournaments}
                />
              )}

              {activeTab === "completed-tournaments" && (
                <CompletedTournamentManager
                  tournaments={tournaments}
                  refreshData={mutate}
                  joiners={joiners}
                  updateJoiners={updateJoiners}
                />
              )}

              {activeTab === "participants" && (
                <Participants participants={participants} />
              )}

              {activeTab === "manage-participants" && (
                <ManageParticipant
                  tournaments={tournaments}
                  participants={participants}
                  refreshData={mutate}
                />
              )}

              {activeTab === "reviews" && <Reviews />}

              {activeTab === "revenue" && (
                <Revenue
                  revenueData={investmentData}
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
