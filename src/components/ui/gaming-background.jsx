import React from 'react';
import { Gamepad2 } from 'lucide-react';

const GamingBackground = React.memo(({ isDarkMode }) => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-20 overflow-hidden pointer-events-none"
    >
      {/* Neon grid */}
      <div className="neon-grid" />

      {/* Subtle scanlines for retro/gaming feel */}
      <div className="scanlines" />

      {/* Animated blurred color blobs (kept from previous design) */}
      <div
        className="blob"
        style={{
          left: "-12%",
          top: "-10%",
          width: "48rem",
          height: "48rem",
          background: isDarkMode
            ? "radial-gradient(circle at 30% 30%, rgba(14,211,8,0.12), transparent 28%), radial-gradient(circle at 70% 70%, rgba(14,165,233,0.06), transparent 30%)"
            : "radial-gradient(circle at 30% 30%, rgba(255,179,71,0.18), transparent 28%), radial-gradient(circle at 70% 70%, rgba(6,182,212,0.08), transparent 30%)",
        }}
      />

      <div
        className="blob"
        style={{
          right: "-14%",
          bottom: "-8%",
          width: "36rem",
          height: "36rem",
          background: isDarkMode
            ? "radial-gradient(circle at 40% 40%, rgba(255,179,0,0.08), transparent 40%)"
            : "radial-gradient(circle at 60% 60%, rgba(99,102,241,0.12), transparent 40%)",
          animationDelay: "4s",
        }}
      />

      {/* Tiny moving particles for energy */}
      <div className="particles">
        <span className="particle p1" />
        <span className="particle p2" />
        <span className="particle p3" />
        <span className="particle p4" />
        <span className="particle p5" />
        <span className="particle p6" />
      </div>

      {/* Low-opacity gamepad icons to reinforce gaming theme */}
      <Gamepad2
        className="game-icons"
        color={isDarkMode ? "rgba(14,211,8,0.2)" : "rgba(14,165,233,0.2)"}
        strokeWidth={1}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 w-full h-full -z-10"
        style={{
          background: `linear-gradient(90deg, ${
            isDarkMode ? "rgba(2, 27, 18, 0.12)" : "rgba(255, 250, 240, 0.12)"
          } 0%, ${isDarkMode ? "rgba(1, 16, 12, 0.06)" : "rgba(240, 255, 255, 0.06)"} 100%)`,
        }}
      />

      <style jsx>{`
        .neon-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0, 0, 0, 0) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0) 1px, transparent 1px),
            linear-gradient(0deg, rgba(0, 0, 0, 0), transparent);
          background-size:
            40px 40px,
            40px 40px,
            100% 100%;
          background-position:
            0 0,
            0 0,
            0 0;
          opacity: ${isDarkMode ? "0.15" : "0.22"};
          mix-blend-mode: ${isDarkMode ? "screen" : "overlay"};
          transform: translateZ(0);
          will-change: background-position;
          animation: gridMove 18s linear infinite;
          filter: blur(8px) saturate(120%);
        }

        @keyframes gridMove {
          0% {
            background-position:
              0 0,
              0 0,
              0 0;
          }
          50% {
            background-position:
              -120px -80px,
              120px 80px,
              0 0;
          }
          100% {
            background-position:
              0 0,
              0 0,
              0 0;
          }
        }

        .scanlines {
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            180deg,
            rgba(255, 255, 255, ${isDarkMode ? "0.01" : "0.02"}) 0px,
            rgba(255, 255, 255, ${isDarkMode ? "0.01" : "0.02"}) 1px,
            transparent 2px
          );
          mix-blend-mode: ${isDarkMode ? "overlay" : "soft-light"};
          pointer-events: none;
        }

        .blob {
          position: absolute;
          border-radius: 48%;
          filter: blur(80px);
          opacity: 0.6;
          transform-origin: center;
          animation: blobMove 12s infinite ease-in-out;
          will-change: transform, opacity;
        }

        @keyframes blobMove {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(28px, -36px) scale(1.06);
          }
          66% {
            transform: translate(-36px, 24px) scale(0.96);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.85);
          opacity: 0.06;
          box-shadow: 0 0 12px rgba(0, 0, 0, 0.6);
        }
        .p1 { left: 12%; top: 22%; animation: particleMove 6s infinite ease-in-out; background: ${isDarkMode ? "rgba(14,211,8,0.9)" : "rgba(14,165,233,0.9)"}; }
        .p2 { left: 42%; top: 12%; animation: particleMove 8s 0.6s infinite ease-in-out; background: ${isDarkMode ? "rgba(6,182,212,0.9)" : "rgba(255,179,71,0.9)"}; }
        .p3 { left: 72%; top: 36%; animation: particleMove 7s 1.2s infinite ease-in-out; background: ${isDarkMode ? "rgba(255,179,0,0.9)" : "rgba(99,102,241,0.9)"}; }
        .p4 { left: 22%; top: 72%; animation: particleMove 9s 0.2s infinite ease-in-out; background: ${isDarkMode ? "rgba(56,189,248,0.9)" : "rgba(6,182,212,0.9)"}; }
        .p5 { left: 58%; top: 68%; animation: particleMove 5s 0.4s infinite ease-in-out; background: ${isDarkMode ? "rgba(99,102,241,0.9)" : "rgba(14,165,233,0.9)"}; }
        .p6 { left: 86%; top: 18%; animation: particleMove 10s 0.9s infinite ease-in-out; background: ${isDarkMode ? "rgba(255,102,102,0.9)" : "rgba(255,179,71,0.9)"}; }

        @keyframes particleMove {
          0% { transform: translateY(0) scale(1); opacity: 0.06; }
          50% { transform: translateY(-18px) scale(1.25); opacity: 0.18; }
          100% { transform: translateY(0) scale(1); opacity: 0.06; }
        }

        .game-icons {
          position: absolute;
          right: -6%;
          top: 6%;
          width: 36%;
          height: 36%;
          opacity: 0.06;
          transform-origin: center;
          animation: iconsFloat 14s infinite ease-in-out;
        }
        @keyframes iconsFloat {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
      `}</style>
    </div>
  );
});

GamingBackground.displayName = 'GamingBackground';

export default GamingBackground;