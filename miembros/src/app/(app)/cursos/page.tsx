import Link from "next/link";
import { Clock, Play, BookOpen, Users } from "lucide-react";
import { COURSE } from "@/lib/data";
import { Badge } from "@/components/ui";

export default function CursosPage() {
  return (
    <div className="fade-up">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#F8FAFC]">Cursos</h1>
        <p className="mt-1 text-[13.5px] text-[#94A3B8]">Todo el contenido de tu plan, en un solo lugar.</p>
      </div>

      <Link
        href={`/cursos/${COURSE.id}`}
        className="group relative block overflow-hidden rounded-2xl border border-white/[0.08]"
      >
        <div className="relative aspect-[21/9] md:aspect-[21/7]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#159DFF]/45 via-[#0D1C24] to-[#050A0E]" />
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(rgba(21,157,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(21,157,255,0.07) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
          <div className="relative z-10 flex h-full flex-col justify-end p-5 md:p-8">
            <Badge tone="blue">Curso principal</Badge>
            <h2 className="mt-2 text-xl font-black text-[#F8FAFC] md:text-2xl">{COURSE.title}</h2>
            <p className="mt-1.5 max-w-xl text-[13px] text-[#94A3B8] md:text-[14px]">{COURSE.subtitle}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-[12px] font-semibold text-[#94A3B8]">
              <span className="flex items-center gap-1.5"><BookOpen size={14} /> {COURSE.modules.length} módulos</span>
              <span className="flex items-center gap-1.5"><Play size={14} /> {COURSE.modules.reduce((a, m) => a + m.lessons.length, 0)} clases</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> ~{COURSE.hours} horas</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {COURSE.modules.map((m) => (
          <Link
            key={m.id}
            href={`/cursos/${COURSE.id}/${m.id}`}
            className="group rounded-xl border border-white/[0.08] bg-[#0D1C24]/70 p-5 transition hover:-translate-y-0.5 hover:border-[#159DFF]/40"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-[#159DFF]/12 px-2.5 py-1 text-[11px] font-black text-[#159DFF]">
                MÓDULO {m.numero}
              </span>
              {m.tag && <Badge tone={m.tag === "Bonus" ? "green" : "amber"}>{m.tag}</Badge>}
            </div>
            <div className="mt-3 text-[15px] font-extrabold text-[#F8FAFC] group-hover:text-[#159DFF]">{m.title}</div>
            <p className="mt-1 line-clamp-2 text-[12.5px] text-[#94A3B8]">{m.desc}</p>
            <div className="mt-3 flex items-center justify-between text-[11.5px] font-semibold text-[#94A3B8]">
              <span className="flex items-center gap-1.5"><Play size={12} /> {m.lessons.length} clases</span>
              <span className="flex items-center gap-1.5"><Users size={12} /> {m.lessons.reduce((a, l) => a + l.duration, 0)} min</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
