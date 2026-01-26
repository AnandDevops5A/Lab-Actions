import React from 'react';
import server_error from "../images/error.gif"
import Image from 'next/image';

const CyberpunkError = ({ message }) => {
  return (
    <div className="relative w-full max-w-lg p-8 mx-auto my-8 overflow-hidden bg-gray-950 border-4 border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.6)] font-mono transform -skew-x-2">
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none  bg-[linear-gradient(transparent_50%,rgba(50,0,0,0.5)_50%)] bg-[length:100%_4px]" />
      <div className="absolute inset-0 pointer-events-none z-0 bg-red-900/10 animate-pulse" />
      
      <div className="relative z-20 flex flex-col items-center text-center">
        <Image
          src={server_error.src} 
          alt="System Failure" 
          width={160}
          height={120}
          className="w-40 h-32 mb-6 object-cover opacity-90 mix-blend-luminosity grayscale contrast-125 border-2 border-red-500/50"
        />
        <div className="mb-2 text-4xl font-black text-red-600 uppercase tracking-[0.2em] animate-pulse drop-shadow-[0_0_15px_rgba(220,38,38,0.9)] skew-x-[-10deg]">
          😮OOPS!!
        </div>
        <div className="w-full h-0.5 bg-red-600/50 my-4 shadow-[0_0_10px_red]"></div>
        <div className="text-lg font-bold text-gray-100 uppercase tracking-widest drop-shadow-md">
          {message}
        </div>
        <div className="mt-4 text-xs text-red-500/60 font-mono">
            ERROR_CODE: 0xFAIL // SYSTEM_HALTED
        </div>
      </div>
    </div>
  );
};

export default CyberpunkError;



