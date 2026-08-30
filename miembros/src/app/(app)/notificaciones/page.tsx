import Link from "next/link";
import { Bell, CheckCheck, Video, Flame, FileText, CalendarClock, CheckCircle2 } from "lucide-react";
import { NOTIFICATIONS } from "@/lib/data";
import { Badge } from "@/components/ui";

const ICONS: Record<string, React.ReactNode> = {
  "new-class": <Video size={15} />,
  streak: <Flame size={15} />,
  resource: <FileText size={15} />,
  event: <CalendarClock size={15} />,
};

export default function NotificacionesPage() {
  return (
    <div className="fade-up mx-auto max-w-2xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#F8FAFC]">Notificaciones</h1>
          <p className="mt-1 text-[13.5px] text-[#94A3B8]">Mantente al día con tu progreso.</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[12px] font-bold text-[#94A3B8] hover:text-[#F8FAFC]">
          <CheckCheck size={14} /> Marcar todas
        </button>
      </div>

      <div className="space-y-2">
        {NOTIFICATIONS.map((n) => (
          <div
            key={n.id}
            className={`flex items-start gap-3 rounded-xl border p-4 transition hover:bg-white/[0.03] ${
              n.unread ? "border-[#159DFF]/25 bg-[#159DFF]/[0.04]" : "border-white/[0.08] bg-[#0D1C24]/60"
            }`}
          >
            <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              n.unread ? "bg-[#159DFF]/15 text-[#159DFF]" : "bg-white/[0.05] text-[#94A3B8]"
            }`}>
              {ICONS[n.type] ?? <Bell size={15} />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[13.5px] font-extrabold text-[#F8FAFC]">{n.title}</span>
                {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-[#159DFF]" />}
              </div>
              <p className="mt-0.5 text-[12.5px] text-[#94A3B8]">{n.desc}</p>
            </div>
            <div className="shrink-0 text-[11px] text-[#94A3B8]">{n.time}</div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Badge tone="green">Nueva clase disponible: Automatización con IA</Badge>
      </div>
      <Link href="/cursos/sistema/m7" className="mt-3 inline-flex items-center gap-2 text-[13px] font-bold text-[#159DFF] hover:underline">
        <CheckCircle2 size={14} /> Ir a la nueva clase
      </Link>
    </div>
  );
}
