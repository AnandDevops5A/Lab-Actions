// app/page.jsx

import Image from 'next/image';
import Link from 'next/link';
import Navbar from './Components/Navbar';
import image1 from './images/image.jpg';
import image2 from './images/image2.jpg';
import Footer from './Components/Footer';



// SEO Metadata (Next.js 13+ App Router)
export const metadata = {
  title: 'BGMI Elite - The Premier Esports Gaming Platform',
  description: 'Join the ultimate Battlegrounds Mobile India (BGMI) esports experience. Compete in high-stakes tournaments, climb the global leaderboard, and go pro!',
  keywords: ['BGMI', 'Esports', 'Gaming Platform', 'Battlegrounds Mobile India', 'Tournaments', 'Leaderboard', 'Pro Gaming'],
  openGraph: {
    title: 'BGMI Elite - The Premier Esports Gaming Platform',
    description: 'Compete in high-stakes tournaments, climb the global leaderboard, and go pro!',
    url: 'https://localhost:3000',
    type: 'website',
  },
};


// Main Page Component
export default function LandingPage() {
  
  // Example data for the Tournaments section
  const upcomingTournaments = [
    { name: "BGMI King's Cup", date: 'Dec 15', prize: '₹10 Lakh', teams: 32 },
    { name: "Solo Survivor Series", date: 'Jan 05', prize: '₹2 Lakh', teams: 'Open' },
    { name: "Clash of Squads Pro", date: 'Feb 10', prize: '₹5 Lakh', teams: 16 },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans antialiased">
      
      {/* 1. Navigation Bar */}
      <Navbar />

      <main>
        
        {/* 2. Hero Section (High Conversion Focus) */}
        <section className="relative h-[90vh]  flex items-center justify-center pt-16" id="hero">
          {/* Background Image with Next.js Image for optimization */}
          <Image
            src={image1}
            alt="BGMI Pro Player in Action - High Quality"
            fill
            style={{ objectFit: 'cover' }}
            priority={true} // High priority for LCP (Largest Contentful Paint)
            className="opacity-20 saturate-150 top-10"
          />

          {/* Hero Content */}
          <div className="relative z-10 text-center max-w-4xl px-4">
            <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tight text-white drop-shadow-lg leading-tight">
              THE <span className="text-neon-red">BATTLEGROUND </span> AWAITS 
  {/* Assuming you want an actual image tag here with alt text */}
  <img src="/gun-svgrepo-com.svg" alt="Gun icon" className="inline ml-4 h-15 w-15 bg-cyan-600 rounded-full" />


            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Dominate the Indian Esports scene. Compete in **official BGMI tournaments**, climb the ranks, and earn your legacy.
            </p>
            
            {/* Primary Call to Action */}
            <div className="flex justify-center space-x-6">
              <Link href="#tournaments" className="bg-neon-red hover:bg-neon-red/80 text-white text-lg px-10 py-3 rounded-lg font-bold transition duration-300 shadow-2xl shadow-neon-red/50 uppercase tracking-widest">
                Join Tournament 🥷
              </Link>
              <button className="border border-neon-blue text-neon-blue hover:bg-neon-blue/10 text-lg px-10 py-3 rounded-lg font-bold transition duration-300 uppercase tracking-widest">
                Watch Live 🖥️
              </button>
            </div>
          </div>
        </section>

        {/* 3. Upcoming Tournaments Section */}
        <section id="tournaments" className="py-20 bg-gray-900 border-t border-b border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-neon-blue uppercase tracking-wide">
              🔥 Upcoming Tournaments
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        
        {/* 4. Leaderboard & Stats Section (Engaging Data) */}
        <section id="leaderboard" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl font-bold mb-6 text-neon-red uppercase">
                Global Domination Starts Here
              </h2>
              <p className="text-lg text-gray-400 mb-6">
                See real-time stats, track the top players and teams, and analyze match data. Our transparent, real-time leaderboard ensures you always know where you stand against the best in India.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-xl font-medium text-white"><span className="text-neon-blue mr-3">🏆</span> Track Top 100 Players</li>
                <li className="flex items-center text-xl font-medium text-white"><span className="text-neon-blue mr-3">📊</span> In-Depth Match Analysis</li>
                <li className="flex items-center text-xl font-medium text-white"><span className="text-neon-blue mr-3">📈</span> ELO and Rank History</li>
              </ul>
              
              <Link href="/leaderboard" className="border border-neon-red text-neon-red hover:bg-neon-red/10 px-8 py-3 rounded-lg font-bold transition duration-300 uppercase tracking-widest">
                View Full Leaderboard
              </Link>
            </div>
            
            {/* Image block for visual appeal - uses Next.js Image */}
            <div className="order-1 lg:order-2 rounded-xl overflow-hidden shadow-2xl shadow-gray-700/50">
              <Image
                src={image2}
                alt="BGMI Leaderboard and Stats Panel"
                width={700}
                height={450}
                layout="responsive"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            
          </div>
        </section>

        <Footer/>
      </main>
      
    </div>
  );
}