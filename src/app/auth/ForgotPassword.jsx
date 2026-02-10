"use client";

import React, { useRef, useState } from "react";
import { Mail, ArrowLeft, Loader2, CheckCircle, Phone } from "lucide-react";

const COUNTRIES = [
  { code: "+91", label: "India", emoji: "🇮🇳" },
  { code: "+1", label: "USA", emoji: "🇺🇸" },
  { code: "+44", label: "UK", emoji: "🇬🇧" },
  { code: "+92", label: "Pakistan", emoji: "🇵🇰" },
  { code: "+971", label: "UAE", emoji: "🇦🇪" },
  { code: "+61", label: "Australia", emoji: "🇦🇺" },
];

const ForgotPassword = ({ onSwitch, isDarkMode }) => {
  const [countryCode, setCountryCode] = useState(COUNTRIES[0].code);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const emailRef = useRef(null);
  const contactRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      email: emailRef.current?.value,
      contact: contactRef.current?.value,
      
    });
    setLoading(true);
    setError("");

    // Simulate API call
    try {
      // TODO: Replace with actual API call
      // await api.forgotPassword(email);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setSubmitted(true);
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="px-4 py-6 text-center">
        <h1
          className={`sm:text-xl text-3xl font-extrabold uppercase tracking-widest ${
            isDarkMode ? "text-amber-400" : "text-amber-600"
          } drop-shadow-[0_0_15px_rgba(251,191,36,0.4)] leading-tight`}
        >
          <span className="text-orange-500">RECOVER</span> ACCESS
        </h1>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center text-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
            Check your email
          </h3>
          <p className={`text-sm mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            We have sent a recovery link to your registered contact details.
          </p>
          <button
            onClick={() => onSwitch("login")}
            className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
          >
            Back to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="relative group">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400 opacity-90"
              aria-hidden
            />
            <input
              type="email"
              name="email"
              ref={emailRef}
              placeholder="Email Address"
              className="w-full bg-transparent border-b border-amber-500/20 py-3 pl-12 pr-4 text-slate-100 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* <div className="text-center text-xs text-gray-500 font-mono">- OR -</div> */}

          <div className="relative group">
            <Phone
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500 opacity-90"
              aria-hidden
            />
            <select
              aria-label="Country code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="absolute left-10 top-1/2 -translate-y-1/2 bg-transparent text-slate-100 text-sm pl-2 pr-6 py-1 rounded-md focus:outline-none focus:border-amber-500/30 [&>option]:bg-black"
                disabled
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{`${c.emoji} ${c.code}`}</option>
              ))}
            </select>
            <input
              type="number"
              name="contact"
              ref={contactRef}
              placeholder="Mobile Number"
              className="w-full bg-transparent border-b border-amber-500/20 py-3 pl-36 pr-4 text-slate-100 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn relative w-full overflow-hidden rounded-lg px-6 py-3 font-extrabold text-lg 
                         bg-linear-to-r from-amber-400 via-orange-500 to-red-500 text-black shadow-lg 
                         hover:shadow-orange-500/50 disabled:opacity-60 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-gray-950"
            >
              {loading ? (
                 <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    <span>Sending...</span>
                 </div>
              ) : (
                <span className={`${isDarkMode ? "text-slate-100" : "text-black"}`}>
                  Send Recovery Link
                </span>
              )}
            </button>
          </div>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => onSwitch("login")}
              className="text-sm text-amber-400 hover:text-orange-400 inline-flex items-center gap-2 transition-colors font-semibold tracking-wide uppercase"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;