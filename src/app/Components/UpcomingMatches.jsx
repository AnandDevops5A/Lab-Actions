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
            <h2 className="text-4xl font-bold text-center mb-12 text-neon-blue uppercase tracking-wide">
              🔥 Upcoming Tournaments
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingTournaments.map((tournament, index) => (
                <div key={index} className="bg-gray-950 p-6 rounded-xl border border-gray-700 hover:border-neon-red transition duration-300 shadow-xl">
                  <h3 className="text-3xl font-extrabold text-white mb-2">{tournament.name}</h3>
                  <p className="text-neon-red font-bold mb-4 text-xl">{tournament.prize} Prize Pool</p>
                  <div className="space-y-2 text-gray-300">
                    <p className="flex items-center"><span className="text-neon-blue mr-2">📅</span> Date: **{tournament.date}**</p>
                    <p className="flex items-center"><span className="text-neon-blue mr-2">👥</span> Teams: **{tournament.teams}**</p>
                  </div>
                  <button className="mt-6 w-full bg-neon-red hover:bg-neon-red/80 text-white py-2 rounded font-semibold transition duration-300 ">
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
