(function () {
  'use strict';

  window.ANCHORS_DATA = {
    title: 'Puntos ancla',
    september: {
      alert: 'Septiembre es el mes más crítico del año: caen juntas las 4 cuotas de créditos (días 2, 11 y 19) por S/ 6,971 + S/ 2,000 de junta + S/ 250 del préstamo papá = S/ 9,221 (≈ $2,459 USD).',
      action: 'Aparta S/ 9,221 hoy mismo en una cuenta separada y no lo toques hasta cada vencimiento.'
    },
    anchors: [
      { n: 1, title: 'Septiembre crítico: reserva S/ 9,221', tag: 'URGENTE', color: 'red', desc: 'Este mes caen juntas las 4 cuotas de créditos (días 2, 11 y 19: S/ 6,971) + junta (S/ 2,000) + préstamo papá (S/ 250). Reserva ese dinero ANTES de gastar nada. Es tu mayor riesgo de caer en mora y pagar intereses adicionales.', action: 'Aparta S/ 9,221 hoy mismo en una cuenta separada.' },
      { n: 2, title: 'Liquidar el préstamo de Papá (S/ 5,000)', tag: 'URGENTE', color: 'red', desc: 'S/ 250/mes de SOLO intereses = 5% mensual ≈ 60% TEA. Nunca amortizas capital: pagarías intereses por siempre. Es tu deuda más cara y debe desaparecer primero.', action: 'Destina todo ingreso extra a cancelarlo en 1–2 meses.' },
      { n: 3, title: 'Tarjetas de crédito de interés alto', tag: 'ALTA', color: 'red', desc: 'El revolving cuesta ~100% TEA. TC Scotiabank Angel (S/ 1,550) y TC Scotiabank Papa Michel (S/ 2,400) deben liquidarse antes que los créditos en cuota, que tienen tasa fija más barata.', action: 'Paga primero las tarjetas, luego Compartamos y Santander.' },
      { n: 4, title: 'Subir el ROAS a ≥ 2.0x', tag: 'ALTA', color: 'amber', desc: 'Viene cayendo mes a mes: Mayo 2.07x → Junio 1.81x → Julio 1.60x. Concentra la pauta en Perú y México (tus mejores mercados) y pausa los países sin retorno (Argentina).', action: 'Revisa el ROAS por país cada semana y reasigna la pauta.' },
      { n: 5, title: 'Estabilizar el Low Ticket Hotmart', tag: 'MEDIA', color: 'amber', desc: 'Promedia $1,306/mes, pero tus herramientas cuestan $1,614/mes. Objetivo: que el low ticket cubra los gastos fijos del negocio y que el Combo IA sea puro profit y colchón de deudas.', action: 'Fija meta de low ticket ≥ $1,700/mes.' },
      { n: 6, title: 'Eliminar fugas: +$134/mes', tag: 'MEDIA', color: 'amber', desc: 'Google One +$80, 6 cobros Skool +$30, IA duplicada +$23.60 y OpenAI cobrado 2 veces en enero ($23.60 ×2). Es dinero gratis que hoy se pierde.', action: 'Cancela los duplicados esta semana: recuperas ~$134/mes.' },
      { n: 7, title: 'Pagarse primero: 20%', tag: 'MEDIA', color: 'amber', desc: 'Meta US$ 7,600. Antes de gastar nada, el ahorro sale primero. Automatiza el día 1 de cada mes (Warda) para no depender de la fuerza de voluntad.', action: 'Transfiere el 20% de cada ingreso a ahorro el día 1.' },
      { n: 8, title: 'Revisión semanal de 15 minutos', tag: 'MEDIA', color: 'amber', desc: 'Cada lunes: ROAS de la semana, pauta por país y los próximos pagos (Tarjetas / Deudas / Negocio). El dashboard ya te avisa solo — úsalo como checklist de acción.', action: 'Agenda el lunes 8:00 am la revisión semanal.' },
      { n: 9, title: 'Separar lo personal del negocio', tag: 'MEDIA', color: 'amber', desc: 'Tus ahorros personales mueven montos enormes (BCP enero S/ 27,757 · Scotiabank julio S/ 56,860). Si no pones límite, el negocio paga la vida personal sin control.', action: 'Define un monto fijo personal mensual y respétalo.' },
      { n: 10, title: 'Fondo de emergencia de 1 mes', tag: 'MEDIA', color: 'amber', desc: 'Junta S/ 9,000 (hoy tienes S/ 4,000 disponibles). Ese colchón evita que una emergencia te obligue a endeudarte otra vez.', action: 'Aporta S/ 500/mes hasta completar S/ 9,000.' }
    ],
    actionPlan: [
      { task: 'Apartar S/ 9,221 de septiembre en cuenta separada', when: 'Hoy mismo' },
      { task: 'Cancelar suscripciones duplicadas (Google One, Skool ×6, IA duplicada, OpenAI ×2)', when: 'Esta semana' },
      { task: 'Pausar anuncios en países sin ROAS (Argentina)', when: 'Esta semana' },
      { task: 'Liquidar el préstamo de Papá (S/ 5,000) con ingresos extra', when: 'En 1–2 meses' },
      { task: 'Transferir el 20% de cada ingreso a ahorro el día 1', when: 'Cada mes' },
      { task: 'Revisión semanal de ROAS y próximos pagos', when: 'Cada lunes' },
      { task: 'Pagar tarjetas Scotiabank antes que cuotas de crédito', when: 'Este mes' }
    ]
  };
})();
