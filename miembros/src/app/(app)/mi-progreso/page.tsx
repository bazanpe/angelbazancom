import { Trophy, Flame, CheckCircle2, TrendingUp, Medal, Rocket, Target, Zap } from "lucide-react";
import { DEMO_USER, PHASES } from "@/lib/data";
import { Badge, ProgressRing } from "@/components/ui";

const BADGES = [
  { name: "Sistema activado", icon: Rocket, got: true },
  { name: "Primera venta", icon: Trophy, got: false },
  { name: "Oferta construida", icon: Target, got: false },
  { name: "Funnel preparado", icon: Zap, got: false },
  { name: "Alumno disciplinado", icon: Medal, got: false },
];

export default function MiProgresoPage() {
  return (
    <div className="fade-up mx-auto max-w-3xl">
      <h1 className="text-2xl font-black text-[#F8FAFC]">Mi progreso</h1>
      <p className="mt-1 text-[13.5px] text-[#94A3B8]">Tu avance, racha e insignias.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-white/[0.08] bg-[#0D1C24]/70 p-4 text-center">
          <ProgressRing value={DEMO_USER.progress} size={92} />
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0D1C24]/70 p-4">
          <Flame size={18} className="text-[#F59E0B]" />
          <div className="mt-2 text-[22px] font-black text-[#F8FAFC]">{DEMO_USER.streak} días</div>
          <div className="text-[11.5px] text-[#94A3B8]">Racha actual</div>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0D1C24]/70 p-4">
          <CheckCircle2 size={18} className="text-[#35E981]" />
          <div className="mt-2 text-[22px] font-black text-[#F8FAFC]">{DEMO_USER.classesCompleted}</div>
          <div className="text-[11.5px] text-[#94A3B8]">Clases completadas</div>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0D1C24]/70 p-4">
          <TrendingUp size={18} className="text-[#159DFF]" />
          <div className="mt-2 text-[22px] font-black text-[#F8FAFC]">{PHASES.filter((p) => p.progress > 0).length} / {PHASES.length}</div>
          <div className="text-[11.5px] text-[#94A3B8]">Fases iniciadas</div>
        </div>
      </div>

      <h2 className="mb-3 mt-8 text-[16px] font-extrabold text-[#F8FAFC]">Insignias</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {BADGES.map((b) => (
          <div
            key={b.name}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center ${
              b.got ? "border-[#35E981]/25 bg-[#35E981]/[0.05]" : "border-white/[0.08] bg-[#0D1C24]/50 opacity-50"
            }`}
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-full ${b.got ? "bg-[#35E981]/15 text-[#35E981]" : "bg-white/[0.05] text-[#94A3B8]"}`}>
              <b.icon size={20} />
            </span>
            <div className="text-[11.5px] font-bold leading-tight text-[#F8FAFC]">{b.name}</div>
            {b.got ? <Badge tone="green">Ganada</Badge> : <span className="text-[10px] text-[#94A3B8]">Bloqueada</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
