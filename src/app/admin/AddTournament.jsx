"use client";
import React from "react";
import { X } from "lucide-react"; // Icon library for the cross button
import { errorMessage, successMessage } from "../../lib/utils/alert";
import { FetchBackendAPI } from "../../lib/api/backend-api";
import { setCache } from "../../lib/utils/action-redis";
import { dateInLongFormat } from "@/lib/utils/common";

const inputBoxes = [
  { label: "Prize", type: "number", placeholder: "500", name: "prizePool" },
  { label: "Slots", type: "number", placeholder: "50", name: "slot" },
  {
    label: "plateform",
    type: "text",
    placeholder: "Game plateform",
    name: "plateform",
  },
  { label: "Time", type: "time", placeholder: "01pm = 13", name: "time" },
  { label: "Date", type: "date", placeholder: "02-02-2020", name: "date" },
];


const AddTournamentForm = ({ onClose, refreshData}) => {
  const handleSubmit = async (e) => {
  e.preventDefault();

  // Extract form data
  const formData = new FormData(e.target);
  const tornamentName = formData.get("tornamentName");
  const prizePool = formData.get("prizePool");
  const slot = formData.get("slot");
  const plateform = formData.get("plateform");
  const time = formData.get("time");
  const date = formData.get("date");
  const description = formData.get("description");

  // Validate required fields
  if (
    !tornamentName ||
    !prizePool ||
    !slot ||
    !plateform ||
    !time ||
    !date
  ) {
    errorMessage("All required fields");
    return;
  }

 const dateTime=dateInLongFormat(date);


  // Prepare data payload
  const data = {
    tournamentName: tornamentName,
    prizePool: parseInt(prizePool),
    slot: parseInt(slot),
    platform: plateform,
    dateTime: parseInt(dateTime),
    description: description,
  };

// console.log(data);
  // Submit data to backend
  try {
    // TODO: Replace with your API endpoint
    const response = await fetch("http://localhost:8082/tournament/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      const cacheData = await setCache('upcomingTournament', responseData);
      // console.log(response.data);
      console.log("caching data", cacheData);
      if(!cacheData) errorMessage("Error in caching data");
      successMessage("Tournament created successfully!");
      // console.log(response);
      // Reset form or redirect
      e.target.reset();
      if (refreshData) refreshData();
      onClose(true);
    } else {
      errorMessage("Failed to create tournament");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    errorMessage("Internal Server Error");
  }

};
  return (
    <div className="max-h-screen bg-[#050505] flex items-center justify-center  md:p-3 Rusty Attack animate-slideInUp">
      {/* Main Container - Responsive Widths */}
      <div className="relative w-full max-w-sm sm:max-w-xl md:max-w-3xl lg:max-w-4xl p-0.5 bg-linear-to-br from-green-500 via-transparent to-emerald-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
        {/* The "Cyber-Box" */}
        <div className="bg-black p-5 sm:p-10 relative border border-green-900/50">
          {/* --- CROSS BUTTON (Top Right) --- */}
          <button
            type="button"
            onClick={() => onClose(true)}
            aria-label="Close add tournament"
            className="absolute top-0 right-0 bg-red-600 p-2 text-slate-100 hover:bg-green-400 hover:text-black transition-colors z-50 group cursor-pointer"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 20% 100%)" }}
          >
            <X
              size={24}
              className="group-hover:rotate-180 transition-transform"
            />
          </button>

          {/* Header Section */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-green-400 italic hover:text-emerald-300 transition-colors">
              New Tournament{" "}
              <span className="text-emerald-500 text-sm sm:text-lg animate-pulse">
                [v2.001]
              </span>
            </h2>
            <div className="h-1 w-20 bg-green-500 mt-2"></div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Tournament Name - Full Width */}
            <div className="group">
              <label className="text-xs text-emerald-500 uppercase font-bold tracking-widest mb-2 block">
                {">"} Tournament_Name
              </label>
              <input
                type="text"
                name="tornamentName"
                className="w-full bg-gray-900/50 border border-gray-800 focus:border-green-500 p-3 outline-none text-green-300 placeholder:text-gray-700 transition-all"
                placeholder="NEON_STRIKE_CHAMPIONSHIP"
              />
            </div>

            {/* --- 4 BOX GRID (RESPONSIVE) --- */}
            {/* Mobile: 1 col | Tablet: 2 cols | Desktop: 4 cols */}
            <div className="grid grid-cols-2 md:grid-cols-3  gap-2.5">
              {inputBoxes.map((box, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900/30 border border-green-900 p-3 group hover:border-emerald-500  transition-colors"
                >
                  <label className="text-[10px] text-green-500 uppercase mb-1 block">
                    {box.label}
                  </label>
                  <input
                    type={box.type}
                    placeholder={box.placeholder}
                    className="w-full bg-transparent outline-none text-slate-100 text-sm"
                    name={box.name}
                  />
                </div>
              ))}
            </div>

            {/* Description Area */}
            <details className="group">
              <summary
                className="cursor-pointer text-xs text-emerald-500 uppercase font-bold mb-2 flex items-center gap-2"
              >
                <span className="text-emerald-500">▼</span>
                <span className="text-emerald-500">Add Description</span>
              
              </summary>
              <textarea
                name="description"
                className="w-full bg-gray-900/50 border border-gray-800 focus:border-green-500 p-3 h-24 outline-none text-green-300 transition-all"
                placeholder="Input rules and regulations..."
              />
            </details>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-500 text-slate-100 font-black py-4 uppercase 
            tracking-[0.2em] relative overflow-hidden group transition-all rounded-lg "
            >
              <span className="relative ">Add ➕ </span>
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



