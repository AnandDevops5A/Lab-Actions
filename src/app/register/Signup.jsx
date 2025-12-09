"use client"

import React, { useState } from 'react';
import { Users, UserPlus, Phone, Lock, Eye, EyeOff, Check } from 'lucide-react';

export default function Signup({ onSwitch, onSubmit }) {
  const [teamName, setTeamName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [contact, setContact] = useState('');
  const countries = [
    { code: '+91', label: 'India', emoji: '🇮🇳' },
    { code: '+1', label: 'USA', emoji: '🇺🇸' },
    { code: '+44', label: 'UK', emoji: '🇬🇧' },
    { code: '+92', label: 'Pakistan', emoji: '🇵🇰' },
    { code: '+971', label: 'UAE', emoji: '🇦🇪' },
    { code: '+61', label: 'Australia', emoji: '🇦🇺' },
  ];
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function fakeRegister(payload) {
    await new Promise((r) => setTimeout(r, 900));
    return { ok: true };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!teamName.trim() || !playerId.trim() || !contact.trim() || !password) {
      setError('Please fill all fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    // combine selected country code and local contact for validation
    const combined = `${selectedCountry.code}${contact.trim()}`;
    if (!/^\+[0-9]{7,15}$/.test(combined)) {
      setError('Enter a valid contact number (local number + selected country code).');
      return;
    }

    setLoading(true);
    try {
      const payload = { teamName: teamName.trim(), playerId: playerId.trim(), contact: `${selectedCountry.code}${contact.trim()}`, password };
      const res = onSubmit ? await onSubmit(payload) : await fakeRegister(payload);
      if (res && res.ok === false) {
        setError(res.message || 'Registration failed');
      } else {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onSwitch?.('login');
        }, 900);
      }
    } catch (err) {
      setError(err?.message || 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4 p-4" aria-live="polite">
        <div className="relative group">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00E5FF] opacity-90" aria-hidden />
          <label htmlFor="team" className="sr-only">Team Name</label>
          <input
            id="team"
            name="team"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team Name"
            className="w-full bg-transparent border-b border-[#00E5FF]/10 py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4170] transition-colors"
          />
        </div>

        <div className="relative group">
          <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9b59ff] opacity-90" aria-hidden />
          <label htmlFor="playerId" className="sr-only">Player ID</label>
          <input
            id="playerId"
            name="playerId"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            placeholder="Player ID"
            className="w-full bg-transparent border-b border-[#00E5FF]/10 py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4170] transition-colors"
          />
        </div>

        <div className="relative group gap-1">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF4170] opacity-90" aria-hidden />
          <label htmlFor="contact" className="sr-only">Contact Number</label>

          {/* Country select (emoji + code) positioned after the icon */}
          <select
            aria-label="Country code"
            value={selectedCountry.code}
            onChange={(e) => {
              const found = countries.find(c => c.code === e.target.value);
              if (found) setSelectedCountry(found);
            }}
            className="absolute left-10 top-1/2 -translate-y-1/2 bg-transparent text-white text-sm pl-2 pr-6 py-1 border border-transparent rounded-md focus:outline-none focus:border-[#00E5FF]/30"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code} className="bg-black text-white">{`${c.emoji} ${c.code}`}</option>
            ))}
          </select>

          <input
            id="contact"
            name="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Local number (without country code)"
            className="w-full bg-transparent border-b border-[#00E5FF]/10 py-3 pl-36 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4170] transition-colors"
          />
        </div>

        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00E5FF] opacity-90" aria-hidden />
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Set Access Key"
            type={showPwd ? 'text' : 'password'}
            className="w-full bg-transparent border-b border-[#00E5FF]/10 py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4170] transition-colors"
            autoComplete="new-password"
          />
          <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1" aria-label={showPwd ? 'Hide password' : 'Show password'}>
            {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9b59ff] opacity-70" aria-hidden />
          <label htmlFor="confirm" className="sr-only">Confirm Password</label>
          <input
            id="confirm"
            name="confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm Access Key"
            type={showPwd ? 'text' : 'password'}
            className="w-full bg-transparent border-b border-[#00E5FF]/10 py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4170] transition-colors"
            autoComplete="new-password"
          />
        </div>

        <div role="status" aria-live="polite" className="min-h-[1.25rem] flex items-center justify-center">
          {error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : success ? (
            <div className="flex items-center gap-2 bg-green-900/10 px-3 py-2 rounded-md border border-green-700">
              <Check className="w-5 h-5 text-green-300" />
              <p className="text-sm text-green-300">Registration successful — redirecting...</p>
            </div>
          ) : null}
        </div>

        <div className="pt-2">
          <button type="submit" disabled={loading} className="relative w-full inline-flex items-center justify-center overflow-hidden rounded-lg px-6 py-3 font-extrabold text-lg transition-transform duration-150 transform bg-gradient-to-r from-[#00E5FF] via-[#FF0055] to-[#9b59ff] text-black shadow-lg">
            {loading ? <svg className="w-5 h-5 animate-spin mr-3" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.2)" strokeWidth="4" /><path d="M4 12a8 8 0 018-8" stroke="rgba(0,0,0,0.6)" strokeWidth="4" strokeLinecap="round" /></svg> : null}
            <span className="z-10 text-white focus:pointer-events-none">{loading ? 'Registering...' : 'Create Team'}</span>
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-300 text-center">
          Already have an account?{' '}
          <button type="button" onClick={() => onSwitch?.('login')} className="text-[#00E5FF] font-semibold hover:text-[#00B8E6] transition-colors inline-flex items-center gap-2">
            Back to Login
          </button>
        </p>
      </form>
    </div>
  );
}
