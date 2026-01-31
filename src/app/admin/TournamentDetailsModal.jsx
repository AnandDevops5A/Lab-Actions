"use client";
import React, { useContext } from "react";
import { X, Calendar, Clock, Trophy, Users, DollarSign, MapPin, FileText } from "lucide-react";
import { ThemeContext } from "../../lib/contexts/theme-context";

const TournamentDetailsModal = ({ tournament, onClose }) => {
  const { isDarkMode } = useContext(ThemeContext);

  const formatDateTime = (dateTime) => {
    const dateStr = dateTime.toString();
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    const hour = dateStr.slice(8, 10);
    const minute = dateStr.slice(10, 12);

    const date = new Date(year, month - 1, day);
    const timeString = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;

    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: timeString,
      dateShort: `${day}/${month}/${year}`,
      timeShort: timeString
    };
  };

  const getStatusInfo = (tournament) => {
    const now = new Date();
    const dateOnly = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const currentDateTime = dateOnly * 10000 + currentTime;

    if (tournament.dateTime > currentDateTime) {
      return {
        label: "UPCOMING",
        color: isDarkMode ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-amber-800 bg-amber-100 border-amber-200",
        dotColor: "bg-amber-400",
        description: "Tournament is scheduled for the future"
      };
    } else {
      return {
        label: "COMPLETED",
        color: isDarkMode ? "text-green-400 bg-green-500/10 border-green-500/20" : "text-green-800 bg-green-100 border-green-200",
        dotColor: "bg-green-400",
        description: "Tournament has been completed"
      };
    }
  };

  const { date, time, dateShort, timeShort } = formatDateTime(tournament.dateTime);
  const statusInfo = getStatusInfo(tournament);

  // Mock participant data - in real app this would come from API
  const participants = tournament.rankList ? Object.keys(tournament.rankList).length : 0;
  const maxSlots = tournament.slot || 50;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-h-screen bg-[#050505] flex items-center justify-center md:p-3 Rusty Attack w-full max-w-4xl">
        <div className="relative w-full p-0.5 bg-linear-to-br from-purple-500 via-transparent to-pink-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
          <div className="bg-black p-5 sm:p-10 relative border border-purple-900/50 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close tournament details"
              className="absolute top-0 right-0 bg-red-600 p-2 text-white hover:bg-purple-400 hover:text-black transition-colors z-50 group cursor-pointer"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 20% 100%)" }}
            >
              <X size={24} className="group-hover:rotate-180 transition-transform" />
            </button>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-purple-400 italic hover:text-pink-300 transition-colors">
                Tournament Details{" "}
                <span className="text-pink-500 text-sm sm:text-lg animate-pulse">
                  [v2.001]
                </span>
              </h2>
              <div className="h-1 w-20 bg-purple-500 mt-2"></div>
            </div>

            {/* Tournament Name */}
            <div className="mb-6">
              <h3 className="text-xl sm:text-3xl font-bold text-white mb-2">
                {tournament.tournamentName}
              </h3>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${statusInfo.dotColor}`}></span>
                  {statusInfo.label}
                </span>
                <span className="text-sm text-gray-400">{statusInfo.description}</span>
              </div>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <DollarSign className={`h-8 w-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Prize Pool</p>
                    <p className={`text-xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      ₹{tournament.prizePool?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <Users className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Participants</p>
                    <p className={`text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {participants}/{maxSlots}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <Calendar className={`h-8 w-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date</p>
                    <p className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      {dateShort}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <Clock className={`h-8 w-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time</p>
                    <p className={`text-lg font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                      {timeShort}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Tournament Information
                  </h4>
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Platform:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{tournament.platform}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Max Slots:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{maxSlots}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tournament ID:</span>
                        <span className={`Rusty Attack text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>#{tournament.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date & Time:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{date} at {time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Status */}
                <div>
                  <h4 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Registration Status
                  </h4>
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Registered:</span>
                        <span className={`font-bold text-lg ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{participants}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Available Slots:</span>
                        <span className={`font-bold text-lg ${participants < maxSlots ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')}`}>
                          {maxSlots - participants}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((participants / maxSlots) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {participants < maxSlots ? 'Registration is open' : 'Tournament is full'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Description */}
                {tournament.description && (
                  <div>
                    <h4 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Description & Rules
                    </h4>
                    <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {tournament.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Prize Distribution (Mock data - would come from API) */}
                <div>
                  <h4 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Prize Distribution
                  </h4>
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} font-medium`}>🥇 1st Place:</span>
                        <span className={`font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>₹{Math.floor(tournament.prizePool * 0.5).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>🥈 2nd Place:</span>
                        <span className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>₹{Math.floor(tournament.prizePool * 0.3).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDarkMode ? 'text-orange-400' : 'text-orange-600'} font-medium`}>🥉 3rd Place:</span>
                        <span className={`font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>₹{Math.floor(tournament.prizePool * 0.2).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="text-lg font-bold text-purple-400 mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button className={`p-3 rounded-lg border font-medium transition-colors ${
                      isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}>
                      📋 Copy Details
                    </button>
                    <button className={`p-3 rounded-lg border font-medium transition-colors ${
                      isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}>
                      📊 View Analytics
                    </button>
                    <button className={`p-3 rounded-lg border font-medium transition-colors ${
                      isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}>
                      👥 Manage Participants
                    </button>
                    <button className={`p-3 rounded-lg border font-medium transition-colors ${
                      isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}>
                      📢 Send Announcement
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetailsModal;



