"use client";

import Link from "next/link";
import { Play, Info, Clock } from "lucide-react";
import { DEMO_USER, COURSE, LIBRARY, EVENTS } from "@/lib/data";
import { Carousel, ModuleCard, ContinueCard, LibraryRowCard } from "@/components/course-card";
import { Poster, PosterSkeleton } from "@/components/posters";

export default function InicioPage() {
  const modulos = COURSE.modules;
  const continuarMod = modulos[1]; // Módulo 2

  return (
    <div className="fade-up">
      {/* ===== HERO CINEMATOGRÁFICO ===== */}
      <section className="relative overflow-hidden rounded-2xl">
        <div className="relative h-[440px] md:h-[520px]">
          {/* portada de fondo */}
          <div className="absolute inset-0">
            <Poster id="m2" title={continuarMod.title} numero={continuarMod.numero} variant="horizontal" />
          </div>
          {/* gradientes cinematográficos */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#05090D] via-[#05090D]/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#05090D] to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05090D]/40 via-transparent to-transparent" />

          <div className="relative z-10 flex h-full flex-col justify-end p-5 md:p-10 md:max-w-[62%]">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#35E981]">
              Continúa aprendiendo
            </div>
            <h1 className="mt-2 text-[26px] font-black leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] md:text-[42px]">
              {continuarMod.lessons[1].title}
            </h1>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-[#F8FAFC]/85 md:text-[14.5px]">
              {continuarMod.desc} En esta clase entenderás la matemática detrás de una oferta económica que convierte.
            </p>
            <div className="mt-3 flex items-center gap-3 text-[12px] font-semibold text-[#F8FAFC]/80">
              <span>{continuarMod.title}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {continuarMod.lessons[1].duration} min</span>
              <span className="text-[#35E981]">pausaste en {DEMO_USER.lastLesson.at}</span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href={`/clases/${continuarMod.lessons[1].id}`}
                className="flex items-center gap-2 rounded-md bg-white px-7 py-3 text-[14.5px] font-extrabold text-[#05090D] shadow-2xl shadow-black/50 transition hover:bg-[#E8F0F8]"
              >
                <Play size={17} className="fill-current" /> Continuar
              </Link>
              <Link
                href={`/cursos/sistema/${continuarMod.id}`}
                className="flex items-center gap-2 rounded-md bg-white/10 px-6 py-3 text-[14px] font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                <Info size={16} /> Más información
              </Link>
            </div>

            {/* barra de progreso fina */}
            <div className="mt-5 h-[3px] w-full max-w-md overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-gradient-to-r from-[#35E981] to-[#159DFF]" style={{ width: "38%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== CARRUSELES ===== */}
      <Carousel title="Continúa donde lo dejaste">
        <ContinueCard mod={continuarMod} lessonIndex={1} at={DEMO_USER.lastLesson.at} />
        <ContinueCard mod={modulos[0]} lessonIndex={0} at="2:10" />
        <ContinueCard mod={modulos[2]} lessonIndex={0} at="1:05" />
      </Carousel>

      <Carousel title="Empieza por aquí" sub="Los primeros pasos del sistema.">
        {modulos.slice(0, 4).map((m) => (
          <ModuleCard key={m.id} mod={m} />
        ))}
      </Carousel>

      <Carousel title="Sistema Vende en Automático" sub="Todos los módulos del programa.">
        {modulos.map((m) => (
          <ModuleCard key={m.id} mod={m} />
        ))}
      </Carousel>

      <Carousel title="WhatsApp Funnel Pro">
        {modulos.filter((m) => [6, 7].includes(m.numero)).map((m) => (
          <ModuleCard key={m.id} mod={m} />
        ))}
      </Carousel>

      <Carousel title="Creativos y anuncios que venden">
        {modulos.filter((m) => [8, 9].includes(m.numero)).map((m) => (
          <ModuleCard key={m.id} mod={m} />
        ))}
      </Carousel>

      <Carousel title="Automatización con IA">
        {modulos.filter((m) => [7, 12].includes(m.numero)).map((m) => (
          <ModuleCard key={m.id} mod={m} />
        ))}
      </Carousel>

      <Carousel title="Clases nuevas" sub="Contenido publicado recientemente.">
        {modulos.slice(1, 4).map((m) => (
          <ModuleCard key={m.id} mod={m} />
        ))}
      </Carousel>

      <Carousel title="Biblioteca infinita" sub="Recursos listos para usar.">
        {LIBRARY.slice(0, 6).map((r) => (
          <LibraryRowCard key={r.id} title={r.title} category={r.category} format={r.format} />
        ))}
      </Carousel>

      <Carousel title="Mentorías y clases en vivo">
        {EVENTS.map((ev) => (
          <div key={ev.id} className="w-[300px] shrink-0 snap-start">
            <div className="relative">
              <Poster id="m13" title={ev.title} variant="horizontal" />
              <div className="absolute left-2.5 top-2.5 rounded-md bg-[#EF4444] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                {ev.type}
              </div>
            </div>
            <div className="flex items-center justify-between px-1 pt-2 text-[11.5px] text-[#94A3B8]">
              <span className="font-bold text-[#159DFF]">{ev.date} · {ev.time}</span>
              <span>{ev.duration}</span>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
