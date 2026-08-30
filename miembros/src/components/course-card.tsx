"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Plus, Info } from "lucide-react";
import { Poster } from "./posters";
import { Badge } from "./ui";
import type { Module } from "@/lib/data";

export function Carousel({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  function scroll(dir: number) {
    ref.current?.scrollBy({ left: dir * (ref.current.clientWidth * 0.8), behavior: "smooth" });
  }
  return (
    <section className="relative mt-7">
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="text-[16.5px] font-extrabold tracking-tight text-[#F8FAFC]">{title}</h2>
        <div className="flex items-center gap-1">
          <Link href="/cursos" className="mr-2 text-[12px] font-bold text-[#94A3B8] hover:text-[#F8FAFC]">
            Ver todo
          </Link>
          <button
            onClick={() => scroll(-1)}
            aria-label="Anterior"
            className="rounded-full bg-white/[0.05] p-1.5 text-[#94A3B8] transition hover:bg-white/[0.1] hover:text-[#F8FAFC]"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Siguiente"
            className="rounded-full bg-white/[0.05] p-1.5 text-[#94A3B8] transition hover:bg-white/[0.1] hover:text-[#F8FAFC]"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
      {sub && <p className="-mt-1.5 mb-2.5 text-[12px] text-[#94A3B8]">{sub}</p>}
      <div ref={ref} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 md:-mx-6 md:px-6">
        {children}
      </div>
    </section>
  );
}

export function ModuleCard({ mod }: { mod: Module }) {
  return (
    <Link
      href={`/cursos/sistema/${mod.id}`}
      className="group w-[208px] shrink-0 snap-start transition duration-200 hover:z-10 hover:scale-[1.06] sm:w-[224px]"
    >
      <div className="relative">
        <Poster id={mod.id} title={mod.title} numero={mod.numero} variant="vertical" locked={mod.locked} />
        {/* overlay hover */}
        <div className="absolute inset-0 hidden flex-col justify-end rounded-xl bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition duration-200 group-hover:flex group-hover:opacity-100">
          <div className="flex items-center gap-2 p-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#159DFF] text-white shadow-lg shadow-[#159DFF]/50 transition group-hover:scale-110">
              <Play size={16} className="ml-0.5 fill-current" />
            </span>
            <div className="ml-auto flex gap-1.5">
              <span className="rounded-full bg-white/10 p-2 text-[#F8FAFC] backdrop-blur" title="Guardar"><Plus size={14} /></span>
              <span className="rounded-full bg-white/10 p-2 text-[#F8FAFC] backdrop-blur" title="Información"><Info size={14} /></span>
            </div>
          </div>
          <div className="px-3 pb-3">
            <div className="text-[12px] font-bold text-[#F8FAFC]">{mod.lessons.length} clases · {mod.lessons.reduce((a, l) => a + l.duration, 0)} min</div>
          </div>
        </div>
        {/* barra de progreso */}
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
          <div className="h-full bg-[#159DFF] transition-all" style={{ width: `${mod.progress ?? (mod.id === "m2" ? 38 : 0)}%` }} />
        </div>
        {mod.tag && (
          <div className="absolute right-2 top-2">
            <Badge tone={mod.tag === "Bonus" ? "green" : mod.tag === "Esencial" ? "blue" : "amber"}>{mod.tag}</Badge>
          </div>
        )}
      </div>
    </Link>
  );
}

export function ContinueCard({ mod, lessonIndex, at }: { mod: Module; lessonIndex: number; at: string }) {
  const lesson = mod.lessons[lessonIndex];
  return (
    <Link href={`/clases/${lesson.id}`} className="group w-[300px] shrink-0 snap-start sm:w-[360px]">
      <div className="relative">
        <Poster id={mod.id} title={lesson.title} numero={mod.numero} variant="horizontal" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#159DFF] text-white opacity-0 shadow-xl shadow-[#159DFF]/40 transition duration-200 group-hover:scale-110 group-hover:opacity-100">
            <Play size={18} className="ml-0.5 fill-current" />
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020507] via-[#020507]/60 to-transparent p-3.5 pt-10">
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#35E981]">Continúa aprendiendo</div>
          <div className="mt-0.5 text-[14px] font-extrabold leading-tight text-[#F8FAFC]">{lesson.title}</div>
          <div className="mt-0.5 text-[11px] text-[#94A3B8]">{mod.title} · {at} de {lesson.duration} min</div>
          <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-[#35E981] to-[#159DFF]" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function LibraryRowCard({ title, category, format }: { title: string; category: string; format: string }) {
  return (
    <Link href="/biblioteca" className="group w-[180px] shrink-0 snap-start">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gradient-to-br from-[#0F1820] to-[#070D12]">
        <svg viewBox="0 0 180 270" className="absolute inset-0 h-full w-full">
          <g stroke="rgba(21,157,255,0.06)" strokeWidth="1">
            {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={i * 20} y1="0" x2={i * 20} y2="270" />)}
            {Array.from({ length: 14 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 20} x2="180" y2={i * 20} />)}
          </g>
          <rect x="30" y="44" width="120" height="86" rx="10" fill="rgba(255,255,255,0.04)" stroke="#159DFF" strokeOpacity="0.35" />
          <rect x="52" y="66" width="76" height="10" rx="5" fill="#159DFF" fillOpacity="0.8" />
          <rect x="52" y="86" width="52" height="8" rx="4" fill="rgba(53,233,129,0.6)" />
          <rect x="52" y="102" width="64" height="8" rx="4" fill="rgba(255,255,255,0.2)" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020507] to-transparent p-3 pt-8">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#35E981]">{format}</div>
          <div className="mt-0.5 text-[12px] font-extrabold leading-tight text-[#F8FAFC]">{title}</div>
          <div className="text-[10px] text-[#94A3B8]">{category}</div>
        </div>
      </div>
    </Link>
  );
}

export function PosterSkeletonRow({ count = 6, variant = "vertical" as const }: { count?: number; variant?: "vertical" | "horizontal" }) {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${variant === "vertical" ? "w-[208px] sm:w-[224px]" : "w-[300px] sm:w-[360px]"} shrink-0`}>
          <div className={`${variant === "vertical" ? "aspect-[2/3]" : "aspect-video"} skeleton rounded-xl`} />
        </div>
      ))}
    </div>
  );
}
