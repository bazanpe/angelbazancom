"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, MessageCircle, Zap, Bot, Rocket, ShieldCheck, Sparkles } from "lucide-react";

const DEMO_EMAIL = "demo@vende.com";
const DEMO_PASS = "vende2026";

export default function LoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !pass) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }
    if (email.trim().toLowerCase() !== DEMO_EMAIL || pass !== DEMO_PASS) {
      setError("Credenciales incorrectas. Usa el acceso demo: demo@vende.com / vende2026");
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      router.push("/inicio");
    }, 900);
  }

  return (
    <div className="flex min-h-screen">
      {/* Lado izquierdo — visual */}
      <div className="relative hidden flex-1 overflow-hidden lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1C24] via-[#09141A] to-[#050A0E]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(21,157,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(21,157,255,0.07) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-[#159DFF]/20 blur-[120px]" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#35E981]/15 blur-[110px]" />

        <div className="relative z-10 flex w-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#35E981] to-[#0878F9] text-sm font-black text-[#050A0E]">
              VA
            </span>
            <div className="text-sm font-extrabold text-[#F8FAFC]">
              Vende en Automático <span className="text-[#159DFF]">VIP</span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-8">
            <RobotArt />
            <div>
              <h1 className="max-w-lg text-[32px] font-black leading-tight text-[#F8FAFC]">
                Tu sistema para vender productos digitales <span className="grad-text">en automático.</span>
              </h1>
              <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-[#94A3B8]">
                Accede a las clases, herramientas y recursos que te ayudarán a convertir WhatsApp en tu canal de ventas.
              </p>
            </div>
            <div className="flex gap-6 text-[12px] font-semibold text-[#94A3B8]">
              <span className="flex items-center gap-1.5"><MessageCircle size={14} className="text-[#35E981]" /> WhatsApp</span>
              <span className="flex items-center gap-1.5"><Bot size={14} className="text-[#159DFF]" /> Inteligencia Artificial</span>
              <span className="flex items-center gap-1.5"><Zap size={14} className="text-[#F59E0B]" /> Meta Ads</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
            <ShieldCheck size={14} className="text-[#35E981]" />
            Sistema protegido · Tus datos están seguros
          </div>
        </div>
      </div>

      {/* Lado derecho — formulario */}
      <div className="flex w-full items-center justify-center px-5 py-10 lg:max-w-[560px]">
        <div className="w-full max-w-sm fade-up">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#35E981] to-[#0878F9] text-sm font-black text-[#050A0E]">
              VA
            </span>
            <div className="text-sm font-extrabold text-[#F8FAFC]">
              Vende en Automático <span className="text-[#159DFF]">VIP</span>
            </div>
          </div>

          <h2 className="text-2xl font-black text-[#F8FAFC]">Bienvenido de vuelta</h2>
          <p className="mt-1 text-[13.5px] text-[#94A3B8]">Ingresa para continuar donde lo dejaste.</p>

          <div className="mt-5 rounded-xl border border-[#35E981]/25 bg-[#35E981]/[0.06] p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#35E981]">
              <Sparkles size={13} /> Acceso demo
            </div>
            <div className="mt-1.5 space-y-0.5 text-[12.5px] text-[#94A3B8]">
              <div>
                <b className="text-[#F8FAFC]">Correo:</b> demo@vende.com
              </div>
              <div>
                <b className="text-[#F8FAFC]">Contraseña:</b> vende2026
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-bold text-[#94A3B8]">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full rounded-lg border border-white/[0.08] bg-[#0D1C24] px-3.5 py-3 text-[14px] text-[#F8FAFC] outline-none placeholder:text-[#94A3B8]/60 focus:border-[#159DFF]/60"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-bold text-[#94A3B8]">Contraseña</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-white/[0.08] bg-[#0D1C24] px-3.5 py-3 pr-11 text-[14px] text-[#F8FAFC] outline-none placeholder:text-[#94A3B8]/60 focus:border-[#159DFF]/60"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC]"
                  aria-label="Mostrar contraseña"
                >
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[12.5px]">
              <label className="flex items-center gap-2 text-[#94A3B8]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 accent-[#159DFF]"
                />
                Recordarme
              </label>
              <Link href="/recuperar" className="font-semibold text-[#159DFF] hover:underline">
                Olvidé mi contraseña
              </Link>
            </div>

            {error && (
              <div className="rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 px-3.5 py-2.5 text-[12.5px] font-semibold text-[#EF4444]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#159DFF] to-[#0878F9] py-3.5 text-[14.5px] font-extrabold text-white shadow-lg shadow-[#159DFF]/25 transition hover:brightness-110 disabled:opacity-70"
            >
              {loading ? <Loader2 size={17} className="animate-spin" /> : null}
              {loading ? "Ingresando…" : "Ingresar a mi cuenta"}
            </button>

            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-white/[0.07]" />
              <span className="text-[11px] font-semibold text-[#94A3B8]">o</span>
              <div className="h-px flex-1 bg-white/[0.07]" />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.03] py-3 text-[14px] font-bold text-[#F8FAFC] transition hover:bg-white/[0.06]"
            >
              <GoogleG /> Continuar con Google
            </button>

            <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-[12px] text-[#94A3B8]">
              ¿Tienes problemas para ingresar?
              <a href="https://wa.me/" className="font-bold text-[#35E981] hover:underline">
                Solicita ayuda por WhatsApp
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function RobotArt() {
  return (
    <div className="relative flex items-center gap-6">
      <svg width="220" height="220" viewBox="0 0 200 200" fill="none" className="drop-shadow-[0_0_40px_rgba(21,157,255,0.25)]">
        <defs>
          <linearGradient id="rb1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#35E981" />
            <stop offset="100%" stopColor="#159DFF" />
          </linearGradient>
        </defs>
        {/* cabeza */}
        <rect x="62" y="34" width="76" height="72" rx="20" fill="#0D1C24" stroke="rgba(21,157,255,0.5)" strokeWidth="2" />
        {/* ojos */}
        <circle cx="88" cy="66" r="11" fill="url(#rb1)" />
        <circle cx="112" cy="66" r="11" fill="url(#rb1)" />
        <circle cx="90" cy="62" r="4" fill="#050A0E" />
        <circle cx="114" cy="62" r="4" fill="#050A0E" />
        {/* antena */}
        <line x1="100" y1="34" x2="100" y2="18" stroke="rgba(21,157,255,0.6)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="100" cy="14" r="5" fill="#35E981" />
        {/* boca */}
        <path d="M82 90 Q100 100 118 90" stroke="rgba(53,233,129,0.8)" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* cuerpo */}
        <rect x="70" y="118" width="60" height="46" rx="14" fill="#09141A" stroke="rgba(21,157,255,0.4)" strokeWidth="2" />
        <rect x="84" y="132" width="32" height="18" rx="6" fill="rgba(21,157,255,0.18)" />
        <circle cx="100" cy="141" r="4" fill="#35E981" />
      </svg>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 rounded-full border border-[#35E981]/25 bg-[#35E981]/10 px-3 py-1.5 text-[11.5px] font-bold text-[#35E981]">
          <MessageCircle size={13} /> Ventas automáticas
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#159DFF]/25 bg-[#159DFF]/10 px-3 py-1.5 text-[11.5px] font-bold text-[#159DFF]">
          <Bot size={13} /> IA que vende por ti
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#F59E0B]/25 bg-[#F59E0B]/10 px-3 py-1.5 text-[11.5px] font-bold text-[#F59E0B]">
          <Rocket size={13} /> Anuncios que convierten
        </div>
      </div>
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
