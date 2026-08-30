import { CalendarDays, Video, Clock } from "lucide-react";
import { EVENTS } from "@/lib/data";
import { Badge } from "@/components/ui";

export default function CalendarioPage() {
  return (
    <div className="fade-up mx-auto max-w-3xl">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-[#F8FAFC]">Calendario</h1>
        <p className="mt-1 text-[13.5px] text-[#94A3B8]">Mentorías, clases en vivo y auditorías.</p>
      </div>

      {/* Banner clases en vivo */}
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#159DFF]/25 bg-gradient-to-r from-[#159DFF]/12 to-[#35E981]/[0.06] p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#159DFF]/15 text-[#159DFF]">
          <Video size={18} />
        </span>
        <div>
          <div className="text-[13.5px] font-extrabold text-[#F8FAFC]">Clases en vivo</div>
          <div className="text-[12.5px] text-[#94A3B8]">
            2 veces al mes · <b className="text-[#35E981]">los sábados al mediodía</b>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {EVENTS.map((ev) => (
          <div key={ev.id} className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-[#0A1117] p-4 transition hover:bg-white/[0.03]">
            <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[#159DFF]/10 text-center">
              <span className="text-[9px] font-black uppercase text-[#94A3B8]">{ev.date.split(" ")[1]}</span>
              <span className="text-[16px] font-black leading-none text-[#159DFF]">{ev.date.split(" ")[0]}</span>
            </div>
            <div className="min-w-0 flex-1">
              <Badge tone={ev.type === "Mentoría" ? "green" : ev.type === "Clase en vivo" ? "blue" : "amber"}>{ev.type}</Badge>
              <div className="mt-1 text-[14.5px] font-extrabold text-[#F8FAFC]">{ev.title}</div>
              <div className="mt-0.5 flex items-center gap-3 text-[12px] text-[#94A3B8]">
                <span className="flex items-center gap-1"><Clock size={11} /> {ev.time} · {ev.duration}</span>
                <span>{ev.instructor}</span>
              </div>
            </div>
            <button className="shrink-0 rounded-lg bg-white/10 px-3.5 py-2 text-[12px] font-bold text-[#F8FAFC] transition hover:bg-white/20">
              + Google Calendar
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 text-[12.5px] text-[#94A3B8]">
        <CalendarDays size={15} className="text-[#159DFF]" />
        Los recordatorios de cada evento se envían 24h antes por correo y WhatsApp.
      </div>
    </div>
  );
}
