"use client"
import React from 'react'

const Settings = () => {
  return (
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
                      <button className="bg-linear-to-r from-orange-500 to-red-500 px-4 md:px-6 py-2 rounded-lg font-bold hover:shadow-lg transition text-sm md:text-base">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
  )
}

export default Settings
