"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Route,
  BookOpen,
  Library,
  Trophy,
  Users,
  Calendar,
  Video,
  BarChart3,
  Bell,
  TrendingUp,
  LifeBuoy,
  Settings,
  LogOut,
  Rocket,
} from "lucide-react";
import { DEMO_USER } from "@/lib/data";

const SECTIONS = [
  {
    label: "PRINCIPAL",
    items: [
      { href: "/inicio", label: "Inicio", icon: Home },
      { href: "/mi-ruta", label: "Mi ruta", icon: Route },
      { href: "/cursos", label: "Cursos", icon: BookOpen },
      { href: "/biblioteca", label: "Biblioteca", icon: Library },
      { href: "/resultados", label: "Resultados", icon: Trophy },
    ],
  },
  {
    label: "COMUNIDAD",
    items: [
      { href: "/comunidad", label: "Comunidad VIP", icon: Users },
      { href: "/calendario", label: "Calendario", icon: Calendar },
      { href: "/mentorias", label: "Mentorías", icon: Video },
      { href: "/ranking", label: "Ranking", icon: BarChart3 },
    ],
  },
  {
    label: "MI CUENTA",
    items: [
      { href: "/notificaciones", label: "Notificaciones", icon: Bell },
      { href: "/mi-progreso", label: "Mi progreso", icon: TrendingUp },
      { href: "/soporte", label: "Soporte", icon: LifeBuoy },
      { href: "/configuracion", label: "Configuración", icon: Settings },
    ],
  },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/inicio" && pathname.startsWith(href));

  return (
    <aside className="flex h-full w-[248px] flex-col overflow-y-auto border-r border-white/[0.06] bg-[#09141A] px-3 py-5">
      <Link href="/inicio" className="mb-6 flex items-center gap-3 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#35E981] to-[#0878F9] text-sm font-black text-[#050A0E]">
          VA
        </span>
        <div>
          <div className="text-sm font-extrabold leading-tight text-[#F8FAFC]">Vende en Automático</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#159DFF]">VIP</div>
        </div>
      </Link>

      <div className="mb-4 rounded-xl border border-[#35E981]/20 bg-[#35E981]/[0.06] p-3">
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#35E981]">
          <Rocket size={13} />
          Tu siguiente acción
        </div>
        <div className="mt-1 text-[11px] leading-snug text-[#94A3B8]">Completa la Fase 2: elige tu producto con datos.</div>
      </div>

      <nav className="flex-1 space-y-4">
        {SECTIONS.map((sec) => (
          <div key={sec.label}>
            <div className="mb-1.5 px-2 text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-[#94A3B8]/60">
              {sec.label}
            </div>
            <div className="space-y-0.5">
              {sec.items.map((it) => {
                const active = isActive(it.href);
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition ${
                      active
                        ? "bg-[#159DFF]/12 text-[#F8FAFC] shadow-[inset_2.5px_0_0_#159DFF]"
                        : "text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F8FAFC]"
                    }`}
                  >
                    <it.icon size={16} className={active ? "text-[#159DFF]" : ""} />
                    {it.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#159DFF] to-[#0878F9] text-xs font-black text-white">
            {DEMO_USER.avatar}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-bold text-[#F8FAFC]">{DEMO_USER.name}</div>
            <div className="text-[10.5px] font-semibold text-[#35E981]">{DEMO_USER.plan}</div>
          </div>
        </div>
        <button className="mt-2.5 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-[#94A3B8] transition hover:bg-white/[0.05] hover:text-[#EF4444]">
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
