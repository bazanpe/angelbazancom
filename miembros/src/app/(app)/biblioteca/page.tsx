"use client";

import { useState } from "react";
import { Search, FileText, Copy, Star, Download, ChevronDown } from "lucide-react";
import { LIBRARY } from "@/lib/data";
import { Badge, EmptyState } from "@/components/ui";

const CATEGORIES = ["Todos", ...Array.from(new Set(LIBRARY.map((r) => r.category)))];

export default function BibliotecaPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("Todos");
  const [favs, setFavs] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const items = LIBRARY.filter(
    (r) =>
      (cat === "Todos" || r.category === cat) &&
      (r.title + r.desc + r.category).toLowerCase().includes(query.toLowerCase())
  );

  function copy(id: string, text: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1200);
  }

  return (
    <div className="fade-up">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F8FAFC]">Biblioteca infinita</h1>
          <p className="mt-1 text-[13.5px] text-[#94A3B8]">Prompts, flujos, copys, plantillas y recursos listos para usar.</p>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-[#159DFF]/25 bg-[#159DFF]/10 px-3 py-1.5 text-[12px] font-bold text-[#159DFF]">
          <Download size={13} /> 3 actualizaciones nuevas
        </span>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar prompts, copys, flujos…"
            className="w-full rounded-lg border border-white/[0.08] bg-[#0D1C24] py-2.5 pl-9 pr-3 text-[13px] text-[#F8FAFC] outline-none placeholder:text-[#94A3B8] focus:border-[#159DFF]/50"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-[12px] font-bold transition ${
                cat === c ? "bg-[#159DFF] text-white" : "border border-white/10 bg-white/[0.03] text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => (
          <div key={r.id} className="group rounded-xl border border-white/[0.08] bg-[#0D1C24]/70 p-4 transition hover:-translate-y-0.5 hover:border-[#159DFF]/40">
            <div className="flex items-start justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#159DFF]/12 text-[#159DFF]">
                <FileText size={18} />
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => copy(r.id, "Pega aquí el prompt o contenido del recurso…")}
                  className="rounded-md p-1.5 text-[#94A3B8] hover:bg-white/[0.06] hover:text-[#F8FAFC]"
                  title="Copiar"
                >
                  {copied === r.id ? <span className="text-[10px] font-black text-[#35E981]">¡Copiado!</span> : <Copy size={14} />}
                </button>
                <button
                  onClick={() => setFavs((p) => (p.includes(r.id) ? p.filter((x) => x !== r.id) : [...p, r.id]))}
                  className={`rounded-md p-1.5 hover:bg-white/[0.06] ${favs.includes(r.id) ? "text-[#F59E0B]" : "text-[#94A3B8]"}`}
                  title="Guardar"
                >
                  <Star size={14} className={favs.includes(r.id) ? "fill-current" : ""} />
                </button>
              </div>
            </div>
            <div className="mt-3 text-[14px] font-extrabold text-[#F8FAFC]">{r.title}</div>
            <p className="mt-1 line-clamp-2 text-[12px] text-[#94A3B8]">{r.desc}</p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge tone="outline">{r.format}</Badge>
                {r.featured && <Badge tone="blue">Destacado</Badge>}
              </div>
              <span className="text-[10.5px] text-[#94A3B8]">{r.updated}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 rounded-lg bg-[#159DFF]/12 py-2 text-[12px] font-bold text-[#159DFF] transition hover:bg-[#159DFF]/20">
                Ver recurso
              </button>
              <button className="flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[12px] font-bold text-[#F8FAFC] hover:bg-white/[0.07]">
                <Download size={13} /> Descargar
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={<Search size={22} />}
            title="Sin resultados"
            desc="No encontramos recursos con esa búsqueda. Prueba con otra palabra clave."
          />
        </div>
      )}
    </div>
  );
}
