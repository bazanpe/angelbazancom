import { Gift, ExternalLink } from "lucide-react";
import { BONOS } from "@/lib/data";
import { Badge } from "@/components/ui";

export default function BonosPage() {
  return (
    <div className="fade-up mx-auto max-w-4xl">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#35E981] to-[#159DFF] text-[#05090D]">
          <Gift size={20} />
        </span>
        <div>
          <h1 className="text-2xl font-black text-[#F8FAFC]">Bonos de la Comunidad</h1>
          <p className="mt-0.5 text-[13.5px] text-[#94A3B8]">Herramientas premium incluidas en tu acceso. Actívalas y ponlas a trabajar.</p>
        </div>
      </div>

      <div className="space-y-4">
        {BONOS.map((b) => (
          <div key={b.id} className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A1117]">
            <div className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${b.grad}`} />
            <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${b.grad} text-lg text-[#05090D]`}>
                  {b.nombre[0]}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-[17px] font-extrabold text-[#F8FAFC]">{b.nombre}</h2>
                    <Badge tone="green">{b.dias}</Badge>
                  </div>
                  <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-[#94A3B8]">{b.desc}</p>
                </div>
              </div>
              <button className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white/10 px-5 py-3 text-[13px] font-extrabold text-[#F8FAFC] transition hover:bg-white/20 md:w-[150px]">
                Activar bono <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-[#159DFF]/20 bg-[#159DFF]/[0.05] p-4 text-[13px] text-[#94A3B8]">
        💡 <b className="text-[#F8FAFC]">Consejo:</b> activa los bonos cuando llegues a la fase correspondiente de tu ruta para aprovecharlos al máximo.
      </div>
    </div>
  );
}
