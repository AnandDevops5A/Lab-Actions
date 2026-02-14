"use client";

import {
  useState,
  useEffect,
  useContext,
  useMemo,
  memo,
  useCallback,
  useRef,
} from "react";
import { getCache, setCache, deleteCache } from "../../lib/utils/client-cache";
import {
  errorMessage,
  simpleMessage,
  successMessage,
} from "../../lib/utils/alert";
import {
  joinTournament,
  getUserTournamentDetails,
  getUpcomingTournament,
} from "../../lib/api/backend-api";
import { UserContext } from "../../lib/contexts/user-context";
import CyberLoading from "../../app/skeleton/CyberLoading";
import {
  fetchUpcomingTournament,
  fetchUserTournaments,
  generateRandomNumberForQR,
} from "@/lib/utils/common";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";
import { SkeletonCard } from "@/app/skeleton/Skeleton";
import Image from "next/image";
import {
  Mail,
  Gamepad2,
  Trophy,
  CreditCard,
  Loader2,
  Check,
  Plus,
} from "lucide-react";
import { ThemeContext } from "../../lib/contexts/theme-context";

/**
 * Dynamically load QR code images with fallback
 * Optimized with memo to prevent unnecessary re-renders
 */
const GetQRCode = memo(({ no }) => {
  const DynamicQR = useMemo(
    () =>
      dynamic(
        async () => {
          const image = await import(`@/app/payment_QR/payment${no}.jpeg`);
          const QRImage = () => (
            <Image
              src={image.default}
              alt="Payment QR"
              width={160}
              height={160}
              className="w-40 h-40 object-contain rounded-lg shadow-[0_0_15px_rgba(0,255,240,0.2)] mx-auto overflow-hidden scale-260"
              priority={false}
              loading="lazy"
            />
          );
          QRImage.displayName = "QRImage";
          return QRImage;
        },
        {
          ssr: false,
          loading: () => <SkeletonCard />,
        },
      ),
    [no],
  );

  return <DynamicQR />;
});

GetQRCode.displayName = "GetQRCode";

/**
 * Reusable input field component with memoization
 * Prevents unnecessary re-renders when props haven't changed
 */
