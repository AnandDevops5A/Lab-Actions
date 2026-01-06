import React from "react";
import dynamic from "next/dynamic";
import profileBackImage from "../images/profile.png";
import Image from "next/image";

const DynamicChargeborder = dynamic(
  () => import("../Components/ChargeBorder.jsx"),
  { loading: () => <p>...</p>, ssr: false }
);

const ProfileHeader = ({ player }) => (
  // <DynamicChargeborder
  //   color="#7cfc00 "
  //   speed={1}
  //   chaos={0.5}
  //   thickness={2}
  //   style={{ borderRadius: 14 }}
  // >
  <div
    className="relative h-48 sm:h-56 md:h-64 lg:h-72 bg-cover bg-center mt-16 rounded-2xl overflow-hidden"
    style={{ backgroundImage: `url(${profileBackImage.src})` }}
  >
    {/* Semi-transparent overlay */}
    {/* <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm rounded-2xl"></div> */}

    <div className="relative p-4 sm:p-6 flex flex-col md:flex-row-reverse items-center justify-evenly h-full gap-6 blur(4px)">
      {/* Player Avatar */}
      <Image
        src={player.avatarUrl}
        alt={player.username}
        // Set the base width and height based on the largest possible size (lg:w-40/h-40)
        width={80}
        height={80}
        // Apply the Tailwind classes for styling, responsiveness, and border/shadow.
        // NOTE: 'object-cover' is handled by the 'style' prop in newer Next.js versions.
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full border-2 border-green-400 shadow-xl shadow-gray-700/70"
        // Use the 'style' prop for CSS properties that affect layout or object fitting
        style={{
          objectFit: "cover", // Equivalent to the 'object-cover' class
        }}
        // Optional: Add 'priority' if this avatar is critical for the LCP
        priority={true}
      />

      {/* Player Info */}
      <div className="text-center md:text-left max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <h1
          className="
              text-xl md:text-2xl lg:text-3xl 
              font-bold uppercase 
              tracking-[0.35em] 
              text-green-500 
              drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] 
              animate-pulse 
              wrap-break-word
            "
        >
          {player.username}
        </h1>

        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mt-2">
          Team:{" "}
          <span className="font-semibold text-white">{player.teamName || "N/A"}</span>{" "}
          | Player ID: {player.playerId|| "N/A"}
        </p>
      </div>
    </div>
  </div>
  // </DynamicChargeborder>
);

export default ProfileHeader;
