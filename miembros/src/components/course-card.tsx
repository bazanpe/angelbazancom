"use client";

import Link from "next/link";
import { Play, Clock, Lock } from "lucide-react";
import { Badge, Skeleton } from "./ui";
import type { Module } from "@/lib/data";

export function ModuleCard({ mod }: { mod: Module }) {
  return (
    <Link
      href={`/cursos/sistema/${mod.id}`}
      className="group relative block w-[252px] shrink-0 snap-start overflow-hidden rounded-xl border border-white/[0.08] bg-[#0D1C24] transition duration-300 hover:-translate-y-1 hover:border-[#159DFF]/40 hover:shadow-[0_14px_40px_rgba(21,157,255,0.15)]"
    >
      <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${mod.id === "m2" ? "from-[#159DFF]/50 via-[#0D1C24]" : "from-[#0878F9]/40 via-[#0D1C24]"} `}>
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 70% 20%, rgba(21,157,255,0.5), transparent 60%)" }} />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span className="rounded-md bg-[#050A0E]/70 px-2 py-0.5 text-[10px] font-black text-[#35E981] backdrop-blur">M{mod.numero}</span>
          {mod.tag && <Badge tone={mod.tag === "Bonus" ? "green" : mod.tag === "Esencial" ? "blue" : "amber"}>{mod.tag}</Badge>}
        </div>
        {mod.locked && (
          <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#050A0E]/70 text-[#94A3B8] backdrop-blur">
            <Lock size={13} />
          </span>
        )}
        <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#159DFF] text-white opacity-0 shadow-lg shadow-[#159DFF]/40 transition group-hover:opacity-100">
          <Play size={15} className="ml-0.5 fill-current" />
        </div>
        {mod.locked && <div className="absolute inset-0 bg-[#050A0E]/60 backdrop-blur-[1px]" />}
      </div>
      <div className="p-3.5">
        <div className="text-[13.5px] font-extrabold leading-snug text-[#F8FAFC]">{mod.title}</div>
        <div className="mt-1 line-clamp-2 text-[11.5px] leading-snug text-[#94A3B8]">{mod.desc}</div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-[#94A3B8]">
          <span className="flex items-center gap-1"><Clock size={11} /> {mod.lessons.length} clases</span>
          <span>{mod.progress !== undefined ? `${mod.progress}%` : "Disponible"}</span>
        </div>
      </div>
    </Link>
  );
}

export function ModuleCardSkeleton() {
  return (
    <div className="w-[252px] shrink-0">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="p-3.5">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="mt-2 h-3 w-full" />
        <Skeleton className="mt-1 h-3 w-3/5" />
      </div>
    </div>
  );
}

export function Carousel({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-[16px] font-extrabold text-[#F8FAFC]">{title}</h2>
          {sub && <p className="text-[12px] text-[#94A3B8]">{sub}</p>}
        </div>
      </div>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">{children}</div>
    </section>
  );
}
