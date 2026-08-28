(function () {
  'use strict';

  window.DEBTS_DATA = {
    summary: {
      totalDebtEstimatedMinPEN: 212860,
      totalDebtEstimatedMaxPEN: 232860,
      monthlyFixedCommitmentPEN: 6971,
      weeklyJuntaCommitmentPEN: 2000,
      totalMonthlyCommitmentCurrentPEN: 9221,
      septemberAlertText: '🚨 Septiembre 2026 es el mes crítico: Coinciden las 4 cuotas de créditos formales (días 2, 11 y 19) por S/ 6,971 + S/ 2,000 de junta + S/ 250 préstamo papá (Total S/ 9,221).',
      liquidAssetsPEN: 4000,
      cardGuaranteesPEN: 1205
    },
    formalCredits: [
      { name: 'Compartamos (S/ 30,000)', monthlyFeePEN: 2889, dueDateDay: 2, remainingQuota: 12, totalQuotas: 12, range: '2 sep 2026 → ago 2027', pendingBalancePEN: 34668, status: 'Crítico Sep' },
      { name: 'Santander Arly (S/ 25,000)', monthlyFeePEN: 2722, dueDateDay: 11, remainingQuota: 5, totalQuotas: 12, currentQuota: 8, range: 'sep 2026 → ene 2027', pendingBalancePEN: 13610, status: 'Cuota 8 de 12 · 11 sept' },
      { name: 'Santander Michel (S/ 5,000)', monthlyFeePEN: 575, dueDateDay: 19, remainingQuota: 12, totalQuotas: 12, range: 'ago 2026 → jul 2027', pendingBalancePEN: 6898, status: 'Activo' },
      { name: 'Alfin Arly (S/ 7,954)', monthlyFeePEN: 785, dueDateDay: 19, remainingQuota: 14, totalQuotas: 14, range: 'ago 2026 → sep 2027', pendingBalancePEN: 10993, status: 'Activo' },
      { name: 'Préstamo Papá Amigo (S/ 5,000)', monthlyFeePEN: 250, dueDateDay: 24, remainingQuota: 0, totalQuotas: 0, interestOnly: true, range: 'Mensual · solo intereses', pendingBalancePEN: 5000, status: 'URGENTE — Liquidar' }
    ],
    informalDebts: [
      { creditor: 'TC Sandra', amountPEN: 60000, note: 'Nota: Hoja registra Tarjeta BCP S/35k + BBVA S/35k + Qore S/10k = S/80,000', priority: 'Alta - Acordar plazos' },
      { creditor: 'Préstamo familiares (Julio 2026)', amountPEN: 56860, note: 'Depositado en Scotiabank Ahorros en julio para pagar deudas pendientes (TC OH! S/ 9,000+ y otros). Acordar plan de pago.', priority: 'Alta - Acordar plazos' },
      { creditor: 'Mamá Eva', amountPEN: 20000, note: 'Préstamo familiar sin cuota fija', priority: 'Media - Familiar' },
      { creditor: 'Jessica', amountPEN: 15000, note: 'Préstamo personal sin cuota fija', priority: 'Media - Negociar' }
    ],
    creditCards: [
      { card: 'TC Scotiabank Ángel', balancePEN: 1550, balanceUSD: 450, status: 'Normal' },
      { card: 'TC Scotiabank Michel', balancePEN: 2400, balanceUSD: 700, status: 'Normal' },
      { card: 'TC Interbank Ángel', balancePEN: 700, guaranteePEN: 655, status: 'Garantizada' },
      { card: 'TC BBVA Ángel', balancePEN: 550, guaranteePEN: 550, status: 'Garantizada' },
      { card: 'TC OH!', balancePEN: 0, note: 'Pagada en julio con el préstamo familiar (más de S/ 9,000)', status: 'Pagada en Julio' },
      { card: 'Reporte SBS (Cierre Junio)', balancePEN: 9727, note: 'InFinance + Scotiabank', status: 'Normal' }
    ],
    weeklyCommitments: [
      { name: 'Junta con Sandra', weeklyFeePEN: 500, paidQuotas: 12, totalQuotas: 20, remainingQuotas: 8, range: '30/08 → 18/10/2026', pendingBalancePEN: 4000, status: 'Activo' },
      { name: 'Comida Sandra', weeklyFeePEN: 250, status: 'Detenido (S/ 0 desde mediados de agosto)' },
      { name: 'Colaboración Marcos', weeklyFeePEN: 300, status: 'Detenido (S/ 0 desde mediados de agosto)' }
    ],
    assetsAndGuarantees: [
      { concept: 'Plazo Fijo Scotiabank', amountPEN: 1000, type: 'Inversión' },
      { concept: 'Plazo Fijo BCP', amountPEN: 1500, type: 'Inversión' },
      { concept: 'Plazo Fijo BBVA', amountPEN: 1500, type: 'Inversión' },
      { concept: 'Garantía TC Interbank', amountPEN: 655, type: 'Garantía' },
      { concept: 'Garantía TC BBVA', amountPEN: 550, type: 'Garantía' }
    ],
    strategySteps: [
      { step: 1, title: '1. Superar el Embudo de Septiembre 2026', desc: 'Resguardar S/ 8,971 PEN del flujo de Combo IA Pack para cubrir las 4 cuotas formales (días 2, 11, 19) y las juntas semanales.' },
      { step: 2, title: '2. Liquidar Tarjetas de Crédito de Interés Alto', desc: 'Eliminar el saldo de TC Scotiabank Ángel (~S/ 1,550) y TC Scotiabank Michel (~S/ 2,400) para detener el cobro de intereses financieros.' },
      { step: 3, title: '3. Liberación de Santander Arly (Enero 2027)', desc: 'Al terminar en enero 2027, se liberarán S/ 2,722/mes de flujo de caja que se redestinarán directamente a amortizar la deuda de Sandra y Mamá Eva.' },
      { step: 4, title: '4. Renegociación de Cuotas Informales', desc: 'Pautar cuotas mensuales alcanzables para Sandra (S/ 60k-80k) y Jessica con el excedente de ganancias del Combo IA Pack.' }
    ]
  };
})();
