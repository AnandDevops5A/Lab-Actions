"use client"
import React from 'react'
import { Bar, Line } from 'react-chartjs-2'

const Revenue = ({revenueData,registrationData,chartOptions}) => {
  return (
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
  )
}

export default Revenue
