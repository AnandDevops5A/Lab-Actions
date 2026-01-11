'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useContext, useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { UserContext } from '../Library/ContextAPI';
import { successMessage } from '../Library/Alert';
import { LogoutButton } from './LogoutButton';
import ThemeToggle from './ThemeToggle';
import { ThemeContext } from '../Library/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, getUserFromContext } = useContext(UserContext);
  const themeContext = useContext(ThemeContext);
  const { isDarkMode } = themeContext || { isDarkMode: true };

  // Animation refs
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Entrance animation for navbar and staggered items
  useEffect(() => {
    if (!navRef.current) return;
    const navNode = navRef.current;
    gsap.from(navNode, { y: -24, opacity: 0, duration: 0.6, ease: 'power3.out' });
    const items = navNode.querySelectorAll('.nav-item');
    if (items && items.length) {
      gsap.from(items, { y: 8, opacity: 0, stagger: 0.08, duration: 0.45, delay: 0.12 });
    }
  }, []);

  // Mobile menu open animation
  useEffect(() => {
    if (!mobileMenuRef.current) return;
    if (isOpen) {
      gsap.from(mobileMenuRef.current, { y: -8, opacity: 0, duration: 0.28, ease: 'power3.out' });
      // Announce menu state for screen readers
      mobileMenuRef.current.setAttribute('aria-hidden', 'false');
    } else {
      mobileMenuRef.current.setAttribute('aria-hidden', 'true');
    }
  }, [isOpen]);

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
        ref={navRef}
        className={`animate-slideInUp fixed w-full z-50 shadow-xl transition-all duration-300 ease-out backdrop-blur-md ${
          isDarkMode
            ? 'bg-gray-950/95 border-b border-gray-800/50 shadow-black/50'
            : 'bg-white/95 border-b border-slate-200/50 shadow-slate-300/20'
        } ${showNavbar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
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
            <div className="hidden md:flex md:space-x-6 items-center gap-4">
              {navItems.map((item, idx) => (
                <Link
                  key={item.name}
                  href={item.name && !user === "leaderboard" ? "/?scroll=leaderboard" : item.href}
                  className={`group ${idx % 2 === 0 ? "animate-slideInLeft" : "animate-slideInRight"} px-4 py-2 text-sm font-semibold transition-colors duration-200 text-gray-200/90 hover:text-white border-l-2 border-r-2 border-transparent hover:border-l-neon-red hover:border-r-neon-red ${item.name !== "leaderboard" ? "focus:cursor-none" : ""} nav-item`}
                >
                  <span className="relative inline-block">
                    {item.name}
                    <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-linear-to-r from-red-400 to-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </span>
                </Link>
              ))}
              {/* Theme Toggle */}
              <ThemeToggle />
              {/* logout button cyberpunk style */}
              {user ? <LogoutButton /> : null}

            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neon-red transition-colors will-change-transform ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-blue-100'
                }`}
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
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
            <div id="mobile-menu" ref={mobileMenuRef} className={`md:hidden animate-slideDown ${
              isDarkMode ? 'bg-black/90' : 'bg-gray-50/95'
            }`}>
              <div className="px-3 pt-3 pb-4 space-y-2 sm:px-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors shadow-sm ${
                      isDarkMode
                        ? 'text-gray-200 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-800 hover:bg-blue-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="inline-block">{item.name}</span>
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
