'use client';

import { useEffect } from 'react';
import { ServerCrash, RefreshCw } from 'lucide-react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="bg-gray-950 text-slate-100">
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_3px,2px_100%] z-0" />

          <div className="relative z-10 text-center p-8 border border-[#FF0055]/50 bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-[0_0_40px_rgba(255,0,85,0.3)] max-w-lg">
            <ServerCrash className="w-24 h-24 mx-auto text-[#FF0055] mb-6 drop-shadow-[0_0_10px_#FF0055] animate-pulse" />

            <h1 className="text-3xl md:text-4xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-linear-to-r from-[#FF0055] to-[#ff5588]">
              System Failure
            </h1>

            <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-gray-300 mt-4 mb-2">
              Error Code: 500
            </h2>

            <p className="Rusty Attack text-gray-400 max-w-md mx-auto mb-8">
              A critical error occurred in the application core. Our cyber-response
              unit has been dispatched. Please try to re-initialize the
              connection.
            </p>

            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-3 px-8 py-3 bg-[#00E5FF] text-black font-bold uppercase tracking-wider transition-all hover:bg-white hover:shadow-[0_0_20px_#00E5FF] focus:ring-2 focus:ring-offset-2 focus:ring-[#00E5FF] focus:ring-offset-gray-950"
            >
              <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
              Re-initialize
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}



