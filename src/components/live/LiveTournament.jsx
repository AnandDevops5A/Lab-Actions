"use client";
import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../lib/contexts/theme-context";
import { FetchBackendAPI } from "@/lib/api/backend-api";
import { SkeletonCard } from "@/app/skeleton/Skeleton";
import { errorMessage } from "@/lib/utils/alert";

const LiveTournament = ({ query = "game tournament", joinUrl = "#", showChat = true, tournamentId = null, tournamentURL = null }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [streams, setStreams] = useState([]);
  const [selected, setSelected] = useState(null);
  const [chatVisible, setChatVisible] = useState(showChat);
  const [matchMeta, setMatchMeta] = useState(null);

  const buttonStyles = isDarkMode
    ? `relative overflow-hidden rounded-lg px-6 py-3 font-bold text-sm tracking-wider uppercase transition-all duration-300 ease-out bg-linear-to-r from-cyan-500 to-blue-500 text-black hover:from-cyan-400 hover:to-blue-400 hover:scale-105 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-400/70 border border-cyan-400/50`
    : `relative overflow-hidden rounded-lg px-6 py-3 font-bold text-sm tracking-wider uppercase transition-all duration-300 ease-out bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 border border-transparent`;

  useEffect(() => {
    if (!tournamentURL) {
      errorMessage("No tournament URL provided. Unable to fetch live streams.");
      setLoading(false);
      return;
    }
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [tournamentURL]);

  const videoId = parseYouTubeId(tournamentURL);
  const streamData = videoId ? {
    videoId,
    title: 'Cyberpunk Tournament Live',
    channelTitle: 'Neon Arena',
    liveViewerCount: Math.floor(Math.random() * 10000) + 1000,
    startTime: new Date(),
    thumbnail: null
  } : null;

  const videoUrl = streamData ? `https://www.youtube.com/embed/${streamData.videoId}?autoplay=1&mute=1` : null;
  const chatUrl = streamData && typeof window !== 'undefined' ? `https://www.youtube.com/live_chat?v=${streamData.videoId}&embed_domain=${window.location.hostname}` : null;

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-linear-to-br from-gray-900 via-black to-gray-900' : 'bg-gray-100'}`}>
      <div className="text-center">
        <div className={`w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4 ${isDarkMode ? 'border-cyan-500 border-t-transparent' : 'border-blue-500 border-t-transparent'}`}></div>
        <p className={`text-lg font-mono ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>INITIALIZING NEURAL LINK...</p>
      </div>
    </div>
  );

  if (!streamData) return (
    <div className={`min-h-screen flex items-center justify-center p-8 ${isDarkMode ? 'bg-linear-to-br from-gray-900 via-black to-gray-900' : 'bg-gray-100'}`}>
      <div className={`text-center rounded-2xl p-8 ${isDarkMode ? 'bg-black/50 backdrop-blur-sm border border-cyan-500/30 shadow-2xl shadow-cyan-500/20' : 'bg-white border border-gray-200 shadow-lg'}`}>
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className={`text-2xl font-bold mb-2 font-mono ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>NO SIGNAL DETECTED</h2>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>No live stream found for "{query}". We'll notify when the grid comes online.</p>
      </div>
    </div>
  );

  return (
    <div className={`h-screen lg:max-h-[90vh] lg:rounded-2xl overflow-hidden flex flex-col ${isDarkMode ? 'bg-linear-to-br from-gray-900 via-black to-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      {/* Background Effects */}
      {isDarkMode && <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-magenta-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>}

      <div className="relative z-10 container mx-auto px-4 py-4 h-full">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Main Video */}
          <div className="lg:col-span-3 h-full min-h-0">
            <div className={`rounded-2xl overflow-hidden flex flex-col h-full ${isDarkMode ? 'bg-black/50 backdrop-blur-sm border border-cyan-500/30 shadow-2xl shadow-cyan-500/20' : 'bg-white border border-gray-200 shadow-xl'}`}>
              {/* Video Header */}
              <div className={`shrink-0 p-4 border-b ${isDarkMode ? 'bg-linear-to-r from-cyan-900/50 to-blue-900/50 border-cyan-500/30' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className={`text-xl font-bold font-mono ${isDarkMode ? 'text-cyan-300' : 'text-gray-900'}`}>{streamData.title}</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{streamData.channelTitle}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 rounded-full px-3 py-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-400 text-sm font-bold">LIVE</span>
                    </div>
                    <span className={`text-sm font-mono ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                      {streamData.liveViewerCount?.toLocaleString()} viewers
                    </span>
                    <a
                      href={`https://www.youtube.com/watch?v=${streamData.videoId}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`${isDarkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-gray-500 hover:text-black'} transition-colors`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Video Player */}
              <div className="relative flex-1 bg-black min-h-0">
                <iframe
                  src={videoUrl}
                  title={streamData.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                />

                {/* Overlay Info */}
                <div className={`absolute top-4 left-4 rounded-lg px-4 py-2 ${isDarkMode ? 'bg-black/70 backdrop-blur-sm border border-cyan-500/50' : 'bg-white/80 backdrop-blur-sm border border-gray-300'}`}>
                  <p className={`text-sm font-mono ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                    {streamData.startTime ? streamData.startTime.toLocaleString() : 'Live Transmission'}
                  </p>
                </div>

                <div className={`absolute top-4 right-4 rounded-lg px-4 py-2 ${isDarkMode ? 'bg-black/70 backdrop-blur-sm border border-magenta-500/50' : 'bg-white/80 backdrop-blur-sm border border-gray-300'}`}>
                  <p className={`text-sm font-mono ${isDarkMode ? 'text-magenta-400' : 'text-purple-600'}`}>Match Status</p>
                  <p className={`${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>
                    {matchMeta?.teamA || 'Team Alpha'} vs {matchMeta?.teamB || 'Team Beta'}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className={`shrink-0 p-4 border-t ${isDarkMode ? 'bg-linear-to-r from-gray-900/50 to-black/50 border-cyan-500/30' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <a href={joinUrl} className={buttonStyles}>
                    <span className="relative z-10">JOIN TOURNAMENT</span>
                    <div className="absolute inset-0 bg-linear-to-r from-cyan-400 to-blue-500 opacity-0 hover:opacity-20 transition-opacity"></div>
                  </a>
                  <button
                    onClick={() => setChatVisible(!chatVisible)}
                    className={`${buttonStyles} ${chatVisible && isDarkMode ? 'bg-linear-to-r from-magenta-500 to-purple-500' : ''} ${chatVisible && !isDarkMode ? 'bg-red-600 hover:bg-red-700' : ''}`}
                  >
                    <span className="relative z-10">
                      {chatVisible ? 'HIDE CHAT' : 'SHOW CHAT'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className={`lg:col-span-1 h-full min-h-0 ${chatVisible ? 'block' : 'hidden lg:block'}`}>
            <div className={`rounded-2xl overflow-hidden h-full flex flex-col ${isDarkMode ? 'bg-black/50 backdrop-blur-sm border border-magenta-500/30 shadow-2xl shadow-magenta-500/20' : 'bg-white border border-gray-200 shadow-xl'}`}>
              {/* Chat */}
              {chatVisible && chatUrl ? (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className={`shrink-0 p-3 border-b ${isDarkMode ? 'bg-linear-to-r from-magenta-900/50 to-purple-900/50 border-magenta-500/30' : 'bg-gray-50 border-gray-200'}`}>
                    <h3 className={`font-bold font-mono ${isDarkMode ? 'text-magenta-300' : 'text-purple-700'}`}>NEURAL CHAT</h3>
                  </div>
                  <iframe
                    src={chatUrl}
                    title="Live Chat"
                    frameBorder="0"
                    className="w-full flex-1"
                  />
                </div>
              ) : (
                <div className="p-6 text-center text-gray-400">
                  <div className="text-4xl mb-2">📡</div>
                  <p className="font-mono">Chat Offline</p>
                </div>
              )}

              {/* Other Streams */}
              <div className={`shrink-0 p-4 border-t overflow-y-auto max-h-[40%] ${isDarkMode ? 'border-magenta-500/30' : 'border-gray-200'}`}>
                <h3 className={`font-bold font-mono mb-3 ${isDarkMode ? 'text-magenta-300' : 'text-purple-700'}`}>OTHER STREAMS</h3>
                <div className="space-y-3">
                  {streams.filter(s => s.videoId !== streamData.videoId).map((s) => (
                    <button
                      key={s.videoId}
                      onClick={() => setSelected(s)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20' : 'bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-blue-500 hover:shadow-md'}`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={s.thumbnail} alt="thumb" className="w-12 h-8 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm truncate ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{s.title}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{s.channelTitle}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                  {streams.length === 0 && (
                    <p className={`text-sm text-center font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No additional streams</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Extract YouTube video id from common URL formats
function parseYouTubeId(url) {
  if (!url) return null;
  try {
    // direct id
    if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url;
    const u = new URL(url, 'https://example.com');
    // youtu.be short link
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.split('/').filter(Boolean)[0] || null;
    }
    // youtube watch?v=
    if (u.searchParams && u.searchParams.get('v')) return u.searchParams.get('v');
    // /embed/VIDEOID
    const embedMatch = u.pathname.match(/embed\/([A-Za-z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];
    // fallback: look for 11-char id in string
    const m = url.match(/([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  } catch (e) {
    return null;
  }
}

export default LiveTournament;
