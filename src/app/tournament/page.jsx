'use client';
import { useState, useRef, useEffect } from "react";
import {
  Terminal,
  ShieldAlert,
  Rocket,
  Gamepad2,
  Check,
  X,
  ChevronRight,
  Skull,
  Radio,
  Lock,
} from "lucide-react";

/* ---------------------------------------------------------------
   DATA — swap topics/questions here to extend the deck
--------------------------------------------------------------- */
const TOPICS = [
  {
    id: "neon_protocol",
    name: "NEON_PROTOCOL",
    label: "Cyberpunk Lore",
    icon: Radio,
    accent: "#adff2f",
    glow: "rgba(173,255,47,0.45)",
    questions: [
      {
        q: "Which novel by William Gibson is credited with popularizing the term 'cyberspace'?",
        options: ["Snow Crash", "Neuromancer", "Altered Carbon", "Do Androids Dream of Electric Sheep?"],
        correct: 1,
      },
      {
        q: "In Blade Runner, what is the term for a bounty hunter who retires rogue replicants?",
        options: ["Ghost", "Runner", "Blade Runner", "Sweeper"],
        correct: 2,
      },
      {
        q: "'High tech, low life' is the classic tagline describing what genre?",
        options: ["Cyberpunk", "Steampunk", "Space Opera", "Dieselpunk"],
        correct: 0,
      },
      {
        q: "Which studio developed the game Cyberpunk 2077?",
        options: ["CD Projekt Red", "FromSoftware", "Bethesda", "Arkane Studios"],
        correct: 0,
      },
      {
        q: "In most cyberpunk fiction, corporations that rival or replace governments are called:",
        options: ["Syndicates", "Megacorps", "Cartels", "Conglomerates"],
        correct: 1,
      },
    ],
  },
  {
    id: "ghost_shell",
    name: "GHOST_SHELL",
    label: "Hacking & Security",
    icon: ShieldAlert,
    accent: "#00e5ff",
    glow: "rgba(0,229,255,0.45)",
    questions: [
      {
        q: "What does 'VPN' stand for?",
        options: [
          "Virtual Private Network",
          "Verified Public Node",
          "Virtual Protocol Node",
          "Volatile Packet Network",
        ],
        correct: 0,
      },
      {
        q: "A phishing attack primarily tries to exploit which layer of a system?",
        options: ["Hardware", "The human user", "The database", "The firewall"],
        correct: 1,
      },
      {
        q: "What is 'two-factor authentication' commonly abbreviated as?",
        options: ["TFA / 2FA", "DDoS", "SSL", "VPN"],
        correct: 0,
      },
      {
        q: "Which of these is a type of malware that encrypts files and demands payment?",
        options: ["Worm", "Ransomware", "Adware", "Rootkit"],
        correct: 1,
      },
      {
        q: "In security, 'white hat' refers to a hacker who:",
        options: [
          "Sells exploits on the black market",
          "Works maliciously for profit",
          "Tests systems with permission to find flaws",
          "Only targets governments",
        ],
        correct: 2,
      },
    ],
  },
  {
    id: "synth_core",
    name: "SYNTH_CORE",
    label: "Sci-Fi Tech",
    icon: Rocket,
    accent: "#ffb703",
    glow: "rgba(255,183,3,0.45)",
    questions: [
      {
        q: "In science fiction, an 'AI singularity' refers to:",
        options: [
          "A single powerful robot",
          "The point AI surpasses human intelligence and self-improves rapidly",
          "A black hole simulation",
          "A quantum encryption method",
        ],
        correct: 1,
      },
      {
        q: "What is a 'neural interface' typically depicted as doing in sci-fi?",
        options: [
          "Connecting a brain directly to a computer or network",
          "Cloning memories onto paper",
          "Translating alien languages",
          "Powering spaceships",
        ],
        correct: 0,
      },
      {
        q: "The robotic laws first proposed by Isaac Asimov are known as:",
        options: [
          "The Turing Principles",
          "The Three Laws of Robotics",
          "The Asimov Protocol",
          "The Android Code",
        ],
        correct: 1,
      },
      {
        q: "Which term describes a human body enhanced with mechanical implants?",
        options: ["Android", "Cyborg", "Replicant", "Automaton"],
        correct: 1,
      },
      {
        q: "'Holographic display' technology projects images using:",
        options: [
          "Light interference patterns to create 3D-looking images",
          "Physical moving parts",
          "Magnetic ink",
          "Sound waves only",
        ],
        correct: 0,
      },
    ],
  },
  {
    id: "arcade_root",
    name: "ARCADE_ROOT",
    label: "Retro Gaming",
    icon: Gamepad2,
    accent: "#39ff88",
    glow: "rgba(57,255,136,0.45)",
    questions: [
      {
        q: "Which company created the arcade game Pac-Man?",
        options: ["Sega", "Namco", "Atari", "Capcom"],
        correct: 1,
      },
      {
        q: "The Game Boy, released in 1989, was manufactured by:",
        options: ["Sony", "Sega", "Nintendo", "NEC"],
        correct: 2,
      },
      {
        q: "What was the first commercially successful home video game console?",
        options: ["Atari 2600", "Magnavox Odyssey", "NES", "ColecoVision"],
        correct: 1,
      },
      {
        q: "In Street Fighter, Ryu and Ken are known for which iconic special move?",
        options: ["Spinning Bird Kick", "Hadouken", "Sonic Boom", "Flash Kick"],
        correct: 1,
      },
      {
        q: "Which genre does the classic arcade game 'Defender' belong to?",
        options: ["Puzzle", "Side-scrolling shooter", "Fighting", "Racing"],
        correct: 1,
      },
    ],
  },
];

