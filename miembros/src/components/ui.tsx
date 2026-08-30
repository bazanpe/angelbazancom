import type { ReactNode } from "react";
import { Lock } from "lucide-react";

export function Badge({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "green" | "amber" | "red" | "outline" }) {
  const tones = {
    blue: "bg-[#159DFF]/15 text-[#159DFF] border-[#159DFF]/30",
    green: "bg-[#35E981]/12 text-[#35E981] border-[#35E981]/30",
    amber: "bg-[#F59E0B]/12 text-[#F59E0B] border-[#F59E0B]/30",
    red: "bg-[#EF4444]/12 text-[#EF4444] border-[#EF4444]/30",
    outline: "bg-white/5 text-[#94A3B8] border-white/10",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function ProgressRing({ value, size = 92, stroke = 7 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (value / 100) * c}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)" }}
        />
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#35E981" />
            <stop offset="100%" stopColor="#159DFF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-lg font-black text-[#F8FAFC]">{value}%</div>
        <div className="text-[9px] font-semibold uppercase tracking-wider text-[#94A3B8]">progreso</div>
      </div>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function LockedOverlay({ why, how }: { why: string; how: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-[#050A0E]/85 p-6 text-center backdrop-blur-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-[#94A3B8]">
        <Lock size={18} />
      </span>
      <div className="text-sm font-bold text-[#F8FAFC]">{why}</div>
      <div className="text-xs text-[#94A3B8]">{how}</div>
    </div>
  );
}

export function EmptyState({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-[#94A3B8]">{icon}</span>
      <div className="text-sm font-bold text-[#F8FAFC]">{title}</div>
      <div className="max-w-xs text-xs text-[#94A3B8]">{desc}</div>
    </div>
  );
}

export function PlayerButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#159DFF] to-[#0878F9] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#159DFF]/25 transition hover:brightness-110"
    >
      {label}
    </button>
  );
}
