"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Play, Clock, FileText, Lock, CheckCircle2, Target, Sparkles } from "lucide-react";
import { COURSE } from "@/lib/data";
import { Badge, PlayerButton, LockedOverlay, ProgressRing } from "@/components/ui";

const FILTERS = ["Todas", "Pendientes", "En progreso", "Completadas"];

export default function ModuloDetailPage() {
  const { id, modulo } = useParams();
  const mod = COURSE.modules.find((m) => m.id === modulo);
  const [filter, setFilter] = useState("Todas");

  if (!mod) return <div className="text-[#94A3B8]">Módulo no encontrado.</div>;

  const completed = ["m1l1", "m1l2", "m2l1"];
  const inProgress = ["m2l2"];
  const filtered = mod.lessons.filter((l) => {
    if (filter === "Pendientes") return !completed.includes(l.id) && !inProgress.includes(l.id);
    if (filter === "En progreso") return inProgress.includes(l.id);
    if (filter === "Completadas") return completed.includes(l.id);
    return true;
  });
  const totalMin = mod.lessons.reduce((a, l) => a + l.duration, 0);
  const pct = Math.round((completed.filter((c) => mod.lessons.some((l) => l.id === c)).length / mod.lessons.length) * 100);

  return (
    <div className="fade-up">
      <Link href={`/cursos/${id}`} className="text-[12.5px] font-bold text-[#159DFF] hover:underline">
        ← Volver al curso
      </Link>

      <section className="relative mt-4 overflow-hidden rounded-2xl border border-white/[0.08]">
        <div className="relative aspect-[21/9] md:aspect-[21/6]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0878F9]/40 via-[#0D1C24] to-[#050A0E]" />
          {mod.locked && <div className="absolute inset-0 bg-[#050A0E]/70 backdrop-blur-sm" />}
          <div className="relative z-10 flex h-full flex-col justify-end p-5 md:p-8">
            <Badge tone="blue">Módulo {mod.numero}</Badge>
            <h1 className="mt-2 text-2xl font-black text-[#F8FAFC]">{mod.title}</h1>
            <p className="mt-1.5 max-w-xl text-[13.5px] text-[#94A3B8]">{mod.desc}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <PlayerButton label={mod.locked ? "Bloqueado" : "Comenzar módulo"} />
              <span className="text-[12.5px] text-[#94A3B8]">
                {mod.lessons.length} clases · {totalMin} min
              </span>
            </div>
          </div>
          {mod.locked && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-[#94A3B8]">
                <Lock size={20} />
              </span>
              <div className="max-w-sm text-sm font-bold text-[#F8FAFC]">
                Este módulo se desbloquea al completar la fase anterior.
              </div>
              <div className="text-xs text-[#94A3B8]">Completa las clases del módulo {mod.numero - 1} para acceder.</div>
            </div>
          )}
        </div>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-[1fr_240px]">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-bold transition ${
                  filter === f ? "bg-[#159DFF] text-white" : "border border-white/10 bg-white/[0.03] text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map((l, i) => {
              const isDone = completed.includes(l.id);
              const isProg = inProgress.includes(l.id);
              return (
                <Link
                  key={l.id}
                  href={`/clases/${l.id}`}
                  className={`flex items-center gap-4 rounded-xl border p-3.5 transition hover:bg-white/[0.04] ${
                    isProg ? "border-[#159DFF]/40 bg-[#159DFF]/[0.05]" : "border-white/[0.08] bg-[#0D1C24]/60"
                  }`}
                >
                  <span className="relative flex h-11 w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#0D1C24] to-[#050A0E]">
                    {isProg && <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#159DFF] text-white"><Play size={12} className="ml-0.5 fill-current" /></span>}
                    {isDone && <CheckCircle2 size={20} className="text-[#35E981]" />}
                    {!isProg && !isDone && <span className="text-[11px] font-black text-[#94A3B8]">{String(i + 1).padStart(2, "0")}</span>}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13.5px] font-extrabold text-[#F8FAFC]">{l.title}</span>
                      {isDone && <Badge tone="green">Completada</Badge>}
                      {isProg && <Badge tone="blue">En progreso</Badge>}
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-[11.5px] text-[#94A3B8]">
                      <span className="flex items-center gap-1"><Clock size={11} /> {l.duration} min</span>
                      {l.resource && <span className="flex items-center gap-1"><FileText size={11} /> Recurso</span>}
                    </div>
                  </div>
                  <Play size={15} className={isProg ? "text-[#159DFF]" : "text-[#94A3B8]"} />
                </Link>
              );
            })}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-[#0D1C24]/70 p-5 text-center">
            <ProgressRing value={pct} size={110} />
            <div className="mt-3 text-[13px] font-extrabold text-[#F8FAFC]">Avance del módulo</div>
            <div className="text-[11.5px] text-[#94A3B8]">{completed.length} de {mod.lessons.length} clases</div>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-[#0D1C24]/70 p-4">
            <div className="flex items-center gap-2 text-[12px] font-black uppercase tracking-wide text-[#159DFF]">
              <Target size={13} /> Objetivo
            </div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#94A3B8]">{mod.objective}</p>
          </div>
          <div className="rounded-xl border border-[#35E981]/20 bg-[#35E981]/[0.05] p-4">
            <div className="flex items-center gap-2 text-[12px] font-black uppercase tracking-wide text-[#35E981]">
              <Sparkles size={13} /> Resultado esperado
            </div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#94A3B8]">{mod.result}</p>
          </div>
        </aside>
      </section>
    </div>
  );
}
