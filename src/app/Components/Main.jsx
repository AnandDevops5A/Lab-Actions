'use client';
import dynamic from 'next/dynamic';
import React from 'react'
import image from '../images/image.jpg'
import HeroSection from './HeroSection';
import UpcomingMatches from './UpcomingMatches';
import WinnerSection from './Winner';
import Stats from './Stats';
import ContactPage from './ContactPage';
import Footer from './Footer';

// const HeroSection = dynamic(() =>
//   import('./HeroSection'),
//   {
//     loading: () => <h2 className='text-center text-emerald-500 m-auto'>Hangon please...</h2>, // Optional: A fallback UI while loading
//     // ssr: false, 
//     // Optional: Set to false if the component must ONLY run on the client
//   }
// );

// const UpcomingMatches = dynamic(() =>
//   import('./UpcomingMatches'),
//   {
//     loading: () => <h2 className='text-center text-emerald-500 m-36'>Hangon please...</h2>, // Optional: A fallback UI while loading
//     ssr: false, // Optional: Set to false if the component must ONLY run on the client
//   }
// );

// const WinnerSection = dynamic(() =>
//   import('./Winner'),
//   {
//     loading: () => <h2 className='text-center text-emerald-500 m-36'>Hangon please...</h2>, // Optional: A fallback UI while loading
//     ssr: false, // Optional: Set to false if the component must ONLY run on the client
//   }
// );

// const ContactPage = dynamic(() => 
//   import('./ContactPage'), 
//   {
//     loading: () => <h2 className='text-center text-emerald-500 m-36'>Hangon please...</h2>, // Optional: A fallback UI while loading
//     ssr: false, // Optional: Set to false if the component must ONLY run on the client
//   }
// );

// const Stats = dynamic(() =>
//   import('./Stats'),
//   {
//     loading: () => <h2 className='text-center text-emerald-500 m-36'>Hangon please...</h2>, // Optional: A fallback UI while loading
//     ssr: false, // Optional: Set to false if the component must ONLY run on the client
//   }
// );

// const Footer = dynamic(() =>
//   import('./Footer.jsx'),
//   {
//     loading: () => <h2 className='text-center text-emerald-500 m-36'>Hangon please...</h2>, // Optional: A fallback UI while loading
//     // Optional: Set to false if the component must ONLY run on the client
//   }
// );
const Main = () => {
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
  )
}

export default Main
