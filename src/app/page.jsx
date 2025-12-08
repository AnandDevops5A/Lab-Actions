// app/page.jsx

import HeroSection from './Components/HeroSection';
import Footer from './Components/Footer';
import Stats from './Components/Stats';
import UpcomingMatches from './Components/UpcomingMatches';
import WinnerSection from './Components/Winner';
import ContactPage from './Components/ContactPage';
import image from './images/image.jpg'


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


  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans antialiased scrollbar-hide">



      <main>

        {/* 2. Hero Section (High Conversion Focus) */}
        <HeroSection image1={image} />

        {/* 3. Upcoming Tournaments Section */}

        <UpcomingMatches />

        {/*4. Winner section*/}
        <WinnerSection />

        {/* 5. Leaderboard & Stats Section (Engaging Data) */}
        <Stats />


        {/*6. contact section*/}
        <ContactPage />


        {/* 6. footer section Section (Engaging Data) */}
        <Footer />
      </main>

    </div>
  );
}