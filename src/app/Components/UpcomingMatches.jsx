import React from 'react'

const UpcomingMatches = () => {

    // Example data for the Tournaments section
  const upcomingTournaments = [
    { name: "BGMI King's Cup", date: 'Dec 15', prize: '₹10 Lakh', teams: 32 },
    { name: "Solo Survivor Series", date: 'Jan 05', prize: '₹2 Lakh', teams: 'Open' },
    { name: "Clash of Squads Pro", date: 'Feb 10', prize: '₹5 Lakh', teams: 16 },
  ];

  return (
    <section id="tournaments" className="py-20 bg-gray-900 border-t border-b border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className=" text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-12 text-red-500 uppercase tracking-wide autoblur">
              🔥 Upcoming Tournaments
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingTournaments.map((tournament, index) => (
                <div key={index} className="fadeup bg-gray-950 p-6 rounded-xl border border-gray-700 hover:border-red-300 transition duration-300 shadow-xs shadow-purple-400 hover:shadow-md hover:shadow-purple-600 hover:scale-105">
                  <h3 className="text-3xl font-extrabold text-white/85 mb-2 autoblur">{tournament.name}</h3>
                  <p className="text-fuchsia-500/80 font-bold mb-4 text-xl autoblur">{tournament.prize} Prize Pool</p>
                  <div className="space-y-2 text-gray-300">
                    <p className="flex items-center"><span className="text-neon-blue mr-2">📅</span> Date: **{tournament.date}**</p>
                    <p className="flex items-center"><span className="text-neon-blue mr-2">👥</span> Teams: **{tournament.teams}**</p>
                  </div>
                  <button className="mt-6 w-full bg-neutral-900  text-white/50 hover:text-white py-2 rounded font-semibold transition
                   duration-300  hover:scale-102 shadow-xs shadow-purple-400 hover:shadow-md hover:shadow-purple-600 cursor-pointer">
                    Register Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

  )
}

export default UpcomingMatches
