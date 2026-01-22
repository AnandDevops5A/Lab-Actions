"use client";
import React, { useContext } from "react";
import {
  X,
  Trophy,
  TrendingUp,
  Activity,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  Hash,
  Shield,
} from "lucide-react";
import { ThemeContext } from "../Library/ThemeContext";

// StatCard component moved outside to avoid creating during render
const StatCard = ({ icon: Icon, label, value, subValue, isDarkMode }) => (
  <div
    className={`p-4 rounded-lg border ${isDarkMode ? 'border-cyan-500/20' : 'border-blue-100'} ${isDarkMode ? 'bg-black/40' : 'bg-gray-50'} flex items-start space-x-3`}
  >
    <div
      className={`p-2 rounded-md ${isDarkMode ? "bg-cyan-500/10 text-cyan-400" : "bg-blue-100 text-blue-600"}`}
    >
      <Icon size={20} />
    </div>
    <div>
      <p
        className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-cyan-500' : 'text-blue-600'}`}
      >
        {label}
      </p>
      <p className={`text-lg font-mono font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </p>
      {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
    </div>
  </div>
);

// DetailRow component moved outside to avoid creating during render
const DetailRow = ({ icon: Icon, label, value, isDarkMode }) => (
  <div
    className={`flex items-center justify-between p-3 border-b ${isDarkMode ? "border-gray-800" : "border-gray-100"} last:border-0`}
  >
    <div className="flex items-center space-x-3">
      <Icon
        size={16}
        className={isDarkMode ? "text-gray-500" : "text-gray-400"}
      />
      <span
        className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
      >
        {label}
      </span>
    </div>
    <span className={`font-mono text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {value || "N/A"}
    </span>
  </div>
);

const ViewParticipation = ({ data, onClose }) => {
  const { isDarkMode } = useContext(ThemeContext);

  const total = data.totalPlay || 0;
  const wins = data.totalWin || (data.totalPlay && data.totallosses != null ? data.totalPlay - data.totallosses : 0);
  const winRate = total > 0 ? (wins / total) * 100 : 0;

  const themeColors = {
    border: isDarkMode ? "border-cyan-500/30" : "border-blue-200",
    bg: isDarkMode ? "bg-gray-950" : "bg-white",
    label: isDarkMode ? "text-cyan-600" : "text-blue-400",
    cardBorder: isDarkMode ? "border-gray-800" : "border-blue-100",
    cardBg: isDarkMode ? "bg-gray-900/50" : "bg-blue-50/50",
    text: isDarkMode ? "text-cyan-400" : "text-blue-600"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono no-scrollbar">
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border ${themeColors.border} ${themeColors.bg} shadow-[0_0_50px_rgba(6,182,212,0.15)]`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"} ${themeColors.bg}`}
        >
          <div>
            <h2
              className={`text-2xl font-black uppercase tracking-tighter ${isDarkMode ? "text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500" : "text-gray-900"}`}
            >
              Participant_Profile
            </h2>
            <p className={`text-xs tracking-widest ${themeColors.label}`}>
              ID: {data.id || data._id || "UNKNOWN"}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-gray-800 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"}`}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-8">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Trophy}
              label="Win Rate"
              value={`${winRate.toFixed(1)}%`}
              subValue={`${wins} Wins / ${total} Plays`}
              isDarkMode={isDarkMode}
            />
            <StatCard
              icon={DollarSign}
              label="Total Earnings"
              value={`₹${data.winAmount?.toLocaleString() || 0}`}
              isDarkMode={isDarkMode}
            />
            <StatCard
              icon={Activity}
              label="Status"
              value={data.active ? "ACTIVE" : "INACTIVE"}
              isDarkMode={isDarkMode}
            />
            <StatCard
              icon={TrendingUp}
              label="Invested"
              value={`₹${data.investAmount?.toLocaleString() || 0}`}
              isDarkMode={isDarkMode}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Info Column */}
            <div
              className={`lg:col-span-1 rounded-xl border ${themeColors.cardBorder} ${themeColors.cardBg} overflow-hidden`}
            >
              <div
                className={`p-4 border-b ${themeColors.cardBorder} bg-gray-900/20`}
              >
                <h3
                  className={`font-bold uppercase tracking-wider ${themeColors.text}`}
                >
                  Identity_Matrix
                </h3>
              </div>
              <div className="p-2">
                <DetailRow icon={User} label="Username" value={data.username} isDarkMode={isDarkMode} />
                <DetailRow icon={Mail} label="Email" value={data.email} isDarkMode={isDarkMode} />
                <DetailRow icon={Phone} label="Contact" value={data.contact} isDarkMode={isDarkMode} />
                <DetailRow
                  icon={Hash}
                  label="Call Sign"
                  value={data.callSign}
                  isDarkMode={isDarkMode}
                />
                {/* <DetailRow icon={Shield} label="Access Key" value={data.accessKey} isDarkMode={isDarkMode} /> */}
                <DetailRow
                  icon={Calendar}
                  label="Joined"
                  value={data.joiningDate}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>

            {/* Financial/Game Stats Column */}
            <div
              className={`lg:col-span-2 rounded-xl border ${themeColors.cardBorder} ${themeColors.cardBg} overflow-hidden`}
            >
              <div
                className={`p-4 border-b ${themeColors.cardBorder} bg-gray-900/20`}
              >
                <h3
                  className={`font-bold uppercase tracking-wider ${themeColors.text}`}
                >
                  Performance_Log
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4
                      className={`text-xs font-bold uppercase ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Financials
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          Balance
                        </span>
                        <span
                          className={`font-mono font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}
                        >
                          ₹{data.balanceAmount?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          Withdrawn
                        </span>
                        <span
                          className={`font-mono ${isDarkMode ? "text-red-400" : "text-red-600"}`}
                        >
                          ₹{data.withdrawAmount?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 h-1 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-green-500 h-full"
                          style={{
                            width: `${(data.winAmount / (data.investAmount || 1)) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-right text-gray-500">
                        ROI Indicator
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4
                      className={`text-xs font-bold uppercase ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Match Statistics
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          Total Matches
                        </span>
                        <span className="font-mono">{data.totalPlay || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          Victories
                        </span>
                        <span
                          className={`font-mono ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}
                        >
                          {data.totalWin || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          Defeats
                        </span>
                        <span
                          className={`font-mono ${isDarkMode ? "text-pink-500" : "text-red-500"}`}
                        >
                          {data.totallosses || 0}
                        </span>
                      </div>
                    </div>
                    
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`p-6 border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"} flex justify-end gap-3`}>
           <button 
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-bold uppercase text-sm tracking-wider transition-all ${isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
          >
            Close
          </button>
          <button className={`px-6 py-2 rounded-lg font-bold uppercase text-sm tracking-wider transition-all ${isDarkMode ? "bg-pink-600 hover:bg-pink-500 text-white shadow-[0_0_15px_rgba(219,39,119,0.4)]" : "bg-red-600 hover:bg-red-700 text-white"}`}>
            Ban User
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewParticipation;
