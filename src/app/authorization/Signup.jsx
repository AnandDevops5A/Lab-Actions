"use client";

import React, { useContext, useState } from "react";
import { Users, UserPlus, Phone, Lock, Eye, EyeOff, Check } from "lucide-react";
import { useFetchBackendAPI } from "../Library/API";
import { validatePassword } from "./PasswordCheck";
import { useRouter } from "next/navigation";
import { errorMessage, successMessage } from "../Library/Alert";
import { getCache, setCache } from "../Library/ActionRedis";
import { UserContext } from "../Library/ContextAPI";

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
  value,
  onChange,
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
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-transparent border-b border-[#00E5FF]/10 py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4170] transition-colors ${extraClass}`}
      />
    </div>
  );
}

export default function Signup({ onSwitch }) {
  const Router = useRouter();
  const { setUser } = useContext(UserContext);
  const [form, setForm] = useState({
    username: "",
    callSign: "",
    contact: "",
    accessKey: "",
    confirm: "",
  });
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    const { username, callSign, contact, accessKey, confirm } = form;
    if (!username.trim() || !callSign.trim() || !contact.trim() || !accessKey)
      return "Please fill all fields.";
    const paswordValidation = validatePassword(accessKey);
    if (!paswordValidation.valid) return paswordValidation.message;
    if (accessKey !== confirm) return "Passwords do not match.";
    const combined = `${selectedCountry.code}${contact.trim()}`;
    if (!/^\+[0-9]{11,15}$/.test(combined))
      return "Enter a valid contact number.";
    return null;
  };

  async function onSubmit(payload) {
    console.log("Submitting payload:", payload);
    const res = await useFetchBackendAPI("users/register", {
      method: "POST",
      data: payload,
    });
    const status = await setCache("activeUser", res.data);
    //set to context userdata
    setUser(res.data);
    if (!status.status) {
      errorMessage("Error caching user data");
    } else {
    }

    console.log("Data found", res.data);
    return { ok: true };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const validationError = validateForm();
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      const payload = {
        username: form.username.trim(),
        callSign: form.callSign.trim(),
        contact: `${selectedCountry.code}${form.contact.trim()}`,
        accessKey: form.accessKey,
      };

      // console.log("Submitting payload:", payload);

      const res = await onSubmit(payload);
      if (!res.ok) {
        errorMessage(res.message || "Server Error");
      } else {
        setSuccess(true);
        //success popup
        successMessage("Succesfully Registered...");
      }
    } catch (err) {
      // setError(err?.message || "Unexpected error.");
      errorMessage(err?.message || "Unexpected error.");
    } finally {
      setLoading(false);
      //rediect to profile page after 2 seconds
      if (success) {
        Router.push("/player");
      }
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
          value={form.username}
          onChange={handleChange}
          placeholder="Aapka Name"
        />
        <InputField
          id="callSign"
          icon={UserPlus}
          value={form.callSign}
          onChange={handleChange}
          placeholder="Call Sign"
        />

        {/* Contact field with country select */}
        <div className="relative group gap-1">
          <Phone
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF4170] opacity-90"
            aria-hidden
          />
          <select
            aria-label="Country code"
            value={selectedCountry.code}
            onChange={(e) =>
              setSelectedCountry(
                COUNTRIES.find((c) => c.code === e.target.value)
              )
            }
            className="absolute left-10 top-1/2 -translate-y-1/2 bg-transparent text-white text-sm pl-2 pr-6 py-1 rounded-md focus:outline-none focus:border-[#00E5FF]/30"
            disabled //only indian number are allowed
          >
            {COUNTRIES.map((c) => (
              <option
                key={c.code}
                value={c.code}
                className="bg-black text-white"
              >{`${c.emoji} ${c.code}`}</option>
            ))}
          </select>
          <input
            id="contact"
            type="number"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Local number"
            className="w-full bg-transparent border-b border-[#00E5FF]/10 py-3 pl-36 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4170] transition-colors"
          />
        </div>

        {/* Password */}
        <InputField
          id="accessKey"
          icon={Lock}
          type={showPwd ? "text" : "password"}
          value={form.accessKey}
          onChange={handleChange}
          placeholder="Set Access Key"
          extraClass="pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPwd(!showPwd)}
          className="absolute right-3 top-[38%] text-white/80 hover:text-white p-1"
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
          value={form.confirm}
          onChange={handleChange}
          placeholder="Confirm Access Key"
        />

        {/* Status */}
        <div
          role="status"
          aria-live="polite"
          className="min-h-5 flex items-center justify-center"
        >
          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && (
            <div className="flex items-center gap-2 bg-green-900/10 px-3 py-2 rounded-md border border-green-700">
              <Check className="w-5 h-5 text-green-300" />
              <p className="text-sm text-green-300">
                Registration successful — redirecting...
              </p>
            </div>
          )}
        </div>

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
}
