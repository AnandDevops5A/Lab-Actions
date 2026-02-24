
import dynamic from "next/dynamic";
import CyberLoading from "./skeleton/CyberLoading";

// SEO Metadata (Next.js 13+ App Router)
export const metadata = {
  title: "BGMI Elite - The Premier Esports Gaming Platform",
  description:
    "Join the ultimate Battlegrounds Mobile India (BGMI) esports experience. Compete in high-stakes tournaments, climb the global leaderboard, and go pro!",
  keywords: [
    "BGMI",
    "Esports",
    "Gaming Platform",
    "Battlegrounds Mobile India",
    "Tournaments",
    "Leaderboard",
    "Pro Gaming",
    "Competitive Gaming",
    "Gaming Community",
    "Esports Events",
    "Play BGMI",
    "BGMI Esports",
    "BGMI Tournament",
    "Play and wind",
    
  ],
  openGraph: {
    title: "BGMI Elite - The Premier Esports Gaming Platform",
    description:
      "Compete in high-stakes tournaments, climb the global leaderboard, and go pro!",
    url: process.env.FRONTEND_URL,
    type: "website",
  },
};

const Main = dynamic(() => import("../components/features/home/main"), {
  loading: () => <CyberLoading />, // Optional fallback UI
  // ssr: false, // Optional: disable server-side rendering
});

// Main Page Component
export default function LandingPage() {
  return <Main />;
}