const ReUseableInput = memo(
  ({
    title,
    name,
    color,
    placeholder,
    svg,
    defaultValue,
    onChange,
    isDarkMode,
  }) => {
    const bgClass = isDarkMode
      ? "border-gray-700/10 text-slate-100 placeholder-gray-400"
      : "border-gray-300 text-gray-900 placeholder-gray-500";

    return (
      <label className="flex flex-col">
        <span
          className={`text-xs mb-1 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {title}
        </span>
        <div className="relative">
          {svg}
          <input
            type="text"
            name={name}
            {...(name === "transactionId" && { autoComplete: "off" })}
            defaultValue={defaultValue || ""}
            onChange={onChange}
            required
            placeholder={placeholder}
            className={`w-full bg-transparent border-2 rounded-md px-3 pl-10 py-2 focus:outline-none transition-colors duration-200 ${bgClass}`}
          />
        </div>
      </label>
    );
  },
);

ReUseableInput.displayName = "ReUseableInput";

/**
 * Reusable dropdown component with memoization
 */
const ReUseableDropdown = memo(
  ({ title, name, value, onChange, options, color, svg, isDarkMode }) => {
    const bgClass = isDarkMode
      ? "border-gray-700/10 text-slate-100"
      : "border-gray-300 text-gray-900";
    const optionBgClass = isDarkMode
      ? "bg-gray-900 text-slate-100"
      : "bg-white text-gray-900";

    return (
      <label className="flex flex-col">
        <span
          className={`text-xs mb-1 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {title}
        </span>
        <div className="relative">
          {svg}
          <select
            name={name}
            value={value}
            onChange={onChange}
            required
            className={`w-full bg-transparent border-2 rounded-md px-3 pl-10 py-2 focus:outline-none transition-colors duration-200 appearance-none ${bgClass}`}
          >
            <option value="" className={optionBgClass}>
              Select {title}
            </option>
            {options?.map((opt, idx) => (
              <option
                key={opt.id || idx}
                value={opt.id}
                className={optionBgClass}
              >
                {opt.tournamentName}
              </option>
            ))}
          </select>
        </div>
      </label>
    );
  },
);
ReUseableDropdown.displayName = "ReUseableDropdown";

export default function MatchJoiningForm({
  open: controlledOpen,
  setOpen: controlledSetOpen,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledSetOpen || setInternalOpen;
  const { user } = useContext(UserContext);
  const { isDarkMode } = useContext(ThemeContext);

  // Use useRef for form fields to avoid re-renders on every keystroke
  const formRef = useRef({
    userId: user?.id || "",
    transactionId: "",
    tempEmail: user?.email || "",
    gameId: "",
    investAmount: "",
  });

  // Keep tournamentId in state because it triggers UI updates (QR code)
  const [tournamentId, setTournamentId] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [match, setMatch] = useState(null);
  const [qrCode, setQrCode] = useState(null);

  // Sync user data to ref if it loads after component mount
  useEffect(() => {
    if (user) {
      if (!formRef.current.userId) formRef.current.userId = user.id;
      if (!formRef.current.tempEmail) formRef.current.tempEmail = user.email;
    }
  }, [user]);

  const alreadyRegistered = useCallback(() => {
    simpleMessage("You have already joined all upcoming tournaments.", "Info");

    setSubmitting(false);
    setSuccess(false);
    setOpen(false);
    setQrCode(null);
    setTournamentId("");
    formRef.current = {
      userId: user?.id || "",
      transactionId: "",
      tempEmail: user?.email || "",
      gameId: "",
    };
  }, [
    user?.id,
    user?.email,
    setOpen,
    setSubmitting,
    setSuccess,
    setQrCode,
    setTournamentId,
  ]);

  useEffect(() => {
    if (!open || !user?.id) return;

    let isMounted = true;
    const fetchData = async () => {
      try {
        // 1. Get all upcoming tournaments (Cache First -> API Fallback)
        let upcomingData = [];
        await fetchUpcomingTournament().then((res) => {
          if (res && Array.isArray(res) && res.length > 0) {
            upcomingData = res;
          }
        });


        if (!isMounted) return;

        if (!upcomingData || upcomingData.length === 0) {
          alreadyRegistered();
          return;
        }
        // 2. Get user's joined tournaments
        const backendJoinedRes = await fetchUserTournaments(user.id);
        let userJoinedTournaments = backendJoinedRes || [];

        if (!isMounted) return;

        // 3. Filter available tournaments
        const joinedTournamentNames = new Set(
          userJoinedTournaments
            .map((t) => t.tournamentName || t.id)
            .filter(Boolean)
            .map(String),
        );

        const finalAvailable = upcomingData.filter(
          (d) => !joinedTournamentNames.has(d.tournamentName),
        );

        if (isMounted) {
          if (finalAvailable.length === 0) {
            alreadyRegistered();
          } else {
            setMatch(finalAvailable);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (isMounted) {
          errorMessage("Could not load tournament list. Please try again.");
          setOpen(false);
        }
      }
    };
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [open, user?.id, alreadyRegistered, setOpen]);

  // const upcomingTournament=await getCache("upcomingTournament");
  //   console.log(upcomingTournament);

  async function handleChange(e) {
    const { name, value } = e.target;
    if (name !== "tournamentId") {
      // Update ref for non-triggering fields
      formRef.current[name] = value;
    } else {
      const selectedTournament = match.find((t) => String(t.id) === value);
      if (!selectedTournament) return;

      Swal.fire({
        title:
          "Are you want to join " + selectedTournament.tournamentName + "?",
        text: "You won't be able to revert payable for tournament!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Let me In!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await generateRandomNumberForQR(
            value,
            user.id,
            1,
            50,
          );
          if (!response) {
            errorMessage("All slots are book for the tournament...");
            return;
          }
          formRef.current.investAmount = response;
          // successMessage(qrNo+response)

          setTournamentId(value);
          setQrCode(response || null);
          // successMessage(response)
        }
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formRef.current,
      tournamentId,
    };

    const response = await joinTournament(payload);
    console.log(payload);
    console.log(response);

    
  if(response.data) { successMessage(
      response.data.message ||
        response.data ||
        "Successfully joined tournament",
    );}
    if (!response.ok) {
      errorMessage(response.error || "Failed to join tournament");
      setSubmitting(false);
      return;
    }

    //update cache with adding recent join of user tournament details
    if (user?.id) {
      await deleteCache(`userTournamentDetails:${user.id}`);
    }

    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setOpen(false);
      setQrCode(null);
      setTournamentId("");
      formRef.current = {
        userId: user?.id || "",
        transactionId: "",
        tempEmail: user?.email || "",
        gameId: "",
      };
    }, 1000);
  }

  if (!open) return null;

  return match && match.length > 0 ? (
    <div className="fixed animate-slideInUp inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <div className="relative max-w-lg w-[94%] sm:w-3/4 md:w-2/3 lg:w-1/2 mx-4">
        <div className="neon-modal-animate transform transition-all duration-400 scale-100 -translate-y-2">
          <div
            className={`relative bg-linear-to-br ${isDarkMode ? "from-neutral-900/95 to-neutral-800/95 border-[#00fff0]/10 neon-glow" : "from-white/95 to-gray-50/95 border-gray-200 shadow-2xl"} border rounded-2xl p-6`}
          >
            {/* Animated Background */}
            {isDarkMode && (
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#00fff0]/10 rounded-full blur-3xl animate-pulse"></div>
                <div
                  className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#ff0055]/10 rounded-full blur-3xl animate-pulse"
                  style={{ animationDelay: "1.5s" }}
                ></div>

                {/* Game Feel: Grid & Scanline */}
                <div
                  className="absolute inset-0 opacity-[0.1]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(0, 255, 240, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 240, 0.5) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                    maskImage:
                      "radial-gradient(circle at center, black 30%, transparent 80%)",
                  }}
                />
                <div
                  className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-[#00fff0] to-transparent opacity-50"
                  style={{ animation: "scan 3s linear infinite" }}
                ></div>
                <style>{`
                @keyframes scan {
                  0% { top: 0%; opacity: 0; }
                  10% { opacity: 1; }
                  90% { opacity: 1; }
                  100% { top: 100%; opacity: 0; }
                }
              `}</style>
              </div>
            )}

            {/* decorative neon accents */}
            {isDarkMode && (
              <>
                <span className="absolute -left-6 -top-6 w-24 h-1 bg-linear-to-r from-[#00fff0] to-[#ff0055] opacity-80 blur-sm rotate-12"></span>
                <span className="absolute -right-6 -bottom-6 w-24 h-1 bg-linear-to-r from-[#9b59ff] to-[#ff0055] opacity-70 blur-sm -rotate-12"></span>
              </>
            )}
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className=" animate-slideInRight">
                <h3
                  className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}
                >
                  Join Tournament
                </h3>
                <p
                  className={`text-sm mt-1 ${isDarkMode ? "text-gray-300/80" : "text-gray-600"}`}
                >
                  Submit your details to secure a spot. Double-check your
                  tournament id.
                </p>
              </div>
              <button
                aria-label="close"
                onClick={() => setOpen(false)}
                className={`p-2 rounded-md transition border border-transparent cursor-pointer ${isDarkMode ? "text-[#00fff0] hover:text-slate-100 hover:border-[#00fff0]/30" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="relative z-10 mt-5 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* <ReUseableInput
                  title={"Callsign"}
                  name={"callsign"}
                  color={"#00fff0"}
				  placeholder={"e.g. ShadowFury"}
                  svg={callSignSVG}
                /> */}

                <ReUseableInput
                  key={user?.email}
                  title={"Contact Email"}
                  name={"tempEmail"}
                  defaultValue={user?.email || formRef.current.tempEmail}
                  onChange={handleChange}
                  color={"#9b59ff"}
                  placeholder={"contact email id"}
                  svg={
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9b59ff]" />
                  }
                  isDarkMode={isDarkMode}
                />
                <ReUseableInput
                  title={"Game ID"}
                  name={"gameId"}
                  defaultValue={formRef.current.gameId}
                  onChange={handleChange}
                  color={"#ff0055"}
                  placeholder={"eg: @7575945394"}
                  svg={
                    <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ff0055]" />
                  }
                  isDarkMode={isDarkMode}
                />
                <ReUseableDropdown
                  title={"Tournament"}
                  name={"tournamentId"}
                  value={tournamentId}
                  onChange={handleChange}
                  color={"#84ff00"}
                  svg={
                    <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#84ff00]" />
                  }
                  options={match}
                  isDarkMode={isDarkMode}
                />
                <ReUseableInput
                  title={"Transaction ID"}
                  name={"transactionId"}
                  defaultValue={formRef.current.transactionId}
                  onChange={handleChange}
                  color={"#ff7a00"}
                  placeholder={"Eg: TXH543KGJIYJF"}
                  svg={
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ff7a00]" />
                  }
                  isDarkMode={isDarkMode}
                />
              </div>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  qrCode ? "max-h-60 opacity-100 mt-4" : "max-h-0 opacity-0"
                }`}
              >
                {qrCode && (
                  <div
                    className={`flex flex-col items-center justify-center p-3 border rounded-xl backdrop-blur-sm ${isDarkMode ? "border-[#00fff0]/20 bg-black/40" : "border-gray-200 bg-white/60"}`}
                  >
                    <p
                      className={`text-xs mb-2 font-semibold tracking-wider uppercase ${isDarkMode ? "text-[#00fff0]" : "text-cyan-600"}`}
                    >
                      Scan to Pay
                    </p>
                    {qrCode && <GetQRCode no={qrCode} />}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className={` animate-slideInLeft neon-accent-btn neon-pulse-slow relative w-full inline-flex items-center justify-center overflow-hidden rounded-lg px-6 py-3 font-extrabold text-lg transition-transform duration-200 transform ${
                    submitting ? "scale-95" : "hover:scale-105"
                  } from-[#00fff0] via-[#ff0055] to-[#9b59ff] text-slate-100`}
                  style={{
                    background:
                      "linear-gradient(90deg,#00fff0, #ff0055, #9b59ff)",
                  }}
                >
                  <span
                    className="absolute inset-0 opacity-30 blur-xl"
                    style={{
                      background:
                        "linear-gradient(90deg,#00fff0, #ff0055, #9b59ff)",
                    }}
                  />

                  <span className="relative  flex items-center gap-3">
                    {submitting ? (
                      <Loader2 className="w-5 h-5 text-slate-100 animate-spin" />
                    ) : success ? (
                      <Check className="w-5 h-5 text-slate-100" />
                    ) : (
                      <Plus className="w-5 h-5 text-slate-100" />
                    )}
                    <span>
                      {submitting
                        ? "Submitting.."
                        : success
                          ? "Joined"
                          : "AGGRO JOIN"}
                    </span>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <CyberLoading />
  );
}
