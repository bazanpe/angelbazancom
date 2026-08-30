"use client";

import Link from "next/link";
import { CheckCircle2, Lock, Play, Clock, Trophy, ChevronRight } from "lucide-react";
import { PHASES } from "@/lib/data";
import { Badge, ProgressRing } from "@/components/ui";

const STATUS = {
  bloqueado: { label: "Bloqueado", cls: "border-white/[0.08] text-[#94A3B8]", icon: Lock },
  disponible: { label: "Disponible", cls: "border-[#159DFF]/30 text-[#159DFF]", icon: Play },
  iniciado: { label: "En progreso", cls: "border-[#F59E0B]/30 text-[#F59E0B]", icon: Play },
  completado: { label: "Completado", cls: "border-[#35E981]/30 text-[#35E981]", icon: CheckCircle2 },
};

export default function MiRutaPage() {
  const pct = Math.round(PHASES.reduce((a, p) => a + p.progress, 0) / PHASES.length);

  return (
    <div className="fade-up">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F8FAFC]">Mi ruta</h1>
          <p className="mt-1 max-w-lg text-[13.5px] text-[#94A3B8]">
            El camino exacto desde cero hasta escalar tu sistema de ventas automáticas.
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-[#0D1C24]/70 p-4">
          <ProgressRing value={pct} size={84} />
          <div>
            <div className="text-[13px] font-extrabold text-[#F8FAFC]">Avance de tu ruta</div>
            <div className="text-[11.5px] text-[#94A3B8]">{PHASES.filter((p) => p.status === "completado").length} de {PHASES.length} fases</div>
          </div>
        </div>
      </div>

      <div className="mb-5 flex gap-2">
        <button className="rounded-full bg-[#159DFF] px-4 py-2 text-[12.5px] font-extrabold text-white">Ruta completa</button>
        <button className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[12.5px] font-bold text-[#94A3B8] transition hover:text-[#F8FAFC]">
          ⚡ Ruta rápida (lanzar ya)
        </button>
      </div>

      <div className="space-y-3">
        {PHASES.map((p) => {
          const st = STATUS[p.status];
          const Icon = st.icon;
          const isNext = p.status === "iniciado";
          return (
            <div
              key={p.id}
              className={`overflow-hidden rounded-xl border bg-[#0D1C24]/70 transition ${st.cls} ${isNext ? "ring-1 ring-[#159DFF]/40" : ""}`}
            >
              <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
                <div className="flex shrink-0 items-center gap-4">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-[16px] font-black ${
                    p.status === "completado" ? "bg-[#35E981]/15 text-[#35E981]" : p.status === "iniciado" ? "bg-[#159DFF]/15 text-[#159DFF]" : "bg-white/[0.04] text-[#94A3B8]"
                  }`}>
                    {p.status === "completado" ? <CheckCircle2 size={22} /> : p.id}
                  </span>
                  <Icon size={18} className={p.status === "bloqueado" ? "text-[#94A3B8]" : p.status === "iniciado" ? "text-[#159DFF]" : "text-[#35E981]"} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#94A3B8]">Fase {p.id}</span>
                    <Badge tone={p.status === "completado" ? "green" : p.status === "iniciado" ? "blue" : "outline"}>{st.label}</Badge>
                    {p.id === 2 && <Badge tone="amber">Siguiente acción</Badge>}
                  </div>
                  <div className="mt-1 text-[16px] font-extrabold text-[#F8FAFC]">{p.title}</div>
                  <p className="mt-0.5 text-[12.5px] text-[#94A3B8]">{p.objective}</p>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <div className="text-center">
                    <div className="text-[13px] font-black text-[#F8FAFC]">{p.lessonsCount} clases</div>
                    <div className="flex items-center justify-center gap-1 text-[11px] text-[#94A3B8]"><Clock size={11} /> {p.hours}h</div>
                  </div>
                  <div className="w-20">
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className={`h-full rounded-full ${p.status === "completado" ? "w-full bg-[#35E981]" : `w-[${p.progress}%] bg-[#159DFF]`}`} style={{ width: p.status === "completado" ? "100%" : `${p.progress}%` }} />
                    </div>
                    <div className="mt-1 text-center text-[11px] font-bold text-[#94A3B8]">{p.progress}%</div>
                  </div>
                  {!p.status.includes("bloqueado") && (
                    <Link href="/cursos/sistema/m3" className="flex items-center gap-1 rounded-lg bg-[#159DFF] px-3.5 py-2 text-[12px] font-extrabold text-white transition hover:brightness-110">
                      {p.status === "iniciado" ? "Continuar" : "Empezar"} <ChevronRight size={13} />
                    </Link>
                  )}
                </div>
              </div>

              {isNext && (
                <div className="border-t border-white/[0.06] bg-[#159DFF]/[0.04] px-4 py-3">
                  <div className="mb-2 text-[11.5px] font-black uppercase tracking-wide text-[#159DFF]">Checklist de implementación</div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {p.checklist.map((c, i) => (
                      <label key={i} className="flex cursor-pointer items-center gap-2 text-[12.5px] text-[#94A3B8]">
                        <input type="checkbox" className="h-3.5 w-3.5 accent-[#159DFF]" />
                        {c}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#35E981]/20 bg-[#35E981]/[0.05] p-4">
        <Trophy size={20} className="shrink-0 text-[#35E981]" />
        <div className="text-[13px] text-[#94A3B8]">
          <b className="text-[#F8FAFC]">Recompensa:</b> al completar la Fase 7 desbloqueas la insignia <b className="text-[#35E981]">"Primera venta"</b> y el módulo de Clases grabadas.
        </div>
      </div>
    </div>
  );
}
