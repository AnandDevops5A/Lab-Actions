"use client"

import { useState, useEffect } from "react";

export default function MatchJoiningForm() {
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState({ callsign: "", whatsapp: "", gameId: "", transaction: "" });
	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		const handler = () => setOpen(true);
		document.addEventListener("openJoinForm", handler);
		const esc = (e) => e.key === "Escape" && setOpen(false);
		window.addEventListener("keydown", esc);
		return () => {
			document.removeEventListener("openJoinForm", handler);
			window.removeEventListener("keydown", esc);
		};
	}, []);

	function handleChange(e) {
		setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setSubmitting(true);
		// simulate network
		await new Promise((r) => setTimeout(r, 900));
		setSubmitting(false);
		setSuccess(true);
		setTimeout(() => {
			setSuccess(false);
			setOpen(false);
			setForm({ callsign: "", whatsapp: "", gameId: "", transaction: "" });
		}, 1200);
	}

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				onClick={() => setOpen(false)}
			/>

			<div className="relative max-w-lg w-[94%] sm:w-3/4 md:w-2/3 lg:w-1/2 mx-4">
				<div className="neon-modal-animate transform transition-all duration-400 scale-100 -translate-y-2">
					<div className="relative bg-gradient-to-br from-neutral-900/95 to-neutral-800/95 border border-[#00fff0]/10 rounded-2xl p-6 neon-glow">
						{/* decorative neon accents */}
						<span className="absolute -left-6 -top-6 w-24 h-1 bg-gradient-to-r from-[#00fff0] to-[#ff0055] opacity-80 blur-sm rotate-12"></span>
						<span className="absolute -right-6 -bottom-6 w-24 h-1 bg-gradient-to-r from-[#9b59ff] to-[#ff0055] opacity-70 blur-sm -rotate-12"></span>
								<div className="flex items-start justify-between gap-4">
							<div>
								<h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
									Join Tournament
								</h3>
								<p className="text-sm text-gray-300/80 mt-1">
									Submit your details to secure a spot. Double-check your transaction id.
								</p>
							</div>
									<button
										aria-label="close"
										onClick={() => setOpen(false)}
										className="text-[#00fff0] hover:text-white p-2 rounded-md transition border border-transparent hover:border-[#00fff0]/30"
									>
										✕
									</button>
						</div>

								<form onSubmit={handleSubmit} className="mt-5 space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<label className="flex flex-col">
									<span className="text-xs text-gray-300 mb-1">Callsign</span>
									<div className="relative">
										<svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00fff0]/90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
											<path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
											<path d="M20 21c0-3.866-3.582-7-8-7s-8 3.134-8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
										<input
											name="callsign"
											value={form.callsign}
											onChange={handleChange}
											required
											placeholder="e.g. ShadowFury"
											className="w-full bg-transparent border-2 border-[#00fff0]/10 rounded-md px-3 pl-10 py-2 text-white placeholder-gray-400 focus:outline-none neon-input transition-colors duration-200"
										/>
									</div>
								</label>

								<label className="flex flex-col">
									<span className="text-xs text-gray-300 mb-1">WhatsApp No.</span>
									<div className="relative">
										<svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9b59ff]/80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
											<path d="M21 16.5a11.683 11.683 0 01-5.2 4.9l-1.9.8a1.2 1.2 0 01-1.3-.3l-3.2-3.9a1.2 1.2 0 01-.2-1.1l.6-1.8a11.7 11.7 0 014.7-4.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
											<path d="M17 7a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" fill="currentColor" />
										</svg>
										<input
											name="whatsapp"
											value={form.whatsapp}
											onChange={handleChange}
											required
											inputMode="tel"
											placeholder="e.g. +911234567890"
											className="w-full bg-transparent border-2 border-[#00fff0]/10 rounded-md px-3 pl-10 py-2 text-white placeholder-gray-400 focus:outline-none neon-input transition-colors duration-200"
										/>
									</div>
								</label>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<label className="flex flex-col">
									<span className="text-xs text-gray-300 mb-1">Game ID</span>
									<div className="relative">
										<svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ff0055]/90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
											<path d="M6 12v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
											<rect x="6" y="12" width="12" height="7" rx="2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
										<input
											name="gameId"
											value={form.gameId}
											onChange={handleChange}
											required
											placeholder="Player Game ID"
											className="w-full bg-transparent border-2 border-[#9b59ff]/10 rounded-md px-3 pl-10 py-2 text-white placeholder-gray-400 focus:outline-none neon-input transition-colors duration-200"
										/>
									</div>
								</label>

								<label className="flex flex-col">
									<span className="text-xs text-gray-300 mb-1">Transaction No.</span>
									<div className="relative">
										<svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ff7a00]/90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
											<path d="M21 8V7a2 2 0 00-2-2H5a2 2 0 00-2 2v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
											<rect x="3" y="8" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
											<path d="M7 12h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
										<input
											name="transaction"
											value={form.transaction}
											onChange={handleChange}
											required
											placeholder="TXN12345XXXXX"
											className="w-full bg-transparent border-2 border-[#ff0055]/10 rounded-md px-3 pl-10 py-2 text-white placeholder-gray-400 focus:outline-none neon-input transition-colors duration-200"
										/>
									</div>
								</label>
							</div>

							<div className="pt-2">
								<button
									type="submit"
									disabled={submitting}
									className={`neon-accent-btn neon-pulse-slow relative w-full inline-flex items-center justify-center overflow-hidden rounded-lg px-6 py-3 font-extrabold text-lg transition-transform duration-200 transform ${
										submitting ? "scale-95" : "hover:scale-105"
									} from-[#00fff0] via-[#ff0055] to-[#9b59ff] text-white`}
									style={{ background: 'linear-gradient(90deg,#00fff0, #ff0055, #9b59ff)' }}
								>
									<span className="absolute inset-0 opacity-30 blur-xl" style={{ background: 'linear-gradient(90deg,#00fff0, #ff0055, #9b59ff)' }} />

									<span className="relative z-10 flex items-center gap-3">
										{submitting ? (
											<svg
												className="w-5 h-5 animate-spin"
												viewBox="0 0 24 24"
												fill="none"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												/>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
												/>
											</svg>
										) : success ? (
											<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
												<path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										) : (
											<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
												<path d="M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
												<path d="M12 5v14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										)}
										<span>{submitting ? "Submitting.." : success ? "Joined" : "AGGRO JOIN"}</span>
									</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

