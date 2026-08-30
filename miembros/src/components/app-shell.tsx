"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Play, Bell, Flame, Menu, X } from "lucide-react";
import { DEMO_USER, NOTIFICATIONS } from "@/lib/data";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar escritorio */}
      <div className="fixed inset-y-0 left-0 z-30 hidden md:block">
        <Sidebar />
      </div>

      {/* Drawer móvil */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <Sidebar onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen w-full flex-1 flex-col md:pl-[248px]">
        <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#09141A]/85 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 py-3 md:px-7">
            <button
              className="rounded-lg border border-white/10 p-2 text-[#94A3B8] md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Menú"
            >
              <Menu size={18} />
            </button>

            <div className="relative hidden flex-1 max-w-sm sm:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar clases, recursos, prompts…  (Ctrl K)"
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] py-2 pl-9 pr-10 text-[13px] text-[#F8FAFC] outline-none placeholder:text-[#94A3B8] focus:border-[#159DFF]/50"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[9px] font-bold text-[#94A3B8]">
                ⌘K
              </kbd>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/inicio"
                className="hidden items-center gap-2 rounded-full bg-[#159DFF]/12 px-3.5 py-2 text-[12.5px] font-bold text-[#159DFF] transition hover:bg-[#159DFF]/20 sm:flex"
              >
                <Play size={13} className="fill-current" />
                Continuar: {DEMO_USER.lastLesson.title.split(":")[0]}
              </Link>
              <span className="flex items-center gap-1 rounded-full border border-[#35E981]/25 bg-[#35E981]/10 px-2.5 py-1.5 text-[12px] font-extrabold text-[#35E981]">
                <Flame size={13} className="fill-current" />
                {DEMO_USER.streak}
              </span>
              <Link
                href="/notificaciones"
                className="relative rounded-lg border border-white/[0.08] p-2 text-[#94A3B8] transition hover:text-[#F8FAFC]"
                aria-label="Notificaciones"
              >
                <Bell size={17} />
                {unread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-black text-white">
                    {unread}
                  </span>
                )}
              </Link>
              <button
                className="rounded-lg border border-white/[0.08] p-2 text-[#94A3B8] sm:hidden"
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Buscar"
              >
                <Search size={17} />
              </button>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#159DFF] to-[#0878F9] text-[11px] font-black text-white">
                {DEMO_USER.avatar}
              </span>
            </div>
          </div>

          {searchOpen && (
            <div className="border-t border-white/[0.06] px-4 py-3 sm:hidden">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar en tu academia…"
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[13px] text-[#F8FAFC] outline-none placeholder:text-[#94A3B8]"
              />
            </div>
          )}
        </header>

        <main className="flex-1 px-4 pb-24 pt-5 md:px-7 md:pb-12">{children}</main>
      </div>
    </div>
  );
}
