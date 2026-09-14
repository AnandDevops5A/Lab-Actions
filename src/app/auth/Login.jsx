"use client";

import React, { useState, useRef, memo, useContext } from "react";
import { Lock, Eye, EyeOff, PhoneCall, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { errorMessage, successMessage } from "../../lib/utils/alert";
import { FetchBackendAPI } from "../../lib/api/backend-api";
import { UserContext } from "../../lib/contexts/user-context";
import { useRouter } from "next/navigation";
import LZString from "lz-string";
import { setSecureCookie } from "../api/httpcookies/cookiesManagement";

const Login = memo(({ onSwitch, isDarkMode }) => {
  const contactRef = useRef(null);
  const accessKeyRef = useRef(null);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser, MALIK, refreshUserTournaments } = useContext(UserContext);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLoginError = (error) => {
    console.error("Login API Error:", { status: error.status, message: error.error });

    switch (error.status) {
      case 401:
      case 403:
        errorMessage("Invalid credentials. Please check your Player ID and Access Key.");
        break;
      case 404:
        errorMessage("Player account not found.");
        break;
      case 429:
        errorMessage(error.error || "Too many login attempts. Please try again later.");
        break;
      default:
        errorMessage(error.error || "An unexpected server error occurred. Please try again.");
        break;
    }
  };

  async function onSubmit(payload) {
    const response = await FetchBackendAPI("users/verify", {
      method: "POST",
      data: payload,
    });
    console.log("Login API Response:", response);

    if (!response.ok) {
      return response;
    }

    try {
      const userData = response.data?.data ?? response.data;
      const compressedUser = LZString.compressToUTF16(JSON.stringify(userData));
      const cookieResult = await setSecureCookie("currentUser", compressedUser);

      if (!cookieResult.success) {
        throw new Error(cookieResult.message || "Failed to save user session.");
      }

      setUser(userData);
      refreshUserTournaments(true, userData);
      return response;
    } catch (sessionError) {
      console.error("Session handling error after login:", sessionError);
      return {
        ok: false,
        error: "Could not start your session. Please try again.",
        status: 500,
      };
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const contact = contactRef.current?.value || "";
    const accessKey = accessKeyRef.current?.value || "";

    if (!contact.trim() || !accessKey.trim()) {
      errorMessage("Please enter both Player ID and accessKey.");
      return;
    }
    setLoading(true);

    try {
      const payload = { contact: contact.trim(), accessKey: accessKey.trim() };
      const result = await onSubmit(payload);

      if (result.ok) {
        successMessage("Login successful!");
        if (MALIK) {
          router.push("/");
        } else {
          router.push("/player");
        }
      } else {
        handleLoginError(result);
      }
    } catch (err) {
      console.error("Fatal login process error:", err);
      setError("A critical error occurred. Please refresh and try again.");
      errorMessage("A critical error occurred. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center justify-center p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[#00E5FF] mb-1 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
          <ShieldCheck className="w-6 h-6 animate-pulse" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-slate-100 to-[#FF4170] drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">
          VERIFY <span className="text-slate-100">YOURSELF</span>
        </h1>
        <p className="text-xs uppercase tracking-widest font-mono text-cyan-400/70">
          [ ACCESS_CONTROL_LEVEL // 01 ]
        </p>
      </div>

      {/* Form Area */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-2 sm:p-4"
        aria-describedby={error ? "login-error" : undefined}
      >
        {/* Contact Input Group */}
        <div className="space-y-1.5">
          <label htmlFor="contact" className="block text-xs font-mono uppercase tracking-wider text-cyan-300/80">
            Identity / Contact
          </label>
          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/70 group-focus-within:text-[#00E5FF] transition-colors pointer-events-none">
              <PhoneCall className="w-5 h-5" aria-hidden="true" />
            </div>
            <input
              id="contact"
              name="contact"
              ref={contactRef}
              required
              placeholder="Player ID or Phone Number"
              className="w-full bg-slate-900/60 border border-slate-800 rounded-lg py-3 pl-11 pr-4 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] focus:shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-all font-sans"
              autoComplete="username"
            />
          </div>
        </div>

        {/* Access Key Input Group */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="accessKey" className="block text-xs font-mono uppercase tracking-wider text-[#FF4170]/80">
              Access Key
            </label>
            {/* Navigates to Forgot Password */}
            <button
              type="button"
              onClick={() => onSwitch?.("forgot-password")}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline underline-offset-4 transition-colors cursor-pointer"
            >
              Key Lost?
            </button>
          </div>
          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF4170]/70 group-focus-within:text-[#FF4170] transition-colors pointer-events-none">
              <Lock className="w-5 h-5" aria-hidden="true" />
            </div>
            <input
              id="accessKey"
              name="accessKey"
              ref={accessKeyRef}
              required
              placeholder="••••••••••••"
              type={showPwd ? "text" : "password"}
              className="w-full bg-slate-900/60 border border-slate-800 rounded-lg py-3 pl-11 pr-11 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-[#FF4170] focus:ring-1 focus:ring-[#FF4170] focus:shadow-[0_0_15px_rgba(255,65,112,0.25)] transition-all font-sans"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPwd((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:text-cyan-400 focus:outline-none transition-colors p-0.5 cursor-pointer"
              aria-label={showPwd ? "Hide access key" : "Show access key"}
            >
              {showPwd ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Error State Alert */}
        {error && (
          <div
            id="login-error"
            role="status"
            aria-live="polite"
            className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="relative w-full group overflow-hidden rounded-lg py-3.5 px-6 font-mono font-bold uppercase text-sm tracking-widest text-slate-950 bg-gradient-to-r from-[#00E5FF] via-[#00B8E6] to-[#FF4170] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Initialize Session</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Footer Navigation Switcher */}
        <div className="pt-4 text-center border-t border-slate-800/60">
          <p className="text-xs text-slate-400">
            Unregistered Agent?{" "}
            <button
              type="button"
              onClick={() => onSwitch?.("signup")}
              className="text-[#00E5FF] font-semibold hover:text-cyan-300 underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-[#00E5FF] rounded px-1 transition-all cursor-pointer"
            >
              Request Access
            </button>
          </p>
        </div>
      </form>
    </div>
  );
});

Login.displayName = "Login";
export default Login;