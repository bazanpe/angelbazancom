"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Route, BookOpen, Library, UserRound } from "lucide-react";

const ITEMS = [
  { href: "/inicio", label: "Inicio", icon: Home },
  { href: "/mi-ruta", label: "Ruta", icon: Route },
  { href: "/cursos", label: "Cursos", icon: BookOpen },
  { href: "/biblioteca", label: "Biblioteca", icon: Library },
  { href: "/perfil", label: "Perfil", icon: UserRound },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-[#09141A]/95 backdrop-blur-lg md:hidden">
      <div className="grid grid-cols-5">
        {ITEMS.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold transition ${
                active ? "text-[#159DFF]" : "text-[#94A3B8]"
              }`}
            >
              <it.icon size={19} />
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
