export type Lesson = {
  id: string;
  title: string;
  duration: number; // minutos
  desc: string;
  resource?: string;
  type?: "video" | "recurso" | "checklist";
};

export type Module = {
  id: string;
  numero: number;
  title: string;
  desc: string;
  objective: string;
  result: string;
  tag?: "Esencial" | "Nuevo" | "Bonus" | "Actualizado";
  locked?: boolean;
  progress?: number;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  gradient: string;
  hours: number;
  modules: Module[];
};

export const COURSE: Course = {
  id: "sistema",
  title: "SISTEMA VENDE EN AUTOMÁTICO",
  subtitle: "De cero a tu primera venta automatizada con WhatsApp, IA y Meta Ads.",
  image: "/hero-system.webp",
  gradient: "from-[#159DFF]/40 via-[#0D1C24] to-transparent",
  hours: 42,
  modules: [
    {
      id: "m1",
      numero: 1,
      title: "EMPIEZA AQUÍ",
      desc: "Prepara tu entorno, entiende la plataforma y define tu meta de 30 días.",
      objective: "Configurar tu cuenta y fijar una meta clara y medible.",
      result: "Sabrás exactamente cómo usar la plataforma y qué vas a lograr.",
      tag: "Esencial",
      lessons: [
        { id: "m1l1", title: "Bienvenida a Vende en Automático VIP", duration: 8, desc: "Qué vas a lograr y cómo funciona todo el sistema." },
        { id: "m1l2", title: "Cómo utilizar la plataforma", duration: 6, desc: "Navegación, progreso, notas y recursos." },
        { id: "m1l3", title: "Cómo seguir la ruta de implementación", duration: 5, desc: "El orden correcto para avanzar sin perderte." },
        { id: "m1l4", title: "Configura tus accesos", duration: 4, desc: "Verifica correo, WhatsApp y dispositivos." },
        { id: "m1l5", title: "Define tu meta de los próximos 30 días", duration: 7, desc: "Elige tu objetivo y nivel actual." },
        { id: "m1l6", title: "Reglas y soporte de la comunidad", duration: 3, desc: "Cómo pedir ayuda y compartir resultados." },
      ],
    },
    {
      id: "m2",
      numero: 2,
      title: "LÓGICA DEL MODELO LOW TICKET",
      desc: "La matemática detrás de vender productos digitales económicos a gran escala.",
      objective: "Entender por qué el low ticket funciona y qué errores evitar.",
      result: "Mentalidad clara de validación y ejecución.",
      lessons: [
        { id: "m2l1", title: "Cómo funciona la venta directa de productos digitales", duration: 9, desc: "El modelo de negocio en una sola página." },
        { id: "m2l2", title: "La matemática detrás de una oferta económica", duration: 11, desc: "Números, costos y márgenes reales." },
        { id: "m2l3", title: "Por qué WhatsApp convierte", duration: 8, desc: "El canal de mayor confianza y respuesta." },
        { id: "m2l4", title: "Errores que impiden conseguir resultados", duration: 10, desc: "Los 7 errores que matan el lanzamiento." },
        { id: "m2l5", title: "Mentalidad de validación y ejecución", duration: 6, desc: "Menos perfección, más acción medida." },
      ],
    },
    {
      id: "m3",
      numero: 3,
      title: "PRODUCTOS DIGITALES QUE LA GENTE COMPRA",
      desc: "Detecta dolores urgentes y productos con demanda real.",
      objective: "Seleccionar un producto con demanda comprobable.",
      result: "Un producto elegido con datos, no con corazonadas.",
      tag: "Esencial",
      lessons: [
        { id: "m3l1", title: "Cómo detectar dolores urgentes", duration: 9, desc: "Dolores que la gente paga por resolver YA." },
        { id: "m3l2", title: "Investigación de mercados", duration: 12, desc: "Fuentes y métodos para validar demanda." },
        { id: "m3l3", title: "Selección de nichos", duration: 8, desc: "Nicho, subnicho y audiencia." },
        { id: "m3l4", title: "Análisis de competidores", duration: 10, desc: "Qué vende tu competencia y por qué." },
        { id: "m3l5", title: "Validación rápida de ideas", duration: 7, desc: "Validar en 48 horas sin gastar de más." },
        { id: "m3l6", title: "Cómo evitar productos sin demanda", duration: 6, desc: "Señales de alerta antes de crear." },
      ],
    },
    {
      id: "m4",
      numero: 4,
      title: "CREA TU PRODUCTO DESDE CERO",
      desc: "Construye un producto digital de calidad con IA y sin complicarte.",
      objective: "Crear tu primer PDF/descargable listo para vender.",
      result: "Producto terminado con entrega digital automática.",
      lessons: [
        { id: "m4l1", title: "Estructura del producto", duration: 8, desc: "Índice, capítulos y entregables." },
        { id: "m4l2", title: "Creación de PDFs y descargables", duration: 14, desc: "Herramientas y formato profesional." },
        { id: "m4l3", title: "Uso de inteligencia artificial", duration: 12, desc: "Prompts para crear contenido de valor." },
        { id: "m4l4", title: "Diseño y presentación", duration: 10, desc: "Portadas y piezas visuales." },
        { id: "m4l5", title: "Bonos", duration: 6, desc: "Qué añadir para aumentar el valor." },
        { id: "m4l6", title: "Entrega digital", duration: 5, desc: "Sistemas de entrega y control de calidad." },
      ],
    },
    {
      id: "m5",
      numero: 5,
      title: "CONSTRUYE UNA OFERTA IRRESISTIBLE",
      desc: "Promesa, mecanismo, bonos, precio, urgencia y garantía.",
      objective: "Estructurar una oferta completa con upsell y downsell.",
      result: "Oferta lista que la gente no puede ignorar.",
      tag: "Esencial",
      lessons: [
        { id: "m5l1", title: "Promesa", duration: 7, desc: "El resultado prometido con claridad." },
        { id: "m5l2", title: "Mecanismo", duration: 8, desc: "Cómo se logra el resultado." },
        { id: "m5l3", title: "Oferta principal y bonos", duration: 9, desc: "Apilamiento de valor." },
        { id: "m5l4", title: "Precio, urgencia y garantía", duration: 8, desc: "Anclaje y eliminación de riesgo." },
        { id: "m5l5", title: "Oferta básica, completa, upsell y downsell", duration: 12, desc: "La escalera de compra completa." },
      ],
    },
    {
      id: "m6",
      numero: 6,
      title: "WHATSAPP FUNNEL PRO",
      desc: "El embudo completo dentro de WhatsApp: de mensaje inicial a cobro.",
      objective: "Montar el flujo de conversación y venta en WhatsApp.",
      result: "Funnel funcional con seguimientos y cierre.",
      tag: "Esencial",
      lessons: [
        { id: "m6l1", title: "Configuración de WhatsApp", duration: 8, desc: "Cuenta, perfil, catálogo y horarios." },
        { id: "m6l2", title: "Estructura del embudo", duration: 10, desc: "Etapas: contacto → oferta → cierre." },
        { id: "m6l3", title: "Etiquetas y organización", duration: 6, desc: "Organiza conversaciones por estado." },
        { id: "m6l4", title: "Mensaje inicial", duration: 7, desc: "El primer mensaje que responde la gente." },
        { id: "m6l5", title: "Presentación de la oferta", duration: 9, desc: "Cómo presentar el producto en chat." },
        { id: "m6l6", title: "Objeciones", duration: 10, desc: "Respuestas a las 10 objeciones comunes." },
        { id: "m6l7", title: "Seguimientos", duration: 8, desc: "Secuencia de seguimiento automática." },
        { id: "m6l8", title: "Venta contra entrega digital", duration: 6, desc: "Cierre y entrega en el momento." },
      ],
    },
    {
      id: "m7",
      numero: 7,
      title: "AUTOMATIZACIÓN CON IA",
      desc: "VendeChat y agentes de IA que responden, venden y entregan solos.",
      objective: "Automatizar respuestas, seguimientos y entregas con IA.",
      result: "Tu funnel funciona 24/7 mientras duermes.",
      tag: "Nuevo",
      lessons: [
        { id: "m7l1", title: "Introducción a VendeChat", duration: 9, desc: "Qué es y cómo encaja en tu sistema." },
        { id: "m7l2", title: "Configuración del agente de IA", duration: 13, desc: "Entrenamiento, personalidad y límites." },
        { id: "m7l3", title: "Flujos automáticos", duration: 11, desc: "Respuestas automáticas por palabras clave." },
        { id: "m7l4", title: "Respuestas inteligentes", duration: 10, desc: "La IA resolviendo dudas y objeciones." },
        { id: "m7l5", title: "Recuperación de ventas", duration: 8, desc: "Seguimiento automático de carritos." },
        { id: "m7l6", title: "Automatización de entrega", duration: 7, desc: "Entrega del producto sin intervención." },
        { id: "m7l7", title: "Medición de conversiones", duration: 6, desc: "Métricas del agente." },
      ],
    },
    {
      id: "m8",
      numero: 8,
      title: "CREATIVOS Y ANUNCIOS QUE VENDEN",
      desc: "Estructura CTR Infinito y videos de 30 a 59 segundos que convierten.",
      objective: "Crear creativos y copys basados en dolores reales.",
      result: "Anuncios que la gente quiere ver y clickear.",
      tag: "Esencial",
      lessons: [
        { id: "m8l1", title: "Investigación profunda del avatar", duration: 12, desc: "Dolores, deseos y objeciones de tu cliente." },
        { id: "m8l2", title: "Estructura CTR Infinito", duration: 14, desc: "El marco de anuncios que para el scroll." },
        { id: "m8l3", title: "Promesa, mecanismo, testimonios y CTA", duration: 9, desc: "Los 4 elementos del anuncio." },
        { id: "m8l4", title: "Creación de videos de 30 a 59 segundos", duration: 16, desc: "Guion, grabación y edición rápida." },
        { id: "m8l5", title: "Mini VSL", duration: 12, desc: "Videos de venta cortos que convierten." },
        { id: "m8l6", title: "IA para creativos", duration: 10, desc: "Generación de guiones y visuales con IA." },
      ],
    },
    {
      id: "m9",
      numero: 9,
      title: "META ADS DESDE CERO",
      desc: "Business Manager, Pixel, campañas y segmentación explicadas paso a paso.",
      objective: "Tener la infraestructura publicitaria lista.",
      result: "Cuenta publicitaria funcionando con Pixel.",
      tag: "Esencial",
      lessons: [
        { id: "m9l1", title: "Infraestructura publicitaria", duration: 9, desc: "Qué necesitas antes de anunciar." },
        { id: "m9l2", title: "Business Manager", duration: 10, desc: "Creación y verificación." },
        { id: "m9l3", title: "Cuenta publicitaria y página", duration: 8, desc: "Configuración básica." },
        { id: "m9l4", title: "Pixel y eventos", duration: 11, desc: "Instalación y eventos de conversión." },
        { id: "m9l5", title: "Métodos de pago", duration: 6, desc: "Tarjetas y cuentas para ads." },
        { id: "m9l6", title: "Configuración de campañas", duration: 12, desc: "Objetivos, presupuesto y lanzamiento." },
        { id: "m9l7", title: "Segmentación y presupuesto", duration: 9, desc: "A quién mostrar y cuánto gastar." },
      ],
    },
    {
      id: "m10",
      numero: 10,
      title: "LANZA Y VALIDA RÁPIDO",
      desc: "Campañas de prueba, señales de compra y decisiones a 48 horas.",
      objective: "Lanzar tu primera campaña y saber si funciona.",
      result: "Campaña en el aire con criterio claro de decisión.",
      lessons: [
        { id: "m10l1", title: "Campañas de prueba", duration: 9, desc: "Estructura de testeo inicial." },
        { id: "m10l2", title: "Presupuesto inicial", duration: 7, desc: "Cuánto invertir para validar." },
        { id: "m10l3", title: "Las primeras 24 a 48 horas", duration: 10, desc: "Qué revisar y qué ignorar." },
        { id: "m10l4", title: "Señales de compra", duration: 8, desc: "Cómo identificar intención de compra." },
        { id: "m10l5", title: "Cuándo apagar o mantener un anuncio", duration: 9, desc: "Criterios concretos de decisión." },
        { id: "m10l6", title: "Registro de ventas", duration: 5, desc: "Lleva el control de cada venta." },
      ],
    },
    {
      id: "m11",
      numero: 11,
      title: "CONTROLA TUS NÚMEROS",
      desc: "ROAS, conversión, costos y tablero de control.",
      objective: "Leer tus métricas y tomar decisiones con datos.",
      result: "Tablero que te dice exactamente qué arreglar.",
      lessons: [
        { id: "m11l1", title: "ROAS y conversión a venta", duration: 9, desc: "Las 2 métricas que importan." },
        { id: "m11l2", title: "Costo por conversación y por compra", duration: 8, desc: "CPC, CPM, CTR explicados." },
        { id: "m11l3", title: "Tablero de control", duration: 11, desc: "Tu panel de métricas semanal." },
        { id: "m11l4", title: "Diagnóstico de problemas", duration: 10, desc: "Encontrar el punto de fuga." },
        { id: "m11l5", title: "Decisiones basadas en datos", duration: 8, desc: "El método para decidir sin miedo." },
      ],
    },
    {
      id: "m12",
      numero: 12,
      title: "OPTIMIZA Y ESCALA",
      desc: "Escala lo que funciona y automatiza la operación.",
      objective: "Escalar campañas ganadoras de forma controlada.",
      result: "Plan de escala con reinversión de ganancias.",
      lessons: [
        { id: "m12l1", title: "Selección de anuncios ganadores", duration: 8, desc: "Qué hace ganador a un anuncio." },
        { id: "m12l2", title: "Nuevos ángulos y creativos", duration: 9, desc: "Variaciones para escalar." },
        { id: "m12l3", title: "Reinversión", duration: 7, desc: "Cuánto reinvertir de cada venta." },
        { id: "m12l4", title: "Escalamiento progresivo", duration: 11, desc: "Subir presupuesto sin romper la cuenta." },
        { id: "m12l5", title: "Automatización operativa", duration: 8, desc: "Operar con menos trabajo manual." },
        { id: "m12l6", title: "Expansión a nuevos productos", duration: 7, desc: "Repetir el sistema con otros productos." },
      ],
    },
    {
      id: "m13",
      numero: 13,
      title: "CLASES GRABADAS",
      desc: "Mentorías, auditorías y análisis de campañas.",
      objective: "Aprender de casos reales.",
      result: "Criterio para tus propias decisiones.",
      tag: "Bonus",
      locked: true,
      lessons: [
        { id: "m13l1", title: "Mentoría: primeros pasos", duration: 60, desc: "Sesión grabada completa." },
        { id: "m13l2", title: "Auditoría de campañas", duration: 55, desc: "Análisis en vivo de una cuenta." },
        { id: "m13l3", title: "Análisis de funnel", duration: 48, desc: "Revisión de un embudo real." },
      ],
    },
    {
      id: "m14",
      numero: 14,
      title: "BIBLIOTECA INFINITA",
      desc: "Prompts, flujos, copys, guiones y plantillas.",
      objective: "Usar los recursos listos para copiar y pegar.",
      result: "Material de implementación al instante.",
      tag: "Nuevo",
      lessons: [
        { id: "m14l1", title: "Prompts de IA", duration: 4, desc: "Copiar y pegar para crear contenido." },
        { id: "m14l2", title: "Flujos de WhatsApp", duration: 5, desc: "Secuencias listas para usar." },
        { id: "m14l3", title: "Copys y guiones", duration: 6, desc: "Textos que venden." },
        { id: "m14l4", title: "Plantillas y tableros", duration: 4, desc: "Recursos descargables." },
      ],
    },
    {
      id: "m15",
      numero: 15,
      title: "BONOS DE REGALO",
      desc: "Contenido adicional según tu plan y progreso.",
      objective: "Desbloquear contenido extra.",
      result: "Más herramientas a tu favor.",
      tag: "Bonus",
      locked: true,
      lessons: [
        { id: "m15l1", title: "Bono: plantilla de oferta", duration: 5, desc: "Estructura lista para llenar." },
        { id: "m15l2", title: "Bono: audit de creativos", duration: 7, desc: "Revisión de tus anuncios." },
      ],
    },
  ],
};

