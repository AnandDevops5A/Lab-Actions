"use client";
import React, { useContext } from "react";
import { X, User, Mail, Phone, Hash, Calendar, Trophy, DollarSign, Activity, TrendingUp, Award, Medal, Crown } from "lucide-react";
import { ThemeContext } from "../Library/ThemeContext";

const ParticipantDetailsModal = ({ participant, tournament, leaderboardData, onClose }) => {
  const { isDarkMode } = useContext(ThemeContext);

  const totalGames = participant.totalPlay || 0;
  const wins = totalGames - (participant.totallosses || 0);
  const losses = participant.totallosses || 0;
  const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;

  // Get leaderboard data for this participant (now stored in participant object)
  const participantLeaderboard = participant.leaderboardData || {};

  const formatJoiningDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const year = Math.floor(dateStr / 10000);
    const month = Math.floor((dateStr % 10000) / 100);
    const day = dateStr % 100;
    return `${day}/${month}/${year}`;
  };

  const getPerformanceLevel = () => {
    if (winRate >= 80) return { level: "Elite", color: "text-purple-400", icon: Crown };
    if (winRate >= 70) return { level: "Expert", color: "text-blue-400", icon: Award };
    if (winRate >= 60) return { level: "Advanced", color: "text-green-400", icon: Medal };
    if (winRate >= 50) return { level: "Intermediate", color: "text-yellow-400", icon: Trophy };
    return { level: "Beginner", color: "text-gray-400", icon: Activity };
  };

  const performanceLevel = getPerformanceLevel();
  const PerformanceIcon = performanceLevel.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-h-screen bg-[#050505] flex items-center justify-center md:p-3 font-mono w-full max-w-4xl">
        <div className="relative w-full p-0.5 bg-linear-to-br from-green-500 via-transparent to-blue-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <div className="bg-black p-5 sm:p-10 relative border border-green-900/50 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close participant details"
              className="absolute top-0 right-0 bg-red-600 p-2 text-white hover:bg-green-400 hover:text-black transition-colors z-50 group cursor-pointer"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 20% 100%)" }}
            >
              <X size={24} className="group-hover:rotate-180 transition-transform" />
            </button>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-green-400 italic hover:text-blue-300 transition-colors">
                Participant Details{" "}
                <span className="text-blue-500 text-sm sm:text-lg animate-pulse">
                  [v2.001]
                </span>
              </h2>
              <div className="h-1 w-20 bg-green-500 mt-2"></div>
            </div>

            {/* Participant Header */}
            <div className="flex items-center gap-6 mb-8 p-6 bg-gray-900/50 rounded-lg border border-gray-800">
              <div className="h-20 w-20 rounded-full flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-500 text-white text-2xl font-bold">
                {participant.username ? participant.username.charAt(0).toUpperCase() : "?"}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-1">{participant.username}</h3>
                <p className="text-gray-400 mb-2">{participant.callSign}</p>
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                    participant.active
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${participant.active ? "bg-green-400" : "bg-red-400"}`}></span>
                    {participant.active ? "ACTIVE" : "INACTIVE"}
                  </span>
                  <div className="flex items-center gap-2">
                    <PerformanceIcon className={`h-4 w-4 ${performanceLevel.color}`} />
                    <span className={`text-sm font-medium ${performanceLevel.color}`}>{performanceLevel.level}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <Activity className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Games Played</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{totalGames}</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <Trophy className={`h-8 w-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wins</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{wins}</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <TrendingUp className={`h-8 w-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Win Rate</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>{winRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <DollarSign className={`h-8 w-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Invested</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>₹{participant.investAmount?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <Crown className={`h-8 w-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tournament Rank</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      {participantLeaderboard.rank ? `#${participantLeaderboard.rank}` : 'N/A'}
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
                  <h4 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </h4>
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Username:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{participant.username}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Call Sign:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{participant.callSign}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{participant.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Contact:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{participant.contact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Joined:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatJoiningDate(participant.joiningDate)}</span>
                      </div>
                      {participant.transactionId && (
                        <div className="flex justify-between">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Transaction ID:</span>
                          <span className={`font-medium font-mono ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>{participant.transactionId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tournament Registration Status */}
                <div>
                  <h4 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Tournament Status
                  </h4>
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tournament:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{tournament.tournamentName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Registration Status:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                          participant.isApproved
                            ? participant.active
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : participant.transactionId
                              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                              : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        }`}>
                          {participant.isApproved
                            ? participant.active
                              ? "Approved"
                              : "Registered"
                            : participant.transactionId
                              ? "Pending Approval"
                              : "Not Registered"
                          }
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Entry Fee Paid:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>₹{tournament.entryFee || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Performance Metrics */}
                <div>
                  <h4 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Performance Metrics
                  </h4>
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Win Rate</span>
                          <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{winRate.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${winRate}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{wins}</div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wins</div>
                        </div>
                        <div>
                          <div className={`text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{losses}</div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Losses</div>
                        </div>
                        <div>
                          <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{totalGames}</div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div>
                  <h4 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Summary
                  </h4>
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Invested:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>₹{participant.investAmount?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Earnings:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>₹{participantLeaderboard.winAmount?.toLocaleString() || participant.winAmount?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Withdrawals:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>₹{participant.withdrawAmount?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-600 pt-2">
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Current Balance:</span>
                        <span className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>₹{participant.balanceAmount?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="text-lg font-bold text-green-400 mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button className={`p-3 rounded-lg border font-medium transition-colors ${
                      isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}>
                      📧 Send Message
                    </button>
                    <button className={`p-3 rounded-lg border font-medium transition-colors ${
                      isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}>
                      📊 View History
                    </button>
                    <button className={`p-3 rounded-lg border font-medium transition-colors ${
                      isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}>
                      🏆 View Achievements
                    </button>
                    <button className={`p-3 rounded-lg border font-medium transition-colors ${
                      isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}>
                      ⚙️ Manage Settings
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

export default ParticipantDetailsModal;