'use client'
import { useState, useEffect } from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
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
} from 'chart.js';

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
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const [tournaments, setTournaments] = useState([
    { id: 1, name: 'BGMI Elite Series', participants: 250, prize: 50000, status: 'Active', date: '2025-01-15' },
    { id: 2, name: 'Spring Championship', participants: 180, prize: 75000, status: 'Upcoming', date: '2025-02-10' },
    { id: 3, name: 'Winter Cup 2024', participants: 420, prize: 150000, status: 'Completed', date: '2024-12-20' },
    { id: 4, name: 'Regional Qualifier', participants: 95, prize: 25000, status: 'Active', date: '2025-01-20' },
    { id: 4, name: 'start month', participants: 105, prize: 35000, status: 'Active', date: '2025-02-15' },
  ]);

  const [participants, setParticipants] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', tournaments: 5, winRate: 65, status: 'Active' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', tournaments: 3, winRate: 72, status: 'Active' },
    { id: 3, name: 'Bob Smith', email: 'bob@example.com', tournaments: 2, winRate: 48, status: 'Inactive' },
    { id: 4, name: 'Alex Johnson', email: 'alex@example.com', tournaments: 8, winRate: 78, status: 'Active' },
    { id: 5, name: 'Sarah Williams', email: 'sarah@example.com', tournaments: 4, winRate: 58, status: 'Active' },
  ]);

  const [revenue, setRevenue] = useState([
    { month: 'Jan', amount: 45000, registrations: 250 },
    { month: 'Feb', amount: 52000, registrations: 280 },
    { month: 'Mar', amount: 48000, registrations: 240 },
    { month: 'Apr', amount: 61000, registrations: 320 },
    { month: 'May', amount: 75000, registrations: 410 },
    { month: 'Jun', amount: 82000, registrations: 480 },
  ]);

  // Statistics Cards Data
  const stats = [
    { label: 'Total Tournaments', value: tournaments.length, color: 'from-blue-500 to-cyan-500', icon: '🏆' },
    { label: 'Active Participants', value: participants.filter(p => p.status === 'Active').length, color: 'from-purple-500 to-pink-500', icon: '👥' },
    { label: 'Total Revenue', value: `$${revenue.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}`, color: 'from-green-500 to-emerald-500', icon: '💰' },
    { label: 'Avg Win Rate', value: '64.2%', color: 'from-orange-500 to-red-500', icon: '📈' },
  ];

  const tournamentData = {
    labels: tournaments.map(t => t.name),
    datasets: [
      {
        label: 'Participants',
        data: tournaments.map(t => t.participants),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const revenueData = {
    labels: revenue.map(r => r.month),
    datasets: [
      {
        label: 'Revenue ($)',
        data: revenue.map(r => r.amount),
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(76, 175, 80, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const participantDistribution = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [
          participants.filter(p => p.status === 'Active').length,
          participants.filter(p => p.status === 'Inactive').length,
        ],
        backgroundColor: [
          'rgba(76, 175, 80, 0.7)',
          'rgba(244, 67, 54, 0.7)',
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(244, 67, 54, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const registrationData = {
    labels: revenue.map(r => r.month),
    datasets: [
      {
        label: 'New Registrations',
        data: revenue.map(r => r.registrations),
        backgroundColor: 'rgba(156, 39, 176, 0.6)',
        borderColor: 'rgba(156, 39, 176, 1)',
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
          color: '#666',
          font: { size: 12, weight: 'bold' },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'tournaments', label: 'Tournaments', icon: '🏆' },
    { id: 'participants', label: 'Participants', icon: '👥' },
    { id: 'revenue', label: 'Revenue Analytics', icon: '💹' },
    { id: 'reports', label: 'Reports', icon: '📄' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-700 rounded w-24"></div>
        <div className="h-8 w-8 bg-gray-700 rounded"></div>
      </div>
      <div className="h-8 bg-gray-700 rounded w-32 mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-20"></div>
    </div>
  );

  const SkeletonChart = () => (
    <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg animate-pulse">
      <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
      <div className="h-64 bg-gray-700 rounded"></div>
    </div>
  );

  const SkeletonTable = () => (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg animate-pulse">
      <div className="p-4">
        <div className="h-4 bg-gray-700 rounded mb-4 w-full"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-950 shadow-2xl transition-all duration-300 fixed left-0 top-16 h-[calc(100vh-4rem)] border-r border-gray-800 z-40 overflow-y-auto md:top-0 md:h-screen`}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-bold bg-linear-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Admin Panel</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-xl hover:text-orange-500 transition hover:scale-104 hover:cursor-pointer">
            {sidebarOpen ? '⬅️' : '☰'}
          </button>
        </div>
        
        <nav className="mt-8 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 bg-gray-800 rounded-lg p-4">
          {sidebarOpen && (
            <div>
              <p className="text-xs text-gray-400 mb-2">Admin Account</p>
              <p className="text-sm font-bold">Admin User</p>
              <p className="text-xs text-gray-500">admin@tournament.com</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'md:ml-64' : 'md:ml-16'} transition-all duration-300 ml-0 w-full pt-15`}>
        {/* Header */}
        <div className="bg-gray-950 border-b border-gray-800 p-4 md:p-6  top-0 z-30">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-white mb-1">Tournament Management Dashboard</h1>
              <p className="text-gray-400 text-xs md:text-sm">Welcome back! Here's your tournament overview</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-4">
              <input type="date" className="bg-gray-800 border border-gray-700 rounded px-3 md:px-4 py-2 text-white text-xs md:text-sm" />
              <button className="bg-linear-to-r from-orange-500 to-red-500 px-4 md:px-6 py-2 rounded-lg font-bold hover:shadow-lg hover:shadow-orange-500/50 hover:scale-110 transition text-sm md:text-base">
                Export 📝
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Skeleton Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[...Array(4)].map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                  {/* Skeleton Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <SkeletonChart />
                    <SkeletonChart />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <SkeletonChart />
                    <SkeletonChart />
                  </div>
                </div>
              )}

              {(activeTab === 'tournaments' || activeTab === 'participants') && (
                <div className="space-y-6">
                  <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
                  <SkeletonTable />
                </div>
              )}

              {activeTab === 'revenue' && (
                <div className="space-y-6">
                  <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <SkeletonChart />
                    <SkeletonChart />
                  </div>
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg animate-pulse">
                        <div className="h-5 bg-gray-700 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
                        <div className="h-4 bg-gray-700 rounded w-24"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
                  <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg animate-pulse">
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-700 rounded w-40 mb-4"></div>
                      <div className="h-10 bg-gray-700 rounded mb-4"></div>
                      <div className="h-10 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 md:p-6 rounded-xl border border-gray-700 hover:border-orange-500 transition shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-400 text-xs md:text-sm font-semibold">{stat.label}</h3>
                      <span className="text-2xl md:text-3xl">{stat.icon}</span>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-green-400 text-xs mt-2">↑ 12% from last month</p>
                  </div>
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg">
                  <h2 className="text-lg md:text-xl font-bold mb-4 text-white">Tournament Participants Distribution</h2>
                  <Bar data={tournamentData} options={chartOptions} />
                </div>
                <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg">
                  <h2 className="text-lg md:text-xl font-bold mb-4 text-white">Participant Status</h2>
                  <Doughnut data={participantDistribution} options={chartOptions} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg">
                  <h2 className="text-lg md:text-xl font-bold mb-4 text-white">Revenue Trends</h2>
                  <Line data={revenueData} options={chartOptions} />
                </div>
                <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg">
                  <h2 className="text-lg md:text-xl font-bold mb-4 text-white">Monthly Registrations</h2>
                  <Bar data={registrationData} options={chartOptions} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tournaments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-xl md:text-2xl font-bold">Tournament Management</h2>
                <button className="bg-gradient-to-r from-orange-500 to-red-500 px-4 md:px-6 py-2 rounded-lg font-bold hover:shadow-lg transition text-sm md:text-base">
                  + New Tournament
                </button>
              </div>
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-x-auto shadow-lg">
                <table className="w-full text-xs md:text-sm">
                  <thead className="bg-gray-900 border-b border-gray-700">
                    <tr>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300">Tournament Name</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300">Participants</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300 hidden sm:table-cell">Prize Pool</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300">Status</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300 hidden md:table-cell">Date</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300 hidden lg:table-cell">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tournaments.map((t, idx) => (
                      <tr key={t.id} className={idx % 2 === 0 ? 'bg-gray-750' : 'bg-gray-800'}>
                        <td className="px-3 md:px-6 py-3 md:py-4 font-semibold text-white">{t.name}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-gray-300">{t.participants}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 font-bold text-green-400 hidden sm:table-cell">${t.prize.toLocaleString()}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold ${
                            t.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                            t.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-gray-300 hidden md:table-cell text-xs md:text-sm">{t.date}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 space-x-1 md:space-x-2 hidden lg:table-cell">
                          <button className="text-blue-400 hover:text-blue-300 font-bold text-xs md:text-sm">Edit</button>
                          <button className="text-red-400 hover:text-red-300 font-bold text-xs md:text-sm">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'participants' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-xl md:text-2xl font-bold">Participant Management</h2>
                <input type="text" placeholder="Search participants..." className="bg-gray-800 border border-gray-700 rounded px-3 md:px-4 py-2 text-white text-xs md:text-sm focus:border-orange-500 outline-none w-full sm:w-auto" />
              </div>
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-x-auto shadow-lg">
                <table className="w-full text-xs md:text-sm">
                  <thead className="bg-gray-900 border-b border-gray-700">
                    <tr>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300">Name</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300 hidden sm:table-cell">Email</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300">Tournaments</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300">Win Rate</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300 hidden md:table-cell">Status</th>
                      <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300 hidden lg:table-cell">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((p, idx) => (
                      <tr key={p.id} className={idx % 2 === 0 ? 'bg-gray-750' : 'bg-gray-800'}>
                        <td className="px-3 md:px-6 py-3 md:py-4 font-semibold text-white">{p.name}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-gray-300 hidden sm:table-cell">{p.email}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-gray-300">{p.tournaments}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <div className="flex items-center space-x-1 md:space-x-2">
                            <div className="w-12 md:w-16 bg-gray-700 rounded-full h-2">
                              <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{width: `${p.winRate}%`}}></div>
                            </div>
                            <span className="text-xs md:text-sm font-bold text-orange-400 whitespace-nowrap">{p.winRate}%</span>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 hidden md:table-cell">
                          <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold ${
                            p.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 space-x-1 md:space-x-2 hidden lg:table-cell">
                          <button className="text-blue-400 hover:text-blue-300 font-bold text-xs md:text-sm">View</button>
                          <button className="text-red-400 hover:text-red-300 font-bold text-xs md:text-sm">Ban</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-bold">Revenue Analytics</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg">
                  <h3 className="text-lg md:text-xl font-bold mb-4 text-white">Monthly Revenue</h3>
                  <Line data={revenueData} options={chartOptions} />
                </div>
                <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg">
                  <h3 className="text-lg md:text-xl font-bold mb-4 text-white">Registration Growth</h3>
                  <Bar data={registrationData} options={chartOptions} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-bold">Reports & Analytics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 hover:border-orange-500 transition cursor-pointer shadow-lg">
                  <h3 className="text-base md:text-lg font-bold mb-2">Tournament Performance</h3>
                  <p className="text-gray-400 mb-4 text-xs md:text-sm">Detailed analysis of all tournaments</p>
                  <button className="text-orange-500 font-bold hover:text-orange-400 text-sm">Generate Report →</button>
                </div>
                <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 hover:border-orange-500 transition cursor-pointer shadow-lg">
                  <h3 className="text-base md:text-lg font-bold mb-2">Player Statistics</h3>
                  <p className="text-gray-400 mb-4 text-xs md:text-sm">In-depth player performance metrics</p>
                  <button className="text-orange-500 font-bold hover:text-orange-400 text-sm">Generate Report →</button>
                </div>
                <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 hover:border-orange-500 transition cursor-pointer shadow-lg">
                  <h3 className="text-base md:text-lg font-bold mb-2">Financial Summary</h3>
                  <p className="text-gray-400 mb-4 text-xs md:text-sm">Complete revenue and expense breakdown</p>
                  <button className="text-orange-500 font-bold hover:text-orange-400 text-sm">Generate Report →</button>
                </div>
                <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 hover:border-orange-500 transition cursor-pointer shadow-lg">
                  <h3 className="text-base md:text-lg font-bold mb-2">User Engagement</h3>
                  <p className="text-gray-400 mb-4 text-xs md:text-sm">Participant activity and engagement data</p>
                  <button className="text-orange-500 font-bold hover:text-orange-400 text-sm">Generate Report →</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-bold">Settings & Configuration</h2>
              <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg space-y-6">
                <div>
                  <h3 className="text-base md:text-lg font-bold mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs md:text-sm font-bold mb-2">Platform Name</label>
                      <input type="text" defaultValue="Gold_Pearl Tournament" className="w-full bg-gray-900 border border-gray-700 rounded px-3 md:px-4 py-2 text-white text-xs md:text-sm focus:border-orange-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-bold mb-2">Admin Email</label>
                      <input type="email" defaultValue="admin@tournament.com" className="w-full bg-gray-900 border border-gray-700 rounded px-3 md:px-4 py-2 text-white text-xs md:text-sm focus:border-orange-500 outline-none" />
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <button className="bg-gradient-to-r from-orange-500 to-red-500 px-4 md:px-6 py-2 rounded-lg font-bold hover:shadow-lg transition text-sm md:text-base">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;