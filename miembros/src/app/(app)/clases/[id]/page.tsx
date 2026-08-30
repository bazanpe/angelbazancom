"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Play, Pause, CheckCircle2, Check, Clock, FileText, ListChecks, StickyNote, ChevronLeft, ChevronRight, Gauge, Settings2, PartyPopper, Zap,
} from "lucide-react";
import { COURSE } from "@/lib/data";
import { Badge } from "@/components/ui";

const TABS = ["Resumen", "Recursos", "Checklist", "Notas"];

export default function ClasePage() {
  const { id } = useParams();
  const lesson = useMemo(() => {
    for (const m of COURSE.modules) for (const l of m.lessons) if (l.id === id) return { lesson: l, module: m };
    return null;
  }, [id]);

  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [tab, setTab] = useState("Resumen");
  const [note, setNote] = useState("");
  const [checked, setChecked] = useState<string[]>([]);

  if (!lesson) return <div className="text-[#94A3B8]">Clase no encontrada.</div>;
  const { lesson: l, module: m } = lesson;
  const idx = m.lessons.findIndex((x) => x.id === l.id);
  const prev = idx > 0 ? m.lessons[idx - 1] : null;
  const next = idx < m.lessons.length - 1 ? m.lessons[idx + 1] : null;

  const implementChecklist = [
    "Abre tu herramienta o documento de trabajo.",
    "Aplica lo visto en la clase durante 25 minutos.",
    "Registra el resultado en tu tablero.",
  ];
  const implementChecked = checked.filter((c) => implementChecklist.includes(c));

  function markComplete() {
    setCompleted(true);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2600);
  }

  return (
    <div className="fade-up relative">
      {confetti && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="absolute animate-[float_2.4s_ease-in_forwards] text-sm"
              style={{
                left: `${(i * 37) % 100}%`,
                top: "-10px",
                animation: `confetti-fall ${2 + (i % 5) * 0.4}s ease-in forwards`,
                color: i % 2 ? "#35E981" : "#159DFF",
              }}
            >
              {i % 3 === 0 ? "🎉" : "•"}
            </span>
          ))}
        </div>
      )}

      <Link href={`/cursos/sistema/${m.id}`} className="text-[12.5px] font-bold text-[#159DFF] hover:underline">
        ← Módulo {m.numero} · {m.title}
      </Link>

      <div className="mt-4 grid gap-5 xl:grid-cols-[1fr_300px]">
        {/* Reproductor + info */}
        <div>
          <div className="group relative aspect-video overflow-hidden rounded-2xl border border-white/[0.1] bg-black shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0D1C24] via-[#09141A] to-[#050A0E]" />
            <div
              className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "linear-gradient(rgba(21,157,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(21,157,255,0.08) 1px, transparent 1px)", backgroundSize: "44px 44px" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setPlaying((v) => !v)}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-[#159DFF] text-white shadow-[0_0_60px_rgba(21,157,255,0.6)] transition hover:scale-105"
                aria-label={playing ? "Pausar" : "Reproducir"}
              >
                {playing ? <Pause size={30} className="fill-current" /> : <Play size={30} className="ml-1 fill-current" />}
              </button>
            </div>
            <div className="absolute left-4 top-4 flex gap-2">
              <Badge tone="blue">Clase {idx + 1} de {m.lessons.length}</Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 bg-gradient-to-t from-[#050A0E] to-transparent p-4">
              <div className="flex-1">
                <div className="h-1 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-[#35E981] to-[#159DFF]" />
                </div>
                <div className="mt-1.5 text-[11px] font-semibold text-[#94A3B8]">4:20 · {l.duration} min</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSpeed(speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : speed === 1.5 ? 2 : 0.75)}
                  className="flex items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1.5 text-[11px] font-black text-[#F8FAFC] hover:bg-white/[0.12]"
                  title="Velocidad"
                >
                  <Gauge size={13} /> {speed}×
                </button>
                <button className="rounded-md bg-white/[0.06] p-2 text-[#94A3B8] hover:bg-white/[0.12]" title="Configuración">
                  <Settings2 size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-black text-[#F8FAFC]">{l.title}</h1>
                <div className="mt-1 flex items-center gap-3 text-[12px] text-[#94A3B8]">
                  <span>{m.title}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {l.duration} min</span>
                </div>
              </div>
              <button
                onClick={markComplete}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-extrabold transition ${
                  completed ? "bg-[#35E981]/15 text-[#35E981]" : "bg-gradient-to-r from-[#35E981] to-[#159DFF] text-[#050A0E] hover:brightness-110"
                }`}
              >
                {completed ? <CheckCircle2 size={16} /> : <Check size={16} />}
                {completed ? "Completada" : "Marcar como completada"}
              </button>
            </div>

            <div className="mt-4 flex gap-1.5 overflow-x-auto no-scrollbar">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`shrink-0 rounded-lg px-4 py-2 text-[12.5px] font-bold transition ${
                    tab === t ? "bg-[#159DFF] text-white" : "text-[#94A3B8] hover:bg-white/[0.05] hover:text-[#F8FAFC]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-white/[0.08] bg-[#0D1C24]/60 p-5">
              {tab === "Resumen" && (
                <div>
                  <h3 className="text-[14px] font-extrabold text-[#F8FAFC]">Resumen de la clase</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[#94A3B8]">{l.desc}</p>
                  <p className="mt-3 text-[13px] leading-relaxed text-[#94A3B8]">
                    En esta clase vas a entender el concepto central del {m.title.toLowerCase()}, aplicarlo en tu proyecto y
                    registrar el avance. Al terminar, marca la clase como completada para continuar con tu ruta.
                  </p>
                </div>
              )}
              {tab === "Recursos" && (
                <div className="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.03] p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#159DFF]/12 text-[#159DFF]">
                    <FileText size={18} />
                  </span>
                  <div className="flex-1">
                    <div className="text-[13px] font-extrabold text-[#F8FAFC]">Recurso de esta clase</div>
                    <div className="text-[11.5px] text-[#94A3B8]">Material de apoyo · PDF</div>
                  </div>
                  <button className="rounded-lg bg-[#159DFF]/15 px-3.5 py-2 text-[12px] font-bold text-[#159DFF] hover:bg-[#159DFF]/25">
                    Descargar
                  </button>
                </div>
              )}
              {tab === "Checklist" && (
                <div className="space-y-2">
                  {implementChecklist.map((c) => (
                    <label key={c} className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.03] p-3.5">
                      <input
                        type="checkbox"
                        checked={checked.includes(c)}
                        onChange={() => setChecked((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))}
                        className="h-4 w-4 accent-[#35E981]"
                      />
                      <span className="text-[13px] text-[#F8FAFC]">{c}</span>
                    </label>
                  ))}
                  <div className="text-[12px] text-[#94A3B8]">{implementChecked.length} de {implementChecklist.length} completados</div>
                </div>
              )}
              {tab === "Notas" && (
                <div>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Escribe tus notas de esta clase… (se guardan automáticamente)"
                    className="h-32 w-full rounded-lg border border-white/[0.08] bg-[#0D1C24] p-3.5 text-[13px] text-[#F8FAFC] outline-none placeholder:text-[#94A3B8]/60 focus:border-[#159DFF]/50"
                  />
                  <div className="mt-1.5 text-[11px] text-[#94A3B8]">Guardado automático local.</div>
                </div>
              )}
            </div>

            {/* IMPLEMENTA AHORA */}
            <div className="mt-4 rounded-xl border border-[#35E981]/25 bg-gradient-to-br from-[#35E981]/[0.08] to-[#159DFF]/[0.05] p-5">
              <div className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-[#35E981]">
                <Zap size={14} className="fill-current" /> Implementa ahora
              </div>
              <div className="mt-2 text-[14px] font-extrabold text-[#F8FAFC]">Acción de 25 minutos</div>
              <div className="mt-1 text-[12.5px] text-[#94A3B8]">Aplica lo aprendido antes de pasar a la siguiente clase. Implementar es lo que genera ventas.</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="rounded-lg bg-[#35E981] px-4 py-2 text-[12.5px] font-extrabold text-[#050A0E] transition hover:brightness-110">
                  Ya lo implementé
                </button>
                <span className="flex items-center gap-1 self-center text-[12px] text-[#94A3B8]"><Clock size={12} /> ~25 min</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              {prev ? (
                <Link href={`/clases/${prev.id}`} className="flex items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-[13px] font-bold text-[#F8FAFC] hover:bg-white/[0.07]">
                  <ChevronLeft size={15} /> Anterior
                </Link>
              ) : <span />}
              {next ? (
                <Link href={`/clases/${next.id}`} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#159DFF] to-[#0878F9] px-5 py-2.5 text-[13px] font-extrabold text-white shadow-lg shadow-[#159DFF]/25 hover:brightness-110">
                  Siguiente clase <ChevronRight size={15} />
                </Link>
              ) : (
                <span className="flex items-center gap-2 rounded-lg bg-[#35E981]/15 px-5 py-2.5 text-[13px] font-extrabold text-[#35E981]">
                  <PartyPopper size={15} /> Fin del módulo
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Lista de clases */}
        <aside className="rounded-xl border border-white/[0.08] bg-[#0D1C24]/60 p-3">
          <div className="px-2 pb-2 pt-1 text-[12px] font-black uppercase tracking-wide text-[#94A3B8]">
            {m.title}
          </div>
          <div className="space-y-1">
            {m.lessons.map((x, i) => {
              const active = x.id === l.id;
              const done = ["m1l1", "m1l2", "m2l1"].includes(x.id);
              return (
                <Link
                  key={x.id}
                  href={`/clases/${x.id}`}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 transition ${
                    active ? "bg-[#159DFF]/12 text-[#F8FAFC]" : "text-[#94A3B8] hover:bg-white/[0.04]"
                  }`}
                >
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-black ${
                    done ? "bg-[#35E981]/15 text-[#35E981]" : active ? "bg-[#159DFF] text-white" : "bg-white/[0.05] text-[#94A3B8]"
                  }`}>
                    {done ? <Check size={12} /> : i + 1}
                  </span>
                  <span className="flex-1 text-[12.5px] font-semibold leading-snug">{x.title}</span>
                  <span className="text-[10.5px] text-[#94A3B8]">{x.duration}m</span>
                </Link>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
