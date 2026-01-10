'use client';
import dynamic from 'next/dynamic';
import React, { useContext } from 'react'
import image from '../images/image.jpg'
import { SkeletonCard, SkeletonTable } from '../skeleton/Skeleton';
import { ThemeContext } from '../Library/ThemeContext';


const HeroSection = dynamic(() =>
  import('./HeroSection'),
  {
    loading: () =>
      <SkeletonTable />
    // ssr: false, 
    // Optional: Set to false if the component must ONLY run on the client
  }
);

// const Herosection=React.lazy(()=>import('./HeroSection'))
const UpcomingMatches = dynamic(() =>
  import('./UpcomingMatches'),
  {
    loading: () => {
      <div className='gap-4'>
      <SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
    },
    ssr: false, // Optional: Set to false if the component must ONLY run on the client
  }
);


const WinnerSection = dynamic(() =>
  import('./Winner'),
  {
    loading: () => <SkeletonTable />, // Optional: A fallback UI while loading
    ssr: false, // Optional: Set to false if the component must ONLY run on the client
  }
);

const ContactPage = dynamic(() =>
  import('./ContactPage'),
  {
    loading: () => {
      <div className='gap-4'>
      <SkeletonCard /><SkeletonCard /></div>
    }, // Optional: A fallback UI while loading
    ssr: false, // Optional: Set to false if the component must ONLY run on the client
  }
);

const Stats = dynamic(() =>
  import('./Stats'),
  {
    loading: () => <SkeletonTable />, // Optional: A fallback UI while loading
    ssr: false, // Optional: Set to false if the component must ONLY run on the client
  }
);


const Footer = dynamic(() =>
  import('./Footer.jsx'),
  {
    loading: () => <SkeletonTable />, 
    ssr: false
    // Optional: A fallback UI while loading
    // Optional: Set to false if the component must ONLY run on the client
  }
);
const Main = () => {
  const themeContext = useContext(ThemeContext);
  const { isDarkMode } = themeContext || { isDarkMode: true };

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gray-950 text-white'
        : 'bg-blue-50 text-gray-900'
    }`}>
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
      </main>
    </div>
  );
}

export default Main
