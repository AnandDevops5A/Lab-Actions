"use client";
import dynamic from "next/dynamic";
import React, { useContext, useEffect } from "react";
import image from "../../../app/images/image.jpg";
import { SkeletonCard, SkeletonTable } from "../../../app/skeleton/Skeleton";
import { ThemeContext } from "../../../lib/contexts/theme-context";

import { setUpcomingTournamentCache } from "../../../lib/utils/common";
import HeroSection from "../tournaments/hero-section";
import UpcomingMatches from "@/components/ui/upcoming-matches";
import WinnerSection from "@/components/ui/winner";
import Stats from "@/components/ui/stats";
import ContactPage from "./contact-page";
// import Footer from "@/components/layout/footer";

// const WinnerSection = dynamic(() => import("../../ui/winner"), {
//   loading: () => <SkeletonTable />, // Optional: A fallback UI while loading
//   ssr: false, // Optional: Set to false if the component must ONLY run on the client
// });

// const ContactPage = dynamic(() => import("./contact-page"), {
//   loading: () => (
//     <div className="gap-4">
//       <SkeletonCard />
//       <SkeletonCard />
//     </div>
//   ), // Optional: A fallback UI while loading
//   ssr: false, // Optional: Set to false if the component must ONLY run on the client
// });

// const Stats = dynamic(() => import("../../ui/stats"), {
//   loading: () => <SkeletonTable />, // Optional: A fallback UI while loading
//   ssr: false, // Optional: Set to false if the component must ONLY run on the client
// });

const Footer = dynamic(() => import("../../layout/footer"), {
  loading: () => <SkeletonTable />,
  ssr: false,
  // Optional: A fallback UI while loading
  // Optional: Set to false if the component must ONLY run on the client
});

const Main = () => {
  const themeContext = useContext(ThemeContext);
  const { isDarkMode } = themeContext || { isDarkMode: true };

  // const [upcomingTournament, setUpcomingTournament] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setUpcomingTournamentCache();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        isDarkMode ? "bg-gray-950 text-slate-100" : "bg-blue-50 text-gray-900"
      }`}
    >
      <main>
        {/* 2. Hero Section (High Conversion Focus) */}
        <HeroSection image1={image} />
        {/* 3. Upcoming Tournaments Section */}
        {/* <ActiveTournaments /> */}
        <UpcomingMatches/>
        {/*4. Winner section*/}
        <WinnerSection />
        {/* 5. Leaderboard & Stats Section (Engaging Data) */}
        <Stats />
        {/*6. contact section*/}
        <ContactPage />
        {/* 7. Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Main;
