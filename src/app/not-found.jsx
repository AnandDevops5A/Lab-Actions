'use client';
import Link from 'next/link';
import { Home, Frown } from 'lucide-react';
import Navbar from "../components/layout/navbar";
import { Suspense } from 'react';


const NotFoundPage = () => (
  <div>
  <Suspense fallback={<div>Loading...</div>}>
     <Navbar/></Suspense>
    <div className=" h-[98vh] flex flex-col items-center justify-center bg-gray-950 text-slate-100 relative p-10 pt-25">
      {/* Background effects */}
      <div className="absolute  inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_3px,2px_100%] animate-pulse z-0" />
      
      <div className="relative z-10 text-center p-8 border border-[#FF0055]/50 bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-[0_0_40px_rgba(255,0,85,0.3)]">
        <Frown className="w-20 h-20 mx-auto text-[#FF0055] mb-6 drop-shadow-[0_0_10px_#FF0055]" />

        <h1 className="relative text-3xl md:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-linear-to-r from-[#00E5FF] to-[#FF0055] glitch" data-text="404">
          404
        </h1>

        <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-gray-300 mt-4 mb-2">
          Signal Lost
        </h2>
        
        <p className="Rusty Attack text-gray-400 max-w-sm mx-auto mb-8">
          The requested route could not be found in this sector. The data stream may be corrupted or the path is invalid.
        </p>

        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#00E5FF] text-black font-bold uppercase tracking-wider transition-all hover:bg-white hover:shadow-[0_0_20px_#00E5FF] focus:ring-2 focus:ring-offset-2 focus:ring-[#00E5FF] focus:ring-offset-gray-950 rounded-2xl"
        >
          <Home className="w-5 h-5" />
          Return to Base
        </Link>
      </div>

      <style jsx>{`
        .glitch {
          position: relative;
          text-shadow: 0.05em 0 0 rgba(0, 229, 255, 0.75),
                       -0.05em 0 0 rgba(255, 0, 85, 0.75),
                       0 0.025em 0 rgba(0, 229, 255, 0.75),
                       0 -0.025em 0 rgba(255, 0, 85, 0.75);
          animation: glitch 725ms infinite;
        }

        .glitch:before,
        .glitch:after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
        }

        .glitch:before {
          left: -2px;
          text-shadow: 2px 0 #00e5ff;
          animation: glitch-before 3s infinite linear alternate-reverse;
        }

        .glitch:after {
          left: 2px;
          text-shadow: -2px 0 #ff0055;
          animation: glitch-after 2s infinite linear alternate-reverse;
        }

        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          to { transform: translate(0); }
        }

        @keyframes glitch-before {
          0% { clip: rect(44px, 450px, 56px, 0); }
          100% { clip: rect(42px, 450px, 52px, 0); }
        }

        @keyframes glitch-after {
          0% { clip: rect(100px, 450px, 105px, 0); }
          100% { clip: rect(110px, 450px, 115px, 0); }
        }
      `}</style>
    </div></div>
  );

  export default NotFoundPage;



