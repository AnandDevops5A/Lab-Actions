'use client';

import React, { useContext } from 'react';
import { ThemeContext } from '../../lib/contexts/theme-context';
import { MoonStar, Sun } from 'lucide-react';

export const ThemeToggle = () => {
  const themeContext = useContext(ThemeContext);
  const { isDarkMode, toggleTheme } = themeContext || { isDarkMode: true, toggleTheme: () => {} };

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 font-semibold text-sm ${
        isDarkMode
          ? 'bg-linear-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-yellow-400 shadow-lg shadow-yellow-500/20 border border-gray-700'
          : 'bg-linear-to-br from-blue-400 to-blue-500 hover:from-blue-300 hover:to-blue-400 text-white shadow-lg shadow-blue-400/30 border border-blue-300'
      }`}
      aria-label="Toggle theme"
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDarkMode ? (
        // Moon icon for dark mode
       <span
         className=" text-3xl transition-transform duration-300 hover:scale-110 bg-slate-800 rounded-full p-1 shadow-xs shadow-white"
        >
          
         <Sun />
          </span>
      ) : (
        // Sun icon for light mode
        
        <span
         className=" text-3xl transition-transform duration-300 hover:scale-110 bg-sky-200 rounded-full p-1 shadow-xs shadow-amber-100/30"
        >
           <MoonStar />
        </span>
      )}
    </button>
  );
};



