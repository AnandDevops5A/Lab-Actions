"use client";

import React, { useState, useRef, memo } from "react";
import { Users, UserPlus, Phone, Lock, Eye, EyeOff, Mail, Loader2 } from "lucide-react";
import { FetchBackendAPI } from "../../lib/api/backend-api";
import { validatePassword } from "./PasswordCheck";
import { errorMessage, successMessage } from "../../lib/utils/alert";

const COUNTRIES = [
  { code: "+91", label: "India", emoji: "🇮🇳" },
  { code: "+1", label: "USA", emoji: "🇺🇸" },
  { code: "+44", label: "UK", emoji: "🇬🇧" },
  { code: "+92", label: "Pakistan", emoji: "🇵🇰" },
  { code: "+971", label: "UAE", emoji: "🇦🇪" },
  { code: "+61", label: "Australia", emoji: "🇦🇺" },
];

function InputField({
  id,
  icon: Icon,
  type = "text",
  inputRef,
  placeholder,
  extraClass = "",
  children,
}) {
  return (
    <div className="relative group w-full">
      <Icon
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 opacity-90 transition-colors group-focus-within:text-cyan-300"
        aria-hidden
      />
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        ref={inputRef}
        placeholder={placeholder}
        className={`w-full bg-transparent border-b border-cyan-500/20 py-3 pl-12 pr-4 text-slate-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors ${extraClass}`}
      />
      {children}
    </div>
  );
}

const Signup = memo(({ onSwitch, isDarkMode = true }) => {
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const callSignRef = useRef(null);
  const contactRef = useRef(null);
  const accessKeyRef = useRef(null);
  const confirmRef = useRef(null);
  const countryRef = useRef(null);

  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignupError = (error) => {
    console.error("Signup API Error:", { status: error.status, message: error.error });

    switch (error.status) {
      case 409:
        errorMessage("User already exists. Please try logging in.");
        break;
      case 400:
        errorMessage(error.error || "Invalid registration details. Please check your inputs.");
        break;
      case 429:
        errorMessage("Too many registration attempts. Please try again later.");
        break;
      default:
        errorMessage(error.error || "An unexpected error occurred. Please try again.");
        break;
    }
  };

  const validateForm = () => {
    const username = usernameRef.current?.value || "";
    const callSign = callSignRef.current?.value || "";
    const contact = contactRef.current?.value || "";
    const accessKey = accessKeyRef.current?.value || "";
    const confirm = confirmRef.current?.value || "";
    const countryCode = countryRef.current?.value || COUNTRIES[0].code;

    if (!username.trim() || !callSign.trim() || !contact.trim() || !accessKey)
      return "Please fill all fields.";
    const paswordValidation = validatePassword(accessKey);
    if (!paswordValidation.valid) return paswordValidation.message;
    if (accessKey !== confirm) return "Passwords do not match.";
    const combined = `${countryCode}${contact.trim()}`;
    if (!/^\+[0-9]{11,15}$/.test(combined))
      return "Enter a valid contact number.";
    return null;
  };

  async function onSubmit(payload) {
    return await FetchBackendAPI("users/register", {
      method: "POST",
      data: payload,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      errorMessage(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: usernameRef.current.value.trim(),
        callSign: callSignRef.current.value.trim(),
        email: emailRef.current.value.trim(),
        contact: `${contactRef.current.value.trim()}`,
        accessKey: accessKeyRef.current.value,
      };

      const result = await onSubmit(payload);
      if (result.ok) {
        successMessage("Registration successful! Please login.");
        onSwitch?.("login");
      } else {
        handleSignupError(result);
      }
    } catch (err) {
      console.error("Fatal signup error:", err);
      errorMessage("A critical error occurred. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="px-4 py-4 text-center">
        <h1
          className={`text-2xl sm:text-3xl font-extrabold uppercase tracking-widest ${
            isDarkMode ? "text-cyan-400" : "text-cyan-600"
          } drop-shadow-[0_0_15px_rgba(0,229,255,0.4)] leading-tight`}
        >
          <span className="text-pink-500">CREATE</span> ACCOUNT
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-4" aria-live="polite">
        <InputField
          id="username"
          icon={Users}
          inputRef={usernameRef}
          placeholder="Aapka Name"
        />

        <InputField
          id="callSign"
          icon={UserPlus}
          inputRef={callSignRef}
          placeholder="Call Sign"
        />

        <InputField
          id="email"
          icon={Mail}
          type="email"
          inputRef={emailRef}
          placeholder="Email Address"
        />

        {/* Contact Field with Country Select */}
        <div className="relative group w-full">
          <Phone
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500 opacity-90 transition-colors group-focus-within:text-pink-400"
            aria-hidden
          />
          <select
            aria-label="Country code"
            ref={countryRef}
            defaultValue={COUNTRIES[0].code}
            className="absolute left-10 top-1/2 -translate-y-1/2 bg-transparent text-slate-100 text-sm pl-2 pr-2 py-1 focus:outline-none disabled:opacity-80"
            disabled
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code} className="bg-slate-900 text-slate-100">
                {`${c.emoji} ${c.code}`}
              </option>
            ))}
          </select>
          <input
            id="contact"
            type="number"
            name="contact"
            ref={contactRef}
            placeholder="Local number"
            className="w-full bg-transparent border-b border-cyan-500/20 py-3 pl-36 pr-4 text-slate-100 placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>

        {/* Set Password Field */}
        <InputField
          id="accessKey"
          icon={Lock}
          type={showPwd ? "text" : "password"}
          inputRef={accessKeyRef}
          placeholder="Set Access Key"
          extraClass="pr-12"
        >
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 p-1 transition-colors cursor-pointer"
            aria-label={showPwd ? "Hide password" : "Show password"}
          >
            {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </InputField>

        {/* Confirm Password Field */}
        <InputField
          id="confirm"
          icon={Lock}
          type={showPwd ? "text" : "password"}
          inputRef={confirmRef}
          placeholder="Confirm Access Key"
        />

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="btn relative w-full overflow-hidden rounded-lg px-6 py-3 font-extrabold text-lg 
                       bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 text-black shadow-lg 
                       hover:shadow-cyan-500/30 disabled:opacity-60 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-950 transition-all cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span>Creating Account...</span>
              </div>
            ) : (
              <span className={isDarkMode ? "text-slate-950" : "text-black"}>
                Submit
              </span>
            )}
          </button>
        </div>

        {/* Switch Link */}
        <p className="mt-4 text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onSwitch?.("login")}
            className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors cursor-pointer uppercase tracking-wide text-xs"
          >
            Back to Login
          </button>
        </p>
      </form>
    </div>
  );
});

Signup.displayName = "Signup";
export default Signup;