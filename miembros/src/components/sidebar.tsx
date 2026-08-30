"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  PlayCircle,
  Library,
  Users,
  Calendar,
  UserRound,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Gift,
} from "lucide-react";
import { DEMO_USER, WHATSAPP_COMMUNITY } from "@/lib/data";

type Item = { href?: string; external?: string; label: string; icon: typeof Home };

const ITEMS: Item[] = [
  { href: "/inicio", label: "Inicio", icon: Home },
  { href: "/buscar", label: "Buscar", icon: Search },
  { href: "/clases", label: "Clases", icon: PlayCircle },
  { href: "/bonos", label: "Bonos", icon: Gift },
  { href: "/biblioteca", label: "Biblioteca", icon: Library },
  { external: WHATSAPP_COMMUNITY, label: "Comunidad", icon: Users },
  { href: "/calendario", label: "Calendario", icon: Calendar },
  { href: "/mi-cuenta", label: "Mi cuenta", icon: UserRound },
];

export function Sidebar({ collapsed, onToggle, onNavigate }: { collapsed?: boolean; onToggle?: () => void; onNavigate?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/inicio" && pathname.startsWith(href));

  return (
    <aside
      className={`flex h-full flex-col border-r border-white/[0.04] bg-[#05090D] px-2.5 py-4 transition-all duration-200 ${
        collapsed ? "w-[64px]" : "w-[220px]"
      }`}
    >
      <Link href="/inicio" className={`mb-6 flex items-center gap-2.5 ${collapsed ? "justify-center px-0" : "px-1.5"}`}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#35E981] to-[#0878F9] text-[13px] font-black text-[#05090D]">
          VA
        </span>
        {!collapsed && (
          <div className="leading-none">
            <div className="text-[12.5px] font-extrabold text-[#F8FAFC]">Vende en Automático</div>
            <div className="mt-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-[#159DFF]">VIP</div>
          </div>
        )}
      </Link>

      <nav className="flex-1 space-y-1">
        {ITEMS.map((it) => {
          const active = it.href ? isActive(it.href) : false;
          const cls = `relative flex items-center gap-3 rounded-lg py-2.5 text-[13px] font-semibold transition ${
            collapsed ? "justify-center px-0" : "px-3"
          } ${active ? "text-[#F8FAFC]" : "text-[#94A3B8] hover:text-[#F8FAFC]"}`;
          const inner = (
            <>
              {active && <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[#159DFF]" />}
              <it.icon size={19} className={active ? "text-[#159DFF]" : ""} />
              {!collapsed && it.label}
            </>
          );
          return it.external ? (
            <a key={it.label} href={it.external} target="_blank" rel="noopener noreferrer" title={collapsed ? it.label : undefined} className={cls}>
              {inner}
            </a>
          ) : (
            <Link key={it.href} href={it.href!} onClick={onNavigate} title={collapsed ? it.label : undefined} className={cls}>
              {inner}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={onToggle}
        className={`mb-3 flex items-center gap-3 rounded-lg py-2 text-[12.5px] font-semibold text-[#94A3B8] transition hover:text-[#F8FAFC] ${
          collapsed ? "justify-center px-0" : "px-3"
        }`}
      >
        {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        {!collapsed && "Contraer"}
      </button>

      <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#159DFF] to-[#0878F9] text-[11px] font-black text-white">
          {DEMO_USER.avatar}
        </span>
        {!collapsed && (
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-[12.5px] font-bold text-[#F8FAFC]">{DEMO_USER.name}</div>
            <div className="truncate text-[10px] font-semibold text-[#35E981]">{DEMO_USER.plan}</div>
          </div>
        )}
      </div>
      {!collapsed && (
        <button className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold text-[#94A3B8] transition hover:bg-white/[0.04] hover:text-[#EF4444]">
          <LogOut size={14} /> Cerrar sesión
        </button>
      )}
    </aside>
  );
}