/* ---------------------------------------------------------------
   COMPONENT
--------------------------------------------------------------- */
export default function CyberpunkQuiz() {
  const [screen, setScreen] = useState("topics"); // topics | quiz | results
  const [topic, setTopic] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [log, setLog] = useState([]); // per-question correctness
  const [completed, setCompleted] = useState({}); // topicId -> { score, total, pct }
  const containerRef = useRef(null);

  const startTopic = (t) => {
    if (completed[t.id]) return; // already played — locked out
    setTopic(t);
    setQIndex(0);
    setScore(0);
    setLog([]);
    setSelected(null);
    setLocked(false);
    setScreen("quiz");
  };

  const question = topic ? topic.questions[qIndex] : null;

  const pickAnswer = (idx) => {
    if (locked) return;
    setSelected(idx);
    setLocked(true);
    const correct = idx === question.correct;
    if (correct) setScore((s) => s + 1);
    setLog((l) => [...l, correct]);
  };

  const next = () => {
    if (qIndex + 1 < topic?.questions.length) {
      setQIndex((i) => i + 1);
      setSelected(null);
      setLocked(false);
    } else {
      const finalPct = Math.round((score / topic.questions.length) * 100);
      setCompleted((c) => ({
        ...c,
        [topic.id]: { score, total: topic.questions.length, pct: finalPct },
      }));
      setScreen("results");
    }
  };

  const restart = () => {
    setScreen("topics");
    setTopic(null);
  };

  const pct = topic ? Math.round((score / topic.questions.length) * 100) : 0;
  const rank =
    pct === 100
      ? "GHOST IN THE SHELL"
      : pct >= 80
      ? "NETRUNNER ELITE"
      : pct >= 60
      ? "STREET SAMURAI"
      : pct >= 40
      ? "SCRIPT KIDDIE"
      : "FLATLINED";

  return (
    <div
      ref={containerRef}
      className="top-12 min-h-[640px] w-full bg-[#05070d] text-[#d7e8f0] font-mono relative overflow-hidden rounded-xl border border-[#1b2a3a]"
    >
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          45% { opacity: 1; }
          46% { opacity: 0.4; }
          47% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.6; }
          94% { opacity: 1; }
        }
        @keyframes glitchTop {
          0%, 94%, 100% { clip-path: inset(0 0 0 0); transform: translate(0,0); }
          95% { clip-path: inset(10% 0 60% 0); transform: translate(-2px,0); }
          96% { clip-path: inset(40% 0 20% 0); transform: translate(2px,0); }
          97% { clip-path: inset(0 0 0 0); transform: translate(0,0); }
        }
        @keyframes glitchBottom {
          0%, 94%, 100% { clip-path: inset(0 0 0 0); transform: translate(0,0); opacity: 0; }
          95% { clip-path: inset(60% 0 10% 0); transform: translate(2px,0); opacity: 0.7; }
          96% { clip-path: inset(20% 0 40% 0); transform: translate(-2px,0); opacity: 0.7; }
          97% { clip-path: inset(0 0 0 0); transform: translate(0,0); opacity: 0; }
        }
        @keyframes fillbar {
          from { width: 0%; }
        }
        @keyframes blinkCursor {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .glitch-wrap { position: relative; display: inline-block; }
        .glitch-wrap .g-top {
          position: absolute; top: 0; left: 0; width: 100%; color: #adff2f;
          animation: glitchTop 4s infinite steps(1);
        }
        .glitch-wrap .g-bottom {
          position: absolute; top: 0; left: 0; width: 100%; color: #00e5ff; opacity: 0;
          animation: glitchBottom 4s infinite steps(1);
        }
        .crt-scan {
          position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 30;
        }
        .crt-scan::before {
          content: ""; position: absolute; left: 0; right: 0; height: 40%;
          background: linear-gradient(to bottom, transparent, rgba(0,229,255,0.05), transparent);
          animation: scanline 6s linear infinite;
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(0,229,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .cursor-blink { animation: blinkCursor 1s steps(1) infinite; }
      `}</style>

      {/* ambient grid + scanline overlay */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="crt-scan" />
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(0,229,255,0.08), transparent 60%)",
        }}
      />

      <div className="relative z-10 p-5 sm:p-8">
        {screen === "topics" && (
          <TopicsScreen onSelect={startTopic} completed={completed} />
        )}
        {screen === "quiz" && topic && question && (
          <QuizScreen
            topic={topic}
            qIndex={qIndex}
            question={question}
            selected={selected}
            locked={locked}
            onPick={pickAnswer}
            onNext={next}
            log={log}
          />
        )}
        {screen === "results" && topic && (
          <ResultsScreen
            topic={topic}
            score={score}
            total={topic.questions.length}
            pct={pct}
            rank={rank}
            log={log}
            onBack={restart}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   TOPICS SCREEN
--------------------------------------------------------------- */
function TopicsScreen({ onSelect, completed }) {
  const allDone = TOPICS.every((t) => completed[t.id]);
  return (
    <div>
      <div className="mb-8">
        <div className="text-xs text-[#5c7a8a] tracking-[0.3em] mb-1">
          SYSTEM // QUIZ.EXE — READY
        </div>
        <h1 className="glitch-wrap text-3xl sm:text-4xl font-bold tracking-tight text-[#eaf6ff]">
          <span className="relative">
            SELECT_DATA-STREAM
            <span className="g-top" aria-hidden="true">
              SELECT_DATA-STREAM
            </span>
            <span className="g-bottom" aria-hidden="true">
              SELECT_DATA-STREAM
            </span>
          </span>
          <span className="cursor-blink text-[#adff2f]">_</span>
        </h1>
        <p className="text-[#5c7a8a] text-sm mt-2">
          {allDone
            ? "All streams decrypted. Runs are one-shot — no re-entry."
            : "Choose a module to jack in. Five queries per stream, one run only."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TOPICS.map((t) => {
          const Icon = t.icon;
          const done = completed[t.id];
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              disabled={!!done}
              aria-disabled={!!done}
              className={`group relative text-left p-5 rounded-lg border transition-all duration-200 focus:outline-none focus-visible:ring-2 ${
                done
                  ? "border-[#1b2a3a] bg-[#0d1420]/30 cursor-not-allowed"
                  : "border-[#1b2a3a] bg-[#0d1420]/70 hover:bg-[#0d1420]"
              }`}
              style={{ "--tw-ring-color": t.accent }}
            >
              {!done && (
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{
                    boxShadow: `0 0 0 1px ${t.accent}, 0 0 24px ${t.glow}`,
                  }}
                />
              )}
              <div className="flex items-center justify-between mb-3">
                <Icon size={22} style={{ color: done ? "#3a4a55" : t.accent }} />
                <span className="text-[10px] tracking-[0.25em] text-[#5c7a8a]">
                  {done
                    ? "LOCKED"
                    : `${t.questions.length.toString().padStart(2, "0")} QUERIES`}
                </span>
              </div>
              <div
                className="text-lg font-bold tracking-wide"
                style={{ color: done ? "#3a4a55" : t.accent }}
              >
                {t.name}
              </div>
              <div className={`text-sm mt-1 ${done ? "text-[#3a4a55]" : "text-[#8fa8b5]"}`}>
                {t.label}
              </div>
              {done ? (
                <div className="mt-4 flex items-center gap-1.5 text-xs text-[#5c7a8a]">
                  <Lock size={13} />
                  COMPLETED — {done.score}/{done.total} ({done.pct}%)
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-1 text-xs text-[#5c7a8a] group-hover:text-[#d7e8f0] transition-colors">
                  INITIATE <ChevronRight size={14} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   QUIZ SCREEN
--------------------------------------------------------------- */
function QuizScreen({ topic, qIndex, question, selected, locked, onPick, onNext, log }) {
  const Icon = topic.icon;
  const total = topic.questions.length;
  const progressPct = ((qIndex + (locked ? 1 : 0)) / total) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon size={18} style={{ color: topic.accent }} />
          <span className="text-sm font-bold tracking-widest" style={{ color: topic.accent }}>
            {topic.name}
          </span>
        </div>
        <span className="text-xs text-[#5c7a8a] tracking-widest">
          QUERY {String(qIndex + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
      </div>

      {/* progress / decryption bar */}
      <div className="h-1.5 w-full bg-[#0d1420] rounded-full overflow-hidden mb-1 border border-[#1b2a3a]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progressPct}%`,
            background: `linear-gradient(90deg, ${topic.accent}, #ffffff33)`,
            boxShadow: `0 0 10px ${topic.glow}`,
          }}
        />
      </div>
      <div className="flex gap-1 mb-8">
        {topic.questions.map((_, i) => {
          const answered = log[i] !== undefined;
          const correct = log[i];
          return (
            <div
              key={i}
              className="h-1 flex-1 rounded-full"
              style={{
                background: answered
                  ? correct
                    ? "#39ff88"
                    : "#adff2f"
                  : i === qIndex
                  ? "#1b2a3a"
                  : "#12202e",
              }}
            />
          );
        })}
      </div>

      <div className="rounded-lg border border-[#1b2a3a] bg-[#0d1420]/60 p-5 sm:p-6 mb-5">
        <div className="text-[10px] tracking-[0.3em] text-[#5c7a8a] mb-3">
          &gt; DECRYPTING QUERY...
        </div>
        <h2 className="text-lg sm:text-xl text-[#eaf6ff] leading-relaxed">
          {question.q}
        </h2>
      </div>

      <div className="grid gap-3">
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrect = idx === question.correct;
          let stateClasses =
            "border-[#1b2a3a] bg-[#0d1420]/40 hover:border-[#33475a] hover:bg-[#0d1420]";
          let icon = null;

          if (locked) {
            if (isCorrect) {
              stateClasses = "border-[#39ff88] bg-[#39ff88]/10";
              icon = <Check size={16} className="text-[#39ff88]" />;
            } else if (isSelected) {
              stateClasses = "border-[#adff2f] bg-[#adff2f]/10";
              icon = <X size={16} className="text-[#adff2f]" />;
            } else {
              stateClasses = "border-[#1b2a3a] bg-[#0d1420]/20 opacity-50";
            }
          }

          return (
            <button
              key={idx}
              disabled={locked}
              onClick={() => onPick(idx)}
              className={`flex items-center justify-between text-left px-4 py-3 rounded-md border transition-all duration-150 ${stateClasses} disabled:cursor-default`}
            >
              <span className="flex items-center gap-3">
                <span className="text-xs text-[#5c7a8a] tracking-widest">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm sm:text-base text-[#d7e8f0]">{opt}</span>
              </span>
              {icon}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        {locked && (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md font-bold text-sm tracking-widest text-[#05070d] transition-transform duration-150 hover:scale-[1.02]"
            style={{ background: topic.accent, boxShadow: `0 0 20px ${topic.glow}` }}
          >
            {qIndex + 1 < total ? "NEXT QUERY" : "VIEW REPORT"}
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   RESULTS SCREEN
--------------------------------------------------------------- */
function ResultsScreen({ topic, score, total, pct, rank, log, onBack }) {
  const isFail = pct < 40;
  return (
    <div>
      <div className="text-xs text-[#5c7a8a] tracking-[0.3em] mb-1">
        SYSTEM // REPORT.LOG
      </div>
      <h1 className="text-3xl font-bold text-[#eaf6ff] mb-6 flex items-center gap-3">
        {isFail ? (
          <Skull size={26} className="text-[#adff2f]" />
        ) : (
          <Terminal size={26} style={{ color: topic.accent }} />
        )}
        RUN COMPLETE
      </h1>

      <div className="rounded-lg border border-[#1b2a3a] bg-[#0d1420]/60 p-6 mb-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
          <div>
            <div className="text-xs text-[#5c7a8a] tracking-widest mb-1">
              {topic.name} — {topic.label}
            </div>
            <div className="text-5xl font-bold" style={{ color: topic.accent }}>
              {score}
              <span className="text-xl text-[#5c7a8a]">/{total}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#5c7a8a] tracking-widest mb-1">RANK</div>
            <div
              className="text-lg font-bold tracking-wide"
              style={{ color: isFail ? "#adff2f" : topic.accent }}
            >
              {rank}
            </div>
          </div>
        </div>

        <div className="h-2 w-full bg-[#05070d] rounded-full overflow-hidden border border-[#1b2a3a]">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: isFail
                ? "#adff2f"
                : `linear-gradient(90deg, ${topic.accent}, #ffffff55)`,
            }}
          />
        </div>
        <div className="text-right text-xs text-[#5c7a8a] mt-1">{pct}% ACCURACY</div>

        <div className="flex gap-1.5 mt-5">
          {log.map((correct, i) => (
            <div
              key={i}
              className="flex-1 h-8 rounded-sm flex items-center justify-center border"
              style={{
                borderColor: correct ? "#39ff88" : "#adff2f",
                background: correct ? "rgba(57,255,136,0.08)" : "rgba(173,255,47,0.08)",
              }}
              title={`Query ${i + 1}: ${correct ? "correct" : "incorrect"}`}
            >
              {correct ? (
                <Check size={14} className="text-[#39ff88]" />
              ) : (
                <X size={14} className="text-[#adff2f]" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-[#5c7a8a] tracking-widest mb-4 flex items-center gap-1.5">
        <Lock size={13} />
        RUN LOGGED — THIS STREAM IS NOW SEALED
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md font-bold text-sm tracking-widest text-[#05070d] transition-transform hover:scale-[1.02]"
          style={{ background: topic.accent, boxShadow: `0 0 20px ${topic.glow}` }}
        >
          BACK TO STREAMS
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}