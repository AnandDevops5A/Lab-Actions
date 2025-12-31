"use client";

import React, { useState } from "react";
import { Users, UserPlus, Phone, Lock, Eye, EyeOff, Check, Router } from "lucide-react";
import Swal from "sweetalert2";
import { useFetchBackendAPI } from "../Library/API";
import { validatePassword } from "./PasswordCheck";

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
function InputField({ id, icon: Icon, type = "text", value, onChange, placeholder, extraClass = "" }) {
  return (
    <div className="relative group">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00E5FF] opacity-90" aria-hidden />
      <label htmlFor={id} className="sr-only">{placeholder}</label>
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

export default function Signup({ onSwitch, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    playerId: "",
    contact: "",
    password: "",
    confirm: "",
  });
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    const { name, playerId, contact, password, confirm } = form;
    if (!name.trim() || !playerId.trim() || !contact.trim() || !password) return "Please fill all fields.";
    const paswordValidation = validatePassword(password);
    if (!paswordValidation.valid) return paswordValidation.message;
    if (password !== confirm) return "Passwords do not match.";
    const combined = `${selectedCountry.code}${contact.trim()}`;
    if (!/^\+[0-9]{11,15}$/.test(combined)) return "Enter a valid contact number.";
    return null;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const validationError = validateForm();
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        playerId: form.playerId.trim(),
        contact: `${selectedCountry.code}${form.contact.trim()}`,
        password: form.password,
      };

      console.log("Submitting payload:", payload);

      const res = onSubmit ? await onSubmit(payload) : { ok: true };
      if (!res.ok) {
        setError(res.message || "Registration failed");
      } else {
        setSuccess(true);
        //success popup
        Swal.fire({
          title: "Success!",
          text: "SuccessFully Registered...",
          icon: "success"
        });
      }
    } catch (err) {
      setError(err?.message || "Unexpected error.");
    } finally {
      setLoading(false);
      //rediect to profile page after 2 seconds
      if (success) {
        setTimeout(() => {
          Router.push("/player");
        }, 2000);
      }
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4 p-4" aria-live="polite">
        <InputField id="name" icon={Users} value={form.name} onChange={handleChange} placeholder="Aapka Name" />
        <InputField id="playerId" icon={UserPlus} value={form.playerId} onChange={handleChange} placeholder="Player ID" />

        {/* Contact field with country select */}
        <div className="relative group gap-1">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF4170] opacity-90" aria-hidden />
          <select
            aria-label="Country code"
            value={selectedCountry.code}
            onChange={(e) => setSelectedCountry(COUNTRIES.find(c => c.code === e.target.value))}
            className="absolute left-10 top-1/2 -translate-y-1/2 bg-transparent text-white text-sm pl-2 pr-6 py-1 rounded-md focus:outline-none focus:border-[#00E5FF]/30"
            disabled   //only indian number are allowed
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code} className="bg-black text-white">{`${c.emoji} ${c.code}`}</option>
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
          id="password"
          icon={Lock}
          type={showPwd ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          placeholder="Set Access Key"
          extraClass="pr-12"
        />
        <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-[38%] text-white/80 hover:text-white p-1">
          {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
        <div role="status" aria-live="polite" className="min-h-5 flex items-center justify-center">
          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && (
            <div className="flex items-center gap-2 bg-green-900/10 px-3 py-2 rounded-md border border-green-700">
              <Check className="w-5 h-5 text-green-300" />
              <p className="text-sm text-green-300">Registration successful — redirecting...</p>
            </div>
          )}
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading} className="w-full rounded-lg px-6 py-3 font-extrabold text-lg bg-gradient-to-r from-[#00E5FF] via-[#FF0055] to-[#9b59ff] text-black shadow-lg">
          {loading ? "Registering..." : "Submit"}
        </button>

        <p className="mt-4 text-sm text-gray-300 text-center">
          Already have an account?{" "}
          <button type="button" onClick={() => onSwitch?.("login")} className="text-[#00E5FF] font-semibold hover:text-[#00B8E6] transition-colors">
            Back to Login
          </button>
        </p>
      </form>
    </div>
  );
}
