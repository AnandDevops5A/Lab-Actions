// EscapeCards.jsx
import React from "react";

const cards = [
  {
    id: 1,
    badgeColor: "from-cyan-400 to-sky-500",
    accent: "border-cyan-400/60",
    prize: "$3500",
    time: "0H : 30M",
  },
  {
    id: 2,
    badgeColor: "from-amber-400 to-orange-500",
    accent: "border-amber-400/60",
    prize: "$5000",
    time: "0H : 30M",
  },
  {
    id: 3,
    badgeColor: "from-sky-400 to-blue-500",
    accent: "border-green-400/60",
    prize: "$3500",
    time: "0H : 30M",
  },
//   {
//     id: 4,
//     badgeColor: "from-red-500 to-orange-500",
//     accent: "border-red-500/60",
//     prize: "$3500",
//     time: "0H : 30M",
//   },
];

const EscapeCards = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#021311] text-white pt-10 md:pt-0">
      {/* Title */}
      <h1 className= "autoblur mb-10 text-[25px] md:text-4xl lg:text-5xl font-extrabold  text-amber-300 drop-shadow-[0_0_30px_rgba(14,211,8,0.75)]">
       ⚔ Upcoming Matches ⚔
      </h1>

      {/* Card grid */}
      <div className="bg-[#020b0f]/80 rounded-3xl px-6 py-8 md:p-10 shadow-[0_0_60px_rgba(0,0,0,0.95)]">
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 ">
          {cards.map((card) => (
            <article
              key={card.id}
              className={`
                fadeup group relative flex flex-col justify-between
                w-[320px] md:w-[360px] h-[150px]
                rounded-2xl border border-[#101821] ${card.accent}
                bg-linear-to-br from-[#020814] via-[#050d18] to-[#050b14]
                overflow-hidden
                shadow-[0_18px_30px_rgba(0,0,0,0.85)]
                transition-all duration-300 ease-out
                hover:-translate-y-1.5 hover:shadow-[0_25px_60px_rgba(0,0,0,0.95)]
              `}
            >
              {/* Glow on hover */}
              <div className=" absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className=" absolute -top-20 -right-10 w-48 h-48 bg-cyan-400/20 blur-3xl" />
              </div>

              {/* Top section */}
              <div className=" relative z-10 flex items-start justify-between px-5 pt-4">
                <div className="flex items-center space-x-3">
                  {/* Icon badge */}
                  <div
                    className={`
                      w-12 h-12 rounded-2xl border border-white/10
                      bg-linear-to-br ${card.badgeColor}
                      shadow-[0_0_25px_rgba(56,189,248,0.9)]
                      flex items-center justify-center 
                    `}
                  >
                    <span className="text-lg font-black ">🤺</span>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                      Action
                    </p>
                    <p className="text-[15px] font-semibold tracking-wide text-slate-50">
                      Escape Room
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <button
                  type="button"
                  className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-600/60 bg-slate-900/60 text-slate-300 text-xs transition-colors duration-200 group-hover:border-cyan-300 group-hover:text-cyan-300"
                >
                  ↗
                </button>
              </div>

              {/* Bottom section */}
              <div className="relative z-10 flex items-center justify-between px-5 pb-4 pt-3">
                <div className="flex space-x-6 text-[11px] md:text-[12px] text-slate-400">
                  <div>
                    <p className="uppercase tracking-[0.2em]">Prize</p>
                    <p className="mt-1 text-[13px] font-semibold text-amber-300">
                     🏆 {card.prize}
                    </p>
                  </div>
                  <div>
                    <p className="uppercase tracking-[0.2em]">Time</p>
                    <p className="mt-1 text-[13px] font-semibold text-slate-200">
                      {card.time}
                    </p>
                  </div>
                </div>

                {/* Live Now pill with transition */}
                <button
                  type="button"
                  className="
                    relative overflow-hidden rounded-full
                    bg-cyan-400/10 text-[11px] md:text-[12px]
                    px-4 py-2 font-semibold tracking-wide
                    text-slate-100 border border-cyan-400/60
                    shadow-[0_0_0_rgba(34,211,238,0)]
                    transition-all duration-300 ease-out
                    group-hover:bg-amber-400 group-hover:text-slate-900
                    group-hover:border-amber-300
                    group-hover:shadow-[0_0_25px_rgba(251,191,36,0.85)]
                  "
                >
                  {/* Sweep highlight */}
                  <span className="relative z-10 flex items-center space-x-1">
                    <span>Live Now</span>
                    <span className="text-xs">▶</span>
                  </span>
                  <span
                    className="
                      absolute inset-0 -translate-x-full
                      bg-linear-to-r from-transparent via-white/60 to-transparent
                      opacity-0
                      transition-all duration-400 ease-out
                      group-hover:translate-x-full group-hover:opacity-100
                    "
                  />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Small bottom icon */}
      {/* <div className="mt-8 flex items-center justify-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-black/70 text-slate-300 text-xl">
          {"</>"}
        </div>
      </div> */}
    </div>
  );
};

export default EscapeCards;