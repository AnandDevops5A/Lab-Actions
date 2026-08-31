"use client";

import React, { useState, useRef, memo } from "react";
import { PhoneCall, Loader2, KeyRound, ArrowRight } from "lucide-react";
import { FetchBackendAPI } from "../../lib/api/backend-api";
import { errorMessage, successMessage } from "../../lib/utils/alert";

const ForgotPassword = memo(({ onSwitch, isDarkMode }) => {
  const contactRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const contact = contactRef.current?.value || "";

    if (!contact.trim()) {
      errorMessage("Please enter your registered Player ID, Phone, or Email.");
      return;
    }

    setLoading(true);
    try {
      // Adjust the endpoint if your API path differs
      const result = await FetchBackendAPI("users/forgot-password", {
        method: "POST",
        data: { contact: contact.trim() },
      });

      if (result.ok) {
        successMessage("Recovery instructions transmitted.");
        setIsSubmitted(true);
      } else {
        errorMessage(result.error || "Failed to initiate recovery. User not found.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      errorMessage("A critical error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center justify-center p-2 rounded-xl bg-pink-950/40 border border-pink-500/30 text-[#FF4170] mb-1 shadow-[0_0_15px_rgba(255,65,112,0.2)]">
          <KeyRound className="w-6 h-6 animate-pulse" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FF4170] via-slate-100 to-[#00E5FF] drop-shadow-[0_0_12px_rgba(255,65,112,0.4)]">
          SYSTEM <span className="text-slate-100">RECOVERY</span>
        </h1>
        <p className="text-xs uppercase tracking-widest font-mono text-pink-400/70">
          [ OVERRIDE_PROTOCOL // INITIATED ]
        </p>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4 p-2 sm:p-4">
          {/* Contact Input Group */}
          <div className="space-y-1.5">
            <label
              htmlFor="reset-contact"
              className="block text-xs font-mono uppercase tracking-wider text-cyan-300/80"
            >
              Registered Contact
            </label>
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/70 group-focus-within:text-[#00E5FF] transition-colors pointer-events-none">
                <PhoneCall className="w-5 h-5" aria-hidden="true" />
              </div>
              <input
                id="reset-contact"
                name="contact"
                ref={contactRef}
                required
                placeholder="Player ID, Email, or Phone"
                className="w-full bg-slate-900/60 border border-slate-800 rounded-lg py-3 pl-11 pr-4 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] focus:shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-all font-sans"
              />
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1 text-center">
              Enter your registered details to receive a secure reset link.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="relative w-full group overflow-hidden rounded-lg py-3.5 px-6 font-mono font-bold uppercase text-sm tracking-widest text-slate-950 bg-gradient-to-r from-[#FF4170] via-[#D8305C] to-[#00E5FF] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,65,112,0.4)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <span>Request Reset</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 text-center space-y-4">
          <div className="p-4 bg-cyan-950/30 border border-cyan-500/20 rounded-lg shadow-[0_0_15px_rgba(0,229,255,0.1)]">
            <p className="text-sm text-cyan-100 font-mono leading-relaxed">
              If those details match our system, a recovery protocol has been dispatched. Please check your messages.
            </p>
          </div>
        </div>
      )}

      {/* Footer Navigation Switcher */}
      <div className="pt-4 text-center border-t border-slate-800/60 mt-2">
        <p className="text-xs text-slate-400">
          Remembered your key?{" "}
          <button
            type="button"
            onClick={() => onSwitch?.("login")}
            className="text-[#00E5FF] font-semibold hover:text-cyan-300 underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-[#00E5FF] rounded px-1 transition-all cursor-pointer"
          >
            Return to Login
          </button>
        </p>
      </div>
    </div>
  );
});

ForgotPassword.displayName = "ForgotPassword";
export default ForgotPassword;