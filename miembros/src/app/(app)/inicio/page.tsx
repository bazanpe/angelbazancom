"use client";

import Link from "next/link";
import { Play, PlayCircle, CheckCircle2, Flame, Target, FileText, Sparkles, MessageCircle, TrendingUp, GraduationCap } from "lucide-react";
import { DEMO_USER, COURSE, PHASES, LIBRARY, EVENTS, NOTIFICATIONS } from "@/lib/data";
import { Carousel, ModuleCard } from "@/components/course-card";
import { Badge, ProgressRing, Skeleton } from "@/components/ui";

export default function InicioPage() {
  const modulos = COURSE.modules;
  const continuar = modulos[1].lessons[1];

  return (
    <div className="fade-up">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl border border-white/[0.08]">
        <div className={`absolute inset-0 bg-gradient-to-r ${COURSE.gradient}`} />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(rgba(21,157,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(21,157,255,0.06) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-10">
          <div className="max-w-2xl">
            <Badge tone="blue">Tu siguiente paso</Badge>
            <h1 className="mt-3 text-[22px] font-black leading-tight text-[#F8FAFC] md:text-[30px]">
              {continuar.title}
            </h1>
            <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-[#94A3B8]">
              {modulos[1].title} · {continuar.duration} min · pausaste en {DEMO_USER.lastLesson.at}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/cursos/sistema/m2"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#159DFF] to-[#0878F9] px-6 py-3 text-[14px] font-extrabold text-white shadow-lg shadow-[#159DFF]/30 transition hover:brightness-110"
              >
                <Play size={15} className="fill-current" />
                Continuar aprendiendo
              </Link>
              <Link
                href="/mi-ruta"
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-[13.5px] font-bold text-[#F8FAFC] transition hover:bg-white/[0.08]"
              >
                Ver ruta completa
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ProgressRing value={DEMO_USER.progress} />
          </div>
        </div>
      </section>

      {/* RESUMEN PERSONAL */}
      <section className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={<CheckCircle2 size={16} />} label="Clases completadas" value={`${DEMO_USER.classesCompleted}`} sub="de 96 clases" color="text-[#35E981]" />
        <StatCard icon={<Flame size={16} />} label="Racha actual" value={`${DEMO_USER.streak} días`} sub="sigue aprendiendo" color="text-[#F59E0B]" />
        <StatCard icon={<Target size={16} />} label="Próximo objetivo" value="Crear tu producto" sub="Fase 2 · clase 2/4" color="text-[#159DFF]" />
        <StatCard icon={<TrendingUp size={16} />} label="Progreso general" value={`${DEMO_USER.progress}%`} sub="estás a tiempo" color="text-[#35E981]" />
      </section>

      {/* CARRUSELES */}
      <Carousel title="Continúa donde lo dejaste" sub="Sigue exactamente donde pausaste.">
        <Link href="/cursos/sistema/m2" className="group relative block w-[300px] shrink-0 overflow-hidden rounded-xl border border-white/[0.08]">
          <div className="relative aspect-video bg-gradient-to-br from-[#159DFF]/40 to-[#0D1C24]">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#159DFF] text-white shadow-lg shadow-[#159DFF]/40 transition group-hover:scale-110">
                <Play size={18} className="ml-0.5 fill-current" />
              </span>
            </div>
            <div className="absolute left-3 top-3">
              <Badge tone="blue">En curso</Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#050A0E] to-transparent p-3 pt-8">
              <div className="text-[13.5px] font-extrabold text-[#F8FAFC]">{continuar.title}</div>
              <div className="mt-0.5 text-[11px] text-[#94A3B8]">{modulos[1].title} · {DEMO_USER.lastLesson.at} de {continuar.duration} min</div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-[#35E981] to-[#159DFF]" />
              </div>
            </div>
          </div>
        </Link>
      </Carousel>

      <Carousel title="Tu ruta recomendada" sub="La secuencia exacta para lanzar.">
        {PHASES.filter((p) => !p.status.includes("bloqueado") || p.id <= 2).map((p) => (
          <Link
            key={p.id}
            href="/mi-ruta"
            className="group block w-[240px] shrink-0 rounded-xl border border-white/[0.08] bg-[#0D1C24] p-4 transition hover:-translate-y-0.5 hover:border-[#159DFF]/40"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#159DFF]/25 to-[#0878F9]/10 text-sm font-black text-[#159DFF]">
                {p.id}
              </span>
              {p.status === "completado" ? (
                <CheckCircle2 size={18} className="text-[#35E981]" />
              ) : p.status === "iniciado" ? (
                <span className="text-[11px] font-black text-[#F59E0B]">{p.progress}%</span>
              ) : null}
            </div>
            <div className="mt-3 text-[13.5px] font-extrabold leading-snug text-[#F8FAFC]">{p.title}</div>
            <div className="mt-1 line-clamp-2 text-[11.5px] text-[#94A3B8]">{p.objective}</div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full ${p.status === "completado" ? "w-full bg-[#35E981]" : "w-[37%] bg-[#159DFF]"}`} />
            </div>
          </Link>
        ))}
      </Carousel>

      <Carousel title="Sistema Vende en Automático" sub="Todos los módulos del programa.">
        {modulos.map((m) => (
          <ModuleCard key={m.id} mod={m} />
        ))}
      </Carousel>

      <Carousel title="Herramientas para implementar" sub="Recursos listos para usar.">
        {LIBRARY.slice(0, 5).map((r) => (
          <Link key={r.id} href="/biblioteca" className="group block w-[220px] shrink-0 rounded-xl border border-white/[0.08] bg-[#0D1C24] p-4 transition hover:-translate-y-0.5 hover:border-[#159DFF]/40">
            <div className="flex items-center gap-2 text-[#35E981]">
              <FileText size={15} />
              <span className="text-[10.5px] font-black uppercase tracking-wider">{r.format}</span>
            </div>
            <div className="mt-2.5 text-[13px] font-extrabold leading-snug text-[#F8FAFC]">{r.title}</div>
            <div className="mt-1 line-clamp-2 text-[11.5px] text-[#94A3B8]">{r.desc}</div>
            <div className="mt-3 flex items-center justify-between">
              <Badge tone="outline">{r.category}</Badge>
              <span className="text-[10.5px] text-[#94A3B8]">{r.updated}</span>
            </div>
          </Link>
        ))}
      </Carousel>

      <Carousel title="Mentorías y clases en vivo" sub="No te pierdas los próximos eventos.">
        {EVENTS.map((ev) => (
          <div key={ev.id} className="w-[260px] shrink-0 rounded-xl border border-white/[0.08] bg-gradient-to-b from-[#0D1C24] to-[#09141A] p-4">
            <Badge tone={ev.type === "Mentoría" ? "green" : ev.type === "Clase en vivo" ? "blue" : "amber"}>{ev.type}</Badge>
            <div className="mt-3 text-[14px] font-extrabold text-[#F8FAFC]">{ev.title}</div>
            <div className="mt-2 flex items-center gap-2 text-[12px] text-[#94A3B8]">
              <span className="rounded-md bg-[#159DFF]/12 px-2 py-0.5 font-black text-[#159DFF]">{ev.date}</span>
              <span>{ev.time}</span>·<span>{ev.duration}</span>
            </div>
            <button className="mt-3 w-full rounded-lg border border-[#159DFF]/40 bg-[#159DFF]/10 py-2 text-[12.5px] font-bold text-[#159DFF] transition hover:bg-[#159DFF]/20">
              Agregar a mi calendario
            </button>
          </div>
        ))}
      </Carousel>

      <Carousel title="Casos de éxito" sub="Resultados reales de la comunidad.">
        {[
          { name: "María G.", result: "Primera venta en 12 días", text: "Activé mi sistema y en la segunda semana ya tenía mi primera venta con la oferta del módulo 3." },
          { name: "Carlos R.", result: "Campaña en el aire", text: "Publiqué mi primera campaña de Meta Ads sin experiencia previa, todo siguiendo la ruta." },
          { name: "Lucía M.", result: "Funnel automático", text: "Mi agente de IA responde y entrega el producto mientras yo trabajo." },
        ].map((c, i) => (
          <div key={i} className="w-[300px] shrink-0 rounded-xl border border-[#35E981]/20 bg-[#0D1C24] p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#35E981] to-[#0878F9] text-xs font-black text-[#050A0E]">
                {c.name[0]}
              </span>
              <div>
                <div className="text-[13px] font-extrabold text-[#F8FAFC]">{c.name}</div>
                <div className="text-[11px] font-bold text-[#35E981]">{c.result}</div>
              </div>
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-[#94A3B8]">“{c.text}”</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0D1C24]/70 p-4">
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] ${color}`}>{icon}</span>
      <div className="mt-3 text-[20px] font-black leading-none text-[#F8FAFC]">{value}</div>
      <div className="mt-1.5 text-[12px] font-bold text-[#94A3B8]">{label}</div>
      <div className="text-[11px] text-[#94A3B8]/70">{sub}</div>
    </div>
  );
}
