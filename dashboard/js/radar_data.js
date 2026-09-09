(function () {
  'use strict';

  window.RADAR_DATA = {
    central: 'LOW TICKET RADAR',
    offers: [
      {
        id: 'combo-ia',
        name: 'Combo IA Pack',
        short: 'Combo IA',
        status: 'ganadora',
        score: 92,
        senales: 18,
        nicho: 'Marketing digital',
        subnicho: 'IA aplicada a ventas',
        dolor: 'Pierde tiempo y dinero sin un sistema',
        deseo: 'Automatizar su negocio con IA',
        promesa: 'Vende con IA sin experiencia',
        hook: 'Tu negocio vendiendo 24/7 con IA',
        angulo: 'Fácil + rentable',
        mecanismo: 'Pack de prompts + guías + plantillas'
      },
      {
        id: 'vsl-ia',
        name: 'VSL con IA',
        short: 'VSL IA',
        status: 'vigilada',
        score: 78,
        senales: 12,
        nicho: 'Marketing digital',
        subnicho: 'Producción de video',
        dolor: 'Producir videos de venta cuesta caro',
        deseo: 'VSLs profesionales en horas',
        promesa: 'Tu VSL lista con IA en un día',
        hook: 'Crea tu VSL con IA hoy',
        angulo: 'Rápido + barato',
        mecanismo: 'Guiones + clonación de voz + edición IA'
      },
      {
        id: 'bot-whatsapp',
        name: 'Bot WhatsApp IA',
        short: 'Bot WA IA',
        status: 'analizada',
        score: 64,
        senales: 8,
        nicho: 'Ventas conversacionales',
        subnicho: 'Automatización WhatsApp',
        dolor: 'Pierde ventas por responder tarde',
        deseo: 'Atender clientes 24/7',
        promesa: 'Tu WhatsApp vende solo',
        hook: 'Responde y vende mientras duermes',
        angulo: 'Ahorro + velocidad',
        mecanismo: 'Bot con IA + secuencias + CRM'
      },
      {
        id: 'dropshipping',
        name: 'Dropshipping 2.0',
        short: 'Dropshipping',
        status: 'testeando',
        score: 47,
        senales: 5,
        nicho: 'Ecommerce',
        subnicho: 'Tiendas sin inventario',
        dolor: 'No sabe qué producto probar',
        deseo: 'Tienda rentable sin inventario',
        promesa: 'Tu primera venta en 30 días',
        hook: 'Vende sin stock ni envíos',
        angulo: 'Bajo riesgo',
        mecanismo: 'Research + tienda + ads'
      },
      {
        id: 'salud-mujer',
        name: 'Salud Mujer',
        short: 'Salud Mujer',
        status: 'descartada',
        score: 31,
        senales: 2,
        nicho: 'Salud y bienestar',
        subnicho: 'Belleza natural',
        dolor: 'Inseguridad y productos caros',
        deseo: 'Lucir bien sin gastar de más',
        promesa: 'Belleza natural al alcance',
        hook: 'Rutina natural que sí funciona',
        angulo: 'Emocional',
        mecanismo: 'Guía + comunidad'
      }
    ],
    hypothesis: [
      { from: 'combo-ia', to: 'bot-whatsapp', reason: 'Combo IA fuerte + automatización WhatsApp: sinergia de nichos' },
      { from: 'vsl-ia', to: 'dropshipping', reason: 'Producción VSL con IA aplicada a ofertas de ecommerce' }
    ]
  };
})();
