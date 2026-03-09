"use client";
import dynamic from "next/dynamic";
import React, { useContext } from "react";
import image from "../../../app/images/image.jpg";
import { BannerSkeleton, SkeletonCard, SkeletonTable } from "../../../app/skeleton/Skeleton";
import { ThemeContext } from "../../../lib/contexts/theme-context";

import HeroSection from "../tournaments/hero-section";
import CyberLoading from "@/app/skeleton/CyberLoading";

// Optimizing with dynamic imports for below-the-fold content to reduce initial bundle size
const UpcomingMatches = dynamic(() => import("@/components/ui/upcoming-matches"), {
  loading: () => (
    <div className="container mx-auto px-4 py-12">
      <SkeletonTable />
    </div>
  ),
});

const BannerSection = dynamic(() => import("./Banner"), {
  loading: () => <BannerSkeleton />,
});

const WinnerSection = dynamic(() => import("@/components/ui/winner"), {
  loading: () => (
    <div className="py-12">
      <SkeletonTable />
    </div>
  ),
});

const Stats = dynamic(() => import("@/components/ui/stats"), {
  loading: () => (
    <div className="py-12">
      <SkeletonTable />
    </div>
  ),
});

const ContactPage = dynamic(() => import("./contact-page"), {
  loading: () => (
    <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/2"><SkeletonCard /></div>
      <div className="w-full md:w-1/2"><SkeletonCard /></div>
    </div>
  ),
});

const Footer = dynamic(() => import("../../layout/footer"), {
  loading: () => <SkeletonTable />,
  ssr: false,
  // Optional: A fallback UI while loading
  // Optional: Set to false if the component must ONLY run on the client
});

const Main = () => {
  const themeContext = useContext(ThemeContext);
  const { isDarkMode } = themeContext || { isDarkMode: true };

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
          {/* 1. Banner Section (Dynamic & Engaging) */}
        <BannerSection />
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