export type Phase = {
  id: number;
  title: string;
  objective: string;
  hours: number;
  lessonsCount: number;
  status: "bloqueado" | "disponible" | "iniciado" | "completado";
  progress: number;
  checklist: string[];
  resultado: string;
};

export const PHASES: Phase[] = [
  { id: 1, title: "ACTIVA TU SISTEMA", objective: "Preparar la cuenta, herramientas y entorno de trabajo.", hours: 1, lessonsCount: 3, status: "completado", progress: 100, resultado: "Entorno listo para trabajar.", checklist: ["Crear cuenta", "Configurar accesos", "Definir meta"] },
  { id: 2, title: "ENCUENTRA UNA OPORTUNIDAD", objective: "Detectar productos con demanda, dolores reales y venta rápida.", hours: 2, lessonsCount: 4, status: "iniciado", progress: 37, resultado: "Un producto elegido con datos.", checklist: ["Investigar mercado", "Analizar competencia", "Validar idea", "Elegir producto"] },
  { id: 3, title: "CONSTRUYE TU OFERTA", objective: "Crear una oferta simple, económica y atractiva para WhatsApp.", hours: 3, lessonsCount: 4, status: "disponible", progress: 0, resultado: "Oferta con bonos y garantía.", checklist: ["Definir promesa", "Armar producto", "Estructurar oferta", "Fijar precio"] },
  { id: 4, title: "PREPARA TU SISTEMA DE VENTAS", objective: "Configurar WhatsApp, mensajes, pagos, entregas y automatizaciones.", hours: 2, lessonsCount: 5, status: "bloqueado", progress: 0, resultado: "Funnel funcionando.", checklist: ["Configurar WhatsApp", "Montar flujos", "Activar IA", "Automatizar entrega"] },
  { id: 5, title: "CREA ANUNCIOS QUE VENDEN", objective: "Desarrollar creativos y copys basados en dolores reales.", hours: 3, lessonsCount: 4, status: "bloqueado", progress: 0, resultado: "Anuncios listos para publicar.", checklist: ["Investigar avatar", "Escribir copys", "Grabar videos", "Elegir creativos"] },
  { id: 6, title: "LANZA TU CAMPAÑA", objective: "Configurar y publicar la primera campaña de Meta Ads.", hours: 2, lessonsCount: 4, status: "bloqueado", progress: 0, resultado: "Campaña en el aire.", checklist: ["Montar BM", "Instalar Pixel", "Configurar campaña", "Publicar"] },
  { id: 7, title: "CONSIGUE Y REGISTRA TUS PRIMERAS VENTAS", objective: "Analizar conversaciones, cobros, conversiones y puntos de fuga.", hours: 2, lessonsCount: 3, status: "bloqueado", progress: 0, resultado: "Primeras ventas registradas.", checklist: ["Revisar conversaciones", "Registrar ventas", "Identificar fugas"] },
  { id: 8, title: "OPTIMIZA Y ESCALA", objective: "Reinvertir, probar creativos, mejorar conversión y escalar.", hours: 2, lessonsCount: 4, status: "bloqueado", progress: 0, resultado: "Sistema escalando.", checklist: ["Elegir ganadores", "Reinvertir", "Escalar", "Automatizar"] },
];

