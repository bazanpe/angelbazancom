"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Play, Bell, Flame, Menu, X } from "lucide-react";
import { DEMO_USER, NOTIFICATIONS } from "@/lib/data";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isPlayer = pathname.startsWith("/clases/");
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div className={`flex min-h-screen bg-[#05090D] ${isPlayer ? "" : ""}`}>
      {/* Sidebar escritorio (integrado con el fondo) */}
      <div className={`sticky top-0 hidden h-screen shrink-0 md:block ${isPlayer ? "md:hidden xl:block" : ""}`}>
        <Sidebar collapsed={isPlayer ? true : collapsed} onToggle={() => setCollapsed((v) => !v)} />
      </div>

      {/* Drawer móvil */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <Sidebar collapsed={false} onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen w-full flex-1 flex-col">
        {/* Header (oculto en el reproductor inmersivo) */}
        {!isPlayer && (
          <header className="sticky top-0 z-20 border-b border-white/[0.04] bg-[#05090D]/80 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4 py-3 md:px-6">
              <button
                className="rounded-lg p-2 text-[#94A3B8] md:hidden"
                onClick={() => setMenuOpen(true)}
                aria-label="Menú"
              >
                <Menu size={19} />
              </button>
              <button
                className="hidden items-center gap-2 rounded-full bg-[#159DFF]/10 px-3.5 py-2 text-[12.5px] font-bold text-[#159DFF] transition hover:bg-[#159DFF]/20 md:flex"
              >
                <Play size={13} className="fill-current" />
                Continuar: {DEMO_USER.lastLesson.title.split(":")[0]}
              </button>
              <div className="ml-auto flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-full border border-[#35E981]/25 bg-[#35E981]/10 px-2.5 py-1.5 text-[12px] font-extrabold text-[#35E981]">
                  <Flame size={13} className="fill-current" /> {DEMO_USER.streak}
                </span>
                <Link
                  href="/notificaciones"
                  className="relative rounded-lg p-2 text-[#94A3B8] transition hover:text-[#F8FAFC]"
                  aria-label="Notificaciones"
                >
                  <Bell size={18} />
                  {unread > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-black text-white">
                      {unread}
                    </span>
                  )}
                </Link>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#159DFF] to-[#0878F9] text-[11px] font-black text-white">
                  {DEMO_USER.avatar}
                </span>
              </div>
            </div>
          </header>
        )}

        {/* Contenido: el reproductor inmersivo controla su propio layout */}
        <main className={isPlayer ? "flex-1" : "flex-1 px-4 pb-24 pt-5 md:px-6 md:pb-14"}>
          {children}
        </main>
      </div>
    </div>
  );
}
