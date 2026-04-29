"use client";

import { useTheme } from "@/lib/theme";

export default function HomeBackground() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      background: dark ? "#0a0800" : "#faf8f0",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes blobA {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(60px,-40px) scale(1.08); }
          66%      { transform: translate(-40px,50px) scale(0.95); }
        }
        @keyframes blobB {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(-70px,40px) scale(1.06); }
          66%      { transform: translate(50px,-30px) scale(0.97); }
        }
        @keyframes blobC {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(30px,60px) scale(1.05); }
        }
      `}</style>

      {/* Blob A — top left */}
      <div style={{
        position: "absolute", top: "-10%", left: "-5%",
        width: "60vw", height: "60vw", borderRadius: "50%",
        background: dark
          ? "radial-gradient(circle, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.08) 45%, transparent 70%)"
          : "radial-gradient(circle, rgba(180,140,20,0.18) 0%, rgba(180,140,20,0.06) 45%, transparent 70%)",
        filter: "blur(60px)",
        animation: "blobA 12s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Blob B — bottom right */}
      <div style={{
        position: "absolute", bottom: "-10%", right: "-5%",
        width: "55vw", height: "55vw", borderRadius: "50%",
        background: dark
          ? "radial-gradient(circle, rgba(240,208,96,0.18) 0%, rgba(212,175,55,0.06) 45%, transparent 70%)"
          : "radial-gradient(circle, rgba(200,160,30,0.15) 0%, rgba(180,140,20,0.04) 45%, transparent 70%)",
        filter: "blur(70px)",
        animation: "blobB 15s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Blob C — center */}
      <div style={{
        position: "absolute", top: "30%", left: "35%",
        width: "40vw", height: "40vw", borderRadius: "50%",
        background: dark
          ? "radial-gradient(circle, rgba(212,175,55,0.10) 0%, transparent 65%)"
          : "radial-gradient(circle, rgba(180,140,20,0.08) 0%, transparent 65%)",
        filter: "blur(50px)",
        animation: "blobC 18s ease-in-out infinite",
        willChange: "transform",
      }} />
    </div>
  );
}
