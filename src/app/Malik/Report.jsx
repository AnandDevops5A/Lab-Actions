"use client"
import React from 'react'

const Report = () => {
  return (
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
  )
}

export default Report
