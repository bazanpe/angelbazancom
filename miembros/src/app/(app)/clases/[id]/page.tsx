"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Play, Pause, Check, CheckCircle2, Clock, FileText, StickyNote, ChevronLeft, ChevronRight,
  Gauge, PanelRightClose, PanelRightOpen, Share2, Bookmark, ListVideo, Zap, RotateCcw,
} from "lucide-react";
import { COURSE } from "@/lib/data";
import { Badge } from "@/components/ui";
import { Poster } from "@/components/posters";

const TABS = ["Resumen", "Recursos", "Implementa", "Notas"];

export default function ClasePage() {
  const { id } = useParams();
  const lesson = useMemo(() => {
    for (const m of COURSE.modules) for (const l of m.lessons) if (l.id === id) return { lesson: l, module: m };
    return null;
  }, [id]);

  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [panel, setPanel] = useState(true);
  const [tab, setTab] = useState("Resumen");
  const [note, setNote] = useState("");
  const [checked, setChecked] = useState<string[]>([]);

  if (!lesson) return <div className="text-[#94A3B8]">Clase no encontrada.</div>;
  const { lesson: l, module: m } = lesson;
  const idx = m.lessons.findIndex((x) => x.id === l.id);
  const prev = idx > 0 ? m.lessons[idx - 1] : null;
  const next = idx < m.lessons.length - 1 ? m.lessons[idx + 1] : null;

  const implementChecklist = ["Abre tu herramienta de trabajo.", "Aplica lo visto en 25 minutos.", "Registra el resultado."];
  const done = ["m1l1", "m1l2", "m2l1"];

  function markComplete() {
    setCompleted(true);
    setTimeout(() => setShowNext(true), 400);
  }

  return (
    <div className="fade-up relative h-full">
      <div className="flex h-full gap-4">
        {/* ===== ZONA DE VIDEO ===== */}
        <div className="min-w-0 flex-1">
          {/* Reproductor */}
          <div className="relative overflow-hidden rounded-xl bg-black shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
            <div className={`aspect-video transition-all ${panel ? "" : ""}`}>
              <div className="relative h-full w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A1117] via-[#05090D] to-[#020406]" />
                <div
                  className="absolute inset-0 opacity-15"
                  style={{ backgroundImage: "linear-gradient(rgba(21,157,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(21,157,255,0.08) 1px, transparent 1px)", backgroundSize: "44px 44px" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setPlaying((v) => !v)}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-[#159DFF] text-white shadow-[0_0_80px_rgba(21,157,255,0.6)] transition hover:scale-105"
                    aria-label={playing ? "Pausar" : "Reproducir"}
                  >
                    {playing ? <Pause size={30} className="fill-current" /> : <Play size={30} className="ml-1 fill-current" />}
                  </button>
                </div>

                {/* overlay siguiente lección */}
                {showNext && next && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/85 backdrop-blur-sm">
                    <div className="flex max-w-xl flex-col items-center gap-4 p-6 text-center">
                      <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[#35E981]">Siguiente lección</div>
                      <div className="w-full max-w-[380px]">
                        <Poster id={m.id} title={next.title} variant="horizontal" img={next.img} />
                      </div>
                      <div className="text-lg font-extrabold text-[#F8FAFC]">{next.title}</div>
                      <div className="flex gap-3">
                        <Link
                          href={`/clases/${next.id}`}
                          className="flex items-center gap-2 rounded-md bg-[#159DFF] px-6 py-3 text-[14px] font-extrabold text-white shadow-lg shadow-[#159DFF]/40 hover:brightness-110"
                        >
                          <Play size={15} className="fill-current" /> Reproducir ahora
                        </Link>
                        <button
                          onClick={() => setShowNext(false)}
                          className="flex items-center gap-2 rounded-md bg-white/10 px-5 py-3 text-[13.5px] font-bold text-[#F8FAFC] hover:bg-white/20"
                        >
                          <RotateCcw size={14} /> Volver a ver
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* barra de progreso + controles */}
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="mx-auto h-[3px] max-w-3xl overflow-hidden rounded-full bg-white/15">
                    <div className="h-full bg-gradient-to-r from-[#35E981] to-[#159DFF]" style={{ width: "38%" }} />
                  </div>
                  <div className="mx-auto mt-2 flex max-w-3xl items-center justify-between text-[11px] font-semibold text-[#94A3B8]">
                    <span>4:20 · {l.duration} min</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSpeed(speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : speed === 1.5 ? 2 : 0.75)}
                        className="rounded bg-white/[0.06] px-2 py-1 text-[10.5px] font-black text-[#F8FAFC] hover:bg-white/[0.12]"
                      >
                        {speed}×
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Franja de controles */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10.5px] font-black uppercase tracking-[0.16em] text-[#159DFF]">
                {m.title} · Lección {idx + 1}
              </div>
              <h1 className="truncate text-[17px] font-extrabold text-[#F8FAFC]">{l.title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={markComplete}
                className={`flex items-center gap-1.5 rounded-md px-3.5 py-2 text-[12.5px] font-extrabold transition ${
                  completed ? "bg-[#35E981]/15 text-[#35E981]" : "bg-white/10 text-[#F8FAFC] hover:bg-white/20"
                }`}
              >
                {completed ? <CheckCircle2 size={15} /> : <Check size={15} />}
                {completed ? "Completada" : "Marcar completada"}
              </button>
              <button className="rounded-md bg-white/[0.06] p-2 text-[#94A3B8] hover:bg-white/[0.12] hover:text-[#F8FAFC]" title="Guardar"><Bookmark size={15} /></button>
              <button className="rounded-md bg-white/[0.06] p-2 text-[#94A3B8] hover:bg-white/[0.12] hover:text-[#F8FAFC]" title="Compartir"><Share2 size={15} /></button>
              <button
                onClick={() => setPanel((v) => !v)}
                className="hidden rounded-md bg-white/[0.06] p-2 text-[#94A3B8] hover:bg-white/[0.12] hover:text-[#F8FAFC] lg:flex"
                title={panel ? "Modo cine" : "Abrir lista"}
              >
                {panel ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
              </button>
            </div>
          </div>

          {/* Navegación */}
          <div className="mt-2 flex items-center justify-between gap-2">
            {prev ? (
              <Link href={`/clases/${prev.id}`} className="flex items-center gap-1.5 rounded-md px-3 py-2 text-[12.5px] font-bold text-[#94A3B8] hover:bg-white/[0.05] hover:text-[#F8FAFC]">
                <ChevronLeft size={15} /> Anterior
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/clases/${next.id}`} className="flex items-center gap-1.5 rounded-md bg-[#159DFF] px-4 py-2.5 text-[13px] font-extrabold text-white shadow-lg shadow-[#159DFF]/30 transition hover:brightness-110">
                Siguiente lección <ChevronRight size={15} />
              </Link>
            ) : (
              <span className="flex items-center gap-1.5 rounded-md bg-[#35E981]/15 px-4 py-2.5 text-[13px] font-extrabold text-[#35E981]">Fin del módulo</span>
            )}
          </div>

          {/* Pestañas */}
          <div className="mt-4 flex gap-1 overflow-x-auto no-scrollbar">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`shrink-0 rounded-md px-4 py-2 text-[12.5px] font-bold transition ${
                  tab === t ? "bg-white/10 text-[#F8FAFC]" : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-2 rounded-xl border border-white/[0.06] bg-[#0A1117] p-4">
            {tab === "Resumen" && (
              <p className="text-[13.5px] leading-relaxed text-[#94A3B8]">
                {l.desc} En esta lección del {m.title.toLowerCase()} verás el concepto clave y cómo aplicarlo en tu proyecto hoy mismo.
              </p>
            )}
            {tab === "Recursos" && (
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#159DFF]/12 text-[#159DFF]"><FileText size={18} /></span>
                <div className="flex-1">
                  <div className="text-[13px] font-extrabold text-[#F8FAFC]">Material de la lección</div>
                  <div className="text-[11.5px] text-[#94A3B8]">PDF · plantilla · checklist</div>
                </div>
                <button className="rounded-md bg-[#159DFF]/15 px-3.5 py-2 text-[12px] font-bold text-[#159DFF] hover:bg-[#159DFF]/25">Descargar</button>
              </div>
            )}
            {tab === "Implementa" && (
              <div>
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#35E981]">
                  <Zap size={13} className="fill-current" /> Acción de 25 minutos
                </div>
                <div className="mt-1 text-[13px] text-[#94A3B8]">Aplica lo aprendido antes de continuar.</div>
                <div className="mt-2 space-y-1.5">
                  {implementChecklist.map((c) => (
                    <label key={c} className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-white/[0.03] p-2.5 text-[12.5px] text-[#F8FAFC]">
                      <input type="checkbox" checked={checked.includes(c)} onChange={() => setChecked((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]))} className="h-4 w-4 accent-[#35E981]" />
                      {c}
                    </label>
                  ))}
                </div>
                <button className="mt-3 rounded-md bg-[#35E981] px-4 py-2 text-[12.5px] font-extrabold text-[#05090D] hover:brightness-110">Ya lo implementé</button>
              </div>
            )}
            {tab === "Notas" && (
              <div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Escribe tus notas… (se guardan automáticamente)"
                  className="h-24 w-full rounded-lg border border-white/[0.08] bg-[#0D1C24] p-3 text-[13px] text-[#F8FAFC] outline-none placeholder:text-[#94A3B8] focus:border-[#159DFF]/40"
                />
                <div className="mt-1 flex items-center gap-1 text-[11px] text-[#94A3B8]"><StickyNote size={11} /> Guardado local</div>
              </div>
            )}
          </div>
        </div>

        {/* ===== PANEL DE LECCIONES ===== */}
        {panel && (
          <aside className="hidden w-[320px] shrink-0 lg:flex xl:w-[340px]">
            <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-[#0A1117]">
              <div className="border-b border-white/[0.06] p-4">
                <div className="flex items-center justify-between">
                  <div className="text-[12.5px] font-extrabold text-[#F8FAFC]">{m.title}</div>
                  <button onClick={() => setPanel(false)} className="rounded p-1 text-[#94A3B8] hover:text-[#F8FAFC]" title="Modo cine">
                    <PanelRightClose size={15} />
                  </button>
                </div>
                <div className="mt-0.5 text-[11px] text-[#94A3B8]">{done.length} de {m.lessons.length} clases</div>
                <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/10">
                  <div className="h-full bg-[#159DFF]" style={{ width: `${Math.round((done.length / m.lessons.length) * 100)}%` }} />
                </div>
              </div>
              <div className="flex-1 space-y-1 overflow-y-auto p-2">
                {m.lessons.map((x, i) => {
                  const active = x.id === l.id;
                  const isDone = done.includes(x.id);
                  return (
                    <Link
                      key={x.id}
                      href={`/clases/${x.id}`}
                      className={`flex items-center gap-2.5 rounded-lg p-2 transition ${
                        active ? "bg-[#159DFF]/10 ring-1 ring-[#159DFF]/30" : "hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="relative aspect-video w-[104px] shrink-0 overflow-hidden rounded-md">
                        <Poster id={m.id} title="" variant="horizontal" img={x.img} />
                        {active && (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Play size={12} className="text-white" fill="currentColor" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          {isDone && <Check size={11} className="shrink-0 text-[#35E981]" strokeWidth={3} />}
                          <span className={`truncate text-[12px] font-bold ${active ? "text-[#F8FAFC]" : "text-[#94A3B8]"}`}>{x.title}</span>
                        </div>
                        <div className="text-[10px] text-[#94A3B8]">{i + 1} · {x.duration} min</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Botón fijo de lista en móvil */}
      <button className="fixed bottom-16 right-4 z-30 flex items-center gap-1.5 rounded-full bg-[#159DFF] px-4 py-2.5 text-[12px] font-extrabold text-white shadow-lg shadow-[#159DFF]/40 lg:hidden">
        <ListVideo size={15} /> Lista
      </button>
    </div>
  );
}
