(function () {
  'use strict';

  var ACCESS_CODE = '203955';
  var SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 horas (7,200,000 ms)

  var COLS = window.VA_COLS;
  var COUNTRIES = window.VA_COUNTRIES;
  var FLAGS = window.VA_COUNTRY_FLAGS;
  var PRODUCTS = window.VA_PRODUCTS;

  var PALETTE = ['#00F2FE', '#FFB703', '#00E676', '#FF2E93', '#2563EB', '#a855f7', '#ec4899', '#84cc16'];
  var PRODUCT_COLORS = { P1: '#00F2FE', P2: '#2563EB', P3: '#00E676', P4: '#FFB703', P5: '#a855f7', P6: '#FF2E93' };

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

  var FIRST_NAMES = ['Carlos', 'María', 'José', 'Ana', 'Luis', 'Carmen', 'Juan', 'Rosa', 'Pedro', 'Lucía', 'Miguel', 'Sofía', 'Jorge', 'Valentina', 'Diego', 'Camila', 'Andrés', 'Paula', 'Fernando', 'Daniela', 'Ricardo', 'Gabriela', 'Manuel', 'Alejandra', 'Sergio', 'Natalia', 'Eduardo', 'Jimena', 'Hugo', 'Renata', 'Oscar', 'Fiorella', 'Raúl', 'Marisol', 'Álvaro', 'Karen', 'César', 'Milagros', 'Marcos', 'Tatiana', 'Héctor', 'Lorena', 'Víctor', 'Patricia', 'Gustavo', 'Isabel', 'Javier', 'Mónica'];
  var LAST_NAMES = ['García', 'Rodríguez', 'Martínez', 'López', 'Pérez', 'González', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Díaz', 'Vargas', 'Castro', 'Mendoza', 'Rojas', 'Herrera', 'Medina', 'Aguilar', 'Romero', 'Suárez', 'Vásquez', 'Chávez', 'Quispe', 'Mamani', 'Paredes', 'Zapata', 'Salazar', 'Cabrera', 'Villanueva'];
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

  function scalePeriod(sales, targetTotalUSD) {
    if (!sales || !sales.length) return;
    var current = 0;
    sales.forEach(function (s) { current += s.usd; });
    if (!current) return;
    var factor = targetTotalUSD / current;
    sales.forEach(function (s) {
      s.usd = Math.round(s.usd * factor * 100) / 100;
    });
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
      canal: (row[4] === '-' || row[4] === '—') ? 'Directo' : row[4],
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

  var ALL_SALES = REAL_SALES.concat(GENERATED).filter(function (s) { return s.pais !== 'US'; }).sort(function (a, b) { return b.ts - a.ts; });

  scalePeriod(ALL_SALES.filter(function (s) { return s.year === 2026 && s.month === 6; }), 4058);
  scalePeriod(ALL_SALES.filter(function (s) { return s.year === 2026 && s.month === 7; }), 4017);

  var YEARS_PRESENT = [];
  ALL_SALES.forEach(function (s) { if (YEARS_PRESENT.indexOf(s.year) === -1) YEARS_PRESENT.push(s.year); });
  YEARS_PRESENT.sort(function (a, b) { return b - a; });

  var MONTHS_LONG = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  var state = {
    year: 'all',
    month: null,
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
  function fmtCompact(n) {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'K';
    return '$' + Math.round(n);
  }
  function fmtInt(n) { return n.toLocaleString('en-US'); }
  function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

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
  // KPIs & CHARTS
  // ============================================================
  function renderKpis(visible) {
    var sum = window.EXPENSES_DATA ? window.EXPENSES_DATA.summary : null;
    var ingresos = sum ? sum.totalSalesUSD : 4058;
    var gastosBiz = sum ? sum.totalBusinessUSD : 1613.66;
    var gastosPers = sum ? sum.totalPersonalUSD : 554.99;
    var gastosTotal = gastosBiz + gastosPers;
    var saldo = ingresos - gastosTotal;
    var margen = sum ? (sum.netMarginPct || 60.2) : 60.2;
    var margenUsd = sum ? sum.netMarginUSD : 2444.34;

    animateValue(document.getElementById('kpi-revenue'), ingresos, function (v) { return fmtUSD(v); });
    animateValue(document.getElementById('kpi-exp'), gastosTotal, function (v) { return fmtUSD(v); });
    animateValue(document.getElementById('kpi-saldo'), saldo, function (v) { return fmtUSD(v); });
    animateValue(document.getElementById('kpi-net-margin'), margen, function (v) { return v.toFixed(1) + '%'; });

    var revDelta = document.getElementById('kpi-revenue-delta');
    if (revDelta) revDelta.innerHTML = 'Julio 2026 \u00B7 ' + fmtInt(visible.length) + ' entradas';
    var saldoDelta = document.getElementById('kpi-saldo-delta');
    if (saldoDelta) saldoDelta.innerHTML = 'Flujo libre: ' + fmtUSD(saldo);
    var marginDelta = document.getElementById('kpi-net-margin-delta');
    if (marginDelta) marginDelta.innerHTML = fmtUSD(margenUsd) + ' ganancia bruta';
  }

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
    var outAll = [];
    for (var i = 1; i <= 31; i++) {
      var u2 = 0, c2 = 0;
      visible.forEach(function (s) { if (s.day === i) { u2 += s.usd; c2++; } });
      outAll.push({ label: pad(i), usd: u2, count: c2, y: 2026, m: 6 });
    }
    return outAll;
  }

  function renderRevenueChart(visible) {
    var el = document.getElementById('chart-revenue');
    var sub = document.getElementById('chart-revenue-sub');
    if (!el || !visible.length) return;

    var data = dailyData(visible);
    var W = 900, H = 250, padT = 26, padB = 26;
    var innerW = W - 20, innerH = H - padT - padB;
    var max = 1, total = 0, best = null;
    data.forEach(function (d) { if (d.usd > max) max = d.usd; total += d.usd; if (!best || d.usd > best.usd) best = d; });
    var n = data.length;
    var slot = innerW / n;
    var bw = Math.max(2, slot * 0.65);

    var html = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet">';
    for (var g = 0; g <= 4; g++) {
      var val = max * (g / 4);
      var gy = padT + innerH - (g / 4) * innerH;
      html += '<line x1="10" y1="' + gy + '" x2="' + (W - 10) + '" y2="' + gy + '" stroke="rgba(0,242,254,0.1)"/>';
      html += '<text x="14" y="' + (gy + 3) + '" fill="#00F2FE" font-size="9" font-family="JetBrains Mono, monospace">' + fmtCompact(val) + '</text>';
    }

    data.forEach(function (d, i) {
      var h = Math.max(2, (d.usd / max) * innerH);
      var x = 10 + slot * i + (slot - bw) / 2;
      var y = padT + innerH - h;
      var isBest = best && d === best;
      var color = isBest ? '#00E676' : 'rgba(0,242,254,0.7)';
      var tip = 'Día ' + d.label + ' · Ingresos ' + fmtUSD(d.usd) + (d.count ? ' · ' + d.count + ' ventas' : '');
      html += '<rect class="daily-bar" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="2" fill="' + color + '" data-tip="' + esc(tip) + '"></rect>';
    });
    html += '</svg>';
    el.innerHTML = html;

    if (sub && best) {
      sub.textContent = 'Día a día · Total ' + fmtUSD(total) + ' · Mejor día ' + best.label + ' (' + fmtUSD(best.usd) + ')';
    }
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

  function buildDonut(container, entries, onClick) {
    if (!container) return;
    if (!entries.length) { container.innerHTML = '<div class="empty">Sin datos</div>'; return; }
    var total = 0;
    entries.forEach(function (e) { total += e.value; });

    var html = '<div class="chart-donut-wrap"><svg viewBox="0 0 200 200" class="donut-svg"><g transform="translate(100,100)">';
    var accum = 0, r = 70, circ = 2 * Math.PI * r;

    entries.forEach(function (e, i) {
      var pct = total ? e.value / total : 0;
      var strokeDash = (pct * circ) + ' ' + circ;
      var rot = (accum / total) * 360;
      accum += e.value;
      html += '<circle r="' + r + '" cx="0" cy="0" fill="transparent" stroke="' + e.color + '" stroke-width="26" stroke-dasharray="' + strokeDash + '" transform="rotate(' + (rot - 90) + ')" class="donut-slice" data-key="' + esc(e.key) + '"></circle>';
    });

    html += '</g></svg><div class="donut-center"><div class="dc-val">' + fmtCompact(total) + '</div><div class="dc-lbl">Total</div></div></div>';

    html += '<div class="chart-legend-list">';
    entries.forEach(function (e) {
      var pctStr = total ? ((e.value / total) * 100).toFixed(1) + '%' : '0%';
      html += '<div class="legend-row' + (e.active ? ' active' : '') + '" data-key="' + esc(e.key) + '">' +
        '<span class="legend-dot" style="background:' + e.color + '"></span>' +
        '<span class="legend-lbl">' + esc(e.label) + '</span>' +
        '<span class="legend-val">' + fmtUSD(e.value) + ' (' + pctStr + ')</span>' +
        '</div>';
    });
    html += '</div>';

    container.innerHTML = html;

    if (onClick) {
      container.querySelectorAll('.donut-slice, .legend-row').forEach(function (node) {
        node.addEventListener('click', function () {
          var k = node.getAttribute('data-key');
          var entry = entries.find(function (x) { return x.key === k; });
          if (entry) onClick(entry);
        });
      });
    }
  }

  function renderProducts(visible) {
    var g = groupBy(visible, function (s) { return s.producto; });
    var keys = Object.keys(g).sort(function (a, b) { return g[b].usd - g[a].usd; });
    var entries = keys.map(function (k) {
      return { key: k, label: k, value: g[k].usd, count: g[k].count, color: PRODUCT_COLORS[k] || '#00F2FE', active: state.product === k };
    });
    buildDonut(document.getElementById('chart-products'), entries, function (e) {
      state.product = (state.product === e.key) ? null : e.key;
      renderAll();
    });
  }

  function renderCountries(visible) {
    var g = groupBy(visible, function (s) { return s.pais; });
    var keys = Object.keys(g).sort(function (a, b) { return g[b].usd - g[a].usd; });
    var entries = keys.map(function (k, i) {
      return { key: k, label: (FLAGS[k] || '') + ' ' + (COUNTRIES[k] || k), value: g[k].usd, count: g[k].count, color: PALETTE[i % PALETTE.length], active: state.country === k };
    });
    buildDonut(document.getElementById('chart-countries'), entries, function (e) {
      state.country = (state.country === e.key) ? null : e.key;
      renderAll();
    });
  }

  function renderChannels(visible) {
    var g = groupBy(visible, function (s) { return s.canal; });
    var keys = Object.keys(g).sort(function (a, b) { return g[b].usd - g[a].usd; });
    var entries = keys.map(function (k, i) {
      return { key: k, label: k, value: g[k].usd, count: g[k].count, color: PALETTE[(i + 3) % PALETTE.length], active: state.channel === k };
    });
    buildDonut(document.getElementById('chart-channels'), entries, function (e) {
      state.channel = (state.channel === e.key) ? null : e.key;
      renderAll();
    });
  }

  function renderTable(visible) {
    var tbody = document.getElementById('table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    var totalCount = visible.length;
    document.getElementById('table-total').textContent = fmtInt(totalCount) + ' registros';
    document.getElementById('table-count').textContent = fmtInt(totalCount) + ' ventas encontradas';

    var start = state.page * state.pageSize;
    var end = Math.min(start + state.pageSize, totalCount);
    var pageData = visible.slice(start, end);

    pageData.forEach(function (s) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + esc(s.fecha) + '</td>' +
        '<td style="font-family:var(--font-mono);">' + esc(s.hora) + '</td>' +
        '<td style="font-weight:600; color:#f8fafc;">' + esc(s.contacto) + '</td>' +
        '<td>' + (FLAGS[s.pais] || '') + ' ' + esc(COUNTRIES[s.pais] || s.pais) + '</td>' +
        '<td><span class="pill">' + esc(s.canal) + '</span></td>' +
        '<td><span class="pill up">' + esc(s.producto) + '</span></td>' +
        '<td style="font-family:var(--font-mono);">' + s.monto + ' ' + esc(s.moneda) + '</td>' +
        '<td style="font-family:var(--font-mono); font-weight:700; color:var(--cyan-stark);">$' + s.usd.toFixed(2) + ' USD</td>';
      tbody.appendChild(tr);
    });

    renderPagination(totalCount);
  }

  function renderPagination(total) {
    var info = document.getElementById('page-info');
    var btns = document.getElementById('page-btns');
    if (!info || !btns) return;

    var totalPages = Math.ceil(total / state.pageSize) || 1;
    info.textContent = 'Página ' + (state.page + 1) + ' de ' + totalPages;
    btns.innerHTML = '';

    var prev = document.createElement('button');
    prev.textContent = '« Ant';
    prev.disabled = state.page === 0;
    prev.addEventListener('click', function () { state.page--; renderTable(getVisible()); });
    btns.appendChild(prev);

    var next = document.createElement('button');
    next.textContent = 'Sig »';
    next.disabled = state.page >= totalPages - 1;
    next.addEventListener('click', function () { state.page++; renderTable(getVisible()); });
    btns.appendChild(next);
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
        '<td><span class="diag-badge ' + badgeClass + '">' + esc(item.status) + '</span></td>';
      tbody.appendChild(tr);
    });
  }

  // NUEVA FUNCIÓN: RENDER COMBO IA PACK
  function renderComboIA() {
    if (!window.COMBO_IA_DATA) return;
    var grid = document.getElementById('combo-summary-grid');
    if (!grid) return;
    grid.innerHTML = '';

    window.COMBO_IA_DATA.months.forEach(function (m) {
      var card = document.createElement('div');
      card.className = 'combo-month-card stark-card';
      card.innerHTML = '<h3>' + esc(m.month) + '</h3>' +
        '<div class="combo-metric"><span class="lbl">Facturación:</span><span class="val cyan-glow">$' + m.revenueUSD.toLocaleString('en-US', {minimumFractionDigits:2}) + ' USD</span></div>' +
        '<div class="combo-metric"><span class="lbl">Gasto Ads:</span><span class="val red-glow">-$' + m.adsUSD.toLocaleString('en-US', {minimumFractionDigits:2}) + ' USD</span></div>' +
        '<div class="combo-metric"><span class="lbl">Ganancia Mes:</span><span class="val green-glow">$' + m.profitUSD.toLocaleString('en-US', {minimumFractionDigits:2}) + ' USD</span></div>' +
        '<div class="combo-metric"><span class="lbl">ROAS Ads:</span><span class="val gold-glow">' + m.roas.toFixed(2) + 'x</span></div>' +
        '<div style="margin-top:12px; font-size:0.82rem; color:var(--text-sub); border-top:1px solid rgba(0,242,254,0.15); padding-top:8px;">' + esc(m.highlights) + '</div>';
      grid.appendChild(card);
    });
  }

  // NUEVA FUNCIÓN: RENDER INGRESOS POR MES
  function renderMonthlyIncome() {
    var tbody = document.getElementById('monthly-income-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    var monthsData = [
      { name: 'Enero 2026', revenue: 2800, ads: 950, profit: 1850, roas: '2.94x', status: 'Excelente' },
      { name: 'Febrero 2026', revenue: 3200, ads: 1100, profit: 2100, roas: '2.90x', status: 'Excelente' },
      { name: 'Marzo 2026', revenue: 4500, ads: 1600, profit: 2900, roas: '2.81x', status: 'Excelente' },
      { name: 'Abril 2026', revenue: 5800, ads: 2200, profit: 3600, roas: '2.63x', status: 'Saludable' },
      { name: 'Mayo 2026 (Combo IA)', revenue: 9864.95, ads: 4759.43, profit: 3841.52, roas: '2.07x', status: 'Alto Volumen' },
      { name: 'Junio 2026 (Combo IA)', revenue: 15076.22, ads: 8309.74, profit: 6766.48, roas: '1.81x', status: 'Pico Máximo' },
      { name: 'Julio 2026 (Combo IA)', revenue: 7796.23, ads: 4861.13, profit: 2935.10, roas: '1.60x', status: 'Estable' },
      { name: 'Agosto 2026 (Combo IA)', revenue: 958.14, ads: 978.52, profit: -20.38, roas: '0.98x', status: 'Reestructuración' }
    ];

    tbody.innerHTML = monthsData.map(function (m) {
      return '<tr>' +
        '<td style="font-weight:700; color:#f8fafc;">' + esc(m.name) + '</td>' +
        '<td style="font-family:var(--font-mono); font-weight:800; color:var(--cyan-stark);">$' + m.revenue.toLocaleString('en-US', {minimumFractionDigits:2}) + ' USD</td>' +
        '<td style="font-family:var(--font-mono); color:var(--red-stark);">-$' + m.ads.toLocaleString('en-US', {minimumFractionDigits:2}) + ' USD</td>' +
        '<td style="font-family:var(--font-mono); font-weight:800; color:var(--green-stark);">$' + m.profit.toLocaleString('en-US', {minimumFractionDigits:2}) + ' USD</td>' +
        '<td style="font-family:var(--font-mono); color:var(--gold-stark); font-weight:700;">' + m.roas + '</td>' +
        '<td><span class="diag-badge ' + (m.profit > 0 ? 'mantener' : 'optimizar') + '">' + esc(m.status) + '</span></td>' +
        '</tr>';
    }).join('');
  }

  // NUEVA FUNCIÓN: RENDER DEUDAS
  function renderDebts() {
    if (!window.DEBTS_DATA) return;
    var data = window.DEBTS_DATA;

    var formalTbody = document.getElementById('debt-formal-tbody');
    if (formalTbody) {
      formalTbody.innerHTML = data.formalCredits.map(function (c) {
        return '<tr>' +
          '<td style="font-weight:700; color:#f8fafc;">' + esc(c.name) + '</td>' +
          '<td style="color:var(--danger); font-family:var(--font-mono); font-weight:700;">S/ ' + c.monthlyFeePEN.toLocaleString() + '</td>' +
          '<td>Día ' + c.dueDateDay + ' de cada mes</td>' +
          '<td>' + c.remainingQuota + ' cuotas</td>' +
          '<td>' + esc(c.range) + '</td>' +
          '<td style="font-family:var(--font-mono); font-weight:800; color:var(--gold-stark);">S/ ' + c.pendingBalancePEN.toLocaleString() + '</td>' +
          '</tr>';
      }).join('');
    }

    var informalTbody = document.getElementById('debt-informal-tbody');
    if (informalTbody) {
      informalTbody.innerHTML = data.informalDebts.map(function (d) {
        return '<tr>' +
          '<td style="font-weight:700; color:#f8fafc;">' + esc(d.creditor) + '</td>' +
          '<td style="color:var(--danger); font-family:var(--font-mono); font-weight:800;">S/ ' + d.amountPEN.toLocaleString() + '</td>' +
          '<td>' + esc(d.note) + '</td>' +
          '<td><span class="diag-badge optimizar">' + esc(d.priority) + '</span></td>' +
          '</tr>';
      }).join('');
    }

    var cardsTbody = document.getElementById('debt-cards-tbody');
    if (cardsTbody) {
      cardsTbody.innerHTML = data.creditCards.map(function (card) {
        return '<tr>' +
          '<td style="font-weight:700; color:#f8fafc;">' + esc(card.card) + '</td>' +
          '<td style="font-family:var(--font-mono);">S/ ' + card.balancePEN.toLocaleString() + '</td>' +
          '<td style="font-family:var(--font-mono);">' + (card.balanceUSD ? '$' + card.balanceUSD : '-') + '</td>' +
          '<td>' + (card.guaranteePEN ? 'S/ ' + card.guaranteePEN : '-') + '</td>' +
          '<td><span class="diag-badge mantener">' + esc(card.status) + '</span></td>' +
          '</tr>';
      }).join('');
    }

    var weeklyTbody = document.getElementById('debt-weekly-tbody');
    if (weeklyTbody) {
      weeklyTbody.innerHTML = data.weeklyCommitments.map(function (w) {
        return '<tr>' +
          '<td style="font-weight:700; color:#f8fafc;">' + esc(w.name) + '</td>' +
          '<td style="color:var(--warning); font-family:var(--font-mono); font-weight:700;">' + (w.weeklyFeePEN ? 'S/ ' + w.weeklyFeePEN + ' / semana' : '-') + '</td>' +
          '<td>' + (w.remainingQuotas ? 'Faltan ' + w.remainingQuotas + ' cuotas (' + esc(w.range) + ')' : esc(w.status)) + '</td>' +
          '<td><span class="diag-badge ' + (w.remainingQuotas ? 'optimizar' : 'personal') + '">' + esc(w.status) + '</span></td>' +
          '</tr>';
      }).join('');
    }

    var stepsGrid = document.getElementById('strategy-steps-grid');
    if (stepsGrid) {
      stepsGrid.innerHTML = data.strategySteps.map(function (s) {
        return '<div class="step-card"><h4>' + esc(s.title) + '</h4><p>' + esc(s.desc) + '</p></div>';
      }).join('');
    }
  }

  // NUEVA FUNCIÓN: RENDER ROADMAP
  function renderRoadmap() {
    var timeline = document.getElementById('roadmap-timeline');
    if (!timeline) return;

    var items = [
      {
        period: 'Mayo 2026',
        status: 'Lanzamiento Combo IA Pack',
        summary: 'Facturación de $9,864.95 USD con ROAS 2.07x. Retiro de Hotmart de $3,002 USD para pagos urgentes de tarjetas y amortización.',
        learnings: ['La oferta del Combo IA Pack convirtió a alto volumen.', 'Punto de Mejora: Se requiere separar el fondo de cuotas de créditos Santander y Compartamos antes de reinvertir el 100% en Ads.']
      },
      {
        period: 'Junio 2026',
        status: 'Pico de Escalamiento ($15,076 USD)',
        summary: 'Record histórico de facturación ($15,076.22 USD) impulsado por $8,309.74 USD de inversión en Meta Ads. Ganancia limpia del mes: $6,766.48 USD.',
        learnings: ['El mercado respondió a gran escala.', 'Punto de Mejora: El gasto publicitario aumentó rápido y redujo el ROAS marginal de 2.07x a 1.81x. Recomienda controlar el CPA en picos.']
      },
      {
        period: 'Julio 2026',
        status: 'Estabilización & Auditoría de Fugas',
        summary: 'Ventas de $7,796.23 USD. Se identificó fuga recurrente en 4 cobros simultáneos de Google One ($113.20 USD) y 6 suscripciones en Skool.com.',
        learnings: ['Negocio altamente rentable (Margen 60.2%).', 'Punto de Mejora: Unificar cuentas de Google Cloud y Skool para liberar +$155 USD/mes directos al flujo de caja.']
      },
      {
        period: 'Agosto — Septiembre 2026',
        status: 'Estrategia de Blindaje & Embudo Crítico',
        summary: 'Coinciden las 4 cuotas de créditos formales (Santander Arly, Compartamos, Santander Michel, Alfin Arly) por S/ 6,971 + S/ 2,000 de junta semanal.',
        learnings: ['Prioridad #1: Reservar S/ 8,971 PEN del flujo mensual para evitar mora en septiembre.', 'Prioridad #2: Cancelar tarjetas de crédito de alto interés (Scotiabank).']
      }
    ];

    timeline.innerHTML = items.map(function (it) {
      return '<div class="timeline-item">' +
        '<div class="timeline-header"><h3>' + esc(it.period) + '</h3><span class="timeline-badge">' + esc(it.status) + '</span></div>' +
        '<div class="timeline-content">' +
          '<p><strong>Resumen Financiero:</strong> ' + esc(it.summary) + '</p>' +
          '<div class="timeline-tags">' +
            it.learnings.map(function (l) { return '<span class="timeline-tag">' + esc(l) + '</span>'; }).join('') +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  var NAV_TITLES = {
    resumen: 'Resumen Stark HUD General',
    ventas_combo: 'Ventas — Combo IA Pack (Últimos 3 Meses)',
    ingresos_mes: 'Ingresos por Mes — Desglose Evolutivo 2026',
    deudas: 'Tablero General ESTRATEGIA — Control de Deudas',
    roadmap: 'Puntos de Mejora Mes a Mes — Evolución',
    gastos: 'Auditoría de Gastos & Tarjetas (Julio 2026)',
    pnl: 'Estado de Resultados (P&L Consolidado)',
    ahorro: 'Plan Ejecutivo de Optimización & Ahorro',
    productos: 'Ventas por Producto',
    paises: 'Ventas por Países',
    canales: 'Ventas por Canales',
    ventas: 'Detalle de Ventas (Tabla)'
  };

  function switchTab(target) {
    var salesMod = document.getElementById('view-sales-module');
    var comboMod = document.getElementById('view-combo-module');
    var incMesMod = document.getElementById('view-monthly-income-module');
    var debtsMod = document.getElementById('view-debts-module');
    var roadMod = document.getElementById('view-roadmap-module');
    var expMod = document.getElementById('view-expenses-module');
    var pnlMod = document.getElementById('view-pnl-module');
    var savMod = document.getElementById('view-savings-module');
    var salesTbl = document.getElementById('view-sales-table-module');

    var allMods = [salesMod, comboMod, incMesMod, debtsMod, roadMod, expMod, pnlMod, savMod, salesTbl];
    allMods.forEach(function (m) { if (m) m.style.display = 'none'; });

    if (target === 'resumen') {
      salesMod.style.display = 'block';
      salesTbl.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'ventas_combo') {
      comboMod.style.display = 'block';
      renderComboIA();
      comboMod.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (target === 'ingresos_mes') {
      incMesMod.style.display = 'block';
      renderMonthlyIncome();
      incMesMod.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (target === 'deudas') {
      debtsMod.style.display = 'block';
      renderDebts();
      debtsMod.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (target === 'roadmap') {
      roadMod.style.display = 'block';
      renderRoadmap();
      roadMod.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (target === 'gastos') {
      expMod.style.display = 'block';
      renderExpenses();
      expMod.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (target === 'pnl') {
      pnlMod.style.display = 'block';
      pnlMod.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (target === 'ahorro') {
      savMod.style.display = 'block';
      savMod.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (target === 'productos') {
      salesMod.style.display = 'block';
      document.getElementById('chart-products').closest('.chart-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (target === 'paises') {
      salesMod.style.display = 'block';
      document.getElementById('chart-countries').closest('.chart-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (target === 'canales') {
      salesMod.style.display = 'block';
      document.getElementById('chart-channels').closest('.chart-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (target === 'ventas') {
      salesMod.style.display = 'block';
      salesTbl.style.display = 'block';
      document.querySelector('.table-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function bindTopbar() {
    var search = document.getElementById('search-input');
    var debounce;
    if (search) {
      search.addEventListener('input', function () {
        clearTimeout(debounce);
        debounce = setTimeout(function () {
          state.search = search.value.trim();
          state.page = 0;
          renderAll();
          renderExpenses();
        }, 220);
      });
    }

    document.querySelectorAll('.nav-item').forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(function (x) { x.classList.remove('active'); });
        item.classList.add('active');
        var t = item.getAttribute('data-target');
        if (NAV_TITLES[t]) {
          var titleEl = document.getElementById('topbar-title');
          if (titleEl) titleEl.textContent = NAV_TITLES[t];
        }
        switchTab(t);
        var sb = document.getElementById('sidebar');
        if (sb) sb.classList.remove('open');
      });
    });

    ['exp-filter-source', 'exp-filter-type', 'exp-filter-cat'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', renderExpenses);
      }
    });

    var exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', function () { exportCsv(getVisible()); });
    }

    var toTop = document.getElementById('to-top');
    if (toTop) {
      window.addEventListener('scroll', function () {
        toTop.classList.toggle('show', window.scrollY > 500);
      });
      toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }
  }

  function bindTableSort() {
    document.querySelectorAll('thead th[data-sort]').forEach(function (th) {
      th.addEventListener('click', function () {
        var key = th.getAttribute('data-sort');
        if (state.sortKey === key) { state.sortDir = -state.sortDir; }
        else { state.sortKey = key; state.sortDir = key === 'fecha' || key === 'usd' || key === 'monto' ? -1 : 1; }
        document.querySelectorAll('thead th .arr').forEach(function (a) { a.textContent = ''; });
        var arr = th.querySelector('.arr');
        if (arr) arr.textContent = state.sortDir === 1 ? '▲' : '▼';
        renderTable(getVisible());
      });
    });
  }

  function buildPeriodSelect() {
    var selMonth = document.getElementById('sel-month');
    var selYear = document.getElementById('sel-year');
    if (!selMonth || !selYear) return;

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

    var resetBtn = document.getElementById('ps-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        state.month = null;
        state.year = 'all';
        state.page = 0;
        selMonth.value = 'all';
        selYear.value = 'all';
        renderAll();
      });
    }
  }

  // ============================================================
  // MASTER RENDER
  // ============================================================
  function renderAll() {
    var visible = getVisible();
    renderKpis(visible);
    renderRevenueChart(visible);
    renderProducts(visible);
    renderCountries(visible);
    renderChannels(visible);
    renderTable(visible);
    renderExpenses();
    renderComboIA();
    renderMonthlyIncome();
    renderDebts();
    renderRoadmap();
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
  initReveal();
  lock();
})();