export type LibraryItem = {
  id: string;
  title: string;
  desc: string;
  category: string;
  format: "PDF" | "Prompt" | "Plantilla" | "Checklist" | "Flujo";
  updated: string;
  featured?: boolean;
};

export const LIBRARY: LibraryItem[] = [
  { id: "l1", title: "50 dolores para nichos rentables", desc: "Lista de dolores urgentes con demanda comprobable.", category: "Productos validados", format: "PDF", updated: "28 ago 2026", featured: true },
  { id: "l2", title: "Prompt: crea tu oferta irresistible", desc: "Prompt de IA para estructurar tu oferta completa.", category: "Prompts de IA", format: "Prompt", updated: "27 ago 2026", featured: true },
  { id: "l3", title: "Flujo WhatsApp: mensaje inicial", desc: "Secuencia de apertura que genera respuesta.", category: "Flujos de WhatsApp", format: "Flujo", updated: "26 ago 2026" },
  { id: "l4", title: "Estructura CTR Infinito (plantilla)", desc: "Plantilla editable para tus creativos.", category: "Creativos", format: "Plantilla", updated: "25 ago 2026", featured: true },
  { id: "l5", title: "Checklist lanzamiento 48h", desc: "Qué hacer antes, durante y después de lanzar.", category: "Checklists", format: "Checklist", updated: "24 ago 2026" },
  { id: "l6", title: "Guion mini VSL 45 segundos", desc: "Guion completo para tu video de venta corto.", category: "Guiones", format: "Prompt", updated: "23 ago 2026" },
  { id: "l7", title: "Tablero de control de métricas", desc: "Seguimiento de ROAS, conversión y costos.", category: "Tableros", format: "Plantilla", updated: "22 ago 2026" },
  { id: "l8", title: "Copys para 10 ofertas low ticket", desc: "Copys probados listos para adaptar.", category: "Copys", format: "PDF", updated: "21 ago 2026" },
];

