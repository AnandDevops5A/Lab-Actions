"use client";

import React, { useState } from "react";
import { Hash, Lock, Eye, EyeOff } from "lucide-react";
import { errorMessage, successMessage } from "../Library/Alert";
import { useFetchBackendAPI } from "../Library/API";
import { getCache, setCache, UpdateCache } from "../Library/ActionRedis";
import { useContext } from "react";
import { UserContext } from "../Library/ContextAPI";
import { useRouter } from "next/navigation";

export default function Login({ onSwitch, isDarkMode }) {
  const [contact, setcontact] = useState("");
  const [accessKey, setaccessKey] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  //verify context data saved or not
  // useEffect(() => {
  // 	console.log("User context has been updated:", user);
  //   }, [user]);

  async function onSubmit(payload) {
    // console.log("Submitting payload:", payload);
    const res = await useFetchBackendAPI("users/verify", {
      method: "POST",
      data: payload,
    });
    //    console.log("Response from backend:", res);
    //    console.log("Before set context is :" , user);
    if (res.status === 200 && res.data) {
      const status = await setCache("currentUser", res.data, 3600);
      if (!status.status) {
        errorMessage("Error caching user data");
        const res = await UpdateCache("currentUser", res.data, 3600);
        if (!res.status) {
          errorMessage("Error updating user data");
        } else {
          console.log("User data updated in cache");
        }
      } else setUser(res.data);

      //    console.log("after set context is :" , user);
    }
    return res;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!contact.trim() || !accessKey) {
      errorMessage("Please enter both Player ID and accessKey.");
      return;
    }
    // console.log("contact,accessKey", contact, accessKey);
    setLoading(true);
    let result = null;
    try {
      const payload = { contact: contact.trim(), accessKey };
      result = await onSubmit(payload);
      if (result.status === 200 && result.data) {
        successMessage(result.message || "Login successful.");
      } else if (result.status === 500) {
        errorMessage("Invalid Player ID or accessKey.");
      } else {
        errorMessage(result.message || "Server error. Please try again later.");
      }
    } catch (err) {
      errorMessage(err?.message || "Unexpected error.");
    } finally {
      setLoading(false);
      // console.log("Login user: ", result);
      //rediect to player dashboard
      if (result && result.status === 200 && result.data)
        router.push("/player");
    }
  }

  return (
    <div className="w-full ">
      {/* Aggressive Cyberpunk Heading */}
      <div className="px-4 py-6 text-center">
        <h1
          // Aggressive, cyberpunk styling
          className={`sm:text-xl text-3xl font-extrabold uppercase tracking-widest ${
            isDarkMode ? "text-[#FF4170] neon-glow-frame" : "text-[#00E5FF] "
          } 
                       drop-shadow-[0_0_8px_#FF4170] leading-tight`}
        >
          <span className="text-[#00E5FF]">VERIFY</span> YOURSELF
        </h1>
      </div>

      {/* Form Start */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4"
        aria-describedby="login-error"
      >
        {/* contact Input */}
        <div className="relative group">
          <Hash
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00E5FF] opacity-90"
            aria-hidden
          />
          <label htmlFor="contact" className="sr-only">
            Player ID or Contact
          </label>
          <input
            id="contact"
            name="contact"
            value={contact}
            onChange={(e) => setcontact(e.target.value)}
            placeholder="Player ID or Contact"
            className="w-full bg-transparent border-b border-[#00E5FF]/10 py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4170] transition-colors"
            autoComplete="username"
          />
        </div>

        {/* accessKey Input */}
        <div className="relative group">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF4170] opacity-90"
            aria-hidden
          />
          <label htmlFor="accessKey" className="sr-only">
            accessKey
          </label>
          <input
            id="accessKey"
            name="accessKey"
            value={accessKey}
            onChange={(e) => setaccessKey(e.target.value)}
            placeholder="Secure Access Key"
            type={showPwd ? "text" : "password"}
            className="w-full bg-transparent border-b border-[#00E5FF]/10 py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4170] transition-colors"
            autoComplete="current-password"
          />

          <a
            onClick={() => setShowPwd((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1"
            aria-label={showPwd ? "Hide accessKey" : "Show accessKey"}
          >
            {showPwd ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </a>
        </div>

        {/* Error Message
				<div role="status" aria-live="polite" className="min-h-5">
					{error ? <p id="login-error" className="text-sm text-red-400">{error}</p> : null}
				</div> */}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="btn relative w-full overflow-hidden rounded-lg px-6 py-3 font-extrabold text-lg 
                         bg-linear-to-r from-[#00E5FF] via-[#FF0055] to-[#9b59ff] text-black shadow-lg 
                         hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 focus:ring-[#00E5FF] focus:ring-offset-gray-950"
          >
            {loading ? (
              <svg
                className="w-5 h-5 animate-spin mr-3"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="4"
                />
                <path
                  d="M4 12a8 8 0 018-8"
                  stroke="rgba(0,0,0,0.6)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            ) : null}
            <span className={`${isDarkMode ? "text-white" : "text-black"}`}>
              {loading ? "Signing in..." : "Sign In"}
            </span>
          </button>
        </div>

        {/* Switch to Signup */}
        <p className="mt-4 text-sm text-gray-300 text-center">
          New here?{" "}
          <a
            
            onClick={() => onSwitch?.("signup")}
            className="text-[#00E5FF] font-semibold hover:text-[#00B8E6] transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            Create Team
          </a>
        </p>
      </form>
    </div>
  );
}
