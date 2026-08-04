"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-5">
      <div className="rounded-xl border border-white/10 bg-black/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-gray-400">
          © {new Date().getFullYear()} CyberTournaments. Community-powered,
          player-first.
          <hr />
          Built with ❤️ by{"Anand Raj"}
          <br />
          Backend Url {process.env.NEXT_PUBLIC_BACKEND_URL}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="#"
            className="text-xs text-gray-300 hover:text-cyan-400 transition-colors"
          >
            Guidelines
          </Link>
          <Link
            href="#"
            className="text-xs text-gray-300 hover:text-green-400 transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="text-xs text-gray-300 hover:text-cyan-400 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