export type Evento = {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  desc: string;
  type: "Mentoría" | "Clase en vivo" | "Auditoría";
};

export const EVENTS: Evento[] = [
  { id: "e1", title: "Mentoría: primeros lanzamientos", instructor: "Angel Bazan", date: "3 sep", time: "7:00 PM", duration: "90 min", desc: "Resolvemos dudas de lanzamiento en vivo.", type: "Mentoría" },
  { id: "e2", title: "Clase en vivo: Meta Ads 2026", instructor: "Angel Bazan", date: "10 sep", time: "7:00 PM", duration: "60 min", desc: "Configuración y novedades de Meta Ads.", type: "Clase en vivo" },
  { id: "e3", title: "Auditoría de campañas", instructor: "Equipo VIP", date: "17 sep", time: "7:00 PM", duration: "90 min", desc: "Revisión de campañas de alumnos.", type: "Auditoría" },
];

export type Notif = {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type: string;
};

export const NOTIFICATIONS: Notif[] = [
  { id: "n1", title: "Nueva clase disponible", desc: "Automatización con IA: flujos automáticos.", time: "Hace 2 h", unread: true, type: "new-class" },
  { id: "n2", title: "Tu racha continúa", desc: "3 días seguidos aprendiendo. Sigue así.", time: "Ayer", unread: true, type: "streak" },
  { id: "n3", title: "Nuevo recurso en la biblioteca", desc: "Prompt: crea tu oferta irresistible.", time: "Ayer", unread: false, type: "resource" },
  { id: "n4", title: "Mentoría próxima", desc: "Mentoría: primeros lanzamientos — 3 sep 7PM.", time: "Hace 2 días", unread: false, type: "event" },
];

export const DEMO_USER = {
  name: "Alumno VIP",
  email: "demo-progreso@vende.com",
  plan: "Vende en Automático VIP",
  avatar: "AV",
  streak: 3,
  progress: 37,
  classesCompleted: 14,
  nextObjective: "Crear tu producto digital",
  lastLesson: {
    module: "Módulo 2 · Lógica del modelo low ticket",
    title: "La matemática detrás de una oferta económica",
    duration: 11,
    at: "4:20",
  },
};
