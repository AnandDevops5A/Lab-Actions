"use client";
import React, { useContext, useMemo } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { ThemeContext } from "../../lib/contexts/theme-context";

const Overview = ({
  tournaments,
  participants,
  revenue,
  chartOptions,
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const cardStyle = `bg-linear-to-br
                       ${isDarkMode ? "from-gray-800 to-gray-900" : "from-gray-100 to-gray-200"} p-4 md:p-6 rounded-xl border border-gray-700
                        hover:border-orange-500 transition shadow-lg `;

  const stats = useMemo(
    () => {
      const safeTournaments = tournaments || [];
      const safeParticipants = participants || [];

      const totalGames = safeParticipants.reduce((acc, p) => acc + (p.totalPlay || 0), 0);
      const totalWins = safeParticipants.reduce((acc, p) => acc + (p.totalWin || 0), 0);
      const avgWinRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) + "%" : "0%";

      return [
        {
          label: "Total Tournaments",
          value: safeTournaments.length,
          color: "from-blue-500 to-cyan-500",
          icon: "🏆",
        },
        {
          label: "Active Participants",
          value: safeParticipants.filter((p) => p.active).length,
          color: "from-purple-500 to-pink-500",
          icon: "👥",
        },
        {
          label: "Total Revenue",
          value: `₹${(revenue || [])
            .reduce((sum, r) => sum + (r.amount || 0), 0)
            .toLocaleString()}`,
          color: "from-green-500 to-emerald-500",
          icon: "💰",
        },
        {
          label: "Avg Win Rate",
          value: avgWinRate,
          color: "from-orange-500 to-red-500",
          icon: "📈",
        },
      ];
    },
    [tournaments, participants, revenue]
  );

  // 1. Platform Distribution (Doughnut)
  const platformData = useMemo(() => {
    const safeTournaments = tournaments || [];
    const platforms = {};
    safeTournaments.forEach((t) => {
      const p = t.platform || "Unknown";
      platforms[p] = (platforms[p] || 0) + 1;
    });

    return {
      labels: Object.keys(platforms),
      datasets: [
        {
          label: "Tournaments",
          data: Object.values(platforms),
          backgroundColor: [
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 99, 132, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [tournaments]);

  // 2. Tournament Capacity vs Filled (Bar)
  const capacityData = useMemo(() => {
    const safeTournaments = (tournaments || []).slice(0, 8); // Show last 8
    return {
      labels: safeTournaments.map((t) => t.tournamentName.length > 10 ? t.tournamentName.substring(0, 10) + "..." : t.tournamentName),
      datasets: [
        {
          label: "Participants",
          data: safeTournaments.map((t) =>
            t.rankList ? Object.keys(t.rankList).length : t.participants || 0
          ),
          backgroundColor: "rgba(75, 192, 192, 0.7)",
          borderRadius: 4,
        },
        {
          label: "Total Slots",
          data: safeTournaments.map((t) => t.slot || 0),
          backgroundColor: "rgba(255, 99, 132, 0.3)",
          borderRadius: 4,
        },
      ],
    };
  }, [tournaments]);

  // 3. Top Earners (Bar)
  const topEarnersData = useMemo(() => {
    const safeParticipants = [...(participants || [])]
      .sort((a, b) => (b.winAmount || 0) - (a.winAmount || 0))
      .slice(0, 5);

    return {
      labels: safeParticipants.map((p) => p.username),
      datasets: [
        {
          label: "Total Earnings (₹)",
          data: safeParticipants.map((p) => p.winAmount || 0),
          backgroundColor: "rgba(255, 206, 86, 0.7)",
          borderColor: "rgba(255, 206, 86, 1)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }, [participants]);

  // 4. User Growth (Line Chart) - Monthly Registrations
  const userGrowthData = useMemo(() => {
    const safeParticipants = participants || [];
    const counts = {};

    safeParticipants.forEach((p) => {
      if (!p.joiningDate) return;
      // joiningDate is number YYYYMMDD (e.g., 20231025)
      const dateStr = p.joiningDate.toString();
      if (dateStr.length !== 8) return;

      const key = dateStr.substring(0, 6); // YYYYMM
      counts[key] = (counts[key] || 0) + 1;
    });

    const sortedKeys = Object.keys(counts).sort();
    const labels = sortedKeys.map((k) => {
      const y = k.substring(0, 4);
      const m = k.substring(4, 6);
      const date = new Date(parseInt(y), parseInt(m) - 1);
      return date.toLocaleDateString("default", { month: "short", year: "numeric" });
    });

    return {
      labels,
      datasets: [
        {
          label: "New Players",
          data: sortedKeys.map((k) => counts[k]),
          borderColor: "rgba(147, 51, 234, 1)", // Purple
          backgroundColor: "rgba(147, 51, 234, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [participants]);

  // 5. Player Skill Distribution (Bar Chart) - Win Rates
  const skillData = useMemo(() => {
    const safeParticipants = participants || [];
    const buckets = { "0-20%": 0, "21-40%": 0, "41-60%": 0, "61-80%": 0, "81-100%": 0 };

    safeParticipants.forEach((p) => {
      const total = p.totalPlay || 0;
      if (total === 0) return;
      const wins = p.totalWin || 0; // Assuming totalWin exists, or calculate from total - losses
      const rate = (wins / total) * 100;

      if (rate <= 20) buckets["0-20%"]++;
      else if (rate <= 40) buckets["21-40%"]++;
      else if (rate <= 60) buckets["41-60%"]++;
      else if (rate <= 80) buckets["61-80%"]++;
      else buckets["81-100%"]++;
    });

    return {
      labels: Object.keys(buckets),
      datasets: [
        {
          label: "Player Count",
          data: Object.values(buckets),
          backgroundColor: [
            "rgba(239, 68, 68, 0.7)", // Red
            "rgba(249, 115, 22, 0.7)", // Orange
            "rgba(234, 179, 8, 0.7)", // Yellow
            "rgba(34, 197, 94, 0.7)", // Green
            "rgba(59, 130, 246, 0.7)", // Blue
          ],
          borderRadius: 4,
        },
      ],
    };
  }, [participants]);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={cardStyle}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-xs md:text-sm font-semibold">
                {stat.label}
              </h3>
              <span className="text-2xl md:text-3xl">{stat.icon}</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-slate-100">
              {stat.value}
            </p>
            <p className="text-green-400 text-xs mt-2">Updated just now</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        
        <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-inner inset-1">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-slate-100">
            Tournament Capacity vs Filled
          </h2>
          <Bar data={capacityData} options={chartOptions} />
        </div>

        <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-inner inset-1">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-slate-100">
            Top 5 Earners
          </h2>
          <Bar data={topEarnersData} options={chartOptions} />
        </div>

        <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-inner inset-1">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-slate-100">
            Platform Distribution
          </h2>
          <div className="h-64 flex justify-center">
             <Doughnut data={platformData} options={{...chartOptions, maintainAspectRatio: false}} />
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-inner inset-1">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-slate-100">
            Participant Status
          </h2>
           <div className="h-64 flex justify-center">
             <Doughnut data={{
                labels: ["Active", "Inactive"],
                datasets: [{
                    data: [
                        (participants || []).filter(p => p.active).length,
                        (participants || []).filter(p => !p.active).length
                    ],
                    backgroundColor: ["rgba(76, 175, 80, 0.7)", "rgba(244, 67, 54, 0.7)"],
                    borderWidth: 0
                }]
             }} options={{...chartOptions, maintainAspectRatio: false}} />
           </div>
        </div>

        <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-inner inset-1">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-slate-100">
            User Growth (Monthly)
          </h2>
          <Line data={userGrowthData} options={chartOptions} />
        </div>

        <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-inner inset-1">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-slate-100">
            Player Skill Distribution (Win Rate)
          </h2>
          <Bar data={skillData} options={chartOptions} />
        </div>
      </div>

    </div>
  );
};

export default Overview;
