import React from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'

const Overview = ({tournaments, participants, revenue,
  // tournamentData, 
    chartOptions,revenueData,registrationData}) => {
     const stats = [
    { label: 'Total Tournaments', value: tournaments.length, color: 'from-blue-500 to-cyan-500', icon: '🏆' },
    { label: 'Active Participants', value: participants.filter(p => p.status === 'Active').length, color: 'from-purple-500 to-pink-500', icon: '👥' },
    { label: 'Total Revenue', value: `₹${revenue.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}`, color: 'from-green-500 to-emerald-500', icon: '💰' },
    { label: 'Avg Win Rate', value: '64.2%', color: 'from-orange-500 to-red-500', icon: '📈' },
  ];

  const participantDistribution = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [
          participants.filter(p => p.active === true).length,
          participants.filter(p => p.active === false).length,
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
  return (
    <div className="space-y-8">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, idx) => (
                      <div key={idx} className="bg-linear-to-br from-gray-800 to-gray-900 p-4 md:p-6 rounded-xl border border-gray-700 hover:border-orange-500 transition shadow-lg">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg">
                      <h2 className="text-lg md:text-xl font-bold mb-4 text-white">Tournament Participants Distribution</h2>
                      {/* <Bar data={tournamentData} options={chartOptions} /> */}
                    </div>
                    <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg">
                      <h2 className="text-lg md:text-xl font-bold mb-4 text-white">Participant Status</h2>
                      <Doughnut data={participantDistribution} options={chartOptions} />
                    </div>
                    {/* </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6"> */}
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
  )
}

export default Overview
