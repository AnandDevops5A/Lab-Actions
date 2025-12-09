"use client"

import React, { useState } from 'react';
import Signup from './Signup.jsx';
import Login from './Login.jsx';

// 	const [identifier, setIdentifier] = useState('');
// 	const [password, setPassword] = useState('');

// 	const handleSubmit = (e) => {
// 		e.preventDefault();
// 		console.log('Logging in', { identifier, password });
// 	};

// 	return (
// 		<div className="p-6 sm:p-8 w-full">
// 			<h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 text-center tracking-wider uppercase">ACCESS DEPLOYMENT</h2>
// 			<form onSubmit={handleSubmit} className="space-y-4">
// 				<AuthInput Icon={Hash} placeholder="Player ID or Contact" value={identifier} onChange={(e)=>setIdentifier(e.target.value)} />
// 				<AuthInput Icon={Lock} type="password" placeholder="Secure Access Key" value={password} onChange={(e)=>setPassword(e.target.value)} />

// 				<button type="submit" className="w-full mt-4 py-3 rounded-lg bg-linear-to-r from-[#FF004D] to-[#FF4170] text-white font-extrabold shadow-lg hover:shadow-xl transition-all duration-300 uppercase tracking-widest text-lg border-2 border-red-800">
// 					<LogIn className="inline w-5 h-5 mr-2" />
// 					Join Battle
// 				</button>
// 			</form>

// 			<p className="mt-6 text-sm text-gray-400 text-center">
// 				New to the tournament?{' '}
// 				<button onClick={() => onSwitch('signup')} className="text-[#00E5FF] font-semibold hover:text-[#00B8E6] transition-colors duration-300 inline-flex items-center gap-2">
// 					Register Team <ArrowRight className="w-4 h-4" />
// 				</button>
// 			</p>
// 		</div>
// 	);
// };

// const SignupForm = ({ onSwitch }) => {
// 	const [teamName, setTeamName] = useState('');
// 	const [playerId, setPlayerId] = useState('');
// 	const [contact, setContact] = useState('');
// 	const [password, setPassword] = useState('');

// 	const handleSubmit = (e) => {
// 		e.preventDefault();
// 		console.log('Registering', { teamName, playerId, contact, password });
// 	};

// 	return (
// 		<div className="p-6 sm:p-8 w-full">
// 			<h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 text-center tracking-wider uppercase">TOURNAMENT REGISTRATION</h2>
// 			<form onSubmit={handleSubmit} className="space-y-4">
// 				<AuthInput Icon={Users} placeholder="Team Name" value={teamName} onChange={(e)=>setTeamName(e.target.value)} />
// 				<AuthInput Icon={UserPlus} placeholder="Player ID" value={playerId} onChange={(e)=>setPlayerId(e.target.value)} />
// 				<AuthInput Icon={Phone} placeholder="Contact Number (Squad Leader)" value={contact} onChange={(e)=>setContact(e.target.value)} />
// 				<AuthInput Icon={Lock} type="password" placeholder="New Access Key" value={password} onChange={(e)=>setPassword(e.target.value)} />

// 				<button type="submit" className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-[#FF004D] to-[#FF4170] text-white font-extrabold shadow-lg hover:shadow-xl transition-all duration-300 uppercase tracking-widest text-lg border-2 border-red-800">
// 					<UserPlus className="inline w-5 h-5 mr-2" />
// 					Authorize & Register
// 				</button>
// 			</form>

// 			<p className="mt-6 text-sm text-gray-400 text-center">
// 				Already registered?{' '}
// 				<button onClick={() => onSwitch('login')} className="text-[#00E5FF] font-semibold hover:text-[#00B8E6] transition-colors duration-300 inline-flex items-center gap-2">
// 					<ArrowLeft className="w-4 h-4" /> Login
// 				</button>
// 			</p>
// 		</div>
// 	);
// };

export default function Page() {
	const [mode, setMode] = useState('login');
	const isLogin = mode === 'login';

	return (
		<div className="min-h-screen flex items-center justify-center p-4 antialiased relative bg-[radial-gradient(ellipse_at_top_left,_#001219_0%,_#000000_60%)]">
			<style>{`
				@keyframes glow-pulse { 0%,100%{box-shadow:0 0 15px rgba(0,229,255,0.6),0 0 5px rgba(255,65,112,0.6);} 50%{box-shadow:0 0 25px rgba(0,229,255,0.8),0 0 10px rgba(255,65,112,0.8);} }
				.neon-glow-frame { animation: glow-pulse 5s infinite alternate; border:2px solid; border-image: linear-gradient(to right,#00E5FF,#FF4170) 1; border-radius:1rem }
				.forms-viewport { perspective:1200px }
				.form-visible { opacity:1; transform: translateX(0) rotateY(0deg) scale(1); z-index:2; pointer-events:auto; transition: transform 700ms cubic-bezier(.2,.9,.3,1), opacity 600ms ease; }
				.form-hidden-left { opacity:0; transform: translateX(-18%) rotateY(18deg) scale(.98); z-index:1; pointer-events:none; transition: transform 700ms cubic-bezier(.2,.9,.3,1), opacity 600ms ease; }
				.form-hidden-right { opacity:0; transform: translateX(18%) rotateY(-18deg) scale(.98); z-index:1; pointer-events:none; transition: transform 700ms cubic-bezier(.2,.9,.3,1), opacity 600ms ease; }
				.arrow-pulse { animation: arrowPulse 1.6s infinite; }
				@keyframes arrowPulse { 0%{transform:translateX(0);opacity:.9}50%{transform:translateX(4px);opacity:1}100%{transform:translateX(0);opacity:.9} }
				.group:focus-within svg, .group:hover svg { filter: drop-shadow(0 6px 18px rgba(0,229,255,0.12)); transform: translateY(-1px); transition: all .24s ease; }
			`}</style>

			<div className="absolute inset-0 bg-black/30 z-0"></div>

			<div className="w-full max-w-md mx-auto relative z-10 top-10">
				<div className={`relative w-full neon-glow-frame bg-black/30 transition-all 
          duration-500 ease-in-out rounded-xl ${isLogin ? 'min-h-[420px] p-3' : 'min-h-[500px]'}`}>
					<div className="relative w-full overflow-visible">
						<div className={`absolute top-0 w-full forms-viewport ${isLogin ? 'form-visible' : 'form-hidden-left'}`}>
							<Login onSwitch={(m)=>setMode(m)} />
						</div>
						<div className={`absolute top-0 w-full forms-viewport ${!isLogin ? 'form-visible' : 'form-hidden-right'}`}>
							<Signup onSwitch={(m)=>setMode(m)} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
