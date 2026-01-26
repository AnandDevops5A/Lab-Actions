"use client";

import { useState, useEffect, useLayoutEffect, use } from "react";
import {
  callSignSVG,
  gameIdSVG,
  tournamentSVG,
  tempEmailSVG,
  emailSVG,
  LoadingCircleSVG,
} from "../ui/svg";
import { getCache, setCache } from "../../lib/utils/action-redis";
import { errorMessage, simpleMessage, successMessage } from "../../lib/utils/alert";
import { getHisJoinedTouenament, joinTournament, useFetchBackendAPI } from "../../lib/api/backend-api";
import { UserContext } from "../../lib/contexts/user-context";
import CyberLoading from "../../app/skeleton/CyberLoading";

//reuseable input field
const ReUseableInput = ({
  title,
  name,
  color,
  placeholder,
  svg,
  value,
  onChange,
}) => {
  return (
    <label className="flex flex-col ">
      <span className="text-xs text-gray-300 mb-1">{title}</span>
      <div className="relative">
        {svg}
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={onChange}
          required
          placeholder={placeholder}
          className={`w-full bg-transparent border-2 border-[${color}]/10 rounded-md px-3 pl-10 py-2 text-white placeholder-gray-400 focus:outline-none neon-input transition-colors duration-200`}
        />
      </div>
    </label>
  );
};
//REUSEABLE DROPDOWN
const ReUseableDropdown = ({
  title,
  name,
  value,
  onChange,
  options,
  color,
  svg,
}) => {
  return (
    <label className="flex flex-col">
      <span className="text-xs text-gray-300 mb-1">{title}</span>
      <div className="relative">
        {svg}
        <select
          name={name}
          value={value}
          onChange={onChange}
          required
          className={`w-full bg-transparent border-2 rounded-md px-3 pl-10 py-2 text-white placeholder-gray-400 focus:outline-none neon-input transition-colors duration-200 border-${color}/10 appearance-none`}
        >
          <option value="" className="bg-gray-900 text-white">
            Select {title}
          </option>
          {options?.map((opt, idx) => (
            <option key={idx} value={opt.id} className="bg-gray-900 text-white">
              {opt.tournamentName}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
};

export default function MatchJoiningForm({
  open: controlledOpen,
  setOpen: controlledSetOpen,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledSetOpen || setInternalOpen;
  const { user } = use(UserContext);
  const [form, setForm] = useState({
    userId: user ? user.id : "",
    transactionId: "",
    tempEmail: user ? user.email : "",
    gameId: "",
    tournamentId: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [match, setMatch] = useState(null);

  function alreadyRegistered(){
     simpleMessage(
              "You have already joined all upcoming tournaments.",
              "Info",
            );

            setSubmitting(false);
            setSuccess(false);
            setOpen(false);
            setForm({
              userId: user ? user.id : "",
              transactionId: "",
              tempEmail: user ? user.email : "",
              gameId: "",
              tournamentId: "",
            });
  }

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        // 1. Get all upcoming tournaments from cache
        const ud = await getCache("upcomingTournament");
        const upcomingData = ud?.data;
        if (!upcomingData || !Array.isArray(upcomingData) || upcomingData.length === 0) {
          // If there are no upcoming tournaments at all, inform the user.
          alreadyRegistered();
          return;
        }

        // 2. Get local cache of joined tournaments (to preserve optimistic updates)
        const cj = await getCache(`hisJoinedTournament:${user.id}`);
        const cachedJoined = Array.isArray(cj?.data) ? cj.data : [];

        // 3. Fetch the user's joined tournaments from the backend for accuracy
        const response = await getHisJoinedTouenament(user.id);
        if (!isMounted) return;

        const backendJoined = Array.isArray(response.data) ? response.data : [];

        // 4. Merge cache and backend data to ensure we have the latest joined tournaments
        const joinedMap = new Map();
        backendJoined.forEach((t) => joinedMap.set(String(t.tournamentId), t));
        cachedJoined.forEach((t) => joinedMap.set(String(t.tournamentId), t)); // Local cache takes precedence for recent joins
        
        const mergedJoined = Array.from(joinedMap.values());

        // 5. Update the cache with the merged data
        await setCache(`hisJoinedTournament:${user.id}`, mergedJoined);

        // 6. Filter the upcoming list against the merged joined list
        const filterMatches = (joinedList) => {
          const joinedIds = new Set(joinedList.map((t) => String(t.tournamentId)));
          return upcomingData.filter((d) => !joinedIds.has(String(d.id)));
        };

        const finalAvailable = filterMatches(mergedJoined);

        // 7. Update the state with the final list of available tournaments
        if (finalAvailable.length === 0) {
          alreadyRegistered();
        } else {
          setMatch(finalAvailable);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        errorMessage("Could not load tournament list. Please try again.");
        setOpen(false);
      }
    };
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // const upcomingTournament=await getCache("upcomingTournament");
  //   console.log(upcomingTournament);

  function handleChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const response = await joinTournament(form);
    if (!response.ok) {
      errorMessage(response.error || "Failed to join tournament");
      setSubmitting(false);
      return;
    }
    successMessage(response.data.message || response.data || "Successfully joined tournament");

    // Update cache to reflect the new join immediately
    try {
      const cj = await getCache(`hisJoinedTournament:${user.id}`);
      let currentJoined = cj?.data || [];
      if (!Array.isArray(currentJoined)) currentJoined = [];
      
      const newJoin = { tournamentId: form.tournamentId };
      const updatedJoined = [...currentJoined, newJoin];
      await setCache("hisJoinedTournament:" + user.id, updatedJoined);
    } catch (error) {
      console.error("Error updating cache:", error);
    }

    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setOpen(false);
      setForm({
        userId: user ? user.id : "",
        transactionId: "",
        tempEmail: user ? user.email : "",
        gameId: "",
        tournamentId: "",
      });
    }, 1000);
  }

  if (!open) return null;

  return (
    (match && match.length>0)?
      (<div className="fixed animate-slideInUp inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <div className="relative max-w-lg w-[94%] sm:w-3/4 md:w-2/3 lg:w-1/2 mx-4">
        <div className="neon-modal-animate transform transition-all duration-400 scale-100 -translate-y-2">
          <div className="relative bg-linear-to-br from-neutral-900/95 to-neutral-800/95 border border-[#00fff0]/10 rounded-2xl p-6 neon-glow">
            {/* decorative neon accents */}
            <span className="absolute -left-6 -top-6 w-24 h-1 bg-linear-to-r from-[#00fff0] to-[#ff0055] opacity-80 blur-sm rotate-12"></span>
            <span className="absolute -right-6 -bottom-6 w-24 h-1 bg-linear-to-r from-[#9b59ff] to-[#ff0055] opacity-70 blur-sm -rotate-12"></span>
            <div className="flex items-start justify-between gap-4">
              <div className=" animate-slideInRight">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  Join Tournament
                </h3>
                <p className="text-sm text-gray-300/80 mt-1">
                  Submit your details to secure a spot. Double-check your
                  tournament id.
                </p>
              </div>
              <button
                aria-label="close"
                onClick={() => setOpen(false)}
                className="  text-[#00fff0] hover:text-white p-2 rounded-md transition border border-transparent hover:border-[#00fff0]/30 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* <ReUseableInput
                  title={"Callsign"}
                  name={"callsign"}
                  color={"#00fff0"}
				  placeholder={"e.g. ShadowFury"}
                  svg={callSignSVG}
                /> */}

                <ReUseableInput
                  title={"Contact Email"}
                  name={"tempEmail"}
                  value={form.tempEmail}
                  onChange={handleChange}
                  color={"#9b59ff"}
                  placeholder={"contact email id"}
                  svg={emailSVG}
                />
                <ReUseableInput
                  title={"Game ID"}
                  name={"gameId"}
                  value={form.gameId}
                  onChange={handleChange}
                  color={"#ff0055"}
                  placeholder={"eg: @7575945394"}
                  svg={callSignSVG}
                />
                <ReUseableInput
                  title={"Transaction ID"}
                  name={"transactionId"}
                  value={form.transactionId}
                  onChange={handleChange}
                  color={"#ff7a00"}
                  placeholder={"Eg: Solo surviver"}
                  svg={tournamentSVG}
                />
                <ReUseableDropdown
                  title={"Tournament"}
                  name={"tournamentId"}
                  value={form.tournamentId}
                  onChange={handleChange}
                  color={"#84ff00"}
                  svg={gameIdSVG}
                  options={match}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className={` animate-slideInLeft neon-accent-btn neon-pulse-slow relative w-full inline-flex items-center justify-center overflow-hidden rounded-lg px-6 py-3 font-extrabold text-lg transition-transform duration-200 transform ${
                    submitting ? "scale-95" : "hover:scale-105"
                  } from-[#00fff0] via-[#ff0055] to-[#9b59ff] text-white`}
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
                      LoadingCircleSVG
                    ) : success ? (
                      <svg
                        className="w-5 h-5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M5 12h14"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 5v14"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
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
    </div>):<CyberLoading/>
  );
}



