"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Play, Clock, Lock, FileText } from "lucide-react";
import { COURSE } from "@/lib/data";
import { Badge, PlayerButton } from "@/components/ui";

export default function CursoDetailPage() {
  const { id } = useParams();
  const course = COURSE;
  const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);

  return (
    <div className="fade-up">
      <Link href="/cursos" className="text-[12.5px] font-bold text-[#159DFF] hover:underline">
        ← Volver a cursos
      </Link>

      <section className="relative mt-4 overflow-hidden rounded-2xl border border-white/[0.08]">
        <div className="relative aspect-[21/9] md:aspect-[21/6]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#159DFF]/40 via-[#0D1C24] to-[#050A0E]" />
          <div className="relative z-10 flex h-full flex-col justify-end p-5 md:p-8">
            <Badge tone="blue">Curso principal</Badge>
            <h1 className="mt-2 text-2xl font-black text-[#F8FAFC] md:text-3xl">{course.title}</h1>
            <p className="mt-1.5 max-w-xl text-[13.5px] text-[#94A3B8]">{course.subtitle}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <PlayerButton label="Comenzar módulo 1" />
              <span className="text-[12.5px] text-[#94A3B8]">
                {course.modules.length} módulos · {totalLessons} clases · ~{course.hours}h
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-[16px] font-extrabold text-[#F8FAFC]">Módulos del curso</h2>
        <div className="space-y-3">
          {course.modules.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0D1C24]/70">
              <Link href={`/cursos/${course.id}/${m.id}`} className="flex items-center gap-4 p-4 transition hover:bg-white/[0.03]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#159DFF]/25 to-[#0878F9]/10 text-sm font-black text-[#159DFF]">
                  {m.numero}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[14.5px] font-extrabold text-[#F8FAFC]">{m.title}</span>
                    {m.tag && <Badge tone={m.tag === "Bonus" ? "green" : "amber"}>{m.tag}</Badge>}
                    {m.locked && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#94A3B8]">
                        <Lock size={11} /> Bloqueado
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-[11.5px] text-[#94A3B8]">
                    <span className="flex items-center gap-1"><Play size={11} /> {m.lessons.length} clases</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {m.lessons.reduce((a, l) => a + l.duration, 0)} min</span>
                  </div>
                </div>
                {!m.locked && <Play size={16} className="text-[#159DFF]" />}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
