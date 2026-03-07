"use client";

import React, { useState, useRef, memo } from "react";
import { Users, UserPlus, Phone, Lock, Eye, EyeOff, Mail } from "lucide-react";
import { FetchBackendAPI } from "../../lib/api/backend-api";
import { validatePassword } from "./PasswordCheck";
import { errorMessage, successMessage } from "../../lib/utils/alert";

// ✅ Constants outside component
const COUNTRIES = [
  { code: "+91", label: "India", emoji: "🇮🇳" },
  { code: "+1", label: "USA", emoji: "🇺🇸" },
  { code: "+44", label: "UK", emoji: "🇬🇧" },
  { code: "+92", label: "Pakistan", emoji: "🇵🇰" },
  { code: "+971", label: "UAE", emoji: "🇦🇪" },
  { code: "+61", label: "Australia", emoji: "🇦🇺" },
];

// ✅ Reusable InputField
function InputField({
  id,
  icon: Icon,
  type = "text",
  inputRef,
  placeholder,
  extraClass = "",
}) {
  return (
    <div className="relative group">
      <Icon
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00E5FF] opacity-90"
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
        className={`w-full bg-transparent border-b border-[#00E5FF]/10 py-3 pl-12 pr-4 text-slate-100 placeholder-gray-400 focus:outline-none focus:border-[#FF4170] transition-colors ${extraClass}`}
      />
    </div>
  );
}

const Signup = memo(({ onSwitch }) => {


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
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4"
        aria-live="polite"
      >
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
          inputRef={emailRef}
          placeholder="Email"
        />


        {/* Contact field with country select */}
        <div className="relative group gap-1">
          <Phone
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF4170] opacity-90"
            aria-hidden
          />
          <select
            aria-label="Country code"
            ref={countryRef}
            defaultValue={COUNTRIES[0].code}
            className="absolute left-10 top-1/2 -translate-y-1/2 bg-transparent text-slate-100 text-sm pl-2 pr-6 py-1 rounded-md focus:outline-none focus:border-[#00E5FF]/30"
            disabled //only indian number are allowed
          >
            {COUNTRIES.map((c) => (
              <option
                key={c.code}
                value={c.code}
                className="bg-black text-slate-100"
              >{`${c.emoji} ${c.code}`}</option>
            ))}
          </select>
          <input
            id="contact"
            type="number"
            name="contact"
            ref={contactRef}
            placeholder="Local number"
            className="w-full bg-transparent border-b border-[#00E5FF]/10 py-3 pl-36 pr-4 text-slate-100 placeholder-gray-400 focus:outline-none focus:border-[#FF4170] transition-colors"
          />
        </div>

        {/* Password */}
        <InputField
          id="accessKey"
          icon={Lock}
          type={showPwd ? "text" : "password"}
          inputRef={accessKeyRef}
          placeholder="Set Access Key"
          extraClass="pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPwd(!showPwd)}
          className="absolute right-3 top-[38%] text-slate-100/80 hover:text-slate-100 p-1"
        >
          {showPwd ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>

        <InputField
          id="confirm"
          icon={Lock}
          type={showPwd ? "text" : "password"}
          inputRef={confirmRef}
          placeholder="Confirm Access Key"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="btn w-full rounded-lg px-6 py-3 font-extrabold text-lg bg-linear-to-r from-[#00E5FF] via-[#FF0055] to-[#9b59ff] text-black shadow-lg 
                     hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 focus:ring-[#00E5FF] focus:ring-offset-gray-950"
        >
          {loading ? "Please wait..." : "Submit"}
        </button>

        <p className="mt-4 text-sm text-gray-300 text-center">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onSwitch?.("login")}
            className="text-[#00E5FF] font-semibold hover:text-[#00B8E6] transition-colors cursor-pointer"
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
