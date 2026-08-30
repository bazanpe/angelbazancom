import { Construction } from "lucide-react";

export function Placeholder({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="fade-up">
      <h1 className="text-2xl font-black text-[#F8FAFC]">{title}</h1>
      <p className="mt-1 text-[13.5px] text-[#94A3B8]">{desc}</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#159DFF]/10 text-[#159DFF]">
          <Construction size={22} />
        </span>
        <div className="text-sm font-extrabold text-[#F8FAFC]">Sección en construcción</div>
        <div className="max-w-sm text-xs leading-relaxed text-[#94A3B8]">
          Esta área llegará en la siguiente fase de implementación. Mientras tanto, tu ruta y tus cursos siguen disponibles.
        </div>
      </div>
    </div>
  );
}
