
"use client"

import React, { useState } from 'react';
import { Hash, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login({ onSwitch, onSubmit }) {
	const [identifier, setIdentifier] = useState('');
	const [password, setPassword] = useState('');
	const [showPwd, setShowPwd] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	async function fakeLogin(payload) {
		// placeholder to simulate network latency
		await new Promise((r) => setTimeout(r, 700));
		return { ok: true };
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');
		if (!identifier.trim() || !password) {
			setError('Please enter both Player ID and password.');
			return;
		}

		setLoading(true);
		try {
			const payload = { identifier: identifier.trim(), password };
			const result = onSubmit ? await onSubmit(payload) : await fakeLogin(payload);
			if (result && result.ok === false) {
				setError(result.message || 'Login failed.');
			}
		} catch (err) {
			setError(err?.message || 'Unexpected error.');
		} finally {
			setLoading(false);
		}
	}

	return (
		// <div className="w-full ">
		// 	<form onSubmit={handleSubmit} className="space-y-4 p-4" aria-describedby="login-error">

		// 		<div className="relative group">
		// 			<Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00E5FF] opacity-90" aria-hidden />
		// 			<label htmlFor="identifier" className="sr-only">Player ID or Contact</label>
		// 			<input
		// 				id="identifier"
		// 				name="identifier"
		// 				value={identifier}
		// 				onChange={(e) => setIdentifier(e.target.value)}
		// 				placeholder="Player ID or Contact"
		// 				className="w-full bg-transparent border-b border-[#00E5FF]/10 py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4170] transition-colors"
		// 				autoComplete="username"
		// 			/>
		// 		</div>

		// 		<div className="relative group">
		// 			<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF4170] opacity-90" aria-hidden />
		// 			<label htmlFor="password" className="sr-only">Password</label>
		// 			<input
		// 				id="password"
		// 				name="password"
		// 				value={password}
		// 				onChange={(e) => setPassword(e.target.value)}
		// 				placeholder="Secure Access Key"
		// 				type={showPwd ? 'text' : 'password'}
		// 				className="w-full bg-transparent border-b border-[#00E5FF]/10 py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4170] transition-colors"
		// 				autoComplete="current-password"
		// 			/>

		// 			<button
		// 				type="button"
		// 				onClick={() => setShowPwd((s) => !s)}
		// 				className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1"
		// 				aria-label={showPwd ? 'Hide password' : 'Show password'}
		// 			>
		// 				{showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
		// 			</button>
		// 		</div>

		// 		<div role="status" aria-live="polite" className="min-h-5">
		// 			{error ? <p id="login-error" className="text-sm text-red-400">{error}</p> : null}
		// 		</div>

		// 		<div className="pt-2">
		// 			<button
		// 				type="submit"
		// 				disabled={loading}
		// 				className="relative w-full inline-flex items-center justify-center overflow-hidden rounded-lg px-6 py-3 font-extrabold text-lg transition-transform duration-150 transform
        //                  bg-linear-to-r from-[#00E5FF] via-[#FF0055] to-[#9b59ff] text-black shadow-lg focus:pointer-events-none"
		// 			>
		// 				{loading ? (
		// 					<svg className="w-5 h-5 animate-spin mr-3" viewBox="0 0 24 24" fill="none">
		// 						<circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.2)" strokeWidth="4" />
		// 						<path d="M4 12a8 8 0 018-8" stroke="rgba(0,0,0,0.6)" strokeWidth="4" strokeLinecap="round" />
		// 					</svg>
		// 				) : null}
		// 				<span className="z-10 text-white">{loading ? 'Signing in...' : 'Sign In'}</span>
		// 			</button>
		// 		</div>

		// 		<p className="mt-4 text-sm text-gray-300 text-center">
		// 			New here?{' '}
		// 			<button type="button" onClick={() => onSwitch?.('signup')} className="text-[#00E5FF] font-semibold hover:text-[#00B8E6] transition-colors inline-flex items-center gap-2">
		// 				Create Team
		// 			</button>
		// 		</p>
		// 	</form>
		// </div>
    
<div className="w-full">
    
    {/* Aggressive Cyberpunk Heading */}
    <div className="px-4 py-6 text-center">
        <h1 
            // Aggressive, cyberpunk styling
            className="sm:text-xl text-3xl font-extrabold uppercase tracking-widest text-white 
                       drop-shadow-[0_0_8px_#FF4170] leading-tight" 
        >
            <span className="text-[#00E5FF]">VERIFY</span> YOURSELF
        </h1>
    </div>
    
    {/* Form Start */}
    <form onSubmit={handleSubmit} className="space-y-4 p-4" aria-describedby="login-error">
        
        {/* Identifier Input */}
        <div className="relative group">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00E5FF] opacity-90" aria-hidden />
            <label htmlFor="identifier" className="sr-only">Player ID or Contact</label>
            <input
                id="identifier"
                name="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Player ID or Contact"
                className="w-full bg-transparent border-b border-[#00E5FF]/10 py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4170] transition-colors"
                autoComplete="username"
            />
        </div>

        {/* Password Input */}
        <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF4170] opacity-90" aria-hidden />
            <label htmlFor="password" className="sr-only">Password</label>
            <input
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Secure Access Key"
                type={showPwd ? 'text' : 'password'}
                className="w-full bg-transparent border-b border-[#00E5FF]/10 py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4170] transition-colors"
                autoComplete="current-password"
            />

            <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
            >
                {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
        </div>

        {/* Error Message */}
        <div role="status" aria-live="polite" className="min-h-5">
            {error ? <p id="login-error" className="text-sm text-red-400">{error}</p> : null}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
            <button
                type="submit"
                disabled={loading}
                className="relative w-full inline-flex items-center justify-center overflow-hidden rounded-lg px-6 py-3 font-extrabold text-lg transition-transform duration-150 transform
                         bg-linear-to-r from-[#00E5FF] via-[#FF0055] to-[#9b59ff] text-black shadow-lg focus:pointer-events-none"
            >
                {loading ? (
                    <svg className="w-5 h-5 animate-spin mr-3" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.2)" strokeWidth="4" />
                        <path d="M4 12a8 8 0 018-8" stroke="rgba(0,0,0,0.6)" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                ) : null}
                <span className="z-10 text-white">{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
        </div>

        {/* Switch to Signup */}
        <p className="mt-4 text-sm text-gray-300 text-center">
            New here?{' '}
            <button type="button" onClick={() => onSwitch?.('signup')} className="text-[#00E5FF] font-semibold hover:text-[#00B8E6] transition-colors inline-flex items-center gap-2">
                Create Team
            </button>
        </p>
    </form>
</div>
	);
}

