import React from "react";
import { User, Mail, Gamepad2, Trophy, Loader2 } from "lucide-react";

export const callSignSVG = (
  <User
    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00fff0]/90"
    aria-hidden
  />
);

export const emailSVG = (
  <Mail
    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9b59ff]/80"
    aria-hidden
  />
);

export const gameIdSVG = (
  <Gamepad2
    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ff0055]/90"
    aria-hidden
  />
);

export const tournamentSVG = (
  <Trophy
    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ff7a00]/90"
    aria-hidden
  />
);

export const LoadingCircleSVG = (
  <Loader2 className="w-5 h-5 animate-spin" />
);
