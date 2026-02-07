"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { errorMessage, successMessage } from "../../lib/utils/alert";
import {  updateTournament } from "../../lib/api/backend-api";

const EditTournamentForm = ({ tournament, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    tournamentName: tournament.tournamentName,
    prizePool: tournament.prizePool,
    slot: tournament.slot || 50,
    platform: tournament.platform,
    time: tournament.time || "13:00",
    date: tournament.date || new Date().toISOString().split("T")[0],
    description: tournament.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.tournamentName ||
      !formData.prizePool ||
      !formData.slot ||
      !formData.platform ||
      !formData.time ||
      !formData.date
    ) {
      errorMessage("All required fields must be filled");
      return;
    }

    // Format dateTime
    const [year, month, day] = formData.date.split("-");
    const timeFormatted = formData.time.replace(":", "");
    const dateTime = parseInt(`${year}${month}${day}${timeFormatted}`);

    const data = {
      id: tournament.id,
      tournamentName: formData.tournamentName,
      prizePool: parseInt(formData.prizePool),
      slot: parseInt(formData.slot),
      platform: formData.platform,
      dateTime: dateTime,
      description: formData.description,
    };

    try {
      const response = await updateTournament(data);
      if (response.ok) {
        successMessage("Tournament updated successfully!");
        if (refreshData) refreshData();
        onClose();
      } else {
        errorMessage("Failed to update tournament");
      }
    } catch (error) {
      console.error("Error updating tournament:", error);
      errorMessage("Internal Server Error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-h-screen bg-[#050505] flex items-center justify-center md:p-3 Rusty Attack w-full max-w-2xl">
        <div className="relative w-full max-w-sm sm:max-w-xl md:max-w-3xl p-0.5 bg-linear-to-br from-blue-500 via-transparent to-cyan-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <div className="bg-black p-5 sm:p-10 relative border border-blue-900/50">
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close edit tournament"
              className="absolute top-0 right-0 bg-red-600 p-2 text-slate-100 hover:bg-blue-400 hover:text-black transition-colors z-50 group cursor-pointer"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 20% 100%)" }}
            >
              <X
                size={24}
                className="group-hover:rotate-180 transition-transform"
              />
            </button>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-blue-400 italic hover:text-cyan-300 transition-colors">
                Edit Tournament{" "}
                <span className="text-cyan-500 text-sm sm:text-lg animate-pulse">
                  [v2.001]
                </span>
              </h2>
              <div className="h-1 w-20 bg-blue-500 mt-2"></div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Tournament Name */}
              <div className="group">
                <label className="text-xs text-cyan-500 uppercase font-bold tracking-widest mb-2 block">
                  Tournament_Name
                </label>
                <input
                  type="text"
                  name="tournamentName"
                  value={formData.tournamentName}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-gray-800 focus:border-blue-500 p-3 outline-none text-blue-300 placeholder:text-gray-700 transition-all"
                  placeholder="NEON_STRIKE_CHAMPIONSHIP"
                />
              </div>

              {/* Grid for other fields */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                <div className="bg-gray-900/30 border border-blue-900 p-3 group hover:border-cyan-500 transition-colors">
                  <label className="text-[10px] text-blue-500 uppercase mb-1 block">
                    Prize Pool
                  </label>
                  <input
                    type="number"
                    name="prizePool"
                    value={formData.prizePool}
                    onChange={handleChange}
                    placeholder="500"
                    className="w-full bg-transparent outline-none text-slate-100 text-sm"
                  />
                </div>

                <div className="bg-gray-900/30 border border-blue-900 p-3 group hover:border-cyan-500 transition-colors">
                  <label className="text-[10px] text-blue-500 uppercase mb-1 block">
                    Slots
                  </label>
                  <input
                    type="number"
                    name="slot"
                    value={formData.slot}
                    onChange={handleChange}
                    placeholder="50"
                    className="w-full bg-transparent outline-none text-slate-100 text-sm"
                  />
                </div>

                <div className="bg-gray-900/30 border border-blue-900 p-3 group hover:border-cyan-500 transition-colors">
                  <label className="text-[10px] text-blue-500 uppercase mb-1 block">
                    Platform
                  </label>
                  <input
                    type="text"
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    placeholder="Game platform"
                    className="w-full bg-transparent outline-none text-slate-100 text-sm"
                  />
                </div>

                <div className="bg-gray-900/30 border border-blue-900 p-3 group hover:border-cyan-500 transition-colors">
                  <label className="text-[10px] text-blue-500 uppercase mb-1 block">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-slate-100 text-sm"
                  />
                </div>

                <div className="bg-gray-900/30 border border-blue-900 p-3 group hover:border-cyan-500 transition-colors md:col-span-2">
                  <label className="text-[10px] text-blue-500 uppercase mb-1 block">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-slate-100 text-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <details className="group">
                <summary className="cursor-pointer text-xs text-cyan-500 uppercase font-bold mb-2 flex items-center gap-2">
                  <span className="text-cyan-500">▼</span>
                  <span className="text-cyan-500">Edit Description</span>
                </summary>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-gray-800 focus:border-blue-500 p-3 h-24 outline-none text-blue-300 transition-all"
                  placeholder="Input rules and regulations..."
                />
              </details>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-slate-100 font-black py-4 uppercase
              tracking-[0.2em] relative overflow-hidden group transition-all rounded-lg"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>Update Tournament</span>
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTournamentForm;
