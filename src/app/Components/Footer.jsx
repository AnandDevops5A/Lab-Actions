'use client';

import Link from "next/link";


const Footer=()=>{

    return(
        
        <div className="bg-black border-t border-gray-800/50 py-10">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
            <div className="flex justify-center space-x-6 mb-4">
              <Link href="/privacy" className="hover:text-neon-blue transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-neon-blue transition">Terms of Service</Link>
              <Link href="/contact" className="hover:text-neon-blue transition">Contact Support</Link>
            </div>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} BGMI Elite Platform. All rights reserved. BGMI is a registered trademark of Krafton, Inc.
            </p>
          </div>
        </div>

    );
}


export default Footer