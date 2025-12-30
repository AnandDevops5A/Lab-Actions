'use client'
import React from 'react';
import { X } from 'lucide-react'; // Icon library for the cross button

const AddTournamentForm = ({ onClose }) => {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center  md:p-3 font-mono">

            {/* Main Container - Responsive Widths */}
            <div className="relative w-full max-w-sm sm:max-w-xl md:max-w-3xl lg:max-w-4xl p-0.5 bg-linear-to-br from-cyan-500 via-transparent to-pink-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]">

                {/* The "Cyber-Box" */}
                <div className="bg-black p-5 sm:p-10 relative border border-cyan-900/50">

                    {/* --- CROSS BUTTON (Top Right) --- */}
                    <button
                        onClick={() => onClose(true)}
                        className="absolute top-0 right-0 bg-pink-600 p-2 text-black hover:bg-cyan-400 transition-colors z-50 group cursor-pointer"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 20% 100%)' }}
                    >
                        <X size={24} className="group-hover:rotate-90 transition-transform" />
                    </button>

                    {/* Header Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-cyan-400 italic">
                            New Tournament <span className="text-pink-500 text-sm sm:text-lg animate-pulse">[v2.077]</span>
                        </h2>
                        <div className="h-1 w-20 bg-cyan-500 mt-2"></div>
                    </div>

                    <form className="space-y-6">
                        {/* Tournament Name - Full Width */}
                        <div className="group">
                            <label className="text-xs text-pink-500 uppercase font-bold tracking-widest mb-2 block">
                                {">"} Tournament_Title
                            </label>
                            <input
                                type="text"
                                className="w-full bg-gray-900/50 border border-gray-800 focus:border-cyan-500 p-3 outline-none text-cyan-300 placeholder:text-gray-700 transition-all"
                                placeholder="NEON_STRIKE_CHAMPIONSHIP"
                            />
                        </div>

                        {/* --- 4 BOX GRID (RESPONSIVE) --- */}
                        {/* Mobile: 1 col | Tablet: 2 cols | Desktop: 4 cols */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                            {[
                                { label: 'Prize', type: 'number', placeholder: '5000' },
                                { label: 'Slots', type: 'number', placeholder: '50' },
                                { label: 'Entry', type: 'number', placeholder: '100' },
                                { label: 'LVL', type: 'text', placeholder: 'Elite' },
                            ].map((box, idx) => (
                                <div key={idx} className="bg-gray-900/30 border border-cyan-900 p-3 group hover:border-pink-500 transition-colors">
                                    <label className="text-[10px] text-cyan-500 uppercase mb-1 block">{box.label}</label>
                                    <input
                                        type={box.type}
                                        placeholder={box.placeholder}
                                        className="w-full bg-transparent outline-none text-white text-sm"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Description Area */}
                        <div>
                            <label className="text-xs text-pink-500 uppercase font-bold mb-2 block">{">"} Logic_Brief</label>
                            <textarea
                                className="w-full bg-gray-900/50 border border-gray-800 focus:border-cyan-500 p-3 h-24 outline-none text-cyan-300 transition-all"
                                placeholder="Input rules and regulations..."
                            />
                        </div>

                        {/* Submit Button */}
                        <button className="w-full bg-cyan-500  text-black font-black py-4 uppercase 
            tracking-[0.2em] relative overflow-hidden group transition-all rounded-lg hover:scale-3d">
                            <span className="relative ">Add➕ </span>
                            {/* Glitch Overlay effect */}
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default AddTournamentForm;