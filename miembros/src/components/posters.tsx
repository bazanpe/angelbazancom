import { Check, Play, Lock } from "lucide-react";

export type PosterVariant = "vertical" | "horizontal";

const ACCENTS: Record<string, { from: string; to: string; glow: string }> = {
  green: { from: "#35E981", to: "#0E7A46", glow: "#35E981" },
  blue: { from: "#159DFF", to: "#083A7A", glow: "#159DFF" },
  teal: { from: "#2ED9C3", to: "#0A5E63", glow: "#2ED9C3" },
  cyan: { from: "#27A9FF", to: "#0A2E5E", glow: "#27A9FF" },
  gold: { from: "#F5C34E", to: "#7A5A0E", glow: "#F5C34E" },
};

const MODULE_THEME: Record<string, { accent: string; symbol: string }> = {
  m1: { accent: "blue", symbol: "◆" },
  m2: { accent: "teal", symbol: "∑" },
  m3: { accent: "green", symbol: "◎" },
  m4: { accent: "cyan", symbol: "✎" },
  m5: { accent: "gold", symbol: "$" },
  m6: { accent: "green", symbol: "◉" },
  m7: { accent: "blue", symbol: "⚙" },
  m8: { accent: "cyan", symbol: "▶" },
  m9: { accent: "gold", symbol: "▲" },
  m10: { accent: "teal", symbol: "⚡" },
  m11: { accent: "blue", symbol: "℅" },
  m12: { accent: "green", symbol: "↑" },
  m13: { accent: "cyan", symbol: "◈" },
  m14: { accent: "blue", symbol: "▤" },
  m15: { accent: "gold", symbol: "✦" },
};

function robotFace(accent: string) {
  return (
    <>
      <rect x="64" y="34" width="72" height="66" rx="18" fill="rgba(255,255,255,0.04)" stroke={accent} strokeOpacity="0.5" strokeWidth="1.5" />
      <line x1="100" y1="34" x2="100" y2="18" stroke={accent} strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
      <circle cx="100" cy="15" r="4" fill={accent} />
      <circle cx="84" cy="62" r="10" fill={accent} fillOpacity="0.9" />
      <circle cx="116" cy="62" r="10" fill={accent} fillOpacity="0.9" />
      <circle cx="86" cy="59" r="3.5" fill="#05090D" />
      <circle cx="118" cy="59" r="3.5" fill="#05090D" />
      <path d="M84 84 Q100 94 116 84" stroke={accent} strokeOpacity="0.8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  );
}

export function Poster({
  id,
  title,
  numero,
  variant = "vertical",
  locked,
  done,
}: {
  id: string;
  title: string;
  numero?: number;
  variant?: PosterVariant;
  locked?: boolean;
  done?: boolean;
}) {
  const theme = MODULE_THEME[id] ?? { accent: "blue", symbol: "◆" };
  const a = ACCENTS[theme.accent] ?? ACCENTS.blue;
  const isV = variant === "vertical";
  const W = isV ? 300 : 480;
  const H = isV ? 450 : 270;

  return (
    <div className={`relative overflow-hidden ${isV ? "aspect-[2/3]" : "aspect-video"} rounded-xl bg-[#0A1117]`}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0A1117" />
            <stop offset="55%" stopColor="#05090D" />
            <stop offset="100%" stopColor="#020507" />
          </linearGradient>
          <linearGradient id={`top-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={a.from} stopOpacity="0.55" />
            <stop offset="100%" stopColor={a.from} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={`url(#bg-${id})`} />
        {/* grid técnico */}
        <g stroke="rgba(21,157,255,0.05)" strokeWidth="1">
          {Array.from({ length: isV ? 10 : 16 }).map((_, i) => (
            <line key={`g${i}`} x1={i * 30} y1="0" x2={i * 30} y2={H} />
          ))}
          {Array.from({ length: isV ? 15 : 9 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 30} x2={W} y2={i * 30} />
          ))}
        </g>
        {/* barra superior de color */}
        <rect width={W} height={H} fill={`url(#top-${id})`} opacity="0.7" />
        {/* glow */}
        <ellipse cx={isV ? 230 : 420} cy={isV ? 70 : 60} rx="150" ry="110" fill={a.glow} opacity="0.16" filter="blur(40px)" />
        <ellipse cx={isV ? 60 : 40} cy={isV ? 390 : 240} rx="130" ry="100" fill={a.glow} opacity="0.1" filter="blur(46px)" />
        {/* decoraciones abstractas */}
        <g opacity="0.85">
          {id === "m6" || id === "m7" || id === "m14" ? (
            Array.from({ length: 8 }).map((_, i) => (
              <circle key={`b${i}`} cx={isV ? 40 + i * 30 : 60 + i * 48} cy={isV ? 130 : 60} r="9" fill={a.glow} opacity="0.16" />
            ))
          ) : (
            <>
              <rect x={isV ? 200 : 320} y={isV ? 60 : 40} width="52" height="34" rx="8" fill="rgba(255,255,255,0.05)" stroke={a.glow} strokeOpacity="0.4" />
              <path d={isV ? "M210 190 q20 -30 40 0 t40 0" : "M340 150 q20 -30 40 0 t40 0"} stroke={a.glow} strokeOpacity="0.7" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          )}
          <text x={isV ? 24 : 26} y={isV ? 52 : 44} fill="#94A3B8" fontSize="13" fontWeight="800" letterSpacing="3" opacity="0.7">
            MODULO {numero ?? "·"}
          </text>
        </g>
        {/* robot / cyborg */}
        <g opacity="0.5" transform={isV ? "translate(60 190) scale(0.72)" : "translate(300 70) scale(0.6)"}>
          {robotFace(a.from)}
        </g>
        {/* símbolo grande */}
        <text
          x={isV ? 30 : 34}
          y={isV ? 420 : 236}
          fill={a.from}
          fontSize="64"
          fontWeight="900"
          opacity="0.35"
          fontFamily="Inter, sans-serif"
        >
          {theme.symbol}
        </text>
      </svg>

      {/* capa inferior de texto */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020507] via-[#020507]/70 to-transparent px-3.5 pb-3.5 pt-10">
        {variant === "vertical" ? (
          <>
            <div className="text-[13px] font-black leading-tight text-[#F8FAFC]">{title}</div>
            {numero !== undefined && <div className="mt-0.5 text-[10px] font-bold tracking-wider text-[#94A3B8]">Módulo {numero}</div>}
          </>
        ) : (
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-[15px] font-black leading-tight text-[#F8FAFC]">{title}</div>
              {numero !== undefined && <div className="mt-0.5 text-[10.5px] font-bold tracking-wider text-[#94A3B8]">Módulo {numero}</div>}
            </div>
            <Play size={22} className="shrink-0 text-white opacity-80" fill="currentColor" />
          </div>
        )}
      </div>

      {done && (
        <span className="absolute left-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#35E981] text-[#05090D] shadow-lg shadow-[#35E981]/40">
          <Check size={13} strokeWidth={3} />
        </span>
      )}
      {locked && (
        <span className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-[#94A3B8] backdrop-blur">
          <Lock size={12} />
        </span>
      )}
    </div>
  );
}

export function PosterSkeleton({ variant = "vertical" }: { variant?: PosterVariant }) {
  return <div className={`${variant === "vertical" ? "aspect-[2/3]" : "aspect-video"} skeleton rounded-xl`} />;
}
