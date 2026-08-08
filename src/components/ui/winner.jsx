'use client'
import React, { useContext } from 'react';
import { Trophy, Star, CheckCircle } from 'lucide-react';
import GamingBackground from './gaming-background';
import { ThemeContext } from '@/lib/contexts/theme-context';

/**
 * Shares the token system introduced in Banner.jsx
 * Dark  : void #0a0710  panel #150f26  cyan #00f0ff  magenta #ff2e6e  amber #ffb627
 * Display : 'Chakra Petch'  |  Body : 'Inter'  |  Data/HUD : 'JetBrains Mono'
 */

const WinnerSection = () => {
  const { isdarkMode } = useContext(ThemeContext);
  const isDark = !isdarkMode; // matches Banner's context polarity

  const principles = [
    {
      icon: Trophy,
      code: 'PROTOCOL_01',
      title: 'Community-Driven Tournaments',
      description: 'Our goal is to build the best tournament platform with you. Your participation and feedback shape our future.',
      accent: '#ffb627',
    },
    {
      icon: Star,
      code: 'PROTOCOL_02',
      title: 'Commitment to Integrity',
      description: 'We are dedicated to ensuring a fair and competitive environment for all players. Together, we build trust.',
      accent: '#ff2e6e',
    },
    {
      icon: CheckCircle,
      code: 'PROTOCOL_03',
      title: 'Bigger Prize Pools',
      description: 'As our community grows, so will the rewards. We are committed to offering exciting and valuable prizes.',
      accent: '#00f0ff',
    },
  ];

  return (
    <section
      className={`relative py-16 sm:py-24 overflow-hidden ${isDark ? 'bg-[#0a0710] text-[#f1edf7]' : 'bg-[#f4f1fb] text-[#1a1330]'}`}
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <GamingBackground isDarkMode={isDark} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Headline */}
        <div className="text-center mb-14 sm:mb-20 section-fade">
          <span
            className={`inline-block text-[11px] uppercase tracking-[0.35em] mb-3 ${isDark ? 'text-[#00f0ff]' : 'text-[#007d91]'}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            // Our_Creed
          </span>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl uppercase font-bold leading-[0.95]"
            style={{ fontFamily: "'Chakra Petch', sans-serif" }}
          >
            We Don&apos;t Just Compete.
            <br />
            <span className={isDark ? 'text-[#ff2e6e]' : 'text-[#c4006a]'}>We Conquer.</span>
          </h2>
        </div>

        {/* Principle Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {principles.map((p, index) => (
            <div
              key={index}
              className={`section-fade relative flex h-full flex-col overflow-hidden p-8 border-t-2 transition-transform duration-300 hover:-translate-y-1 ${
                isDark ? 'bg-[#150f26] border-gray-800' : 'bg-white border-gray-200 shadow-sm'
              }`}
              style={{ borderTopColor: p.accent, animationDelay: `${index * 120}ms` }}
            >
              {/* corner brackets, echoing Banner's HUD motif */}
              <div className="absolute top-3 right-3 w-3.5 h-3.5 border-t-2 border-r-2" style={{ borderColor: p.accent, opacity: 0.6 }} />

              <div className="flex items-center justify-between mb-6">
                <p.icon className="w-9 h-9" style={{ color: p.accent }} />
                <span
                  className={`text-[10px] tracking-[0.2em] ${isDark ? 'text-[#948dab]' : 'text-[#6b6280]'}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {p.code}
                </span>
              </div>

              <h3
                className="text-xl font-bold uppercase tracking-wide mb-3"
                style={{ fontFamily: "'Chakra Petch', sans-serif" }}
              >
                {p.title}
              </h3>

              <p className={`text-sm leading-relaxed grow ${isDark ? 'text-[#948dab]' : 'text-[#6b6280]'}`}>
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes section-fade-in {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .section-fade {
          animation: section-fade-in 0.6s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .section-fade { animation: none; }
        }
      `}} />
    </section>
  );
};

export default WinnerSection;