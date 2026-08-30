"use client";

import { useState } from "react";
import { UserRound, Mail, Phone, Globe, ShieldCheck, CalendarClock } from "lucide-react";
import { DEMO_USER } from "@/lib/data";
import { Badge } from "@/components/ui";

export default function MiCuentaPage() {
  const [name] = useState(DEMO_USER.name);
  const [email] = useState(DEMO_USER.email);
  const [whatsapp, setWhatsapp] = useState("+51 999 000 000");
  const [pais] = useState("Perú");

  return (
    <div className="fade-up mx-auto max-w-xl">
      <h1 className="text-2xl font-black text-[#F8FAFC]">Mi cuenta</h1>
      <p className="mt-1 text-[13.5px] text-[#94A3B8]">Tus datos personales.</p>

      <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0A1117] p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#159DFF] to-[#0878F9] text-xl font-black text-white">
            {DEMO_USER.avatar}
          </span>
          <div>
            <div className="text-lg font-extrabold text-[#F8FAFC]">{name}</div>
            <div className="mt-0.5 flex items-center gap-2 text-[12.5px] text-[#94A3B8]">
              <Badge tone="green">{DEMO_USER.plan}</Badge>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Field icon={<UserRound size={15} />} label="Nombre" value={name} />
          <Field icon={<Mail size={15} />} label="Correo electrónico" value={email} />
          <Field icon={<Phone size={15} />} label="WhatsApp" value={whatsapp} onChange={setWhatsapp} editable />
          <Field icon={<Globe size={15} />} label="País" value={pais} />
          <Field icon={<CalendarClock size={15} />} label="Acceso desde" value="28 ago 2026" />
        </div>

        <button className="mt-6 w-full rounded-lg bg-white/10 py-3 text-[13.5px] font-extrabold text-[#F8FAFC] transition hover:bg-white/20">
          Guardar cambios
        </button>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11.5px] text-[#94A3B8]">
          <ShieldCheck size={13} className="text-[#35E981]" /> Tus datos están protegidos y solo son visibles para ti.
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  editable,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange?: (v: string) => void;
  editable?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-[11.5px] font-bold uppercase tracking-wide text-[#94A3B8]">{label}</label>
      {editable && onChange ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-white/[0.08] bg-[#0D1C24] px-3 py-2.5 text-[13.5px] text-[#F8FAFC] outline-none focus:border-[#159DFF]/40"
        />
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#0D1C24] px-3 py-2.5 text-[13.5px] text-[#F8FAFC]">
          {icon} {value}
        </div>
      )}
    </div>
  );
}
