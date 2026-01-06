'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useContext } from 'react';
import { useState, useEffect } from 'react';
import { UserContext } from '../Library/ContextAPI';
import { successMessage } from '../Library/Alert';
import { LogoutButton } from './LogoutButton';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, getUserFromContext } = useContext(UserContext);

  const navItems = [
    { name: 'Review', href: '/review' },
    { name: 'leaderboard', href: '/Leaderboard' },
    { name: 'Admin', href: '/Malik' },
    { name: user ?'My Profile':'Register', href: user ? '/player' : '/authorization' }
  ];
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastscrollX, setLastscrollX] = useState(0);
  // {const [scrollTimeout, setScrollTimeout] = useState(null);}

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastscrollX && currentScrollY > 50) {
        // scrolling down → hide navbar
        setShowNavbar(false);
      } else {
        // scrolling up → show navbar
        setShowNavbar(true);
      }

      setLastscrollX(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastscrollX]);
  const searchParams = useSearchParams();
  const scrollTarget = searchParams.get('scroll');
  

  useEffect(() => {
    if (scrollTarget === 'leaderboard') {
      const timer = setTimeout(() => {
        if (typeof window !== "undefined") {
          const element = document.getElementById('leaderboard');
          if (element) {
            const yOffset = 60;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({
              top: y,
              behavior: 'smooth'
            });
          }
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [scrollTarget]);

  useEffect(() => {
    // By chance if user refresh page
    // On component mount, check if user data is in context; if not, try to get from cache
    const fetchUserData = async () => {
      if (!user) {
         await getUserFromContext();
      }
    };
    fetchUserData();
  }, [user]);


  return (
    showNavbar ?
      <nav
        className={` bg-black/80 backdrop-blur-sm fixed w-full z-50 shadow-lg border-b border-neon-blue/20 transition-all duration-300 ease-out animate-navbarSlideIn ${showNavbar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`} role="navigation"
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Platform Name */}
            <Link
              href="/"
              className="shrink-0 flex items-center space-x-2"
              aria-label="BGMI Elite Home"
            >
              <div className="h-10 w-10 bg-linear-to-br from-red-600 via-orange-600 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50">
                <Image src="/gun.svg" alt="Pearl Esports Logo"
                  width={40}
                  height={40}
                  className="h-6 w-6 filter brightness-0 invert" />
              </div>
              <span className="text-2xl font-extrabold bg-linear-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent tracking-wider">Gold_Pearl</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex md:space-x-8 items-center">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.name === "leaderboard" ? "/?scroll=leaderboard" : item.href}
                  className={`text-gray-300 hover:text-neon-red px-3 py-2 text-sm font-medium transition duration-200 border-l-2 border-r-2 border-transparent hover:border-l-neon-red hover:border-r-neon-red ${item.name !== "leaderboard" ? "focus:cursor-none" : ""
                    }`}                >
                  {item.name}
                </Link>
              ))}
              {/* logout button cyberpunk style */}
              {user ? <LogoutButton /> : null}

            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neon-red"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {
          isOpen && (
            <div id="mobile-menu" className="md:hidden bg-black/90 animate-slideDown">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
                {/* logout button for side style cyber punk */}
                {user ? <LogoutButton /> : null}

              </div>
            </div>
          )
        }
      </nav > : null
  );
};

export default Navbar;
