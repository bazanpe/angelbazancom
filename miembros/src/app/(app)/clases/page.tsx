"use client";

import Link from "next/link";
import { useState } from "react";
import { Play, Check, Clock, ChevronDown } from "lucide-react";
import { COURSE } from "@/lib/data";
import { Poster } from "@/components/posters";

export default function ClasesPage() {
  const [open, setOpen] = useState<string>("m1");
  const done = ["m1l1", "m1l2", "m2l1"];

  return (
    <div className="fade-up mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#F8FAFC]">Clases</h1>
        <p className="mt-1 text-[13.5px] text-[#94A3B8]">
          Todo el contenido de <b className="text-[#F8FAFC]">Sistema Vende en Automático</b>.
        </p>
      </div>

      <div className="space-y-3">
        {COURSE.modules.map((m) => {
          const isOpen = open === m.id;
          const modDone = m.lessons.filter((l) => done.includes(l.id)).length;
          return (
            <div key={m.id} className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#0A1117]">
              <button
                onClick={() => setOpen(isOpen ? "" : m.id)}
                className="flex w-full items-center gap-4 p-3.5 text-left transition hover:bg-white/[0.03]"
              >
                <div className="relative w-[120px] shrink-0 sm:w-[168px]">
                  <Poster id={m.id} title="" variant="horizontal" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#159DFF]">Módulo {m.numero}</div>
                  <div className="truncate text-[15px] font-extrabold text-[#F8FAFC]">{m.title}</div>
                  <div className="mt-0.5 flex items-center gap-3 text-[11.5px] text-[#94A3B8]">
                    <span>{m.lessons.length} clases</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {m.lessons.reduce((a, l) => a + l.duration, 0)} min</span>
                    {modDone > 0 && <span className="font-bold text-[#35E981]">{modDone} completadas</span>}
                  </div>
                </div>
                <ChevronDown size={17} className={`shrink-0 text-[#94A3B8] transition ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="border-t border-white/[0.06] p-2">
                  {m.lessons.map((l, i) => {
                    const isDone = done.includes(l.id);
                    return (
                      <Link
                        key={l.id}
                        href={`/clases/${l.id}`}
                        className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-white/[0.04]"
                      >
                        <span className="relative aspect-video w-[132px] shrink-0 overflow-hidden rounded-md sm:w-[176px]">
                          <Poster id={m.id} title="" variant="horizontal" />
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#159DFF]/90 text-white opacity-0 transition group-hover:opacity-100">
                              <Play size={12} className="ml-0.5 fill-current" />
                            </span>
                          </span>
                          {isDone && (
                            <span className="absolute left-1.5 top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#35E981] text-[#05090D]" style={{ width: 18, height: 18 }}>
                              <Check size={10} strokeWidth={3} />
                            </span>
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13.5px] font-bold text-[#F8FAFC] group-hover:text-[#159DFF]">{l.title}</div>
                          <div className="text-[11px] text-[#94A3B8]">Lección {i + 1} · {l.duration} min</div>
                        </div>
                        <Play size={14} className="mr-2 shrink-0 text-[#94A3B8] group-hover:text-[#159DFF]" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
