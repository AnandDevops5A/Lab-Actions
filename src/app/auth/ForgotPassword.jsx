"use client";

import React, { useRef, useState } from "react";
import {
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Phone,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { resetPassword, confirmPasswordReset } from "@/lib/api/backend-api";
import { errorMessage, successMessage } from "@/lib/utils/alert";
import { validatePassword } from "./PasswordCheck";

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
  const [step, setStep] = useState("details"); // 'details', 'verify', 'success'
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const emailRef = useRef(null);
  const contactRef = useRef(null);
  const otpRef = useRef(null);
  const [userId,setUserId] = useState(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [responseOTP, setResponseOTP] = useState(null);

  //verify reset credential
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      email: emailRef.current?.value,
      contact: `${contactRef.current?.value}`,
    };

    if (!payload.email || !contactRef.current?.value) {
      errorMessage("Please provide both email and contact number.");
      setLoading(false);
      return;
    }

    try {
      const res = await resetPassword(payload);
      if (res.data) {
        successMessage(
          `Hi, ${res.data.username} otp: ${res.data.otp}. An OTP has been sent to your details.`,
        );

        setResponseOTP(res.data.otp);
        setUserId(res.data.id);
        setStep("verify");
      } else {
        errorMessage(res.error || "Invalid details. Please try again.");
        errorMessage(res.error || "Invalid details. Please try again.");
      }
    } catch (err) {
      errorMessage("Failed to send OTP. Please try again.");
      errorMessage(err?.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const otp = otpRef.current?.value || "";
    if (!otp && !responseOTP && otp.length !== 6) {
      errorMessage("Please enter OTP");
      setLoading(false);
      return;
    }
    if (responseOTP == otp) {
      setOtpVerified(true);
      successMessage("OTP Verified Successfully");
      setLoading(false);
      return;
    } else {
      errorMessage("Invalid OTP");
      setLoading(false);
      return;
    }
  };

  // after succesfull verify credential
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newPassword = newPasswordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if ( !newPassword || !confirmPassword) {
      errorMessage("Please fill all fields for verification.");
      setLoading(false);
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      errorMessage(passwordValidation.message);
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      errorMessage("New passwords do not match.");
  
      setLoading(false);
      return;
    }

    const payload = {
      id: userId,
      accessKey: newPassword,
    };

    try {
      // NOTE: This assumes a new API endpoint `users/confirm-password-reset` exists.
      const res = await confirmPasswordReset(payload);
    //  res.ok && successMessage("Password has been reset successfully!");
      if (res.ok) {
        successMessage(res.data || "Password has been reset successfully!");
        setStep("success");
      } else {
        errorMessage(
          res.error || "Failed to reset password",
        );
       
      }
    } catch (err) {
      errorMessage(err?.message || "Unexpected error.");
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

      {step === "success" ? (
        <div className="flex flex-col items-center text-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3
            className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}
          >
            Password Reset Successfully
          </h3>
          <p
            className={`text-sm mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            You can now log in with your new password.
          </p>
          <button
            onClick={() => {
              onSwitch("login")
              setStep("details");
            }}
            className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            Back to Login
          </button>
        </div>
      ) : step === "details" ? (
        <form onSubmit={handleDetailsSubmit} className="space-y-4 p-4">
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
              required
              className="w-full bg-transparent border-b border-amber-500/20 py-3 pl-12 pr-4 text-slate-100 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

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
                <option
                  key={c.code}
                  value={c.code}
                >{`${c.emoji} ${c.code}`}</option>
              ))}
            </select>
            <input
              type="number"
              name="contact"
              ref={contactRef}
              placeholder="Mobile Number"
              required
              className="w-full bg-transparent border-b border-amber-500/20 py-3 pl-36 pr-4 text-slate-100 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn relative w-full overflow-hidden rounded-lg px-6 py-3 font-extrabold text-lg 
                         bg-linear-to-r from-amber-400 via-orange-500 to-red-500 text-black shadow-lg 
                         hover:shadow-orange-500/50 disabled:opacity-60 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-gray-950"
            >
              {loading ? (
                <div className="flex items-center justify-center cursor-progress">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span>Sending OTP...</span>
                </div>
              ) : (
                <span
                  className={`${isDarkMode ? "text-slate-100" : "text-black"} cursor-pointer`}
                >
                  Send OTP
                </span>
              )}
            </button>
          </div>
        </form>
      ) : (
        // step === 'verify'
        <form
          onSubmit={otpVerified ? handleResetSubmit : handleVerifyOtp}
          className="space-y-4 p-4 relative"
        >
          <div className="flex gap-2 items-center">
            <div className="relative group flex-1">
              <KeyRound
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400 opacity-90"
                aria-hidden
              />
              <input
                type="text"
                name="otp"
                ref={otpRef}
                placeholder="Enter OTP"
                required
                disabled={otpVerified}
                className="w-full bg-transparent border-b border-amber-500/20 py-3 pl-12 pr-4 text-slate-100 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            {!otpVerified && (
              <span
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/50 rounded-md text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Verify"
                )}
              </span>
            )}
            {otpVerified && <CheckCircle className="w-6 h-6 text-green-500" />}
          </div>

          {otpVerified && (
            <>
              <div className="relative group animate-in fade-in slide-in-from-top-2 duration-300">
                <KeyRound
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500 opacity-90"
                  aria-hidden
                />
                <input
                  type={showPwd ? "text" : "password"}
                  name="newPassword"
                  ref={newPasswordRef}
                  placeholder="New Password"
                  required
                  className="w-full bg-transparent border-b border-amber-500/20 py-3 pl-12 pr-12 text-slate-100 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-100/80 hover:text-slate-100 p-1 cursor-pointer"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="relative group animate-in fade-in slide-in-from-top-2 duration-300 delay-75">
                <KeyRound
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500 opacity-90"
                  aria-hidden
                />
                <input
                  type={showPwd ? "text" : "password"}
                  name="confirmPassword"
                  ref={confirmPasswordRef}
                  placeholder="Confirm New Password"
                  required
                  className="w-full bg-transparent border-b border-amber-500/20 py-3 pl-12 pr-4 text-slate-100 placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300 delay-100">
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
                      <span>Resetting...</span>
                    </div>
                  ) : (
                    <span
                      className={`${isDarkMode ? "text-slate-100" : "text-black"} cursor-pointer`}
                    >
                      Reset Password
                    </span>
                  )}
                </button>
              </div>
            </>
          )}

        </form>
      )}

      {step !== "success" && (
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => onSwitch("login")}
            className="text-sm text-amber-400 hover:text-orange-400 inline-flex items-center gap-2 transition-colors font-semibold tracking-wide uppercase"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
