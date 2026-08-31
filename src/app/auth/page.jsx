"use client";

import React, { useContext, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ThemeContext } from "../../lib/contexts/theme-context";
import { SkeletonCard } from "../skeleton/Skeleton";

const Signup = dynamic(() => import("./Signup"), {
  loading: () => <SkeletonCard />,
  ssr: false,
});
const Login = dynamic(() => import("./Login"), {
  loading: () => <SkeletonCard />,
  ssr: false,
});
const ForgotPassword = dynamic(() => import("./ForgotPassword"), {
  loading: () => <SkeletonCard />,
  ssr: false,
});

export default function AuthPageWrapper() {
  const [mode, setMode] = useState("login");
  const [loadedForms, setLoadedForms] = useState(["login"]);

  const containerRef = useRef(null);
  const formRefs = useRef({
    login: null,
    signup: null,
    "forgot-password": null,
  });

  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode ?? true;

  // Set initial 3D transform positions safely
  useGSAP(
    () => {
      Object.entries(formRefs.current).forEach(([key, el]) => {
        if (!el) return;
        if (key === "login") {
          gsap.set(el, { autoAlpha: 1, rotationY: 0, xPercent: 0, display: "block" });
        } else {
          gsap.set(el, { autoAlpha: 0, rotationY: 90, xPercent: 100, display: "none" });
        }
      });
    },
    { scope: containerRef }
  );

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleSwitch = contextSafe((newMode) => {
    if (newMode === mode) return;

    if (!loadedForms.includes(newMode)) {
      setLoadedForms((prev) => [...prev, newMode]);
    }

    // Delay slightly to allow dynamic components to mount
    requestAnimationFrame(() => {
      const fromEl = formRefs.current[mode];
      const toEl = formRefs.current[newMode];

      if (!fromEl || !toEl) return;

      const direction = newMode === "login" ? -1 : 1;

      gsap.killTweensOf([fromEl, toEl]);

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut", duration: 0.6 },
      });

      // Prepare target element for entrance animation
      gsap.set(toEl, {
        display: "block",
        rotationY: 90 * direction,
        xPercent: 100 * direction,
        autoAlpha: 0,
      });

      tl.to(fromEl, {
        rotationY: -90 * direction,
        xPercent: -100 * direction,
        autoAlpha: 0,
        onComplete: () => {
          gsap.set(fromEl, { display: "none" });
        },
      }).to(
        toEl,
        {
          rotationY: 0,
          xPercent: 0,
          autoAlpha: 1,
        },
        "<"
      );

      setMode(newMode);
    });
  });

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 antialiased relative transition-colors duration-500 ${
        isDarkMode
          ? "bg-[radial-gradient(ellipse_at_top_left,#0f172a_0%,#020617_80%)]"
          : "bg-[radial-gradient(ellipse_at_top_left,#e0f2fe_0%,#f8fafc_90%)]"
      }`}
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Auth Card Viewport */}
      <div className="w-full max-w-md mx-auto relative z-10 [perspective:1200px]">
        <div
          className={`w-full transition-all duration-300 rounded-2xl border min-h-[400px] ${
            isDarkMode
              ? "bg-slate-950/70 border-cyan-500/20 shadow-[0_0_50px_-12px_rgba(0,229,255,0.2)]"
              : "bg-white/80 border-slate-200 shadow-2xl shadow-slate-300"
          } backdrop-blur-xl p-4 sm:p-6`}
        >
          <div ref={containerRef} className="w-full h-full relative">
            {/* Login Form */}
            <div
              ref={(el) => (formRefs.current["login"] = el)}
              className="w-full [backface-visibility:hidden]"
            >
              <Login onSwitch={handleSwitch} isDarkMode={isDarkMode} />
            </div>

            {/* Signup Form */}
            <div
              ref={(el) => (formRefs.current["signup"] = el)}
              className="w-full [backface-visibility:hidden]"
            >
              {loadedForms.includes("signup") && (
                <Signup onSwitch={handleSwitch} isDarkMode={isDarkMode} />
              )}
            </div>

            {/* Forgot Password Form */}
            <div
              ref={(el) => (formRefs.current["forgot-password"] = el)}
              className="w-full [backface-visibility:hidden]"
            >
              {loadedForms.includes("forgot-password") && (
                <ForgotPassword
                  onSwitch={handleSwitch}
                  isDarkMode={isDarkMode}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}