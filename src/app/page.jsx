import Main from './Components/Main';


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
   <Main/>
  );
}