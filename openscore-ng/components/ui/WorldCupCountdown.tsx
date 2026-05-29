"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

const OPENING_MATCH = new Date("2026-06-11T19:00:00Z");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const diff = OPENING_MATCH.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="min-w-[3.5rem] rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-2 text-center">
        <span className="text-3xl font-bold tabular-nums text-white leading-none">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs font-medium text-rose-100 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export function WorldCupCountdown({ className }: { className?: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const started = OPENING_MATCH.getTime() <= Date.now();

  return (
    <div className={`rounded-2xl bg-gradient-to-br from-rose-600 to-rose-800 p-6 shadow-lg flex flex-col items-center justify-center${className ? ` ${className}` : ""}`}>
      <div className="flex items-center justify-center gap-2 mb-1">
        <Clock className="h-4 w-4 text-rose-200" />
        <span className="text-xs font-semibold text-rose-200 uppercase tracking-widest">
          World Cup 2026
        </span>
      </div>
      <h2 className="text-white font-bold text-lg mb-4 text-center">
        {started ? "The World Cup has started! 🎉" : "Countdown to kick-off"}
      </h2>

      {!started && mounted && (
        <div className="flex items-start justify-center gap-3">
          <Unit value={timeLeft.days} label="days" />
          <span className="text-white/60 text-2xl font-light mt-2">:</span>
          <Unit value={timeLeft.hours} label="hours" />
          <span className="text-white/60 text-2xl font-light mt-2">:</span>
          <Unit value={timeLeft.minutes} label="min" />
          <span className="text-white/60 text-2xl font-light mt-2">:</span>
          <Unit value={timeLeft.seconds} label="sec" />
        </div>
      )}

      <p className="text-rose-200 text-xs mt-4 text-center">
        🏟️ Opening match: Mexico vs South Africa — Estadio Azteca, June 11
      </p>
    </div>
  );
}
