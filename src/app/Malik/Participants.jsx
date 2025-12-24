import React from 'react'

const Participants = ({participants}) => {
  return (
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
                              <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300">Call-Sign</th>
                              <th className="px-3 md:px-6 py-3 md:py-4 text-left font-bold text-gray-300">Attained</th>
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
                                <td className="px-3 md:px-6 py-3 md:py-4 text-gray-300">{p.contact}</td>
                                <td className="px-3 md:px-6 py-3 md:py-4">
                                  <div className="flex items-center space-x-1 md:space-x-2">
                                    <div className="w-12 md:w-16 bg-gray-700 rounded-full h-2">
                                      <div className="bg-linear-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: `${p.winRate}%` }}></div>
                                    </div>
                                    <span className="text-xs md:text-sm font-bold text-orange-400 whitespace-nowrap">{p.winRate}%</span>
                                  </div>
                                </td>
                                <td className="px-3 md:px-6 py-3 md:py-4 hidden md:table-cell">
                                  <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold ${p.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {p.status}
                                  </span>
                                </td>
                                {/* <td className="px-3 md:px-6 py-3 md:py-4 space-x-1 md:space-x-2 hidden lg:table-cell">
                                  <button className="text-blue-400 hover:text-blue-300 font-bold text-xs md:text-sm">View</button>
                                  <button className="text-red-400 hover:text-red-300 font-bold text-xs md:text-sm">Ban</button>
                                </td> */}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
  )
}

export default Participants
