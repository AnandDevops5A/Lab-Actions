import React, { useContext } from "react";
import dynamic from "next/dynamic";
import profileBackImage from "../images/profile.png";
import Image from "next/image";
import { ThemeContext } from "../../lib/contexts/theme-context";

// const DynamicChargeborder = dynamic(
//   () => import("../../components/ui/charge-border"),
//   { loading: () => <p>...</p>, ssr: false }
// );

const ProfileHeader = ({ player }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
  // <DynamicChargeborder
  //   color="#7cfc00 "
  //   speed={0.3}
  //   chaos={0.5}
  //   thickness={2}
  //   style={{ borderRadius: 14 }}
  // >
  <div
    className={`relative h-48 sm:h-56 md:h-64 lg:h-72 bg-cover bg-center mt-16 rounded-2xl overflow-hidden transition-all duration-300 ${
      isDarkMode ? "border-0 shadow-none" : "border-4 border-white shadow-xl"
    }`}
    style={{ backgroundImage: `url(${profileBackImage.src})` }}
  >
    {/* Semi-transparent overlay */}
    {/* <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm rounded-2xl"></div> */}

    <div className="relative p-4 sm:p-6 flex flex-col md:flex-row-reverse items-center justify-evenly h-full gap-6 blur(4px)">
      {/* Player Avatar */}
      <img
        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username}`}
        alt={player.username}
        // Set the base width and height based on the largest possible size (lg:w-40/h-40)
        // width={80}
        // height={80}
        className={`w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full border-2 shadow-xl transition-colors duration-300 ${
          isDarkMode
            ? "border-green-400 shadow-slate-900"
            : "border-green-600 shadow-slate-500"
        }`}
        // Use the 'style' prop for CSS properties that affect layout or object fitting
        style={{
          objectFit: "cover", // Equivalent to the 'object-cover' class
        }}
        // Optional: Add 'priority' if this avatar is critical for the LCP
        loading="lazy"
      />

      {/* Player Info */}
      <div className="text-center md:text-left max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <h1
          className={`
              text-xl md:text-2xl lg:text-3xl 
              font-bold uppercase 
              tracking-[0.35em] 
              drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] 
              animate-pulse 
              wrap-break-word
              transition-colors duration-300
              ${isDarkMode ? "text-green-400" : "text-green-500"}
            `}
        >
          {player.username}
        </h1>

        <p className={`text-sm sm:text-base md:text-lg lg:text-xl mt-2 transition-colors duration-300 ${isDarkMode ? "text-gray-300" : "text-gray-100"}`}>
          Team:{" "}
          <span className="font-semibold text-slate-100">{player.teamName || "N/A"}</span>{" "}
          | Player ID: {player.playerId|| "N/A"}
        </p>
      </div>
    </div>
  </div>
    // </DynamicChargeborder>
  );
};

export default ProfileHeader;
