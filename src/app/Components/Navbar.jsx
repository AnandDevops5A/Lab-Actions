// components/Navbar.jsx

'use client'; // Use client components for interactive elements like the button click state

import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Tournaments', href: '#tournaments' },
    { name: 'Leaderboard', href: '#leaderboard' },
    { name: 'Teams', href: '#teams' },
    { name: 'News', href: '#news' },
  ];

  return (
    <nav className="bg-black/80 backdrop-blur-sm fixed w-full z-50 shadow-lg border-b border-neon-blue/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Platform Name */}
          <Link href="/" className="flex-shrink-0 text-2xl font-extrabold text-neon-blue tracking-wider">
            BGMI ELITE
          </Link>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:space-x-8 items-center">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className="text-gray-300 hover:text-neon-red px-3 py-2 text-sm font-medium transition duration-200">
                {item.name}
              </Link>
            ))}
            
            {/* Desktop Auth Buttons */}
            <div className="flex space-x-3 ml-6">
              <button className="text-white border border-neon-blue hover:bg-neon-blue/20 px-4 py-1.5 rounded text-sm font-semibold transition duration-200">
                Login
              </button>
              <button className="bg-neon-red hover:bg-neon-red/80 text-white px-4 py-1.5 rounded text-sm font-bold transition duration-200 shadow-neon-red/50 shadow-md">
                Sign Up
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neon-red">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="md:hidden bg-black/90">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)} className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium">
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-3 pt-4 px-3">
              <button className="text-white border border-neon-blue hover:bg-neon-blue/20 px-4 py-2 rounded text-base font-semibold transition duration-200">
                Login
              </button>
              <button className="bg-neon-red hover:bg-neon-red/80 text-white px-4 py-2 rounded text-base font-bold transition duration-200 shadow-neon-red/50 shadow-md">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;