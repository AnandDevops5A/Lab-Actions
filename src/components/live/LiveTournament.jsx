"use client";
import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../lib/contexts/theme-context";

const LiveTournament = ({ query = "game tournament", joinUrl = "#", showChat = true, tournamentId = null }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [streams, setStreams] = useState([]);
  const [selected, setSelected] = useState(null);
  const [chatVisible, setChatVisible] = useState(showChat);
  const [matchMeta, setMatchMeta] = useState(null);

  const buttonStyles = `relative overflow-hidden rounded-full px-4 py-2 font-semibold tracking-wide text-[12px] transition-all duration-300 ease-out ${isDarkMode ? "bg-cyan-400/10 text-slate-100 border border-cyan-400/60" : "bg-cyan-600/10 text-cyan-700 border border-cyan-600/60"} hover:scale-[1.02]`;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`/api/live?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        if (json?.ok && Array.isArray(json.data) && json.data.length > 0) {
          setStreams(json.data);
          setSelected(json.data[0] || null);
        } else {
          setStreams([]);
          setSelected(null);
          // fallback: check admin-saved live link
          (async () => {
            try {
              const r2 = await fetch('/api/admin/live-link');
              const j2 = await r2.json();
              if (j2?.ok && j2.data?.url) {
                const url = j2.data.url;
                const vid = parseYouTubeId(url);
                if (vid) {
                  const fallback = {
                    videoId: vid,
                    title: 'Official Live',
                    channelTitle: '',
                    startTime: null,
                    isLive: true,
                    thumbnail: `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
                  };
                  setStreams([fallback]);
                  setSelected(fallback);
                }
              }
            } catch (e) {
              console.warn('Failed to load admin live link', e);
            }
          })();
        }
      })
      .catch((err) => {
        console.error("Live fetch error", err);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [query]);

  // Poll match metadata if tournamentId is provided
  useEffect(() => {
    if (!tournamentId) return;
    let mounted = true;
    let timer = null;

    const fetchMeta = async () => {
      try {
        const r = await fetch(`/api/tournaments/${encodeURIComponent(tournamentId)}/meta`);
        const j = await r.json();
        if (!mounted) return;
        if (j?.ok && j.data) setMatchMeta(j.data.matchMeta || null);
      } catch (e) {
        console.warn('Failed to fetch match meta', e);
      }
    };

    fetchMeta();
    timer = setInterval(fetchMeta, 10000); // poll every 10s

    return () => {
      mounted = false;
      if (timer) clearInterval(timer);
    };
  }, [tournamentId]);

  if (loading) return <div className="p-4">Loading live stream…</div>;

  if (!selected) return (
    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-black/60 text-slate-100' : 'bg-white/60 text-gray-900'} shadow-lg border ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
      No live stream found for "{query}". We'll notify when one goes live.
    </div>
  );

  const videoUrl = `https://www.youtube.com/embed/${selected.videoId}?rel=0&modestbranding=1`;
  const chatUrl = typeof window !== 'undefined' ? `https://www.youtube.com/live_chat?v=${selected.videoId}&embed_domain=${window.location.hostname}` : null;

  return (
    <div className="live-tournament w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        <div className={`video flex-1 rounded-2xl overflow-hidden shadow-[0_18px_30px_rgba(0,0,0,0.6)] ${isDarkMode ? 'bg-[#041212] border border-[#0f1e1b]' : 'bg-white border border-gray-200'}`}>
          <div className={`p-3 flex items-center justify-between ${isDarkMode ? 'bg-[#021514]/60 text-slate-100' : 'bg-white/70 text-gray-900'}`}>
            <div>
              <strong className="mr-2 line-clamp-1">{selected.title}</strong>
              <div className="text-xs opacity-80">{selected.channelTitle}</div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-red-500 text-xs px-2 py-1 rounded-full text-white">LIVE</span>
              {selected.liveViewerCount && (
                <span className="text-xs opacity-80">{selected.liveViewerCount} viewers</span>
              )}
              <a href={`https://www.youtube.com/watch?v=${selected.videoId}`} target="_blank" rel="noreferrer" className="ml-2 text-sm underline">Open</a>
            </div>
          </div>

          <div style={{ position: 'relative', paddingTop: '56.25%' }}>
            <iframe
              src={videoUrl}
              title={selected.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />

            <div className="absolute top-4 left-4 rounded-md px-3 py-1 text-sm font-semibold" style={{ background: isDarkMode ? 'rgba(2,13,12,0.6)' : 'rgba(255,255,255,0.8)' }}>
              {selected.startTime ? new Date(selected.startTime).toLocaleString() : 'Live now'}
            </div>

            <div className="absolute top-4 right-4 rounded-md px-3 py-1 text-sm font-semibold border border-white/6" style={{ background: isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.85)' }}>
              <span className="text-xs opacity-80">Match</span>
              <div className="font-bold">{selected.matchMeta?.teamA || 'Team A'} <span className="mx-2">vs</span> {selected.matchMeta?.teamB || 'Team B'}</div>
            </div>
          </div>

          <div className={`p-3 flex items-center justify-between ${isDarkMode ? 'bg-[#021514]/40' : 'bg-white/70'}`}>
            <div>
              <a href={joinUrl} className={buttonStyles}>Join Tournament</a>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setChatVisible((s) => !s)}
                className={buttonStyles}
              >
                {chatVisible ? 'Hide Chat' : 'Show Chat'}
              </button>
            </div>
          </div>
        </div>

        <aside className={`w-full md:w-80 rounded-2xl overflow-hidden shadow-[0_18px_30px_rgba(0,0,0,0.6)] ${isDarkMode ? 'bg-[#021514]' : 'bg-white'} ${chatVisible ? '' : 'hidden md:block'}`}>
          {chatVisible && chatUrl ? (
            <iframe
              src={chatUrl}
              title="Live Chat"
              frameBorder="0"
              style={{ width: '100%', height: '60vh' }}
            />
          ) : (
            <div className="p-4 text-sm text-gray-300">Chat not available or hidden.</div>
          )}

          <div className={`p-3 border-t ${isDarkMode ? 'border-white/6 bg-[#021514]' : 'border-gray-100 bg-white'}`}>
            <div className="text-sm font-semibold">Other live streams</div>
            <div className="mt-2 space-y-2">
              {streams.filter(s => s.videoId !== selected.videoId).map((s) => (
                <button key={s.videoId} onClick={() => setSelected(s)} className={`w-full text-left p-2 rounded-md flex items-center space-x-3 transition-all ${isDarkMode ? 'hover:bg-white/6' : 'hover:bg-gray-100'}`}>
                  <img src={s.thumbnail} alt="thumb" className="w-16 h-10 rounded-md object-cover" />
                  <div className="flex-1">
                    <div className="font-medium line-clamp-1">{s.title}</div>
                    <div className="text-xs opacity-80">{s.channelTitle}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
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
