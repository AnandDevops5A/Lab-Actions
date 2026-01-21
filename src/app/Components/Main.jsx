"use client";
import dynamic from "next/dynamic";
import React, { useContext, useState, useEffect } from "react";
import image from "../images/image.jpg";
import { SkeletonCard, SkeletonTable } from "../skeleton/Skeleton";
import { ThemeContext } from "../Library/ThemeContext";
import HeroSection from "./HeroSection";
import UpcomingMatches from "./UpcomingMatches";
import { useFetchBackendAPI } from "../Library/API";
import { errorMessage, successMessage } from "../Library/Alert";
import { getCache, setCache, UpdateCache } from "../Library/ActionRedis";
import { setUpcomingTournamentCache } from "../Library/common";

const WinnerSection = dynamic(() => import("./Winner"), {
  loading: () => <SkeletonTable />, // Optional: A fallback UI while loading
  ssr: false, // Optional: Set to false if the component must ONLY run on the client
});

const ContactPage = dynamic(() => import("./ContactPage"), {
  loading: () => {
    <div className="gap-4">
      <SkeletonCard />
      <SkeletonCard />
    </div>;
  }, // Optional: A fallback UI while loading
  ssr: false, // Optional: Set to false if the component must ONLY run on the client
});

const Stats = dynamic(() => import("./Stats"), {
  loading: () => <SkeletonTable />, // Optional: A fallback UI while loading
  ssr: false, // Optional: Set to false if the component must ONLY run on the client
});

const Footer = dynamic(() => import("./Footer.jsx"), {
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
        isDarkMode ? "bg-gray-950 text-white" : "bg-blue-50 text-gray-900"
      }`}
    >
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
        {/* 7. Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Main;
