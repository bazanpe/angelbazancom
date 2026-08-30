"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_COMMUNITY } from "@/lib/data";

export default function ComunidadPage() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => window.location.replace(WHATSAPP_COMMUNITY), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fade-up flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#35E981]/15 text-[#35E981]">
        <MessageCircle size={28} />
      </span>
      <div>
        <div className="text-lg font-extrabold text-[#F8FAFC]">Abriendo la Comunidad VIP…</div>
        <div className="mt-1 text-[13px] text-[#94A3B8]">Te estamos llevando al grupo de WhatsApp.</div>
      </div>
      <a
        href={WHATSAPP_COMMUNITY}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-[#35E981] px-5 py-2.5 text-[13px] font-extrabold text-[#05090D] hover:brightness-110"
      >
        Ir ahora
      </a>
    </div>
  );
}
