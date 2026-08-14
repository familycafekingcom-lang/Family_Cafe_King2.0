import { useEffect, useState } from "react";
import { Crown } from "lucide-react";

interface InitialLoaderProps {
  text?: string;
}

export function InitialLoader() {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Smooth fast counting step (approx 600ms total, clearly visible numbers 1-100)
        return prev + 3;
      });
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1D0609] text-white animate-fadeIn selection:bg-amber-400">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-gradient-to-r from-amber-500/25 via-orange-600/20 to-rose-700/25 blur-3xl animate-pulse" />

      {/* Stylish Crown Icon */}
      <div className="relative mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/20 to-orange-600/20 text-amber-400 shadow-xl backdrop-blur-md">
        <Crown size={30} className="animate-pulse" />
      </div>

      {/* Stylish Family Cafe King Title */}
      <div className="relative text-center">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 drop-shadow-sm">
          FAMILY CAFE KING
        </h1>
        <p className="mt-1.5 text-[12px] font-extrabold uppercase tracking-[0.2em] text-amber-200/70">
          Family • Food • Flavor
        </p>
      </div>

      {/* 1 to 100 Fast Counter Display */}
      <div className="mt-8 flex items-baseline gap-1">
        <span className="font-display text-4xl sm:text-5xl font-black text-amber-400 min-w-[3.5ch] text-right">
          {Math.min(100, progress)}
        </span>
        <span className="font-display text-xl font-bold text-amber-200/80">%</span>
      </div>

      {/* Dynamic Progress Bar */}
      <div className="mt-4 h-1.5 w-56 sm:w-64 overflow-hidden rounded-full bg-white/10 p-0.5 border border-amber-400/20 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 transition-all duration-75 ease-out"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
    </div>
  );
}
