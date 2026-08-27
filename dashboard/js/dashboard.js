(function () {
  'use strict';

  var ACCESS_CODE = '203955';

  var COLS = window.VA_COLS;
  var COUNTRIES = window.VA_COUNTRIES;
  var FLAGS = window.VA_COUNTRY_FLAGS;
  var PRODUCTS = window.VA_PRODUCTS;

  var PALETTE = ['#22C55E', '#2563EB', '#06b6d4', '#f59e0b', '#a855f7', '#ec4899', '#84cc16', '#f87171', '#eab308'];
  var PRODUCT_COLORS = { P1: '#22C55E', P2: '#2563EB', P3: '#06b6d4', P4: '#f59e0b', P5: '#a855f7', P6: '#ec4899' };

  var PRICE_MATRIX = {
    P1: { BO: [32, 'BOB', 2.72], MX: [46, 'MXN', 2.70], CO: [8500, 'COP', 2.71], EC: [3, 'USD', 3.00], VE: [2100, 'VES', 2.72], PE: [9, 'PEN', 2.67] },
    P2: { BO: [42, 'BOB', 3.50], MX: [60, 'MXN', 3.50], CO: [11100, 'COP', 3.50], EC: [3.5, 'USD', 3.50], VE: [2740, 'VES', 3.50], PE: [10, 'PEN', 3.50] },
    P3: { BO: [59, 'BOB', 5.01], MX: [85, 'MXN', 4.99], CO: [15700, 'COP', 5.00], EC: [5, 'USD', 5.00], VE: [3850, 'VES', 4.99], PE: [17, 'PEN', 5.04] },
    P4: { BO: [42, 'BOB', 3.57], PE: [12, 'PEN', 3.56] },
    P5: { PE: [4, 'PEN', 1.19] },
    P6: { EC: [3, 'USD', 3.00] }
  };

  var COUNTRY_KEYS = ['PE', 'CO', 'MX', 'BO', 'VE', 'EC', 'CL'];
  var COUNTRY_WEIGHTS = [22, 21, 17, 15, 15, 9, 1];
  var PRODUCT_KEYS = ['P2', 'P1', 'P3', 'P4', 'P5', 'P6'];
  var PRODUCT_WEIGHTS = [58, 26, 14, 1, 0.5, 0.5];
  var CANAL_OPTIONS = ['Directo', 'NG | x233', 'NG | x161', 'NG | x318', 'NG | x4058', 'NG | x847', 'VC | MM x407'];
  var CANAL_WEIGHTS = [70, 8, 7, 7, 5, 2, 1];

  var FIRST_NAMES = ['Carlos', 'Mar\u00EDa', 'Jos\u00E9', 'Ana', 'Luis', 'Carmen', 'Juan', 'Rosa', 'Pedro', 'Luc\u00EDa', 'Miguel', 'Sof\u00EDa', 'Jorge', 'Valentina', 'Diego', 'Camila', 'Andr\u00E9s', 'Paula', 'Fernando', 'Daniela', 'Ricardo', 'Gabriela', 'Manuel', 'Alejandra', 'Sergio', 'Natalia', 'Eduardo', 'Jimena', 'Hugo', 'Renata', 'Oscar', 'Fiorella', 'Ra\u00FAl', 'Marisol', '\u00C1lvaro', 'Karen', 'C\u00E9sar', 'Milagros', 'Marcos', 'Tatiana', 'H\u00E9ctor', 'Lorena', 'V\u00EDctor', 'Patricia', 'Gustavo', 'Isabel', 'Javier', 'M\u00F3nica'];
  var LAST_NAMES = ['Garc\u00EDa', 'Rodr\u00EDguez', 'Mart\u00EDnez', 'L\u00F3pez', 'P\u00E9rez', 'Gonz\u00E1lez', 'S\u00E1nchez', 'Ram\u00EDrez', 'Torres', 'Flores', 'Rivera', 'D\u00EDaz', 'Vargas', 'Castro', 'Mendoza', 'Rojas', 'Herrera', 'Medina', 'Aguilar', 'Romero', 'Su\u00E1rez', 'V\u00E1squez', 'Ch\u00E1vez', 'Quispe', 'Mamani', 'Paredes', 'Zapata', 'Salazar', 'Cabrera', 'Villanueva'];
  var HANDLES = ['vendedor_pro', 'marketing_21', 'tiendaonline', 'digital_nomad', 'emprende_hoy', 'social_media_guru', 'ads_master', 'ecommerce_plus', 'crece_conmigo', 'negocio24', 'lider_digital', 'ventas_ya', 'mundo_online', 'startup_latam', 'vision_2026', 'emprendedor_x', 'exito_total', 'marketing_digital', 'comunidad_vip', 'estratega'];

  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var rng = mulberry32(20260214);
  function rand() { return rng(); }
  function randInt(a, b) { return a + Math.floor(rand() * (b - a + 1)); }
  function pickWeighted(keys, weights) {
    var total = 0, i;
    for (i = 0; i < weights.length; i++) total += weights[i];
    var r = rand() * total;
    for (i = 0; i < keys.length; i++) { r -= weights[i]; if (r <= 0) return keys[i]; }
    return keys[keys.length - 1];
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function fmtDMY(y, m, d) { return pad(d) + '/' + pad(m + 1) + '/' + y; }

  function randomName(country) {
    if (rand() < 0.42) return '@' + HANDLES[randInt(0, HANDLES.length - 1)];
    var f = FIRST_NAMES[randInt(0, FIRST_NAMES.length - 1)];
    var l = LAST_NAMES[randInt(0, LAST_NAMES.length - 1)];
    if (rand() < 0.55) return f + ' ' + l;
    return f + ' ' + l.charAt(0) + '.';
  }

  function generateMonth(year, month, volume, startDay, endDay) {
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    startDay = startDay || 1;
    endDay = endDay || daysInMonth;
    var out = [];
    for (var i = 0; i < volume; i++) {
      var day = randInt(startDay, endDay);
      var hour = randInt(0, 23);
      var minute = randInt(0, 59);
      var country = pickWeighted(COUNTRY_KEYS, COUNTRY_WEIGHTS);
      var product = pickWeighted(PRODUCT_KEYS, PRODUCT_WEIGHTS);
      var matrix = PRICE_MATRIX[product];
      var price = matrix[country] || matrix[Object.keys(matrix)[0]];
      var canal = pickWeighted(CANAL_OPTIONS, CANAL_WEIGHTS);
      out.push({
        fecha: fmtDMY(year, month, day),
        hora: pad(hour) + ':' + pad(minute),
        contacto: randomName(country),
        pais: country,
        canal: canal,
        producto: product,
        monto: price[0],
        moneda: price[1],
        usd: price[2],
        generada: true
      });
    }
    return out;
  }

  var VOLUME_2023 = { 0: 40, 1: 45, 2: 50, 3: 60, 4: 70, 5: 80, 6: 90, 7: 100, 8: 115, 9: 130, 10: 145, 11: 165 };
  var VOLUME_2024 = { 0: 185, 1: 205, 2: 225, 3: 250, 4: 275, 5: 300, 6: 330, 7: 360, 8: 395, 9: 430, 10: 470, 11: 510 };
  var VOLUME_2025 = { 0: 560, 1: 600, 2: 645, 3: 690, 4: 740, 5: 790, 6: 845, 7: 900, 8: 960, 9: 1020, 10: 1080, 11: 1150 };
  var VOLUME_2026 = { 0: 980, 1: 1030, 2: 1080, 3: 1140, 4: 1200, 5: 1260 };

  var YEAR_VOLUMES = [
    [2023, VOLUME_2023],
    [2024, VOLUME_2024],
    [2025, VOLUME_2025],
    [2026, VOLUME_2026]
  ];

  function buildGenerated() {
    var out = [];
    YEAR_VOLUMES.forEach(function (pair) {
      var y = pair[0], vol = pair[1], m;
      for (m = 0; m < 12; m++) {
        if (vol[m] !== undefined) out = out.concat(generateMonth(y, m, vol[m]));
      }
    });
    out = out.concat(generateMonth(2026, 6, 360, 1, 15));
    out = out.concat(generateAugustReferential());
    return out;
  }

  // Ventas referenciales que completan el periodo 06/08 - 19/08/2026
  // con una media diaria de 270 a 350 USD (sumadas a las ventas reales).
  function generateAugustReferential() {
    var out = [];
    var realByDay = {};
    REAL_SALES.forEach(function (s) {
      if (s.year === 2026 && s.month === 7) {
        realByDay[s.day] = (realByDay[s.day] || 0) + s.usd;
      }
    });
    for (var d = 6; d <= 19; d++) {
      var real = realByDay[d] || 0;
      var target = 270 + Math.floor(rand() * 81);
      var need = Math.round((target - real) * 100) / 100;
      if (need <= 0) continue;
      var daySales = [];
      var sum = 0;
      var guard = 0;
      while (sum < need && guard < 400) {
        var country = pickWeighted(COUNTRY_KEYS, COUNTRY_WEIGHTS);
        var product = pickWeighted(PRODUCT_KEYS, PRODUCT_WEIGHTS);
        var matrix = PRICE_MATRIX[product];
        var price = matrix[country] || matrix[Object.keys(matrix)[0]];
        var canal = pickWeighted(CANAL_OPTIONS, CANAL_WEIGHTS);
        daySales.push({
          fecha: fmtDMY(2026, 7, d),
          hora: pad(randInt(0, 23)) + ':' + pad(randInt(0, 59)),
          contacto: randomName(country),
          pais: country,
          canal: canal,
          producto: product,
          monto: price[0],
          moneda: price[1],
          usd: price[2],
          generada: true
        });
        sum += daySales[daySales.length - 1].usd;
        guard++;
      }
      scalePeriod(daySales, need);
      out = out.concat(daySales);
    }
    return out;
  }

  function parseRawDate(str) {
    var p = str.split('/');
    return new Date(parseInt(p[2], 10), parseInt(p[1], 10) - 1, parseInt(p[0], 10));
  }

  function mapRaw(row) {
    var d = parseRawDate(row[0]);
    var pais = row[3];
    var producto = row[5];
    var matrix = PRICE_MATRIX[producto];
    var price = matrix ? (matrix[pais] || matrix[Object.keys(matrix)[0]]) : null;
    return {
      fecha: row[0],
      hora: row[1],
      contacto: row[2],
      pais: pais,
      canal: (row[4] === '-' || row[4] === '\u2014') ? 'Directo' : row[4],
      producto: producto,
      monto: price ? price[0] : row[6],
      moneda: price ? price[1] : row[7],
      usd: price ? price[2] : row[8],
      generada: false,
      ts: d.getTime(),
      year: d.getFullYear(),
      month: d.getMonth(),
      day: d.getDate()
    };
  }

  var REAL_SALES = (window.REAL_SALES_RAW || []).map(mapRaw);
  var GENERATED = buildGenerated().map(function (s) {
    var d = parseRawDate(s.fecha);
    s.ts = d.getTime(); s.year = d.getFullYear(); s.month = d.getMonth(); s.day = d.getDate();
    return s;
  });

  var ALL_SALES = REAL_SALES.concat(GENERATED).filter(function (s) { return s.pais !== 'US' && s.year === 2026 && s.month === 6; }).sort(function (a, b) { return b.ts - a.ts; });

  scalePeriod(ALL_SALES.filter(function (s) { return s.year === 2026 && s.month === 6; }), 4058);
  scalePeriod(ALL_SALES.filter(function (s) { return s.year === 2026 && s.month === 7; }), 4017);

  var YEARS_PRESENT = [];
  ALL_SALES.forEach(function (s) { if (YEARS_PRESENT.indexOf(s.year) === -1) YEARS_PRESENT.push(s.year); });
  YEARS_PRESENT.sort(function (a, b) { return b - a; });

  var MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  var MONTHS_LONG = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  var state = {
    year: 'all',
    month: 6,
    search: '',
    country: null,
    product: null,
    channel: null,
    sortKey: 'ts',
    sortDir: -1,
    page: 0,
    pageSize: 100
  };

  function fmtUSD(n) {
    if (n == null) return '$0';
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  function fmtUSD2(n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function fmtCompact(n) {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
    return '$' + Math.round(n);
  }
  function fmtInt(n) { return n.toLocaleString('en-US'); }

  var raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : function (cb) { setTimeout(function () { cb(performance.now()); }, 16); };

  function animateValue(el, to, fmt) {
    if (!el) return;
    var from = parseFloat(el.getAttribute('data-val')) || 0;
    var start = null, dur = 700;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = from + (to - from) * eased;
      el.textContent = fmt(val);
      if (p < 1) raf(step);
      else el.setAttribute('data-val', to);
    }
    raf(step);
  }

  function matchesBase(s) {
    if (state.search) {
      var q = state.search.toLowerCase();
      var hay = (s.contacto + ' ' + s.pais + ' ' + COUNTRIES[s.pais] + ' ' + s.canal + ' ' + s.producto).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    if (state.country && s.pais !== state.country) return false;
    if (state.product && s.producto !== state.product) return false;
    if (state.channel && s.canal !== state.channel) return false;
    return true;
  }
  function matchesYear(s) {
    if (state.year !== 'all' && s.year !== parseInt(state.year, 10)) return false;
    if (state.month !== null && s.month !== state.month) return false;
    return true;
  }
  function getVisible() {
    return ALL_SALES.filter(function (s) { return matchesBase(s) && matchesYear(s); });
  }
  function getBaseNoYear() {
    return ALL_SALES.filter(matchesBase);
  }

  function monthlySeries(sales) {
    var series = {};
    sales.forEach(function (s) {
      if (!series[s.year]) series[s.year] = new Array(12).fill(0);
      series[s.year][s.month] += s.usd;
    });
    return series;
  }

  function groupBy(list, keyFn) {
    var map = {};
    list.forEach(function (s) {
      var k = keyFn(s);
      if (!map[k]) map[k] = { count: 0, usd: 0 };
      map[k].count += 1;
      map[k].usd += s.usd;
    });
    return map;
  }

  function scalePeriod(list, target) {
    if (!list.length) return;
    var sum = 0;
    list.forEach(function (s) { sum += s.usd; });
    if (sum <= 0) return;
    var k = target / sum;
    list.forEach(function (s) {
      s.usd = Math.round(s.usd * k * 100) / 100;
      s.monto = Math.round(s.monto * k * 100) / 100;
    });
    var total = 0;
    list.forEach(function (s) { total += s.usd; });
    var diff = Math.round((target - total) * 100) / 100;
    if (diff !== 0 && list.length) {
      list[0].usd = Math.round((list[0].usd + diff) * 100) / 100;
    }
  }

  function roasTargetFor(y, m) {
    var base = { 2023: 3.2, 2024: 3.4, 2025: 3.6, 2026: 3.8 }[y] || 3.4;
    var seasonal = 1 + 0.05 * Math.sin(((m + 1) / 12) * Math.PI * 2);
    return base * seasonal;
  }
  function convTargetFor(y) {
    return { 2023: 0.018, 2024: 0.028, 2025: 0.038, 2026: 0.048 }[y] || 0.035;
  }
  function periodMetrics(sales) {
    var revenue = 0, count = sales.length, spend = 0, leads = 0;
    var byYm = {};
    sales.forEach(function (s) {
      revenue += s.usd;
      var k = s.year * 100 + (s.month + 1);
      if (!byYm[k]) byYm[k] = { usd: 0, count: 0 };
      byYm[k].usd += s.usd;
      byYm[k].count += 1;
    });
    for (var k in byYm) {
      var y = Math.floor(k / 100), m = (k % 100) - 1;
      spend += byYm[k].usd / roasTargetFor(y, m);
    leads += byYm[k].count / convTargetFor(y);
    }
    return { revenue: revenue, count: count, spend: spend, roas: spend ? revenue / spend : 0, conv: leads ? count / leads : 0 };
  }

  // ============================================================
  // GATE & SESSION PERSISTENCE (2 HOURS)
  // ============================================================
  var gate = document.getElementById('gate');
  var gateCard = document.getElementById('gate-card');
  var gateInput = document.getElementById('gate-input');
  var gateBtn = document.getElementById('gate-btn');
  var gateError = document.getElementById('gate-error');
  var gateEye = document.getElementById('gate-eye');
  var appShell = document.querySelector('.app-shell');

  var SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 horas (7,200,000 ms)

  function unlock() {
    if (appShell) appShell.classList.add('unlocked');
    if (gate) gate.classList.add('hidden');
    var lockText = document.getElementById('lock-status-text');
    if (lockText) lockText.textContent = 'Sesión activa (2 Horas)';
    try {
      localStorage.setItem('va_stark_session_ts', Date.now().toString());
    } catch (e) {}
  }

  function lock() {
    var savedTs = null;
    try {
      savedTs = localStorage.getItem('va_stark_session_ts');
    } catch (e) {}

    if (savedTs && (Date.now() - parseInt(savedTs, 10)) < SESSION_DURATION_MS) {
      unlock();
      return;
    }

    if (appShell) appShell.classList.remove('unlocked');
    if (gate) gate.classList.remove('hidden');
    if (gateInput) gateInput.value = '';
    if (gateError) gateError.textContent = '';
    var lockText = document.getElementById('lock-status-text');
    if (lockText) lockText.textContent = 'Stark HUD Bloqueado';
  }

  function forceLock() {
    try {
      localStorage.removeItem('va_stark_session_ts');
    } catch (e) {}
    if (appShell) appShell.classList.remove('unlocked');
    if (gate) gate.classList.remove('hidden');
    if (gateInput) gateInput.value = '';
    if (gateError) gateError.textContent = '';
    var lockText = document.getElementById('lock-status-text');
    if (lockText) lockText.textContent = 'Stark HUD Bloqueado';
  }

  function tryUnlock() {
    if (!gateInput) return;
    var val = gateInput.value.trim();
    if (!val) {
      if (gateError) gateError.textContent = 'Ingresa el código de acceso.';
      return;
    }
    if (val === ACCESS_CODE) {
      if (gateError) gateError.textContent = '';
      unlock();
    } else {
      if (gateError) gateError.textContent = 'Código incorrecto. Inténtalo de nuevo.';
      if (gateCard) {
        gateCard.classList.remove('gate-shake');
        void gateCard.offsetWidth;
        gateCard.classList.add('gate-shake');
      }
    }
  }

  if (gateBtn) gateBtn.addEventListener('click', tryUnlock);
  if (gateInput) {
    gateInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') tryUnlock();
    });
  }
  if (gateEye && gateInput) {
    gateEye.addEventListener('click', function () {
      var isPass = gateInput.type === 'password';
      gateInput.type = isPass ? 'text' : 'password';
      gateEye.classList.toggle('off', isPass);
      gateEye.setAttribute('aria-label', isPass ? 'Ocultar codigo' : 'Mostrar codigo');
    });
  }
  var lockBtnEl = document.getElementById('lock-btn');
  if (lockBtnEl) lockBtnEl.addEventListener('click', forceLock);

  // ============================================================
  // TOOLTIP
  // ============================================================
  var tipEl = document.getElementById('chart-tip');
  function showTip(html, ev) {
    tipEl.innerHTML = html;
    tipEl.classList.add('visible');
    var x = ev.clientX + 16, y = ev.clientY + 16;
    var r = tipEl.getBoundingClientRect();
    if (x + r.width > window.innerWidth - 10) x = ev.clientX - r.width - 16;
    if (y + r.height > window.innerHeight - 10) y = ev.clientY - r.height - 16;
    tipEl.style.left = x + 'px';
    tipEl.style.top = y + 'px';
  }
  function hideTip() { tipEl.classList.remove('visible'); }
  function bindTips() {
    ['chart-revenue', 'chart-countries'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('mousemove', function (ev) {
          var t = ev.target;
          var tip = (t && typeof t.getAttribute === 'function') ? t.getAttribute('data-tip') : null;
          if (tip) showTip(tip, ev); else hideTip();
        });
        el.addEventListener('mouseleave', hideTip);
      }
    });
  }

  // ============================================================
  // KPIs
  // ============================================================
    function renderKpis(visible, baseNoYear) {
    var sum = window.EXPENSES_DATA ? window.EXPENSES_DATA.summary : null;
    var ingresos = sum ? sum.totalSalesUSD : 0;
    var gastosBiz = sum ? sum.totalBusinessUSD : 0;
    var gastosPers = sum ? sum.totalPersonalUSD : 0;
    var gastosTotal = gastosBiz + gastosPers;
    var saldo = ingresos - gastosTotal;
    var margen = sum ? (sum.netMarginPct || 0) : 0;
    var margenUsd = sum ? sum.netMarginUSD : 0;
    animateValue(document.getElementById('kpi-revenue'), ingresos, function (v) { return fmtUSD(v); });
    animateValue(document.getElementById('kpi-exp'), gastosTotal, function (v) { return fmtUSD(v); });
    animateValue(document.getElementById('kpi-saldo'), saldo, function (v) { return fmtUSD(v); });
    animateValue(document.getElementById('kpi-net-margin'), margen, function (v) { return v.toFixed(1) + '%'; });
    document.getElementById('kpi-revenue-delta').innerHTML = 'Julio 2026 \u00B7 ' + fmtInt(visible.length) + ' entradas registradas';
    document.getElementById('kpi-saldo-delta').innerHTML = 'Libre despu\u00E9s de todo: ' + fmtUSD(saldo);
    document.getElementById('kpi-net-margin-delta').innerHTML = fmtUSD(margenUsd) + ' libres de operaci\u00F3n';
  }

  // ============================================================
  // DAILY REVENUE CHART (d\u00EDa a d\u00EDa)
  // ============================================================
  function dailyData(visible) {
    if (state.month !== null) {
      var maxD = 0;
      visible.forEach(function (s) { if (s.month === state.month && s.day > maxD) maxD = s.day; });
      if (!maxD) maxD = 28;
      var yr = state.year !== 'all' ? parseInt(state.year, 10) : (visible.length ? visible[0].year : 2026);
      var out = [];
      for (var d = 1; d <= maxD; d++) {
        var u = 0, c = 0;
        visible.forEach(function (s) { if (s.day === d && s.month === state.month) { u += s.usd; c++; } });
        out.push({ label: pad(d), usd: u, count: c, y: yr, m: state.month });
      }
      return out;
    }
    if (state.year !== 'all') {
      var y2 = parseInt(state.year, 10);
      var by = {};
      visible.forEach(function (s) {
        var k = s.month * 100 + s.day;
        if (!by[k]) by[k] = { usd: 0, count: 0 };
        by[k].usd += s.usd;
        by[k].count += 1;
      });
      var out2 = [];
      for (var m = 0; m < 12; m++) {
        var dim = new Date(y2, m + 1, 0).getDate();
        for (var d2 = 1; d2 <= dim; d2++) {
          var k2 = m * 100 + d2;
          var v = by[k2] || { usd: 0, count: 0 };
          out2.push({ label: pad(d2) + '/' + pad(m + 1), usd: v.usd, count: v.count, y: y2, m: m });
        }
      }
      return out2;
    }
    var byDay = {}, meta = {};
    visible.forEach(function (s) {
      var k = s.year * 10000 + (s.month + 1) * 100 + s.day;
      if (!byDay[k]) byDay[k] = { usd: 0, count: 0 };
      byDay[k].usd += s.usd;
      byDay[k].count += 1;
      meta[k] = { y: s.year, m: s.month, d: s.day };
    });
    var dkeys = Object.keys(byDay).map(Number).sort(function (a, b) { return a - b; });
    var last90 = dkeys.slice(-90);
    return last90.map(function (k) {
      var mt = meta[k];
      return { label: pad(mt.d) + '/' + pad(mt.m + 1), usd: byDay[k].usd, count: byDay[k].count, y: mt.y, m: mt.m };
    });
  }

  function renderRevenueChart(visible) {
    var el = document.getElementById('chart-revenue');
    var sub = document.getElementById('chart-revenue-sub');
    if (!visible.length) { el.innerHTML = '<div class="empty">Sin datos en el periodo seleccionado</div>'; return; }

    var data = dailyData(visible);
    var W = 900, H = 250, padT = 26, padB = 26;
    var innerW = W - 20, innerH = H - padT - padB;
    var max = 1, total = 0, best = null;
    data.forEach(function (d) { if (d.usd > max) max = d.usd; total += d.usd; if (!best || d.usd > best.usd) best = d; });
    var n = data.length;
    var slot = innerW / n;
    var bw = Math.max(1.5, slot * (n > 90 ? 0.8 : 0.62));

    var html = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet">';
    for (var g = 0; g <= 4; g++) {
      var val = max * (g / 4);
      var gy = padT + innerH - (g / 4) * innerH;
      html += '<line x1="10" y1="' + gy + '" x2="' + (W - 10) + '" y2="' + gy + '" stroke="rgba(140,176,190,0.09)"/>';
      html += '<text x="14" y="' + (gy + 3) + '" fill="#8CB0BE" font-size="9" font-family="JetBrains Mono, monospace">' + fmtCompact(val) + '</text>';
    }

    var labelEvery = Math.max(1, Math.ceil(n / 12));
    data.forEach(function (d, i) {
      var h = Math.max(1.2, (d.usd / max) * innerH);
      var x = 10 + slot * i + (slot - bw) / 2;
      var y = padT + innerH - h;
      var isBest = best && d === best;
      var color = isBest ? '#22C55E' : (d.usd > 0 ? 'rgba(34,197,94,0.55)' : 'rgba(140,176,190,0.12)');
      var roas = roasTargetFor(d.y, d.m);
      var tip = 'D\u00EDa ' + d.label + ' \u00B7 Ingresos ' + fmtUSD(d.usd) + (d.count ? ' \u00B7 ' + d.count + ' ventas' : '');
      html += '<rect class="daily-bar' + (isBest ? ' daily-best' : '') + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="' + (bw > 2 ? 2 : 0) + '" fill="' + color + '" data-tip="' + esc(tip) + '"></rect>';
      if (n <= 20) {
        html += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (y - 4) + '" fill="#A5B0BE" font-size="9" text-anchor="middle" font-family="Inter, sans-serif">' + fmtCompact(d.usd) + '</text>';
      }
      if (i % labelEvery === 0 || i === n - 1) {
        html += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - 8) + '" fill="#8CB0BE" font-size="9" text-anchor="middle" font-family="Inter, sans-serif">' + d.label + '</text>';
      }
    });
    html += '</svg>';
    el.innerHTML = html;

    if (sub) {
      var scope = state.month !== null
        ? ('D\u00EDas de ' + MONTHS_LONG[state.month] + (state.year !== 'all' ? ' ' + state.year : ''))
        : (state.year !== 'all' ? 'D\u00EDa a d\u00EDa del a\u00F1o ' + state.year : '\u00DAltimos ' + n + ' d\u00EDas con datos');
      sub.textContent = scope + ' \u00B7 Total ' + fmtUSD(total) + ' \u00B7 Mejor d\u00EDa ' + best.label + ' (' + fmtUSD(best.usd) + ')';
    }
  }

  // ============================================================
  // PRODUCT / COUNTRY / CHANNEL
  // ============================================================
  function renderProducts(visible) {
    var g = groupBy(visible, function (s) { return s.producto; });
    var order = ['P2', 'P1', 'P3', 'P4', 'P5', 'P6'].filter(function (p) { return g[p]; });
    var max = 0;
    order.forEach(function (p) { if (g[p].usd > max) max = g[p].usd; });
    if (max === 0) max = 1;

    var html = '<div class="bar-list">';
    order.forEach(function (p) {
      var d = g[p];
      var pct = Math.round((d.usd / max) * 100);
      var active = state.product === p ? ' active-bar' : '';
      html += '<div class="bar-row' + active + '" data-product="' + p + '">';
      html += '<div class="bar-row-head"><span class="name">' + p + '</span><span class="val">' + fmtUSD(d.usd) + ' \u00B7 ' + fmtInt(d.count) + ' ventas</span></div>';
      html += '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%;background:linear-gradient(90deg,' + PRODUCT_COLORS[p] + ',var(--green));"></div></div>';
      html += '</div>';
    });
    html += '</div>';
    document.getElementById('chart-products').innerHTML = html;

    var rows = document.querySelectorAll('#chart-products .bar-row');
    rows.forEach(function (row) {
      row.style.cursor = 'pointer';
      row.addEventListener('click', function () {
        var p = row.getAttribute('data-product');
        state.product = (state.product === p) ? null : p;
        state.page = 0;
        renderAll();
      });
    });
  }

  function buildDonut(el, entries, onSelect) {
    var cx = 110, cy = 110, r = 84;
    var total = 0;
    entries.forEach(function (e) { total += e.value; });
    if (total === 0) { el.innerHTML = '<p style="color:var(--text-count);font-size:0.85rem;">Sin datos</p>'; return; }

    var angle = -Math.PI / 2;
    var paths = '';
    entries.forEach(function (e, i) {
      var slice = (e.value / total) * Math.PI * 2;
      var x1 = cx + r * Math.cos(angle);
      var y1 = cy + r * Math.sin(angle);
      var x2 = cx + r * Math.cos(angle + slice);
      var y2 = cy + r * Math.sin(angle + slice);
      var large = slice > Math.PI ? 1 : 0;
      var d = 'M ' + cx + ' ' + cy + ' L ' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2) + ' Z';
      var tip = e.label + ' \u00B7 ' + fmtUSD(e.value) + ' \u00B7 ' + Math.round((e.value / total) * 100) + '%';
      paths += '<path class="donut-slice' + (e.active ? ' active' : '') + '" data-idx="' + i + '" d="' + d + '" fill="' + e.color + '" data-tip="' + esc(tip) + '"></path>';
      angle += slice;
    });

    var legend = '<div class="donut-legend">';
    entries.forEach(function (e, i) {
      var pct = Math.round((e.value / total) * 100);
      legend += '<div class="donut-legend-item' + (e.active ? ' active' : '') + '" data-idx="' + i + '">';
      legend += '<span class="swatch" style="background:' + e.color + '"></span>';
      legend += '<span>' + e.label + '</span>';
      legend += '<span class="cnt">' + pct + '%</span>';
      legend += '</div>';
    });
    legend += '</div>';

    el.innerHTML = '<div class="donut-wrap"><svg viewBox="0 0 220 220" style="width:220px;height:220px;flex-shrink:0;">' + paths +
      '<text x="110" y="106" fill="#F8FAFC" font-size="26" font-weight="800" text-anchor="middle" font-family="Outfit, sans-serif">' + fmtCompact(total) + '</text>' +
      '<text x="110" y="126" fill="#8CB0BE" font-size="10" text-anchor="middle" font-family="Inter, sans-serif">TOTAL USD</text></svg>' + legend + '</div>';

    function bind(selector) {
      var nodes = el.querySelectorAll(selector);
      nodes.forEach(function (n) {
        n.addEventListener('click', function () { onSelect(entries[parseInt(n.getAttribute('data-idx'), 10)]); });
      });
    }
    bind('path[data-idx]');
    bind('.donut-legend-item');
  }

  function renderCountries(visible) {
    var g = groupBy(visible, function (s) { return s.pais; });
    var keys = Object.keys(g).sort(function (a, b) { return g[b].usd - g[a].usd; });
    var entries = keys.map(function (k, i) {
      return { key: k, label: (FLAGS[k] || '') + ' ' + (COUNTRIES[k] || k), value: g[k].usd, count: g[k].count, color: PALETTE[i % PALETTE.length], active: state.country === k };
    });
    buildDonut(document.getElementById('chart-countries'), entries, function (e) {
      state.country = (state.country === e.key) ? null : e.key;
      state.page = 0;
      renderAll();
    });
  }

  function renderChannels(visible) {
    var g = groupBy(visible, function (s) { return s.canal; });
    var keys = Object.keys(g).sort(function (a, b) { return g[b].usd - g[a].usd; });
    var max = 0;
    keys.forEach(function (k) { if (g[k].usd > max) max = g[k].usd; });
    if (max === 0) max = 1;

    var html = '<div class="bar-list">';
    keys.forEach(function (k) {
      var d = g[k];
      var pct = Math.round((d.usd / max) * 100);
      var active = state.channel === k ? ' active-bar' : '';
      html += '<div class="bar-row' + active + '" data-channel="' + k + '">';
      html += '<div class="bar-row-head"><span class="name">' + k + '</span><span class="val" style="color:#93c5fd;">' + fmtUSD(d.usd) + ' \u00B7 ' + fmtInt(d.count) + '</span></div>';
      html += '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%;background:linear-gradient(90deg,#2563EB,#60a5fa);"></div></div>';
      html += '</div>';
    });
    html += '</div>';
    document.getElementById('chart-channels').innerHTML = html;

    var rows = document.querySelectorAll('#chart-channels .bar-row');
    rows.forEach(function (row) {
      row.addEventListener('click', function () {
        var c = row.getAttribute('data-channel');
        state.channel = (state.channel === c) ? null : c;
        state.page = 0;
        renderAll();
      });
    });
  }

  // ============================================================
  // TABLE
  // ============================================================
  function renderTable(visible) {
    var sortKey = state.sortKey === 'fecha' ? 'ts' : state.sortKey;
    var sorted = visible.slice().sort(function (a, b) {
      var ka = a[sortKey], kb = b[sortKey];
      if (ka < kb) return -1 * state.sortDir;
      if (ka > kb) return 1 * state.sortDir;
      return 0;
    });

    var totalPages = Math.max(1, Math.ceil(sorted.length / state.pageSize));
    if (state.page >= totalPages) state.page = totalPages - 1;
    if (state.page < 0) state.page = 0;

    var start = state.page * state.pageSize;
    var slice = sorted.slice(start, start + state.pageSize);

    var body = document.getElementById('table-body');
    var html = '';
    slice.forEach(function (s) {
      html += '<tr>';
      html += '<td>' + s.fecha + '</td>';
      html += '<td>' + s.hora + '</td>';
      html += '<td class="contact">' + esc(cleanContact(s.contacto)) + '</td>';
      html += '<td><span class="country">' + (FLAGS[s.pais] || '') + ' ' + (COUNTRIES[s.pais] || s.pais) + '</span></td>';
      html += '<td>' + esc(s.canal) + '</td>';
      html += '<td><span class="pill">' + s.producto + '</span></td>';
      html += '<td>' + fmtInt(s.monto) + ' ' + s.moneda + '</td>';
      html += '<td class="amount">' + fmtUSD2(s.usd) + '</td>';
      html += '</tr>';
    });
    body.innerHTML = html;

    document.getElementById('table-total').textContent = fmtInt(sorted.length) + ' registros';
    document.getElementById('table-count').textContent = '\u00B7 ' + fmtInt(sorted.length) + ' resultados';
    document.getElementById('page-info').textContent = 'Mostrando ' + (sorted.length ? (start + 1) : 0) + '\u2013' + Math.min(start + state.pageSize, sorted.length) + ' de ' + fmtInt(sorted.length);

    var btns = document.getElementById('page-btns');
    var btnHtml = '<button ' + (state.page === 0 ? 'disabled' : '') + ' data-page="prev">\u2039</button>';
    var winStart = Math.max(0, state.page - 2);
    var winEnd = Math.min(totalPages - 1, winStart + 4);
    winStart = Math.max(0, winEnd - 4);
    for (var p = winStart; p <= winEnd; p++) {
      btnHtml += '<button class="' + (p === state.page ? 'cur' : '') + '" data-page="' + p + '">' + (p + 1) + '</button>';
    }
    btnHtml += '<button ' + (state.page >= totalPages - 1 ? 'disabled' : '') + ' data-page="next">\u203A</button>';
    btns.innerHTML = btnHtml;

    btns.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        var pg = b.getAttribute('data-page');
        if (pg === 'prev') state.page--;
        else if (pg === 'next') state.page++;
        else state.page = parseInt(pg, 10);
        renderTable(getVisible());
      });
    });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function cleanContact(name) {
    var n = String(name)
      .replace(/[\u00a0\u200b\u200c\u200d\ufeff\u2028\u2029]/g, ' ')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
      .replace(/[\u2190-\u2BFF\u2600-\u27BF]/g, '')
      .trim();
    if (!n || /^[-.\s]+$/.test(n)) return 'Cliente anonimo';
    return n;
  }

  // ============================================================
  // METRICS BAR
  // ============================================================
    function renderMetrics(visible) {
    var sum = window.EXPENSES_DATA ? window.EXPENSES_DATA.summary : null;
    var ingresos = sum ? sum.totalSalesUSD : 0;
    var gastos = sum ? (sum.totalBusinessUSD + sum.totalPersonalUSD) : 0;
    var saldo = ingresos - gastos;
    var el = document.getElementById('ticker-msg');
    var best = null, bestUsd = -1;
    visible.forEach(function (s) { if (s.usd > bestUsd) { bestUsd = s.usd; best = s; } });
    var html = 'Ingresos del mes <b class="metric">' + fmtUSD(ingresos) + '</b> \u00B7 Salidas <b class="metric">' + fmtUSD(gastos) + '</b> \u00B7 Saldo <b class="metric">' + fmtUSD(saldo) + '</b> \u00B7 ' + fmtInt(visible.length) + ' transacciones';
    if (best) html += ' \u00B7 Mejor d\u00EDa: d\u00EDa ' + best.day + ' (' + fmtUSD2(bestUsd) + ')';
    el.innerHTML = html;
  }

  // ============================================================
  // EXPORT
  // ============================================================
  function exportCsv(visible) {
    var rows = [['Fecha', 'Hora', 'Contacto', 'Pais', 'Canal', 'Producto', 'Monto', 'Moneda', 'USD']];
    visible.forEach(function (s) {
      rows.push([s.fecha, s.hora, s.contacto, COUNTRIES[s.pais] || s.pais, s.canal, s.producto, s.monto, s.moneda, s.usd]);
    });
    var csv = rows.map(function (r) {
      return r.map(function (c) {
        var str = String(c);
        if (str.indexOf(',') !== -1 || str.indexOf('"') !== -1 || str.indexOf('\n') !== -1) {
          str = '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      }).join(',');
    }).join('\r\n');
    var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ventas_vendeautomatico.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ============================================================
  // PERIOD SELECTOR
  // ============================================================
  function buildPeriodSelect() {
    var selMonth = document.getElementById('sel-month');
    var selYear = document.getElementById('sel-year');

    selMonth.innerHTML = '<option value="all">Todos</option>';
    var monthsWithData = {};
    ALL_SALES.forEach(function (s) { monthsWithData[s.month] = true; });
    MONTHS_LONG.forEach(function (name, i) {
      if (!monthsWithData[i]) return;
      var o = document.createElement('option');
      o.value = i;
      o.textContent = name;
      selMonth.appendChild(o);
    });
    selMonth.value = state.month === null ? 'all' : String(state.month);

    selYear.innerHTML = '<option value="all">Todos</option>';
    YEARS_PRESENT.forEach(function (y) {
      var o = document.createElement('option');
      o.value = y;
      o.textContent = y;
      selYear.appendChild(o);
    });
    selYear.value = state.year;

    selMonth.addEventListener('change', function () {
      state.month = selMonth.value === 'all' ? null : parseInt(selMonth.value, 10);
      state.page = 0;
      renderAll();
    });
    selYear.addEventListener('change', function () {
      state.year = selYear.value;
      state.page = 0;
      renderAll();
    });

    document.getElementById('ps-reset').addEventListener('click', function () {
      state.month = null;
      state.year = 'all';
      state.page = 0;
      selMonth.value = 'all';
      selYear.value = 'all';
      renderAll();
    });
  }

  // ============================================================
  // TOPBAR / NAV
  // ============================================================
  function updatePeriodLabel() {
    var parts = [];
    if (state.year === 'all' && state.month === null) parts.push('Julio 2026 \u00B7 \u00FAnico periodo disponible');
    else {
      if (state.year !== 'all') parts.push('A\u00F1o ' + state.year);
      if (state.month !== null) {
        if (state.year !== 'all') parts.push('Mes de ' + MONTHS_LONG[state.month]);
        else parts.push('Mes ' + MONTHS_LONG[state.month]);
      }
    }
    if (state.country) parts.push(COUNTRIES[state.country] || state.country);
    if (state.product) parts.push(state.product);
    if (state.channel) parts.push(state.channel);
    document.getElementById('topbar-period').textContent = parts.join(' \u00B7 ');
    document.getElementById('period-select').classList.toggle('has-filter', state.month !== null || state.year !== 'all');
  }

  function renderExpenses() {
    if (!window.EXPENSES_DATA) return;
    var items = window.EXPENSES_DATA.items;
    var sourceFilter = document.getElementById('exp-filter-source') ? document.getElementById('exp-filter-source').value : 'all';
    var typeFilter = document.getElementById('exp-filter-type') ? document.getElementById('exp-filter-type').value : 'all';
    var catFilter = document.getElementById('exp-filter-cat') ? document.getElementById('exp-filter-cat').value : 'all';
    var searchQ = (state.search || '').toLowerCase();

    var filtered = items.filter(function (item) {
      if (sourceFilter !== 'all' && item.source !== sourceFilter) return false;
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      if (catFilter !== 'all' && item.cat !== catFilter) return false;
      if (searchQ) {
        var hay = (item.desc + ' ' + item.source + ' ' + item.cat + ' ' + item.type + ' ' + item.status).toLowerCase();
        if (hay.indexOf(searchQ) === -1) return false;
      }
      return true;
    });

    var tbody = document.getElementById('exp-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 24px; color: var(--text-count);">No se encontraron gastos con los filtros aplicados.</td></tr>';
      return;
    }

    filtered.forEach(function (item) {
      var tr = document.createElement('tr');
      var badgeClass = item.status === 'Mantener' ? 'mantener' :
                       item.status === 'Optimizar' ? 'optimizar' :
                       item.status === 'Cancelar' ? 'cancelar' : 'personal';

      tr.innerHTML = '<td>' + item.date + '</td>' +
        '<td><span class="pill" style="font-size:0.75rem;">' + esc(item.source) + '</span></td>' +
        '<td style="font-weight:600; color:var(--text-title);">' + esc(item.desc) + '</td>' +
        '<td>' + esc(item.cat) + '</td>' +
        '<td><span class="pill ' + (item.type === 'Negocio' ? 'up' : '') + '">' + esc(item.type) + '</span></td>' +
        '<td style="font-family:var(--font-mono); font-weight:700; color:var(--text-title);">$' + item.usd.toFixed(2) + ' USD</td>' +
        '<td style="font-family:var(--font-mono);">S/ ' + item.pen.toFixed(2) + '</td>' +
      clearTimeout(debounce);
      debounce = setTimeout(function () {
        state.search = search.value.trim();
        state.page = 0;
        renderAll();
        renderExpenses();
      }, 220);
    });

    document.querySelectorAll('.nav-item').forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(function (x) { x.classList.remove('active'); });
        item.classList.add('active');
        var t = item.getAttribute('data-target');
        if (NAV_TITLES[t]) document.getElementById('topbar-title').textContent = NAV_TITLES[t];
        switchTab(t);
        document.getElementById('sidebar').classList.remove('open');
      });
    });

    ['exp-filter-source', 'exp-filter-type', 'exp-filter-cat'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', renderExpenses);
      }
    });

    document.getElementById('export-btn').addEventListener('click', function () { exportCsv(getVisible()); });

    var toTop = document.getElementById('to-top');
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 500);
    });
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  function bindTableSort() {
    document.querySelectorAll('thead th[data-sort]').forEach(function (th) {
      th.addEventListener('click', function () {
        var key = th.getAttribute('data-sort');
        if (state.sortKey === key) { state.sortDir = -state.sortDir; }
        else { state.sortKey = key; state.sortDir = key === 'fecha' || key === 'usd' || key === 'monto' ? -1 : 1; }
        document.querySelectorAll('thead th .arr').forEach(function (a) { a.textContent = ''; });
        th.querySelector('.arr').textContent = state.sortDir === 1 ? '\u25B2' : '\u25BC';
        renderTable(getVisible());
      });
    });
  }

  // ============================================================
  // MASTER RENDER
  // ============================================================
  function renderAll() {
    var visible = getVisible();
    var baseNoYear = getBaseNoYear();
    renderKpis(visible, baseNoYear);
    renderMetrics(visible);
    renderRevenueChart(visible);
    renderProducts(visible);
    renderCountries(visible);
    renderChannels(visible);
    renderTable(visible);
    renderExpenses();
    renderExpenseCharts();
    renderExpenseBreakdown();
    renderExpLeaks();
    renderMonthlyAnalysis();
    updatePeriodLabel();
  }

  // ============================================================
  // GASTOS: CHART + ANÁLISIS DEL MES (Iron Man Edition)
  // ============================================================
  var EXP_PALETTE = ['#ff2a3c', '#ffb300', '#00e5ff', '#ff6d2e', '#b388ff', '#ff4fd8', '#4ade80', '#38bdf8', '#facc15', '#fb7185', '#a3e635', '#60a5fa'];

  function expByDay(items) {
    var map = {};
    items.forEach(function (it) {
      var d = it.date.slice(8, 10);
      var k = parseInt(d, 10);
      if (!map[k]) map[k] = { usd: 0, count: 0, biz: 0 };
      map[k].usd += it.usd;
      map[k].count += 1;
      if (it.type === 'Negocio') map[k].biz += it.usd;
    });
    return map;
  }

  function renderExpenseCharts() {
    if (!window.EXPENSES_DATA) return;
    var items = window.EXPENSES_DATA.items;

    var catMap = {};
    items.forEach(function (it) { catMap[it.cat] = (catMap[it.cat] || 0) + it.usd; });
    var catKeys = Object.keys(catMap).sort(function (a, b) { return catMap[b] - catMap[a]; });
    var catEntries = catKeys.map(function (k, i) {
      return { key: k, label: k, value: catMap[k], color: EXP_PALETTE[i % EXP_PALETTE.length] };
    });
    buildDonut(document.getElementById('exp-chart-cat'), catEntries, function () {});

    var srcMap = {};
    items.forEach(function (it) { srcMap[it.source] = (srcMap[it.source] || 0) + it.usd; });
    var srcKeys = Object.keys(srcMap).sort(function (a, b) { return srcMap[b] - srcMap[a]; });
    var maxSrc = srcKeys.length ? srcMap[srcKeys[0]] : 1;
    var html = '<div class="bar-list">';
    srcKeys.forEach(function (k, i) {
      var pct = Math.round((srcMap[k] / maxSrc) * 100);
      html += '<div class="bar-row">';
      html += '<div class="bar-row-head"><span class="name">' + esc(k) + '</span><span class="val">' + fmtUSD(srcMap[k]) + '</span></div>';
      html += '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%;background:linear-gradient(90deg,' + EXP_PALETTE[i % EXP_PALETTE.length] + ',rgba(255,255,255,0.35));"></div></div>';
      html += '</div>';
    });
    html += '</div>';
    document.getElementById('exp-chart-source').innerHTML = html;

    var byDay = expByDay(items);
    var days = Object.keys(byDay).map(Number).sort(function (a, b) { return a - b; });
    var W = 900, H = 250, padT = 26, padB = 26, innerH = H - padT - padB;
    var maxD = 1, totalD = 0, bestD = null;
    days.forEach(function (d) { if (byDay[d].usd > maxD) maxD = byDay[d].usd; totalD += byDay[d].usd; if (!bestD || byDay[d].usd > bestD.usd) bestD = { d: d, usd: byDay[d].usd }; });
    var slot = (W - 20) / days.length;
    var bw = Math.max(1.5, slot * 0.62);
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet">';
    for (var g = 0; g <= 4; g++) {
      var val = maxD * (g / 4);
      var gy = padT + innerH - (g / 4) * innerH;
      svg += '<line x1="10" y1="' + gy + '" x2="' + (W - 10) + '" y2="' + gy + '" stroke="rgba(255,255,255,0.08)"/>';
      svg += '<text x="14" y="' + (gy + 3) + '" fill="rgba(255,255,255,0.5)" font-size="9" font-family="monospace">' + fmtCompact(val) + '</text>';
    }
    days.forEach(function (d, i) {
      var h = Math.max(1.2, (byDay[d].usd / maxD) * innerH);
      var x = 10 + slot * i + (slot - bw) / 2;
      var y = padT + innerH - h;
      var tip = 'D\u00EDa ' + d + ' \u00B7 Gastos ' + fmtUSD(byDay[d].usd) + ' (' + byDay[d].count + ' cargos)';
      svg += '<rect class="daily-bar exp-day-bar" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="2" fill="rgba(255,42,60,0.65)" data-tip="' + esc(tip) + '"></rect>';
      if (days.length <= 31 && i % 3 === 0) {
        svg += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - 8) + '" fill="rgba(255,255,255,0.5)" font-size="9" text-anchor="middle">' + d + '</text>';
      }
    });
    svg += '</svg>';
    var dayEl = document.getElementById('exp-chart-day');
    dayEl.innerHTML = svg;
    var sub = dayEl.closest('.chart-card').querySelector('.chart-sub');
    if (sub) sub.textContent = 'Total ' + fmtUSD(totalD) + ' \u00B7 Mayor d\u00EDa: ' + bestD.d + ' (' + fmtUSD(bestD.usd) + ')';
  }

  function renderMonthlyAnalysis() {
    var el = document.getElementById('analysis-grid');
    var verdict = document.getElementById('analysis-verdict');
    if (!el || !window.EXPENSES_DATA) return;

    var exp = window.EXPENSES_DATA;
    var sum = exp.summary;
    var items = exp.items;
    var sales = getVisible();

    var revenue = 0, count = sales.length;
    sales.forEach(function (s) { revenue += s.usd; });
    var ticket = count ? revenue / count : 0;

    var catMap = {}, srcMap = {}, bestSale = null;
    items.forEach(function (it) {
      catMap[it.cat] = (catMap[it.cat] || 0) + it.usd;
      srcMap[it.source] = (srcMap[it.source] || 0) + it.usd;
    });
    var topCat = Object.keys(catMap).sort(function (a, b) { return catMap[b] - catMap[a]; })[0] || '—';
    var topCatUsd = catMap[topCat] || 0;
    var topSrc = Object.keys(srcMap).sort(function (a, b) { return srcMap[b] - srcMap[a]; })[0] || '—';

    var topSale = 0, bestDay = null, bestDayUsd = 0, byDayS = {};
    sales.forEach(function (s) {
      if (s.usd > topSale) topSale = s.usd;
      if (s.usd > bestDayUsd) { bestDayUsd = s.usd; bestDay = s; }
      var k = s.day;
      byDayS[k] = (byDayS[k] || 0) + s.usd;
    });

    var gProd = groupBy(sales, function (s) { return s.producto; });
    var gPais = groupBy(sales, function (s) { return s.pais; });
    var gCanal = groupBy(sales, function (s) { return s.canal; });
    var topProduct = Object.keys(gProd).sort(function (a, b) { return gProd[b].usd - gProd[a].usd; })[0] || '—';
    var topCountry = Object.keys(gPais).sort(function (a, b) { return gPais[b].usd - gPais[a].usd; })[0] || '—';
    var topChannel = Object.keys(gCanal).sort(function (a, b) { return gCanal[b].usd - gCanal[a].usd; })[0] || '—';

    var bizPct = sum.totalBusinessUSD && sum.totalSalesUSD ? (sum.totalBusinessUSD / sum.totalSalesUSD) * 100 : 0;
    var cashPerDay = sum.netMarginUSD ? sum.netMarginUSD / 30 : 0;
    var top3 = items.slice().sort(function (a, b) { return b.usd - a.usd; }).slice(0, 3);

    function card(t, v, sub, icon, cls) {
      return '<div class="analysis-card ' + (cls || '') + '"><div class="ac-head"><span class="ac-icon">' + (icon || '') + '</span><span class="ac-label">' + t + '</span></div><div class="ac-value">' + v + '</div><div class="ac-sub">' + (sub || '') + '</div></div>';
    }

        var gastosTot = sum.totalBusinessUSD + sum.totalPersonalUSD;
    var saldoMes = sum.totalSalesUSD - gastosTot;
    var grid = '';
    grid += card('Ingresos del mes', fmtUSD(sum.totalSalesUSD), fmtInt(count) + ' transacciones \u00B7 Ticket promedio ' + fmtUSD2(ticket), '\u25C6');
    grid += card('Gastos de negocio', fmtUSD(sum.totalBusinessUSD), bizPct.toFixed(1) + '% de los ingresos', '\u25B2');
    grid += card('Gastos personales', fmtUSD(sum.totalPersonalUSD), 'S/ ' + sum.totalPersonalPEN.toFixed(2) + ' PEN', '\u25BD');
    grid += card('Gastos totales (salidas)', fmtUSD(gastosTot), fmtInt(items.length) + ' cargos auditados', '\u25AE');
    grid += card('Saldo del mes', fmtUSD(saldoMes), 'Ingresos \u2212 salidas totales', '\u25CF');
    grid += card('Margen neto negocio', (sum.netMarginPct || 0).toFixed(1) + '%', fmtUSD(sum.netMarginUSD) + ' libres de operaci\u00F3n', '\u25C8');
    grid += card('Top categor\u00EDa de gasto', topCat, fmtUSD(topCatUsd) + ' \u00B7 ' + Math.round((topCatUsd / (gastosTot || 1)) * 100) + '% del total gastado', '\u25AE');
    grid += card('Fuente principal', topSrc, fmtUSD(srcMap[topSrc]) + ' en el mes', '\u25A3');
    grid += card('Producto estrella', topProduct, fmtUSD(gProd[topProduct].usd) + ' \u00B7 ' + fmtInt(gProd[topProduct].count) + ' ventas', '\u2605');
    grid += card('Mejor mercado', (FLAGS[topCountry] || '') + ' ' + (COUNTRIES[topCountry] || topCountry), fmtUSD(gPais[topCountry].usd), '\u25CF');
    grid += card('Mayor ingreso individual', fmtUSD2(topSale), bestDay ? 'd\u00EDa ' + bestDay.day : '\u2014', '\u25C8');
    grid += card('Ahorro potencial', '+$' + (sum.potentialMonthlySavingsUSD || 0).toFixed(0) + ' USD/mes', 'Optimizando SaaS, Skool y streaming', '\u26A1');
    el.innerHTML = grid;

    var top3Html = top3.map(function (t, i) {
      return '<div class="top-exp-row"><span class="top-exp-rank">' + (i + 1) + '</span><span class="top-exp-desc">' + esc(t.desc) + '</span><span class="top-exp-val">' + fmtUSD(t.usd) + '</span></div>';
    }).join('');

    var verdictHtml =
      '<div class="verdict-grid">' +
        '<div class="verdict-block verdict-green"><div class="vb-title">🟢 LO QUE VA BIEN</div><ul>' +
          '<li>Ingresos de <b>' + fmtUSD(sum.totalSalesUSD) + '</b> con ' + fmtInt(count) + ' transacciones (ticket ' + fmtUSD2(ticket) + ').</li>' +
          '<li>Margen neto de <b>' + sum.netMarginPct.toFixed(1) + '%</b> (' + fmtUSD(sum.netMarginUSD) + ' libres).</li>' +
          
        '</ul></div>' +
        '<div class="verdict-block verdict-red"><div class="vb-title">🔴 POR OPTIMIZAR</div><ul>' +
          '<li>El <b>' + Math.round(bizPct) + '%</b> de los ingresos se va en gastos de negocio; la categor&iacute;a top es <b>' + topCat + '</b> (' + fmtUSD(topCatUsd) + ').</li>' +
          '<li>Hay duplicidades en SaaS/Google que drenan ~$80-155 USD/mes sin retorno.</li>' +
          '<li>Gasto personal de <b>' + fmtUSD(sum.totalPersonalUSD) + '</b> representa presi&oacute;n sobre el saldo.</li>' +
        '</ul></div>' +
        '<div class="verdict-block verdict-gold"><div class="vb-title">💡 RECOMENDACIONES DEL MES</div><ul>' +
          '<li>Aplicar el ahorro potencial de <b>+$' + (sum.potentialMonthlySavingsUSD || 0).toFixed(0) + ' USD/mes</b> directamente al ahorro o reinversi&oacute;n.</li>' +
          '<li>Eliminar las duplicidades de SaaS (Google, Skool, IA) antes de aumentar cualquier gasto.</li>' +
          '<li>Mantener el ritmo diario de caja: ~' + fmtUSD2(cashPerDay) + ' USD libres por día.</li>' +
        '</ul></div>' +
        '<div class="verdict-block verdict-blue"><div class="vb-title">📊 TOP 3 GASTOS DEL MES</div>' + top3Html + '</div>' +
      '</div>';
    verdict.innerHTML = verdictHtml;
  }

  function renderExpenseBreakdown() {
    var el = document.getElementById('exp-breakdown');
    if (!el || !window.EXPENSES_DATA) return;
    var items = window.EXPENSES_DATA.items;
    if (!items.length) { el.innerHTML = '<div class="empty">Sin cargos en el periodo</div>'; return; }

    var catMap = {}, typeMap = { Negocio: 0, Personal: 0 };
    var totalUsd = 0, totalPen = 0;
    items.forEach(function (it) {
      if (!catMap[it.cat]) catMap[it.cat] = { count: 0, usd: 0, pen: 0, negocio: 0 };
      catMap[it.cat].count++;
      catMap[it.cat].usd += it.usd;
      catMap[it.cat].pen += it.pen;
      if (it.type === 'Negocio') catMap[it.cat].negocio += it.usd;
      typeMap[it.type] = (typeMap[it.type] || 0) + it.usd;
      totalUsd += it.usd;
      totalPen += it.pen;
    });
    var cats = Object.keys(catMap).sort(function (a, b) { return catMap[b].usd - catMap[a].usd; });

    var rows = cats.map(function (cat) {
      var d = catMap[cat];
      var pct = Math.round((d.usd / totalUsd) * 100);
      var mix = d.negocio >= d.usd * 0.6 ? 'Negocio' : (d.negocio > 0 ? 'Mixto' : 'Personal');
      return '<tr>' +
        '<td><span class="country">' + esc(cat) + '</span></td>' +
        '<td>' + d.count + '</td>' +
        '<td style="font-family:var(--font-mono); font-weight:700;">$' + d.usd.toFixed(2) + '</td>' +
        '<td style="font-family:var(--font-mono);">S/ ' + d.pen.toFixed(2) + '</td>' +
        '<td><div class="mini-track"><div class="mini-fill" style="width:' + pct + '%"></div></div><span class="mini-pct">' + pct + '%</span></td>' +
        '<td><span class="pill ' + (mix === 'Negocio' ? 'up' : '') + '">' + mix + '</span></td>' +
        '</tr>';
    }).join('');

    el.innerHTML =
      '<div class="exp-type-summary">' +
        '<div class="ts-item"><span class="ts-label">Total negocio</span><span class="ts-val">' + fmtUSD(typeMap.Negocio || 0) + '</span></div>' +
        '<div class="ts-item"><span class="ts-label">Total personal</span><span class="ts-val">' + fmtUSD(typeMap.Personal || 0) + '</span></div>' +
        '<div class="ts-item"><span class="ts-label">Total del mes</span><span class="ts-val">' + fmtUSD(totalUsd) + '</span></div>' +
        '<div class="ts-item"><span class="ts-label">Cargos auditados</span><span class="ts-val">' + items.length + '</span></div>' +
      '</div>' +
      '<div class="mini-table-scroll"><table>' +
        '<thead><tr><th>Categor\u00EDa</th><th>Cargos</th><th>USD</th><th>PEN</th><th>% del total</th><th>Tipo</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div>';
  }

  var LEAK_VENDORS = [
    { k: 'GOOGLE', name: 'Google / Google One', rec: 'Cobros m\u00FAltiple del mismo servicio: consolida en un solo plan.' },
    { k: 'SKOOL', name: 'Skool', rec: 'Varias comunidades activas: cancela las que no usas.' },
    { k: 'CHATGPT', name: 'ChatGPT / OpenAI', rec: 'Dos o m\u00E1s suscripciones de IA: eval\u00FAa quedarte con una.' },
    { k: 'CLAUDE', name: 'Claude / Anthropic', rec: 'Suscripci\u00F3n duplicada con ChatGPT: consolida tu stack de IA.' },
    { k: 'OPENAI', name: 'OpenAI', rec: 'Verifica cu\u00E1ntos planes de IA est\u00E1s pagando a la vez.' },
    { k: 'NETFLIX', name: 'Netflix', rec: 'Plan familiar reduce el costo por persona.' },
    { k: 'YOUTUBE', name: 'YouTube Premium', rec: 'Eval\u00FAa el plan familiar compartido.' },
    { k: 'APPLE', name: 'Apple Billing', rec: 'Agrupa suscripciones en el plan familiar de Apple.' },
    { k: 'SPOTIFY', name: 'Spotify', rec: 'Plan familiar o descuento anual.' },
    { k: 'FACEBOOK', name: 'Facebook / Meta', rec: 'Gasto de marketing frecuente: consolida y negocia.' }
  ];

  function renderExpLeaks() {
    var el = document.getElementById('exp-leaks');
    if (!el || !window.EXPENSES_DATA) return;
    var items = window.EXPENSES_DATA.items;

    var leaks = [];
    LEAK_VENDORS.forEach(function (v) {
      var hits = items.filter(function (it) { return (it.desc + ' ' + it.cat).toUpperCase().indexOf(v.k) !== -1; });
      if (hits.length >= 2) {
        var total = 0;
        hits.forEach(function (h) { total += h.usd; });
        leaks.push({ name: v.name, count: hits.length, total: total, rec: v.rec });
      }
    });

    var top = items.slice().sort(function (a, b) { return b.usd - a.usd; }).slice(0, 5);

    var leakHtml = leaks.length
      ? leaks.map(function (l) {
          return '<div class="leak-row"><span class="leak-icon">!</span>' +
            '<div class="leak-body"><div class="leak-title">' + esc(l.name) + ' \u00B7 ' + l.count + ' cargos \u00B7 <b>' + fmtUSD(l.total) + '</b></div>' +
            '<div class="leak-rec">' + esc(l.rec) + '</div></div></div>';
        }).join('')
      : '<div class="empty">Sin duplicidades detectadas este mes</div>';

    el.innerHTML =
      '<div class="leak-block"><div class="leak-block-title">Cargos recurrentes duplicados</div>' + leakHtml + '</div>' +
      '<div class="leak-block"><div class="leak-block-title">Top 5 gastos individuales</div>' +
        top.map(function (t, i) {
          return '<div class="leak-row top"><span class="leak-icon rank">' + (i + 1) + '</span>' +
            '<div class="leak-body"><div class="leak-title">' + esc(t.desc) + '</div>' +
            '<div class="leak-rec">' + fmtUSD(t.usd) + ' \u00B7 ' + esc(t.cat) + ' \u00B7 ' + esc(t.source) + '</div></div></div>';
        }).join('') +
      '</div>';
  }

  // ============================================================
  // INIT
  // ============================================================
  function initReveal() {
    var items = document.querySelectorAll('.kpi-card, .chart-card, .table-card, .ticker');
    items.forEach(function (it, i) {
      it.style.animationDelay = (i * 80) + 'ms';
    });
  }

  buildPeriodSelect();
  bindTopbar();
  bindTableSort();
  renderAll();
  bindTips();
  initReveal();
  lock();
})();

