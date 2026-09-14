import Link from 'next/link'
import Rank from './rank'

const FEATURES = [
  { icon: '🏆', label: 'Track Top 100 Players' },
  { icon: '📊', label: 'In-Depth Match Analysis' },
  { icon: '📈', label: 'ELO and Rank History' },
]

const Stats = () => {
  return (
    <section id="leaderboard" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="autoblur">
          <h2 className="text-4xl font-bold mb-6 text-neon-red uppercase">
            Global Domination Starts Here
          </h2>

          <p className="text-lg text-gray-400 mb-6">
            See real-time stats, track the top players and teams, and analyze
            match data. Our transparent, real-time leaderboard ensures you
            always know where you stand against the best in India.
          </p>

          <ul className="space-y-4 mb-8">
            {FEATURES.map(({ icon, label }) => (
              <li
                key={label}
                className="flex items-center text-xl font-medium text-slate-100"
              >
                <span className="text-neon-blue mr-3" aria-hidden="true">
                  {icon}
                </span>
                {label}
              </li>
            ))}
          </ul>

          <Link
            href="/leaderboard"
            className="border border-neon-red text-neon-red hover:bg-neon-red/10 px-8 py-3 rounded-lg font-bold transition duration-300 uppercase tracking-widest"
          >
            View Full Leaderboard
          </Link>
        </div>

        <Rank />
      </div>
    </section>
  )
}

export default Stats