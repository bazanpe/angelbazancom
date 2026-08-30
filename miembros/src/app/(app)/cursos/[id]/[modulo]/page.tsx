"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Play, Clock, Check, FileText, Lock } from "lucide-react";
import { COURSE } from "@/lib/data";
import { Poster } from "@/components/posters";

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
      {/* HERO de temporada */}
      <section className="relative overflow-hidden rounded-2xl">
        <div className="relative h-[420px] md:h-[500px]">
          <div className="absolute inset-0">
            <Poster id={mod.id} title={mod.title} numero={mod.numero} variant="horizontal" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#05090D] via-[#05090D]/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#05090D] to-transparent" />

          <div className="relative z-10 flex h-full flex-col justify-end p-5 md:p-10 md:max-w-[60%]">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#159DFF]">
              Módulo {mod.numero} · {mod.lessons.length} clases · {Math.round(totalMin / 60)} h {totalMin % 60} min
            </div>
            <h1 className="mt-2 text-[26px] font-black leading-tight text-white md:text-[40px]">{mod.title}</h1>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-[#F8FAFC]/85 md:text-[14.5px]">{mod.desc}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {!mod.locked && (
                <Link
                  href={`/clases/${mod.lessons.find((l) => !completed.includes(l.id))?.id ?? mod.lessons[0].id}`}
                  className="flex items-center gap-2 rounded-md bg-white px-6 py-3 text-[14px] font-extrabold text-[#05090D] shadow-2xl shadow-black/50 transition hover:bg-[#E8F0F8]"
                >
                  <Play size={16} className="fill-current" /> {pct > 0 ? "Continuar" : "Comenzar"}
                </Link>
              )}
              <span className="flex items-center gap-2 text-[12.5px] text-[#94A3B8]">
                <Clock size={14} /> {totalMin} min en total
              </span>
            </div>

            {/* barra de progreso */}
            <div className="mt-5 flex max-w-md items-center gap-3">
              <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/15">
                <div className="h-full bg-gradient-to-r from-[#35E981] to-[#159DFF]" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-[11px] font-bold text-[#94A3B8]">{pct}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lecciones — episodios */}
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[18px] font-black text-[#F8FAFC]">Lecciones</h2>
          <div className="flex gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1.5 text-[11.5px] font-bold transition ${
                  filter === f ? "bg-[#159DFF] text-white" : "bg-white/[0.04] text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((l, i) => {
            const isDone = completed.includes(l.id);
            const isProg = inProgress.includes(l.id);
            return (
              <Link
                key={l.id}
                href={`/clases/${l.id}`}
                className={`group flex items-center gap-4 rounded-xl p-2 transition hover:bg-white/[0.03] ${
                  isProg ? "ring-1 ring-[#159DFF]/40" : ""
                }`}
              >
                {/* miniatura episodio */}
                <div className="relative aspect-video w-[220px] shrink-0 overflow-hidden rounded-lg sm:w-[280px]">
                  <Poster id={mod.id} title={l.title} variant="horizontal" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#159DFF] text-white opacity-0 shadow-lg shadow-[#159DFF]/40 transition group-hover:opacity-100">
                      <Play size={14} className="ml-0.5 fill-current" />
                    </span>
                  </div>
                  {isDone && (
                    <span className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#35E981] text-[#05090D]">
                      <Check size={11} strokeWidth={3} />
                    </span>
                  )}
                  <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {l.duration}m
                  </span>
                </div>
                {/* info episodio */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[12px] font-black ${isProg ? "text-[#159DFF]" : "text-[#94A3B8]"}`}>
                      Lección {i + 1}
                    </span>
                    {isDone && <span className="text-[10.5px] font-bold text-[#35E981]">Completada</span>}
                    {isProg && <span className="text-[10.5px] font-bold text-[#159DFF]">En curso</span>}
                  </div>
                  <div className="text-[14.5px] font-extrabold leading-snug text-[#F8FAFC] group-hover:text-[#159DFF]">{l.title}</div>
                  <p className="mt-0.5 line-clamp-2 text-[12px] text-[#94A3B8]">{l.desc}</p>
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-[#94A3B8]">
                    {l.resource && <span className="flex items-center gap-1"><FileText size={11} /> Recurso</span>}
                    {mod.locked && <span className="flex items-center gap-1"><Lock size={11} /> Bloqueada</span>}
                  </div>
                </div>
                <Play size={18} className={`mr-3 shrink-0 ${isProg ? "text-[#159DFF]" : "text-[#94A3B8] group-hover:text-[#F8FAFC]"}`} />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
