(function () {
  'use strict';

  window.EXPENSES_DATA = {
    period: 'Julio 2026',
    summary: {
      totalSalesUSD: 4058.00,
      totalBusinessUSD: 1613.66,
      totalPersonalPEN: 2081.21,
      totalPersonalUSD: 554.99,
      netMarginUSD: 2444.34,
      netMarginPct: 60.2,
      roas: 3.62,
      wardaSavingsPEN: 4301.03,
      potentialMonthlySavingsUSD: 155.00
    },
    items: [
      // META ADS
      { source: 'Scotiabank Visa Oro', date: '2026-07-06', desc: 'FACEBK *54ZMZVRUK2 FACEBOOK.COM', cat: 'Marketing & Ads', type: 'Negocio', usd: 12.57, pen: 47.14, status: 'Mantener' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-07', desc: 'FACEBK *CEHQEVHJ52 fb.me/ads', cat: 'Marketing & Ads', type: 'Negocio', usd: 111.00, pen: 416.25, status: 'Mantener' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-08', desc: 'FACEBK *TSEZNVDJ52 fb.me/ads', cat: 'Marketing & Ads', type: 'Negocio', usd: 29.00, pen: 108.75, status: 'Mantener' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-08', desc: 'FACEBK *B2UHPVDJ52 fb.me/ads', cat: 'Marketing & Ads', type: 'Negocio', usd: 29.00, pen: 108.75, status: 'Mantener' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-08', desc: 'FACEBK *YYDVEURH52 fb.me/ads', cat: 'Marketing & Ads', type: 'Negocio', usd: 34.00, pen: 127.50, status: 'Mantener' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-09', desc: 'FACEBK *HN53QTMH52 fb.me/ads', cat: 'Marketing & Ads', type: 'Negocio', usd: 32.00, pen: 120.00, status: 'Mantener' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-09', desc: 'FACEBK *9J6AVTVH52 fb.me/ads', cat: 'Marketing & Ads', type: 'Negocio', usd: 103.00, pen: 386.25, status: 'Mantener' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-10', desc: 'FACEBK *YHXNTTZH52 FACEBOOK.COM', cat: 'Marketing & Ads', type: 'Negocio', usd: 96.05, pen: 360.19, status: 'Mantener' },

      { source: 'Binance Card', date: '2026-07-03', desc: 'FACEBK *047VZT1VQ2', cat: 'Marketing & Ads', type: 'Negocio', usd: 203.00, pen: 761.25, status: 'Mantener' },
      { source: 'Binance Card', date: '2026-07-02', desc: 'FACEBK *LBZUAUMN52', cat: 'Marketing & Ads', type: 'Negocio', usd: 24.06, pen: 90.23, status: 'Mantener' },
      { source: 'Binance Card', date: '2026-07-25', desc: 'FACEBK *G4UBJW5J52', cat: 'Marketing & Ads', type: 'Negocio', usd: 44.09, pen: 165.34, status: 'Mantener' },
      { source: 'Binance Card', date: '2026-07-20', desc: 'FACEBK *V9ANMVRI52', cat: 'Marketing & Ads', type: 'Negocio', usd: 19.20, pen: 72.00, status: 'Mantener' },
      { source: 'Binance Card', date: '2026-07-20', desc: 'FACEBK *6KB9WUZH52', cat: 'Marketing & Ads', type: 'Negocio', usd: 51.82, pen: 194.33, status: 'Mantener' },
      { source: 'Binance Card', date: '2026-07-17', desc: 'FACEBK *KDTA7XMGH2', cat: 'Marketing & Ads', type: 'Negocio', usd: 29.92, pen: 112.20, status: 'Mantener' },
      { source: 'Binance Card', date: '2026-07-16', desc: 'FACEBK *EN4UCWHJ52', cat: 'Marketing & Ads', type: 'Negocio', usd: 29.47, pen: 110.51, status: 'Mantener' },
      { source: 'Binance Card', date: '2026-07-04', desc: 'FACEBK *SVR7YUZQC2', cat: 'Marketing & Ads', type: 'Negocio', usd: 205.16, pen: 769.35, status: 'Mantener' },

      // INTELIGENCIA ARTIFICIAL
      { source: 'Scotiabank Visa Oro', date: '2026-07-24', desc: 'ANTHROPIC* CLAUDE SUB ANTHROPIC.COM', cat: 'Inteligencia Artificial', type: 'Negocio', usd: 23.60, pen: 88.50, status: 'Mantener' },
      { source: 'Binance Card', date: '2026-07-16', desc: 'ELEVENLABS.IO', cat: 'Inteligencia Artificial', type: 'Negocio', usd: 22.00, pen: 82.50, status: 'Mantener' },

      // INFRAESTRUCTURA & SAAS
      { source: 'Scotiabank Visa Oro', date: '2026-07-08', desc: 'PROXY-CHEAP.COM VILNIUS (Proxy 1)', cat: 'Infraestructura & SaaS', type: 'Negocio', usd: 31.17, pen: 116.89, status: 'Mantener' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-08', desc: 'PROXY-CHEAP.COM VILNIUS (Proxy 2)', cat: 'Infraestructura & SaaS', type: 'Negocio', usd: 36.32, pen: 136.20, status: 'Mantener' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-08', desc: 'PAYPAL *CONTABO (VPS Hosting)', cat: 'Infraestructura & SaaS', type: 'Negocio', usd: 9.90, pen: 37.13, status: 'Mantener' },
      { source: 'Binance Card', date: '2026-07-02', desc: 'PAYPAL *NAMECHEAP (Dominios)', cat: 'Infraestructura & SaaS', type: 'Negocio', usd: 33.12, pen: 124.20, status: 'Mantener' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-15', desc: 'STATCOUNTER.COM DUBLIN (Analytics)', cat: 'Infraestructura & SaaS', type: 'Negocio', usd: 16.53, pen: 61.99, status: 'Mantener' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-18', desc: 'MEDIAFIRE-CHARGE.COM (Cloud Drive)', cat: 'Infraestructura & SaaS', type: 'Negocio', usd: 6.99, pen: 26.21, status: 'Cancelar' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-01', desc: 'PAYPAL *PADDLE.NET / TYRRELSTOWN', cat: 'Infraestructura & SaaS', type: 'Negocio', usd: 76.00, pen: 285.00, status: 'Mantener' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-04', desc: 'PAYPAL *BUNNYWAY (CDN/Storage)', cat: 'Infraestructura & SaaS', type: 'Negocio', usd: 10.00, pen: 37.50, status: 'Mantener' },

      // SKOOL & INFOPRODUCTOS
      { source: 'Scotiabank Visa Oro', date: '2026-07-04', desc: 'P.SKOOL.COM/PLSJT (Comunidad Skool 2)', cat: 'EducaciÃ³n & Comunidades', type: 'Negocio', usd: 12.00, pen: 45.00, status: 'Optimizar' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-07', desc: 'P.SKOOL.COM/WLKXG (Comunidad Skool 3)', cat: 'EducaciÃ³n & Comunidades', type: 'Negocio', usd: 9.00, pen: 33.75, status: 'Optimizar' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-15', desc: 'P.SKOOL.COM/PMPRQ (Comunidad Skool 4)', cat: 'EducaciÃ³n & Comunidades', type: 'Negocio', usd: 3.00, pen: 11.25, status: 'Mantener' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-22', desc: 'P.SKOOL.COM/XHWTT (Comunidad Skool 5)', cat: 'EducaciÃ³n & Comunidades', type: 'Negocio', usd: 14.00, pen: 52.50, status: 'Optimizar' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-25', desc: 'SKOOL.COM WWW.SKOOL.COM (Skool 6)', cat: 'EducaciÃ³n & Comunidades', type: 'Negocio', usd: 9.00, pen: 33.75, status: 'Optimizar' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-01', desc: 'PAYPAL *HOTMART', cat: 'EducaciÃ³n & Comunidades', type: 'Negocio', usd: 5.00, pen: 18.75, status: 'Mantener' },

      // GOOGLE CLOUD & WORKSPACE
      { source: 'Scotiabank Visa Oro', date: '2026-07-01', desc: 'Google Workspace_natal', cat: 'Servicios Cloud & Email', type: 'Negocio', usd: 9.91, pen: 37.16, status: 'Optimizar' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-01', desc: 'Google Workspace_angel', cat: 'Servicios Cloud & Email', type: 'Negocio', usd: 16.80, pen: 63.00, status: 'Mantener' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-11', desc: 'Google One 650-2530000', cat: 'Servicios Cloud & Email', type: 'Negocio', usd: 22.41, pen: 84.04, status: 'Cancelar' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-24', desc: 'Google One 650-2530000', cat: 'Servicios Cloud & Email', type: 'Negocio', usd: 22.42, pen: 84.08, status: 'Cancelar' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-25', desc: 'Google CLOUD 2WKF5N', cat: 'Servicios Cloud & Email', type: 'Negocio', usd: 60.51, pen: 226.91, status: 'Cancelar' },
      { source: 'BCP Ahorros', date: '2026-07-01', desc: 'Google One (Debito BCP)', cat: 'Servicios Cloud & Email', type: 'Negocio', usd: 2.25, pen: 8.44, status: 'Cancelar' },

      // LOGISTICA EMPRESARIAL BCP
      { source: 'BCP Ahorros', date: '2026-07-03', desc: 'SHALOM EMPRESARIAL (EnvÃ­os 1)', cat: 'LogÃ­stica & Operaciones', type: 'Negocio', usd: 2.13, pen: 8.00, status: 'Mantener' },
      { source: 'BCP Ahorros', date: '2026-07-03', desc: 'SHALOM EMPRESARIAL (EnvÃ­os 2)', cat: 'LogÃ­stica & Operaciones', type: 'Negocio', usd: 2.13, pen: 8.00, status: 'Mantener' },
      { source: 'BCP Ahorros', date: '2026-07-03', desc: 'SHALOM EMPRESARIAL (EnvÃ­os 3)', cat: 'LogÃ­stica & Operaciones', type: 'Negocio', usd: 2.13, pen: 8.00, status: 'Mantener' },
      { source: 'BCP Ahorros', date: '2026-07-20', desc: 'SHALOM EMPRESARIAL (EnvÃ­os 4)', cat: 'LogÃ­stica & Operaciones', type: 'Negocio', usd: 2.67, pen: 10.00, status: 'Mantener' },

      // GASTOS PERSONALES
      { source: 'BCP Ahorros', date: '2026-07-02', desc: 'PedidosYa*Market + Propina', cat: 'AlimentaciÃ³n & Delivery', type: 'Personal', usd: 10.56, pen: 39.60, status: 'Optimizar' },
      { source: 'BCP Ahorros', date: '2026-07-03', desc: 'PedidosYa*Ohashi M', cat: 'AlimentaciÃ³n & Delivery', type: 'Personal', usd: 14.29, pen: 53.60, status: 'Optimizar' },
      { source: 'BCP Ahorros', date: '2026-07-11', desc: 'PedidosYa*La B Alt', cat: 'AlimentaciÃ³n & Delivery', type: 'Personal', usd: 5.41, pen: 20.30, status: 'Optimizar' },
      { source: 'BCP Ahorros', date: '2026-07-12', desc: 'PedidosYa*Chicken + Propina', cat: 'AlimentaciÃ³n & Delivery', type: 'Personal', usd: 19.17, pen: 71.90, status: 'Optimizar' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-04', desc: 'OPENPAY*POLLO LOCO CHICLAYO', cat: 'AlimentaciÃ³n & Delivery', type: 'Personal', usd: 6.67, pen: 25.00, status: 'Personal' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-07', desc: 'Grifo San Antonio - LO Jose Leonardo', cat: 'AlimentaciÃ³n & Delivery', type: 'Personal', usd: 2.67, pen: 10.00, status: 'Personal' },
      { source: 'Binance Card', date: '2026-07-05', desc: 'PAYPAL *SUNFLOWERTE', cat: 'AlimentaciÃ³n & Delivery', type: 'Personal', usd: 22.09, pen: 82.84, status: 'Personal' },

      { source: 'BCP Ahorros', date: '2026-07-27', desc: 'TICKETMASTER BCP (Conciertos/Eventos)', cat: 'Entretenimiento & Ocio', type: 'Personal', usd: 66.13, pen: 248.00, status: 'Personal' },
      { source: 'BCP Ahorros', date: '2026-07-19', desc: 'PTP*BETANO (Apuestas)', cat: 'Entretenimiento & Ocio', type: 'Personal', usd: 13.33, pen: 50.00, status: 'Cancelar' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-18', desc: 'PYU*CINEMARK LIMA (Cine 1)', cat: 'Entretenimiento & Ocio', type: 'Personal', usd: 11.25, pen: 42.20, status: 'Personal' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-18', desc: 'PYU*CINEMARK LIMA (Cine 2)', cat: 'Entretenimiento & Ocio', type: 'Personal', usd: 7.97, pen: 29.90, status: 'Personal' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-25', desc: 'EBN*NETFLIX LIMA PE', cat: 'Entretenimiento & Ocio', type: 'Personal', usd: 14.11, pen: 52.90, status: 'Mantener' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-14', desc: 'Google YouTube Member', cat: 'Entretenimiento & Ocio', type: 'Personal', usd: 1.21, pen: 4.54, status: 'Mantener' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-24', desc: 'Google YouTubePremium', cat: 'Entretenimiento & Ocio', type: 'Personal', usd: 16.35, pen: 61.31, status: 'Optimizar' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-16', desc: 'APPLE.COM/BILL (Apple Billing 2)', cat: 'Entretenimiento & Ocio', type: 'Personal', usd: 18.20, pen: 68.25, status: 'Optimizar' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-17', desc: 'APPLE.COM/BILL (Apple Billing 3)', cat: 'Entretenimiento & Ocio', type: 'Personal', usd: 9.87, pen: 37.01, status: 'Optimizar' },

      { source: 'Binance Card', date: '2026-07-28', desc: 'PAYPAL *ULTRAFLI', cat: 'Compras & Retail', type: 'Personal', usd: 56.87, pen: 213.26, status: 'Personal' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-20', desc: 'z2u HONG KONG HK', cat: 'Compras & Retail', type: 'Personal', usd: 5.03, pen: 18.86, status: 'Personal' },

      { source: 'Binance Card', date: '2026-07-02', desc: 'JetSMART Airlines (Vuelos)', cat: 'Transporte & Viajes', type: 'Personal', usd: 119.98, pen: 449.93, status: 'Personal' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-04', desc: 'MORPHO TRAVEL PERU SAC CALLAO', cat: 'Transporte & Viajes', type: 'Personal', usd: 2.88, pen: 10.80, status: 'Personal' },

      { source: 'Binance Card', date: '2026-07-16', desc: 'LASTPASS.COM (Gestor ContraseÃ±as)', cat: 'Seguridad & Utilidades', type: 'Personal', usd: 36.00, pen: 135.00, status: 'Optimizar' },
      { source: 'Scotiabank Visa Oro', date: '2026-07-20', desc: 'CHORRICLUB SANTIAGO DE C ES', cat: 'Seguridad & Utilidades', type: 'Personal', usd: 1.10, pen: 4.13, status: 'Personal' }
    ]
  };
})();
