'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useContext, useState, useEffect, useRef, useMemo, Suspense } from 'react';
import gsap from 'gsap';
import { UserContext } from '../../lib/contexts/user-context';
import { LogoutButton } from '../ui/logout-button';
import { ThemeToggle } from '../ui/theme-toggle';
import { ThemeContext } from '../../lib/contexts/theme-context';
import { Crown, Home, IdCard, LogIn, LucideTrophy, PenLine, Menu, X } from 'lucide-react';

const NavbarContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, getUserFromContext } = useContext(UserContext);
  const themeContext = useContext(ThemeContext);
  const { isDarkMode } = themeContext || { isDarkMode: true };
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("Home");

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
      gsap.from(mobileMenuRef.current, {
        y: -8,
        opacity: 0,
        duration: 0.28,
        ease: "power3.out",
      });
      mobileMenuRef.current.setAttribute("aria-hidden", "false");
    } else {
      mobileMenuRef.current.setAttribute("aria-hidden", "true");
    }
  }, [isOpen]);

  // Memoized icon class to prevent recreation on every render
  const iconClass =
    "h-5 w-5 text-cyan-100 hover:scale-110 transition duration-300";

  const navItems = useMemo(
    () => [
      { name: "Home", href: "/", icons: <Home className={iconClass} /> },
      {
        name: "Review",
        href: "/review",
        icons: <PenLine className={iconClass} />,
      },
    { name: 'leaderboard', href: '/Leaderboard',icons:<LucideTrophy className={iconClass}/> },
    { name: 'Admin', href: ['917254831884', '7254831884'].includes(String(user?.contact)) ? '/admin' : '/',icons:<Crown  className={iconClass}/> },
    { name: user ?'My Profile':'Login', href: user ? '/player' : '/auth' ,icons:user ? <IdCard className={iconClass}/>:<LogIn className={iconClass}/>}
  ], [user, iconClass]);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const Router=useRouter();

// Scroll-based show/hide logic for navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // scrolling down → hide navbar
        setShowNavbar(false);
      } else {
        // scrolling up → show navbar
        setShowNavbar(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const searchParams = useSearchParams();
  const scrollTarget = searchParams.get('scroll');
  
  // Sync active state with path and params
  useEffect(() => {
    if (scrollTarget === 'leaderboard') {
       setActiveItem('leaderboard');
    } else {
       const active = navItems.find(item => item.href === pathname);
       if (active) {
         setActiveItem(active.name);
       } else if (pathname === '/') {
         setActiveItem("Home");
       }
    }
  }, [pathname, navItems, scrollTarget]);

// Scroll to target section if "scroll" query param is present (e.g., after redirect from login)
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
            setTimeout(()=>{
              Router.replace("/", { scroll: false });
            },1000)
          }
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [scrollTarget, Router]);

  // On mount, check if user data is in context; if not, try to get from cache (handles page refresh)
  useEffect(() => {
    // By chance if user refresh page
    // On component mount, check if user data is in context; if not, try to get from cache
    const fetchUserData = async () => {
      // console.log("Navbar mounted, checking user context.");
      if (!user) {
         await getUserFromContext();
         // console.log("Fetched user data and save to context");
      }
    };
    fetchUserData();
    // return () => {
    //   setMounted(false);
    // };
  }, [getUserFromContext, user]);

 


  return (
    showNavbar ?
      <nav
        ref={navRef}
        className={`animate-slideInUp top-0 fixed w-full z-50 shadow-xl transition-all duration-300 ease-out backdrop-blur-md ${
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
                  className="h-6 w-6 filter brightness-0 invert" 
                  loading='eager'
                  />
              </div>
              <span className="text-2xl font-extrabold bg-linear-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent tracking-wider">
                WarPath</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex md:space-x-6 items-center gap-4">
              {navItems.map((item, idx) => (
                <Link
                  key={item.name}
                  href={!user  && item.name === "leaderboard" ? "/?scroll=leaderboard" : item.href}
                  onClick={() => setActiveItem(item.name)}
                  className={`group ${idx % 2 === 0 ? "animate-slideInLeft" : "animate-slideInRight"} px-4 py-2 text-sm capitalize font-semibold transition-colors duration-200 ${activeItem === item.name ? "text-slate-100 border-l-neon-red border-r-neon-red pointer-events-none" : "text-gray-200/90 border-transparent"} hover:text-slate-100 border-l-2 border-r-2 hover:border-l-neon-red hover:border-r-neon-red ${item.name !== "leaderboard" ? "focus:cursor-none" : ""} nav-item
                  ${item.name === 'Admin' && !['917254831884', '7254831884'].includes(String(user?.contact)) ? "hidden" : "block"}`}
                  aria-label={item.name}
                  title={item.name}
               >
                  <span className="relative inline-block">
                 <span className="hidden lg:block">   {item.name}</span>
                 <span className="block lg:hidden">{item.icons}</span>
                    <span className={`absolute left-0 -bottom-1 h-0.5 w-full bg-linear-to-r from-red-400 to-yellow-400 transform ${activeItem === item.name ? "scale-x-100" : "scale-x-0"} group-hover:scale-x-100 transition-transform origin-left`}></span>
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
                    ? 'text-gray-400 hover:text-slate-100 hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-blue-100'
                }`}
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              >
                {isOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
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
                    onClick={() => { setIsOpen(false); setActiveItem(item.name); }}
                    className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors shadow-sm ${
                      isDarkMode
                        ? `${activeItem === item.name ? "bg-gray-800 text-slate-100" : "text-gray-200"} hover:bg-gray-800 hover:text-slate-100`
                        : `${activeItem === item.name ? "bg-blue-100 text-gray-900" : "text-gray-800"} hover:bg-blue-100 hover:text-gray-900`
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

const Navbar = () => {
  return (
    <Suspense fallback={<div className="h-16" />}>
      <NavbarContent />
    </Suspense>
  );
};

export default Navbar;
