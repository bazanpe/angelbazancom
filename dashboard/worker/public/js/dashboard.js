(function () {
  'use strict';

  var USER_EMAIL = 'zangelbazan@gmail.com';
  var ACCESS_PASS = '203955bazan';
  var SESSION_KEY = 'stark_session';
  var FX = 3.75;
  var MONTHS_LONG = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  function fmtUSD(n) { return 'US$ ' + Math.round(n).toLocaleString('en-US'); }
  function fmtUSD2(n) { return 'US$ ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function fmtPEN(n) { return 'S/ ' + Math.round(n).toLocaleString('en-US'); }
  function usdEquiv(pen) { return '$' + Math.round(pen / FX).toLocaleString('en-US'); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var comboMonths = function () {
    if (!window.COMBO_IA_DATA || !window.COMBO_IA_DATA.months) return [];
    return window.COMBO_IA_DATA.months.filter(function (m) { return m.month.indexOf('Agosto') === -1; });
  }();

  var hotmartData = window.HOTMART_DATA || null;
  function hotmartFor(m) {
    if (!hotmartData || !hotmartData.months || !m) return 0;
    var v = hotmartData.months[m.month];
    return v ? v : 0;
  }
  function hotmartTotal() {
    var t = 0;
    if (hotmartData && hotmartData.months) Object.keys(hotmartData.months).forEach(function (k) { t += hotmartData.months[k]; });
    return t;
  }

  var extraMonths = [
    { month: 'Enero 2026', revenueUSD: 0, adsUSD: 0, toolsUSD: 0, withdrawalsUSD: 0, profitUSD: 0, roas: 0, countries: [], highlights: 'Ingresos low ticket v\u00EDa retiros Hotmart.' },
    { month: 'Febrero 2026', revenueUSD: 0, adsUSD: 0, toolsUSD: 0, withdrawalsUSD: 0, profitUSD: 0, roas: 0, countries: [], highlights: 'Ingresos low ticket v\u00EDa retiros Hotmart.' },
    { month: 'Marzo 2026', revenueUSD: 0, adsUSD: 0, toolsUSD: 0, withdrawalsUSD: 0, profitUSD: 0, roas: 0, countries: [], highlights: 'Ingresos low ticket v\u00EDa retiros Hotmart.' },
    { month: 'Abril 2026', revenueUSD: 0, adsUSD: 0, toolsUSD: 0, withdrawalsUSD: 0, profitUSD: 0, roas: 0, countries: [], highlights: 'Ingresos low ticket v\u00EDa retiros Hotmart.' }
  ];
  var fullMonths = extraMonths.concat(comboMonths);

  var debts = window.DEBTS_DATA || null;
  var formalCredits = debts ? debts.formalCredits || [] : [];
  var expSum = window.EXPENSES_DATA ? window.EXPENSES_DATA.summary : null;
  var expItems = window.EXPENSES_DATA ? window.EXPENSES_DATA.items : [];
  var extras0 = loadExtras();
  if (extras0.length) expItems = expItems.concat(extras0);

  function julyMonth() {
    for (var i = 0; i < comboMonths.length; i++) if (comboMonths[i].month.indexOf('Julio') !== -1) return comboMonths[i];
    return null;
  }
  var julio = julyMonth();

  var ingresos = julio ? julio.revenueUSD : 0;
  var gastos = expSum ? (expSum.totalBusinessUSD + expSum.totalPersonalUSD) : 0;
  if (extras0 && extras0.length) extras0.forEach(function (e) { gastos += e.usd; });
  var saldo = ingresos - gastos;

  var MONTHS = fullMonths.slice();
  var state = { mIdx: MONTHS.length - 1 };
  function selectedMonth() { return MONTHS[state.mIdx] || null; }
  function monthIngresos() { var m = selectedMonth(); return m ? m.revenueUSD : 0; }
  function monthGastos() {
    var m = selectedMonth();
    if (!m) return 0;
    if (m.month.indexOf('Julio') !== -1) return gastos;
    return (m.adsUSD || 0) + (m.toolsUSD || 0);
  }
  function monthSaldo() { return monthIngresos() - monthGastos(); }
  function monthLabel() { var m = selectedMonth(); return m ? m.month : '\u2014'; }
  function monthIsJuly() { var m = selectedMonth(); return !!m && m.month.indexOf('Julio') !== -1; }
  function monthIngresosReal() { var m = selectedMonth(); return m ? m.revenueUSD + hotmartFor(m) : 0; }
  function monthGastosReal() {
    var m = selectedMonth();
    if (!m) return 0;
    return (m.adsUSD || 0) + (m.toolsUSD || 0) + (m.withdrawalsUSD || 0);
  }
  function monthProfitReal() { return monthIngresosReal() - monthGastosReal(); }
  var deudasMes = debts ? debts.summary.totalMonthlyCommitmentCurrentPEN : 8971;
  var deudaMin = debts ? debts.summary.totalDebtEstimatedMinPEN : 165000;
  var deudaMax = debts ? debts.summary.totalDebtEstimatedMaxPEN : 185000;
  var disponible = debts ? debts.summary.liquidAssetsPEN : 4000;
  var ahorroPotencial = expSum ? (expSum.potentialMonthlySavingsUSD || 0) : 155;
  var META = 7600;
  var metaPct = Math.min(100, Math.round((saldo / META) * 100));
  var warda = expSum ? expSum.wardaSavingsPEN : 4301.03;

  // ============================================================
  // GATE
  // ============================================================
  var gate = document.getElementById('gate');
  var gateInput = document.getElementById('gate-input');
  var gateEmail = document.getElementById('gate-email');
  var gateError = document.getElementById('gate-error');
  var appShell = document.querySelector('.app-shell');

  function unlock() {
    appShell.classList.add('unlocked');
    gate.classList.add('hidden');
    try { localStorage.setItem(SESSION_KEY, '1'); } catch (e) {}
    var st = document.getElementById('lock-status-text');
    if (st) st.textContent = 'Sesión privada activa';
  }
  function lock() {
    appShell.classList.remove('unlocked');
    gate.classList.remove('hidden');
    if (gateInput) gateInput.value = '';
    if (gateEmail) gateEmail.value = '';
    if (gateError) gateError.textContent = '';
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
    var st = document.getElementById('lock-status-text');
    if (st) st.textContent = 'Sesión cerrada';
  }
  function tryUnlock() {
    var em = gateEmail ? gateEmail.value.trim().toLowerCase() : '';
    var pw = gateInput ? gateInput.value : '';
    if (!em || !pw) { gateError.textContent = 'Ingresa tu usuario y contraseña.'; return; }
    if (em === USER_EMAIL && pw === ACCESS_PASS) { gateError.textContent = ''; unlock(); }
    else {
      gateError.textContent = 'Usuario o contraseña incorrectos. Inténtalo de nuevo.';
      var card = document.getElementById('gate-card');
      card.classList.remove('gate-shake'); void card.offsetWidth; card.classList.add('gate-shake');
    }
  }
  document.getElementById('gate-btn').addEventListener('click', tryUnlock);
  if (gateEmail) gateEmail.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryUnlock(); });
  gateInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryUnlock(); });
  document.getElementById('gate-eye').addEventListener('click', function () {
    var isPass = gateInput.type === 'password';
    gateInput.type = isPass ? 'text' : 'password';
    this.classList.toggle('off', isPass);
  });
  document.getElementById('lock-btn').addEventListener('click', lock);
  var sideLock = document.querySelector('.sidebar .lock-chip');
  if (sideLock) sideLock.addEventListener('click', lock);
  var syncT = document.getElementById('sync-time');
  if (syncT) {
    var now = new Date();
    var h = now.getHours(); var m = now.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    var h12 = h % 12 || 12;
    syncT.textContent = 'Hoy, ' + h12 + ':' + ('0' + m).slice(-2) + ' ' + ampm;
  }

  // ============================================================
  // SONIDO + TOAST
  // ============================================================
  var audioCtx = null;
  function playChime() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      var now = audioCtx.currentTime;
      [880, 1174.66, 1567.98].forEach(function (f, i) {
        var osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
        osc.type = 'sine'; osc.frequency.value = f;
        gain.gain.setValueAtTime(0.0001, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.25, now + i * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.4);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now + i * 0.12); osc.stop(now + i * 0.12 + 0.45);
      });
    } catch (e) {}
  }
  function showToast(title, msg) {
    var wrap = document.getElementById('toast-wrap');
    if (!wrap) return;
    var t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = '<div class="toast-title">' + title + '</div><div class="toast-msg">' + msg + '</div>';
    wrap.appendChild(t);
    setTimeout(function () { t.classList.add('out'); }, 4200);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 4800);
  }
  document.getElementById('notify-btn').addEventListener('click', function () {
    playChime();
    showToast('Recordatorio', 'Hora de revisar tu flujo y tus compromisos del mes.');
    var dot = document.getElementById('notify-dot');
    dot.classList.add('ping');
    setTimeout(function () { dot.classList.remove('ping'); }, 900);
  });

  // ============================================================
  // RENDER: RESUMEN
  // ============================================================
  function renderHero() {
    var profit = monthProfitReal();
    var hv = document.getElementById('hero-saldo');
    if (hv) { hv.textContent = fmtUSD(profit); hv.style.color = profit >= 0 ? '' : 'var(--red)'; }
    var lbl = document.querySelector('.hero-eyebrow');
    if (lbl) lbl.textContent = 'PROFIT REAL DEL MES \u00B7 ' + monthLabel().toUpperCase();
    var cur = selectedMonth();
    var prev = null;
    for (var i = 0; i < fullMonths.length; i++) if (fullMonths[i].month === cur.month && i > 0) prev = fullMonths[i - 1];
    var prevProfit = prev ? (prev.revenueUSD + hotmartFor(prev) - (prev.adsUSD || 0) - (prev.toolsUSD || 0) - (prev.withdrawalsUSD || 0)) : 0;
    var chg = prevProfit > 0 ? ((profit - prevProfit) / prevProfit) * 100 : 0;
    var growth = document.getElementById('hero-growth');
    if (growth) {
      var ingresosM = monthIngresosReal();
      var margin = ingresosM > 0 ? (profit / ingresosM) * 100 : 0;
      var faltaM = Math.max(0, META - saldo);
      growth.innerHTML = 'Beneficio neto: <b>' + fmtUSD(profit) + '</b> \u00B7 Margen del mes: ' + margin.toFixed(1) + '%' +
        (saldo < META ? ' \u00B7 ' + fmtUSD(faltaM) + ' por debajo de la meta' : ' \u00B7 meta alcanzada');
      growth.className = 'hero-growth ' + (profit >= 0 ? 'up' : 'down');
    }
    var mpct = Math.min(100, Math.round((saldo / META) * 100));
    var pctEl = document.getElementById('meta-pct');
    if (pctEl) pctEl.textContent = mpct + '%';
    var msub = document.getElementById('meta-sub');
    if (msub) msub.textContent = fmtUSD(Math.max(0, saldo)) + ' de ' + fmtUSD(META) + ' alcanzado';
    var ring = document.getElementById('meta-ring-fill');
    if (ring) {
      var dash = Math.max(0, Math.min(314, (mpct / 100) * 314));
      ring.setAttribute('stroke-dashoffset', (314 - dash).toFixed(1));
    }
  }

  function renderMinis() {
    document.getElementById('mini-ingresos').textContent = fmtUSD(monthIngresosReal());
    document.getElementById('mini-gastos').textContent = fmtUSD(monthGastosReal());
    document.getElementById('mini-deudas').textContent = fmtUSD(deudasMes / FX);
    var cur = selectedMonth();
    var prev = null;
    for (var i = 0; i < fullMonths.length; i++) if (fullMonths[i].month === cur.month && i > 0) prev = fullMonths[i - 1];
    var prevIng = prev ? prev.revenueUSD + hotmartFor(prev) : 0;
    var prevGas = prev ? (prev.adsUSD || 0) + (prev.toolsUSD || 0) + (prev.withdrawalsUSD || 0) : 0;
    function varHtml(curV, prevV) {
      if (prevV <= 0) return '';
      var c = ((curV - prevV) / prevV) * 100;
      return (c >= 0 ? '\u2191 +' : '\u2193 ') + Math.abs(c).toFixed(1) + '% vs. ' + (prev ? prev.month.split(' ')[0] : '');
    }
    var vIng = varHtml(monthIngresosReal(), prevIng);
    var vGas = varHtml(monthGastosReal(), prevGas);
    var elVI = document.getElementById('mini-var-ingresos');
    if (elVI) { elVI.textContent = vIng; elVI.className = 'mini-var ' + (vIng.indexOf('\u2193') === 0 ? 'down' : 'up'); }
    var elVG = document.getElementById('mini-var-gastos');
    if (elVG) { elVG.textContent = vGas; elVG.className = 'mini-var ' + (vGas.indexOf('\u2193') === 0 ? 'up' : 'down'); }
    var dc = document.getElementById('mini-deudas');
    if (dc) {
      var dsub = dc.closest('.mini-card').querySelector('.mini-sub');
      if (dsub) dsub.textContent = 'S/ ' + deudasMes.toLocaleString() + ' \u00B7 cr\u00E9ditos + junta + pap\u00E1';
    }
    var card = document.getElementById('mini-ingresos');
    if (card) {
      var sub = card.closest('.mini-card').querySelector('.mini-sub');
      if (sub) sub.textContent = monthLabel() + ' \u00B7 Combo + Low Ticket';
    }
    var gc = document.getElementById('mini-gastos');
    if (gc) {
      var sub2 = gc.closest('.mini-card').querySelector('.mini-sub');
      if (sub2) sub2.textContent = monthIsJuly() ? 'Pauta + Herramientas + Retiros + Personal' : 'Pauta + Herramientas + Retiros';
    }
  }

  function setAlert(id, ok, html) {
    var el = document.getElementById(id);
    if (!el) return;
    el.className = 'sec-alert ' + (ok ? 'ok' : 'warn');
    el.innerHTML = html;
  }

  function renderResumenIngresos() {
    var el = document.getElementById('chart-flow');
    if (!el) return;
    var m = selectedMonth();
    var combo = m ? m.revenueUSD : 0;
    var hm = hotmartFor(m);
    var total = combo + hm;
    var rows = [
      { label: 'Ventas Combo IA', v: combo, color: '#25E77A' },
      { label: 'Retiros Hotmart (low ticket)', v: hm, color: '#27A9FF' }
    ];
    var maxRow = Math.max(1, combo, hm);
    var W = 560, H = 185, padT = 12, padB = 24, padL = 48, padR = 12;
    var data = fullMonths.map(function (mm) {
      return { label: mm.month.split(' ')[0], inc: mm.revenueUSD + hotmartFor(mm), exp: (mm.adsUSD || 0) + (mm.toolsUSD || 0) + (mm.withdrawalsUSD || 0) };
    });
    var maxV = 1;
    data.forEach(function (d) { maxV = Math.max(maxV, d.inc, d.exp); });
    var iw = W - padL - padR, ih = H - padT - padB;
    function px(i) { return padL + (data.length > 1 ? iw * i / (data.length - 1) : iw / 2); }
    function py(v) { return padT + ih - (v / maxV) * ih; }
    function line(key) {
      var d = '';
      data.forEach(function (p, i) { d += (i ? ' L ' : 'M ') + px(i).toFixed(1) + ' ' + py(p[key]).toFixed(1); });
      return d;
    }
    var incP = line('inc'), expP = line('exp');
    var area = incP + ' L ' + px(data.length - 1).toFixed(1) + ' ' + (padT + ih) + ' L ' + px(0).toFixed(1) + ' ' + (padT + ih) + ' Z';
    var grid = '';
    for (var g = 0; g <= 3; g++) {
      var v = maxV * (g / 3), gy = py(v);
      grid += '<line x1="' + padL + '" y1="' + gy + '" x2="' + (W - padR) + '" y2="' + gy + '" stroke="rgba(39,169,255,0.07)"/>';
      grid += '<text x="' + (padL - 6) + '" y="' + (gy + 3) + '" fill="#6E7F99" font-size="9" text-anchor="end" font-family="JetBrains Mono, monospace">' + fmtUSD(v) + '</text>';
    }
    var labels = data.map(function (d, i) {
      return '<text x="' + px(i) + '" y="' + (H - 6) + '" fill="#6E7F99" font-size="9.5" text-anchor="middle">' + esc(d.label) + '</text>';
    }).join('');
    var dots = data.map(function (d, i) {
      return '<circle cx="' + px(i) + '" cy="' + py(d.inc) + '" r="3.5" fill="#25E77A" data-tip="' + esc(d.label + ' \u00B7 Ingresos ' + fmtUSD(d.inc)) + '" style="filter:drop-shadow(0 0 4px rgba(37,231,122,0.7));"/>' +
        '<circle cx="' + px(i) + '" cy="' + py(d.exp) + '" r="3" fill="#27A9FF" data-tip="' + esc(d.label + ' \u00B7 Gastos ' + fmtUSD(d.exp)) + '" style="filter:drop-shadow(0 0 4px rgba(39,169,255,0.7));"/>';
    }).join('');
    el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" style="width:100%;height:auto;">' +
      '<defs><linearGradient id="incArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#25E77A" stop-opacity="0.3"/><stop offset="100%" stop-color="#25E77A" stop-opacity="0"/></linearGradient></defs>' +
      grid +
      '<path d="' + area + '" fill="url(#incArea)"/>' +
      '<path d="' + incP + '" fill="none" stroke="#25E77A" stroke-width="2.5" stroke-linecap="round" style="filter:drop-shadow(0 0 7px rgba(37,231,122,0.55));"/>' +
      '<path d="' + expP + '" fill="none" stroke="#27A9FF" stroke-width="2" stroke-linecap="round" stroke-dasharray="5 4" style="filter:drop-shadow(0 0 6px rgba(39,169,255,0.45));"/>' +
      dots + labels +
      '</svg>' +
      '<div class="chart-legend"><span class="lg-dot" style="background:#25E77A"></span> Ingresos <span class="lg-dot" style="background:#27A9FF;margin-left:14px;"></span> Gastos</div>' +
      '<div class="cat-bars">' + rows.map(function (r) {
        var pct = Math.round((r.v / maxRow) * 100);
        return '<div class="cat-row">' +
          '<div class="cat-head"><span>' + esc(r.label) + '</span><span style="color:' + r.color + ';font-family:JetBrains Mono,monospace;font-weight:700;">' + fmtUSD(r.v) + '</span></div>' +
          '<div class="cat-track"><div class="cat-fill" style="width:' + Math.max(2, pct) + '%;background:' + r.color + ';"></div></div></div>';
      }).join('') +
      '<div class="desglose-total up"><span>Total ingresos del mes</span><b>' + fmtUSD(total) + '</b></div>' +
      '</div>';
  }

  function openMonthModal(mo) {
    var body = document.getElementById('month-modal-body');
    var modal = document.getElementById('month-modal');
    if (!body || !modal) return;
    var m = null;
    for (var i = 0; i < fullMonths.length; i++) if (fullMonths[i].month === mo) { m = fullMonths[i]; break; }
    if (!m) return;
    var hm = hotmartFor(m);
    var g = (m.adsUSD || 0) + (m.toolsUSD || 0) + (m.withdrawalsUSD || 0);
    var s = (m.revenueUSD + hm) - g;
    var ok = s >= 0;
    var ctry = (m.countries || []).map(function (c) {
      return '<tr><td class="cell-title">' + esc(c.country) + '</td>' +
        '<td style="color:var(--amber);font-family:JetBrains Mono,monospace;">−' + fmtUSD(c.ads) + '</td>' +
        '<td class="amt-inc">' + fmtUSD(c.revenue) + '</td>' +
        '<td style="color:var(--green);font-family:JetBrains Mono,monospace;font-weight:700;">' + fmtUSD(c.profit) + '</td></tr>';
    }).join('');
    body.innerHTML = '<div class="modal-head"><h3>' + esc(mo) + '</h3><span class="rk-badge ' + (ok ? 'ok' : 'bad') + '">' + (ok ? 'Positivo' : 'Revisar') + '</span></div>' +
      '<div class="ing-metrics">' +
      '<div class="ing-metric"><span class="ing-label">Ventas Combo IA</span><span class="ing-value up">' + fmtUSD(m.revenueUSD) + '</span></div>' +
      '<div class="ing-metric"><span class="ing-label">Low Ticket Hotmart</span><span class="ing-value up" style="color:#6EA8FF;">' + fmtUSD(hm) + '</span></div>' +
      '<div class="ing-metric"><span class="ing-label">Ingresos totales</span><span class="ing-value up">' + fmtUSD(m.revenueUSD + hm) + '</span></div>' +
      '<div class="ing-metric"><span class="ing-label">Gasto pauta</span><span class="ing-value down">−' + fmtUSD(m.adsUSD || 0) + '</span></div>' +
      '<div class="ing-metric"><span class="ing-label">Herramientas</span><span class="ing-value down">−' + fmtUSD(m.toolsUSD || 0) + '</span></div>' +
      '<div class="ing-metric"><span class="ing-label">Retiros</span><span class="ing-value down">−' + fmtUSD(m.withdrawalsUSD || 0) + '</span></div>' +
      '<div class="ing-metric"><span class="ing-label">Ganancia neta</span><span class="ing-value up">' + fmtUSD(m.profitUSD) + '</span></div>' +
      '<div class="ing-metric"><span class="ing-label">ROAS</span><span class="ing-value up">' + m.roas.toFixed(2) + 'x</span></div>' +
      '</div>' +
      (m.highlights ? '<div class="ing-highlight">💡 <b>Destacado:</b> ' + esc(m.highlights) + '</div>' : '') +
      '<table class="tbl tbl-sm"><thead><tr><th>País</th><th>Pauta</th><th>Ingresos</th><th>Ganancia</th></tr></thead><tbody>' + ctry + '</tbody></table>' +
      '<div class="modal-foot"><button class="btn-add" id="month-modal-dl">⬇️ Descargar este mes</button></div>';
    var dl = document.getElementById('month-modal-dl');
    if (dl) dl.addEventListener('click', function () {
      var rows = [
        ['Concepto', 'Valor (USD)'],
        ['Ventas Combo IA', m.revenueUSD],
        ['Retiros Hotmart (low ticket)', hm],
        ['Ingresos totales', m.revenueUSD + hm],
        ['Gasto pauta', m.adsUSD || 0],
        ['Herramientas', m.toolsUSD || 0],
        ['Retiros', m.withdrawalsUSD || 0],
        ['Ganancia neta', m.profitUSD || 0],
        ['ROAS', m.roas]
      ];
      if ((m.countries || []).length) {
        rows.push(['', ''], ['Pa\u00EDs', 'Pauta', 'Ingresos', 'Ganancia']);
        m.countries.forEach(function (c) { rows.push([c.country, c.ads, c.revenue, c.profit]); });
      }
      downloadCsv('stark_mes_' + m.month.replace(/ /g, '_') + '.csv', rows);
      showToast('Exportado', 'Mes ' + m.month + ' descargado.');
    });
    modal.style.display = 'flex';
  }
  function closeMonthModal() {
    var modal = document.getElementById('month-modal');
    if (modal) modal.style.display = 'none';
  }
  function openInfoModal(title, html) {
    var body = document.getElementById('month-modal-body');
    var modal = document.getElementById('month-modal');
    if (!body || !modal) return;
    body.innerHTML = '<div class="modal-head"><h3>' + title + '</h3></div>' + html;
    modal.style.display = 'flex';
  }
  function openIngresosPopup() {
    var m = selectedMonth();
    var combo = m ? m.revenueUSD : 0;
    var hm = hotmartFor(m);
    openInfoModal('📈 Ingresos del mes \u00B7 ' + monthLabel(),
      '<div class="ing-metrics">' +
      '<div class="ing-metric"><span class="ing-label">Ventas Combo IA</span><span class="ing-value up">' + fmtUSD(combo) + '</span></div>' +
      '<div class="ing-metric"><span class="ing-label">Low Ticket Hotmart</span><span class="ing-value up" style="color:#6EA8FF;">' + fmtUSD(hm) + '</span></div>' +
      '<div class="ing-metric"><span class="ing-label">Ingresos totales</span><span class="ing-value up">' + fmtUSD(combo + hm) + '</span></div>' +
      '</div>' +
      '<div class="ing-highlight">⭐ Mejor mes: <b>' + (comboMonths.length ? comboMonths.reduce(function (a, b) { return a.revenueUSD > b.revenueUSD ? a : b; }).month : '—') + '</b> \u00B7 Low Ticket promedio: US$ 1,306/mes.</div>');
  }
  function openGastosPopup() {
    var m = selectedMonth();
    var ads = m ? (m.adsUSD || 0) : 0;
    var tools = m ? (m.toolsUSD || 0) : 0;
    var ret = m ? (m.withdrawalsUSD || 0) : 0;
    var total = ads + tools + ret;
    openInfoModal('💸 Gastos del mes \u00B7 ' + monthLabel(),
      '<div class="ing-metrics">' +
      '<div class="ing-metric"><span class="ing-label">Pauta (ads)</span><span class="ing-value down">−' + fmtUSD(ads) + '</span></div>' +
      '<div class="ing-metric"><span class="ing-label">Herramientas</span><span class="ing-value down">−' + fmtUSD(tools) + '</span></div>' +
      '<div class="ing-metric"><span class="ing-label">Retiros</span><span class="ing-value down">−' + fmtUSD(ret) + '</span></div>' +
      '<div class="ing-metric"><span class="ing-label">Total gastos</span><span class="ing-value down">−' + fmtUSD(total) + '</span></div>' +
      '</div>' +
      '<div class="ing-highlight">💡 Fugas detectadas: <b>+$134/mes</b> (Google One +$80, Skool \u00D76 +$30, IA duplicada +$23.60, OpenAI \u00D72 en enero).</div>');
  }
  function openDeudasPopup() {
    var junta = (debts && debts.weeklyCommitments && debts.weeklyCommitments[0]) ? debts.weeklyCommitments[0].weeklyFeePEN : 500;
    var cred = formalCredits.reduce(function (s, c) { return s + c.monthlyFeePEN; }, 0);
    var suma = cred + junta * 4;
    var rows = formalCredits.map(function (c) {
      return '<tr><td class="cell-title">' + esc(c.name) + (c.interestOnly ? ' <span class="usd-mini" style="color:var(--red);">URGENTE</span>' : '') + '</td>' +
        '<td>D\u00EDa ' + c.dueDateDay + '</td>' +
        '<td class="amt-exp">S/ ' + c.monthlyFeePEN.toLocaleString() + ' <span class="usd-mini">\u2248 ' + usdEquiv(c.monthlyFeePEN) + '</span></td></tr>';
    }).join('');
    rows += '<tr><td class="cell-title">Junta Sandra</td><td>S/ 500/sem</td><td class="amt-exp">S/ 2,000/mes <span class="usd-mini">otras deudas</span></td></tr>';
    openInfoModal('💳 Deudas del mes \u00B7 ' + monthLabel(),
      '<div class="ing-metrics">' +
      '<div class="ing-metric"><span class="ing-label">Cr\u00E9ditos formales</span><span class="ing-value down">' + fmtUSD(cred / FX) + '</span></div>' +
      '<div class="ing-metric"><span class="ing-label">Junta mensual</span><span class="ing-value down">' + fmtUSD(junta * 4 / FX) + '</span></div>' +
      '<div class="ing-metric"><span class="ing-label">Total del mes</span><span class="ing-value down">≈ ' + fmtUSD(suma / FX) + '</span></div>' +
      '</div>' +
      '<div class="ing-highlight">💰 <b>S/ ' + suma.toLocaleString() + ' (\u2248 ' + fmtUSD(suma / FX) + ')</b> este mes. Septiembre es cr\u00EDtico: aparta S/ 9,221 hoy.</div>' +
      '<table class="tbl tbl-sm"><thead><tr><th>Compromiso</th><th>Vence</th><th>Monto</th></tr></thead><tbody>' + rows + '</tbody></table>');
  }

  function renderGastosDesglose() {
    var el = document.getElementById('chart-cat');
    if (!el) return;
    var m = selectedMonth();
    var ads = m ? (m.adsUSD || 0) : 0;
    var tools = m ? (m.toolsUSD || 0) : 0;
    var retiros = m ? (m.withdrawalsUSD || 0) : 0;
    var total = ads + tools + retiros;
    var rows = [
      { label: 'Pauta (ads)', v: ads, color: '#27A9FF' },
      { label: 'Herramientas', v: tools, color: '#206BFF' },
      { label: 'Retiros', v: retiros, color: '#F5A524' }
    ].filter(function (r) { return r.v > 0; });
    var max = Math.max(1, total);
    var vbars = rows.map(function (r) {
      var h = Math.max(6, Math.round((r.v / max) * 100));
      return '<div class="vbar-wrap" data-tip="' + esc(r.label + ' \u00B7 ' + fmtUSD(r.v)) + '">' +
        '<div class="vbar-val">' + fmtUSD(r.v) + '</div>' +
        '<div class="vbar" style="height:' + h + '%;background:linear-gradient(180deg,' + r.color + ',rgba(39,169,255,0.2));box-shadow:0 0 16px ' + r.color + '55;"></div>' +
        '<div class="vbar-label">' + esc(r.label) + '</div></div>';
    }).join('');
    el.innerHTML = '<div class="vbar-chart">' + vbars + '</div>' +
      '<div class="cat-bars">' + rows.map(function (r) {
        var pct = Math.round((r.v / max) * 100);
        return '<div class="cat-row">' +
          '<div class="cat-head"><span>' + esc(r.label) + '</span><span style="color:' + r.color + ';font-family:JetBrains Mono,monospace;font-weight:700;">' + fmtUSD(r.v) + '</span></div>' +
          '<div class="cat-track"><div class="cat-fill" style="width:' + Math.max(2, pct) + '%;background:' + r.color + ';"></div></div></div>';
      }).join('') +
      '<div class="desglose-total down"><span>Total gastos del mes</span><b>' + fmtUSD(total) + '</b></div>' +
      '</div>';
  }

  function renderPersonal() {
    var tb = document.getElementById('personal-tbody');
    var tot = document.getElementById('personal-total');
    var kpis = document.getElementById('personal-kpis');
    var charts = document.getElementById('personal-charts');
    if (!tb || !window.PERSONAL_DATA) return;
    var months = ['Enero 2026', 'Febrero 2026', 'Marzo 2026', 'Abril 2026', 'Mayo 2026', 'Junio 2026', 'Julio 2026'];
    function s(n) { return 'S/ ' + n.toLocaleString('en-US', { minimumFractionDigits: 2 }); }
    var tIn = 0, tOut = 0, rows = '';
    var chartData = months.map(function (mo) {
      var row = { mo: mo, bcp: null, sco: null };
      window.PERSONAL_DATA.accounts.forEach(function (acc) {
        var m = acc.months[mo];
        if (!m) return;
        if (acc.bank === 'BCP') row.bcp = m; else row.sco = m;
      });
      return row;
    });
    chartData.forEach(function (r) {
      var ent = (r.bcp ? r.bcp.entradas : 0) + (r.sco ? r.sco.entradas : 0);
      var sal = (r.bcp ? r.bcp.salidas : 0) + (r.sco ? r.sco.salidas : 0);
      var fin = (r.bcp ? r.bcp.fin : 0) + (r.sco ? r.sco.fin : 0);
      tIn += ent; tOut += sal;
      rows += '<tr><td class="cell-title">' + r.mo + '</td>' +
        '<td style="font-family:JetBrains Mono,monospace;">' + s(r.bcp ? r.bcp.ant : 0) + '</td>' +
        '<td class="amt-inc">' + s(r.bcp ? r.bcp.entradas : 0) + '</td>' +
        '<td class="amt-exp">' + s(r.bcp ? r.bcp.salidas : 0) + '</td>' +
        '<td style="font-family:JetBrains Mono,monospace;">' + s(r.bcp ? r.bcp.fin : 0) + '</td>' +
        '<td style="font-family:JetBrains Mono,monospace;">' + s(r.sco ? r.sco.ant : 0) + '</td>' +
        '<td class="amt-inc">' + s(r.sco ? r.sco.entradas : 0) + '</td>' +
        '<td class="amt-exp">' + s(r.sco ? r.sco.salidas : 0) + '</td>' +
        '<td style="font-family:JetBrains Mono,monospace;">' + s(r.sco ? r.sco.fin : 0) + '</td>' +
        '<td style="font-family:JetBrains Mono,monospace;font-weight:800;color:var(--text-title);">' + s(fin) + '</td></tr>';
    });
    tb.innerHTML = rows;
    if (tot) tot.textContent = 'Entradas totales: ' + s(tIn) + ' \u00B7 Salidas totales: ' + s(tOut);
    var quema = [];
    chartData.forEach(function (r) {
      var ent = (r.bcp ? r.bcp.entradas : 0) + (r.sco ? r.sco.entradas : 0);
      var sal = (r.bcp ? r.bcp.salidas : 0) + (r.sco ? r.sco.salidas : 0);
      if (sal > ent) quema.push('<b>' + r.mo + '</b>');
    });
    setAlert('personal-alert', !quema.length, quema.length
      ? '⚠️ Meses donde las salidas superaron las entradas: ' + quema.join(', ') + '. Revisa los cargos de tus cuentas de ahorro.'
      : '✅ Ahorros estables: entradas y salidas equilibradas en ambos bancos.');
    renderPersonalCharts(chartData, tIn, tOut, kpis, charts);
  }

  function renderPersonalCharts(data, tIn, tOut, kpis, charts) {
    if (!kpis && !charts) return;
    var maxEnt = 1;
    data.forEach(function (r) {
      var ent = (r.bcp ? r.bcp.entradas : 0) + (r.sco ? r.sco.entradas : 0);
      if (ent > maxEnt) maxEnt = ent;
    });
    var totals = data.map(function (r) {
      return { mo: r.mo, fin: (r.bcp ? r.bcp.fin : 0) + (r.sco ? r.sco.fin : 0), ent: (r.bcp ? r.bcp.entradas : 0) + (r.sco ? r.sco.entradas : 0), sal: (r.bcp ? r.bcp.salidas : 0) + (r.sco ? r.sco.salidas : 0) };
    });
    var lastFin = totals.length ? totals[totals.length - 1].fin : 0;
    var maxFin = 1;
    totals.forEach(function (t) { if (t.fin > maxFin) maxFin = t.fin; });
    if (kpis) {
      var mejor = totals.reduce(function (best, t) {
        var net = t.ent - t.sal;
        return !best || net > best.net ? { mo: t.mo, net: net } : best;
      }, null);
      kpis.innerHTML = [
        ['Saldo final \u00FAltimo mes', 'S/ ' + lastFin.toLocaleString('en-US', { minimumFractionDigits: 2 })],
        ['Flujo neto total', (tIn - tOut >= 0 ? '+' : '\u2212') + 'S/ ' + Math.abs(tIn - tOut).toLocaleString('en-US', { minimumFractionDigits: 2 })],
        ['Mejor mes de flujo', mejor ? mejor.mo.replace(' 2026', '') + ' (+S/ ' + mejor.net.toLocaleString('en-US') + ')' : '\u2014']
      ].map(function (k) {
        return '<div class="rk-card"><span class="rk-label">' + k[0] + '</span><span class="rk-value">' + k[1] + '</span></div>';
      }).join('');
    }
    if (charts) {
      var barsHtml = '<div class="pc-legend"><span class="sw" style="background:var(--green)"></span> Entradas <span class="sw" style="background:var(--amber)"></span> Salidas</div>' +
        '<div class="vbar-chart">' +
        data.map(function (r) {
          var ent = (r.bcp ? r.bcp.entradas : 0) + (r.sco ? r.sco.entradas : 0);
          var sal = (r.bcp ? r.bcp.salidas : 0) + (r.sco ? r.sco.salidas : 0);
          var he = Math.max(4, Math.round(ent / maxEnt * 100));
          var hs = Math.max(4, Math.round(sal / maxEnt * 100));
          return '<div class="vbar-wrap">' +
            '<div class="pc-pair">' +
            '<div class="vbar" style="height:' + he + '%;background:linear-gradient(180deg,#20E87B,#0f8f4c);"></div>' +
            '<div class="vbar" style="height:' + hs + '%;background:linear-gradient(180deg,#F5B942,#8a5a12);"></div>' +
            '</div>' +
            '<div class="vbar-label">' + r.mo.split(' ')[0] + '</div>' +
            '</div>';
        }).join('') +
        '</div>';
      var W = 600, H = 130, pad = 12;
      var pts = totals.map(function (t, i) {
        var x = pad + (totals.length > 1 ? i * ((W - pad * 2) / (totals.length - 1)) : 0);
        var y = H - pad - (t.fin / maxFin) * (H - pad * 2);
        return { x: x, y: y };
      });
      var line = pts.map(function (p, i) { return (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1); }).join(' ');
      var area = line + ' L ' + (pts.length ? pts[pts.length - 1].x : 0) + ' ' + (H - pad) + ' L ' + (pts.length ? pts[0].x : 0) + ' ' + (H - pad) + ' Z';
      charts.innerHTML = barsHtml +
        '<div class="pc-fin-title">Evoluci\u00F3n del saldo final por mes</div>' +
        '<svg viewBox="0 0 ' + W + ' ' + H + '" class="pc-line" preserveAspectRatio="none">' +
        '<defs><linearGradient id="pcg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#20E87B" stop-opacity="0.3"/><stop offset="100%" stop-color="#20E87B" stop-opacity="0"/></linearGradient></defs>' +
        '<path d="' + area + '" fill="url(#pcg)"></path>' +
        '<path d="' + line + '" fill="none" stroke="#20E87B" stroke-width="2" stroke-linecap="round"></path>' +
        '</svg>' +
        '<div class="pc-dots">' + totals.map(function (t) {
          return '<span class="pc-dot-label" title="' + t.mo + '">' + t.mo.split(' ')[0] + ' · S/ ' + t.fin.toLocaleString('en-US') + '</span>';
        }).join('') + '</div>';
    }
  }

  function renderWeekActions() {
    var el = document.getElementById('week-actions');
    if (!el) return;
    var next = null;
    var hoyW = new Date();
    var tDayW = hoyW.getDate();
    var mDaysW = new Date(hoyW.getFullYear(), hoyW.getMonth() + 1, 0).getDate();
    formalCredits.forEach(function (c) {
      if (c.interestOnly) return;
      if (paidThisMonth(c.name) > 0) return;
      var d = c.dueDateDay - tDayW; if (d < 0) d = c.dueDateDay + (mDaysW - tDayW);
      if (!next || d < next.d) next = { d: d, c: c };
    });
    var items = [];
    if (next) {
      items.push({ cls: 'amber', icon: '!', title: 'Cuota ' + next.c.name.split('(')[0].trim() + ' vence en ' + (next.d === 0 ? '0 días (HOY)' : next.d + ' días'), sub: 'S/ ' + next.c.monthlyFeePEN.toLocaleString() + ' ≈ ' + usdEquiv(next.c.monthlyFeePEN) + ' USD' });
    }
    var falta = Math.round((META - saldo));
    items.push({ cls: 'green', icon: '●', title: 'Meta de ahorro: faltan US$ ' + Math.max(0, falta).toLocaleString('en-US'), sub: 'Estás al ' + metaPct + '% de tu meta mensual' });
    items.push({ cls: 'green', icon: '▲', title: 'Ingresos arriba del plan', sub: fmtUSD(ingresos) + ' en el mes · ROAS ' + (julio ? julio.roas.toFixed(2) + 'x' : '—') });
    items.push({ cls: 'red', icon: '!', title: 'Septiembre: mes crítico S/ 9,221 (≈$2,459)', sub: 'Las 4 cuotas de créditos + junta + préstamo papá caen juntas' });
    el.innerHTML = items.map(function (a) {
      return '<div class="wa-item ' + a.cls + '"><span class="wa-icon">' + a.icon + '</span><div><div class="wa-title">' + a.title + '</div><div class="wa-sub">' + a.sub + '</div></div><span class="wa-arrow">\u2192</span></div>';
    }).join('');
  }

  var MOV_BATCH = 30;
  var movAll = [];
  var movShown = 0;
  var movObs = null;
  function buildMovementsList() {
    movAll = [];
    comboMonths.forEach(function (m) {
      movAll.push({ name: 'Ventas Combo IA', cat: 'Ingresos', date: m.month, usd: m.revenueUSD, type: 'inc' });
    });
    expItems.forEach(function (it) {
      movAll.push({ name: it.desc, cat: it.cat, date: it.date, usd: it.usd, type: 'exp' });
    });
    movAll.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
  }
  function renderMovements() {
    var el = document.getElementById('mov-table');
    var countEl = document.getElementById('mov-count');
    if (!el) return;
    buildMovementsList();
    movShown = 0;
    if (movObs) { movObs.disconnect(); movObs = null; }
    el.innerHTML = '<table class="tbl"><thead><tr><th>Movimiento</th><th>Categoría</th><th>Fecha</th><th>Monto</th></tr></thead>' +
      '<tbody id="mov-body"></tbody></table>' +
      '<div class="mov-sentinel" id="mov-sentinel"></div>';
    if (countEl) countEl.textContent = movAll.length + ' movimientos';

    var body = document.getElementById('mov-body');
    var root = el;
    function loadMore() {
      var next = movAll.slice(movShown, movShown + MOV_BATCH);
      next.forEach(function (r) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td class="cell-title">' + esc(r.name) + '</td>' +
          '<td>' + esc(r.cat) + '</td>' +
          '<td>' + esc(r.date) + '</td>' +
          '<td class="' + (r.type === 'inc' ? 'amt-inc' : 'amt-exp') + '">' + (r.type === 'inc' ? '+' : '−') + fmtUSD(r.usd) + '</td>';
        body.appendChild(tr);
      });
      movShown += next.length;
      var sent = document.getElementById('mov-sentinel');
      if (sent && movShown >= movAll.length) sent.style.display = 'none';
    }
    loadMore();
    if ('IntersectionObserver' in window) {
      var sentinel = document.getElementById('mov-sentinel');
      if (sentinel) {
        movObs = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) loadMore();
        }, { root: root, rootMargin: '200px' });
        movObs.observe(sentinel);
      }
    }
  }

  function renderAssets() {
    var el = document.getElementById('assets-value');
    var w = document.getElementById('assets-warda');
    if (el) el.textContent = fmtPEN(disponible);
    if (w) w.textContent = fmtPEN(warda);
  }

  function renderQuickCards() {
    var elP = document.getElementById('quick-pago');
    var elPs = document.getElementById('quick-pago-sub');
    var elB = document.getElementById('quick-brecha');
    var elBs = document.getElementById('quick-brecha-sub');
    var elS = document.getElementById('quick-sept');
    var elSs = document.getElementById('quick-sept-sub');
    var hoy = new Date(), tDay = hoy.getDate();
    var mDays = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
    var prox = null;
    formalCredits.forEach(function (c) {
      if (c.interestOnly) return;
      if (paidThisMonth(c.name) > 0) return;
      var d = c.dueDateDay - tDay; if (d < 0) d = c.dueDateDay + (mDays - tDay);
      if (!prox || d < prox.d) prox = { d: d, name: c.name.split('(')[0].trim(), amt: c.monthlyFeePEN };
    });
    if (window.CARDS_DATA) window.CARDS_DATA.cards.forEach(function (c) {
      var d = c.pago - tDay; if (d < 0) d = c.pago + (mDays - tDay);
      if (!prox || d < prox.d) prox = { d: d, name: c.card, amt: null };
    });
    if (elP && prox) {
      elP.textContent = prox.d === 0 ? 'HOY' : prox.d + 'd';
      elP.style.color = prox.d <= 2 ? 'var(--red)' : prox.d <= 7 ? 'var(--amber)' : '';
      if (elPs) elPs.textContent = prox.name + (prox.amt ? ' \u00B7 vence en ' + (prox.d === 0 ? '0d' : prox.d + 'd') + ' \u00B7 S/ ' + prox.amt.toLocaleString() : ' \u00B7 tarjeta');
    }
    var profit = monthProfitReal();
    var need = deudasMes / FX;
    var gap = need - profit;
    if (elB) {
      elB.textContent = (gap > 0 ? '+' : '') + fmtUSD(Math.round(gap));
      elB.style.color = gap > 0 ? 'var(--amber)' : 'var(--green)';
      if (elBs) elBs.textContent = (gap > 0 ? 'te faltan para cubrir deudas' : 'vas sobrado') + ' \u00B7 profit ' + fmtUSD(Math.round(profit));
    }
    var sep = new Date(hoy.getFullYear(), 8, 2);
    var daysSep = Math.ceil((sep - hoy) / 86400000);
    if (daysSep < 0) daysSep = 0;
    if (elS) {
      elS.style.color = daysSep <= 10 ? 'var(--red)' : 'var(--amber)';
      if (elSs) elSs.textContent = daysSep === 0 ? '\u00A1HOY! aparta el dinero YA' : (daysSep <= 10 ? 'primer pago en ' + daysSep + 'd \u00B7 aparta YA' : 'aparta el dinero del mes crítico');
    }
  }

  function renderResumen() {
    renderHero();
    renderMinis();
    renderResumenIngresos();
    renderGastosDesglose();
    renderWeekActions();
    renderQuickCards();
    var profit = monthProfitReal();
    var ok = profit >= 0;
    var alertHtml = (ok
      ? '✅ <b>' + monthLabel() + ':</b> Profit de ' + fmtUSD(profit) + ' (ingresos ' + fmtUSD(monthIngresosReal()) + ' \u2212 gastos ' + fmtUSD(monthGastosReal()) + ').'
      : '⚠️ <b>' + monthLabel() + ' en negativo:</b> \u2212' + fmtUSD(Math.abs(profit)) + '. Revisa tus gastos (' + fmtUSD(monthGastosReal()) + ').');
    var hoy = new Date();
    var hoyD = hoy.getDate();
    var mDays = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
    var prox = null;
    formalCredits.forEach(function (c) {
      if (c.interestOnly) return;
      if (paidThisMonth(c.name) > 0) return;
      var left = c.dueDateDay - hoyD;
      if (left < 0) left = c.dueDateDay + (mDays - hoyD);
      if (left <= 5 && (!prox || left < prox.d)) prox = { d: left, c: c };
    });
    var warn = !ok || !!prox;
    if (prox) alertHtml += ' <b>Cuota ' + esc(prox.c.name.split('(')[0].trim()) + ' vence en ' + prox.d + 'd</b> (S/ ' + prox.c.monthlyFeePEN.toLocaleString() + ').';
    setAlert('resumen-alert', !warn, alertHtml);
  }

  // ============================================================
  // VISTAS SECUNDARIAS
  // ============================================================
  function renderReporteKpis() {
    var kpi = document.getElementById('reporte-kpis');
    if (!kpi) return;
    var tIng = 0, tGas = 0, tSal = 0, tRoas = 0, best = null, bestC = null, bestCRev = 0;
    fullMonths.forEach(function (m) {
      var hm = hotmartFor(m);
      var g = (m.adsUSD || 0) + (m.toolsUSD || 0) + (m.withdrawalsUSD || 0);
      var s = (m.revenueUSD + hm) - g;
      tIng += m.revenueUSD + hm; tGas += g; tSal += s; tRoas += m.roas;
      if (!best || s > best.s) best = { m: m.month, s: s };
      (m.countries || []).forEach(function (c) { if (c.revenue > bestCRev) { bestCRev = c.revenue; bestC = c.country; } });
    });
    var promRoas = fullMonths.length ? tRoas / fullMonths.length : 0;
    kpi.innerHTML = [
      ['Ingresos totales', fmtUSD(tIng)],
      ['Gastos totales', '−' + fmtUSD(tGas)],
      ['Saldo acumulado', fmtUSD(tSal)],
      ['ROAS promedio', promRoas.toFixed(2) + 'x'],
      ['Mejor mes', best ? best.m : '—'],
      ['Mejor país', bestC || '—']
    ].map(function (k) {
      return '<div class="rk-card"><span class="rk-label">' + k[0] + '</span><span class="rk-value">' + k[1] + '</span></div>';
    }).join('');
  }

  function renderIngresos() {
    var tb = document.getElementById('ingresos-tbody');
    var detail = document.getElementById('ingresos-detail');
    var tfoot = document.getElementById('ingresos-tfoot');
    if (!tb && !detail) return;
    var sel = document.getElementById('sel-month-ingresos');
    var filter = sel ? sel.value : 'all';
    var months = (filter === 'all' ? fullMonths.slice() : fullMonths.filter(function (m) { return m.month.indexOf(filter) !== -1; })).reverse();
    if (tb) {
      tb.innerHTML = months.map(function (m) {
        var hm = hotmartFor(m);
        var total = m.revenueUSD + hm;
        return '<tr data-month="' + esc(m.month) + '" class="row-click">' +
          '<td class="cell-title">' + esc(m.month) + ' <svg class="ico ico-info" title="Ver detalle del mes"><use href="#i-info"/></svg></td>' +
          '<td class="amt-inc">' + fmtUSD(m.revenueUSD) + '</td>' +
          '<td class="amt-inc" style="color:#6EA8FF;">' + fmtUSD(hm) + '</td>' +
          '<td class="amt-inc" style="font-weight:900;">' + fmtUSD(total) + '</td>' +
          '<td style="color:var(--amber);font-family:JetBrains Mono,monospace;">−' + fmtUSD(m.adsUSD) + '</td>' +
          '<td style="color:var(--green);font-family:JetBrains Mono,monospace;font-weight:700;">' + fmtUSD(m.profitUSD) + '</td>' +
          '<td style="font-family:JetBrains Mono,monospace;">' + m.roas.toFixed(2) + 'x</td></tr>';
      }).join('');
    }
    if (tfoot) {
      var sCombo = 0, sHm = 0, sAds = 0, sProfit = 0;
      months.forEach(function (m) { sCombo += m.revenueUSD; sHm += hotmartFor(m); sAds += (m.adsUSD || 0); sProfit += (m.profitUSD || 0); });
      tfoot.innerHTML = '<tr style="border-top:2px solid var(--border);"><td><b>Total</b></td>' +
        '<td class="amt-inc"><b>' + fmtUSD(sCombo) + '</b></td>' +
        '<td class="amt-inc" style="color:#6EA8FF;"><b>' + fmtUSD(sHm) + '</b></td>' +
        '<td class="amt-inc" style="font-weight:900;"><b>' + fmtUSD(sCombo + sHm) + '</b></td>' +
        '<td style="color:var(--amber);font-family:JetBrains Mono,monospace;"><b>−' + fmtUSD(sAds) + '</b></td>' +
        '<td style="color:var(--green);font-family:JetBrains Mono,monospace;"><b>' + fmtUSD(sProfit) + '</b></td>' +
        '<td></td></tr>';
    }
    if (detail) {
      detail.innerHTML = months.map(function (m) {
        var hm = hotmartFor(m);
        var ctry = (m.countries || []).map(function (c) {
          return '<tr><td class="cell-title">' + esc(c.country) + '</td>' +
            '<td style="color:var(--amber);font-family:JetBrains Mono,monospace;">−' + fmtUSD(c.ads) + '</td>' +
            '<td class="amt-inc">' + fmtUSD(c.revenue) + '</td>' +
            '<td style="color:var(--green);font-family:JetBrains Mono,monospace;font-weight:700;">' + fmtUSD(c.profit) + '</td></tr>';
        }).join('');
        return '<div class="ing-card">' +
          '<div class="ing-head"><div class="ing-title">' + esc(m.month) + '</div><div class="ing-roas">ROAS ' + m.roas.toFixed(2) + 'x</div></div>' +
          '<div class="ing-metrics">' +
          '<div class="ing-metric"><span class="ing-label">Ingresos Combo</span><span class="ing-value up">' + fmtUSD(m.revenueUSD) + '</span></div>' +
          '<div class="ing-metric"><span class="ing-label">Low Ticket Hotmart</span><span class="ing-value up" style="color:#6EA8FF;">' + fmtUSD(hm) + '</span></div>' +
          '<div class="ing-metric"><span class="ing-label">Ingresos totales</span><span class="ing-value up">' + fmtUSD(m.revenueUSD + hm) + '</span></div>' +
          '<div class="ing-metric"><span class="ing-label">Gasto pauta</span><span class="ing-value down">−' + fmtUSD(m.adsUSD || 0) + '</span></div>' +
          '<div class="ing-metric"><span class="ing-label">Herramientas</span><span class="ing-value down">−' + fmtUSD(m.toolsUSD || 0) + '</span></div>' +
          '<div class="ing-metric"><span class="ing-label">Retiros</span><span class="ing-value down">−' + fmtUSD(m.withdrawalsUSD || 0) + '</span></div>' +
          '<div class="ing-metric"><span class="ing-label">Ganancia neta</span><span class="ing-value up">' + fmtUSD(m.profitUSD) + '</span></div>' +
          '</div>' +
          (m.highlights ? '<div class="ing-highlight">💡 <b>Destacado:</b> ' + esc(m.highlights) + '</div>' : '') +
          '<table class="tbl tbl-sm"><thead><tr><th>País</th><th>Pauta</th><th>Ingresos</th><th>Ganancia</th></tr></thead><tbody>' + ctry + '</tbody></table>' +
          '</div>';
      }).join('');
    }
    var alertHtml = '';
    var badM = [];
    if (months.length) {
      var bestM = months.slice().sort(function (a, b) { return (b.revenueUSD + hotmartFor(b)) - (a.revenueUSD + hotmartFor(a)); })[0];
      alertHtml = '⭐ <b>Mejor mes:</b> ' + esc(bestM.month) + ' con ' + fmtUSD(bestM.revenueUSD + hotmartFor(bestM)) + ' de ingresos.';
      badM = months.filter(function (m) { return (m.profitUSD || 0) < 0 || (m.roas || 0) < 1; });
      if (badM.length) alertHtml += ' ⚠️ En revisión: ' + badM.map(function (m) { return '<b>' + esc(m.month) + '</b>'; }).join(', ') + ' (ganancia < 0 o ROAS < 1x).';
    }
    setAlert('ingresos-alert', !badM.length, alertHtml);
    renderReporteKpis();
  }

  function renderGastosDiarios() {
    var dtb = document.getElementById('gastos-diarios-tbody');
    var dtotal = document.getElementById('gastos-diarios-total');
    if (!dtb) return;
    var items = [];
    var gIdx = 0, pIdx = 0;
    expItems.forEach(function (it) {
      if (it.source === 'Registro diario') items.push({ fecha: it.date, desc: it.desc, cat: it.cat, tipo: it.type, usd: it.usd, pen: it.pen, src: 'gasto', idx: gIdx++ });
    });
    if (window.PAYMENTS_HISTORY) window.PAYMENTS_HISTORY.forEach(function (p) {
      items.push({ fecha: p.fecha, desc: p.desc, cat: 'Pagos', tipo: 'Pago', usd: p.usd, pen: p.usd * FX, src: 'static', idx: -1 });
    });
    loadPagosExtra().forEach(function (p) {
      items.push({ fecha: p.fecha, desc: p.desc, cat: 'Pagos', tipo: 'Pago', usd: p.usd, pen: p.usd * FX, src: 'pago', idx: pIdx++ });
    });
    function sortKey(f) {
      var m = /^(\d{2})\/(\d{2})$/.exec(String(f));
      return m ? '2026-' + m[2] + '-' + m[1] : String(f || '');
    }
    items.sort(function (a, b) { return sortKey(b.fecha).localeCompare(sortKey(a.fecha)); });
    var tUS = 0, tPEN = 0;
    var rows = items.map(function (it) {
      tUS += it.usd; tPEN += it.pen;
      var editable = it.src === 'gasto' || it.src === 'pago';
      var editBtn = editable ? '<button class="ge-edit" data-src="' + it.src + '" data-idx="' + it.idx + '" title="Editar gasto"><svg class="ico"><use href="#i-edit"/></svg></button>' : '';
      return '<tr>' +
        '<td>' + esc(it.fecha) + '</td>' +
        '<td class="cell-title ge-desc" id="ge-desc-' + it.src + '-' + it.idx + '" data-val="' + esc(it.desc) + '">' + esc(it.desc) + '</td>' +
        '<td class="ge-cat" id="ge-cat-' + it.src + '-' + it.idx + '" data-val="' + esc(it.cat) + '">' + esc(it.cat) + '</td>' +
        '<td>' + esc(it.tipo) + '</td>' +
        '<td class="amt-exp">' + fmtUSD2(it.usd) + '</td>' +
        '<td style="font-family:JetBrains Mono,monospace;">S/ ' + it.pen.toFixed(2) + '</td>' +
        '<td>' + editBtn + '</td>' +
        '</tr>';
    }).join('');
    dtb.innerHTML = rows + (items.length
      ? '<tr style="border-top:2px solid var(--border);"><td colspan="5"><b>Total</b></td><td class="amt-exp"><b>' + fmtUSD2(tUS) + '</b></td><td style="font-family:JetBrains Mono,monospace;font-weight:700;">S/ ' + tPEN.toFixed(2) + '</td></tr>'
      : '<tr><td colspan="7" class="nota-empty">Aún no registras gastos ni pagos.</td></tr>');
    if (dtotal) dtotal.textContent = items.length + ' movimientos · Total ' + fmtUSD(tUS) + ' (S/ ' + tPEN.toFixed(2) + ')';
    var bizD = 0, perD = 0;
    items.forEach(function (it) { if (it.tipo === 'Negocio') bizD += it.usd; else if (it.tipo === 'Personal') perD += it.usd; });
    setAlert('gastos-diarios-alert', true, '💡 <b>Gastos y pagos:</b> ' + fmtUSD(tUS) + ' total (negocio ' + fmtUSD(bizD) + ' · personal ' + fmtUSD(perD) + '). Todo se guarda en tu dispositivo.');
    dtb.querySelectorAll('.ge-edit').forEach(function (b) {
      b.addEventListener('click', function () { editGastoRow(b.getAttribute('data-src'), b.getAttribute('data-idx')); });
    });
    renderGastoAnalisis(items);
  }

  function editGastoRow(src, idx) {
    var descEl = document.getElementById('ge-desc-' + src + '-' + idx);
    var catEl = document.getElementById('ge-cat-' + src + '-' + idx);
    if (!descEl) return;
    var dVal = descEl.getAttribute('data-val') || '';
    var cVal = catEl ? catEl.getAttribute('data-val') || '' : '';
    descEl.innerHTML = '<input class="ge-inp" value="' + esc(dVal) + '">';
    if (catEl) catEl.innerHTML = '<input class="ge-inp" value="' + esc(cVal) + '">';
    var dInp = descEl.querySelector('input');
    var cInp = catEl ? catEl.querySelector('input') : null;
    if (dInp) dInp.focus();
    var done = false;
    function commit() {
      if (done) return;
      done = true;
      var nd = dInp ? dInp.value.trim() : '';
      var nc = cInp ? cInp.value.trim() : 'Pagos';
      if (!nd) { renderGastosDiarios(); return; }
      if (src === 'gasto') {
        var daily = expItems.filter(function (it) { return it.source === 'Registro diario'; });
        var it = daily[parseInt(idx, 10)];
        if (it) { it.desc = nd; if (nc) it.cat = nc; saveExtras(daily); }
      } else if (src === 'pago') {
        var arr = loadPagosExtra();
        var pi = parseInt(idx, 10);
        if (arr[pi]) { arr[pi].desc = nd; savePagosExtra(arr); }
      }
      showToast('✎ Editado', (src === 'gasto' ? 'Gasto' : 'Pago') + ' actualizado');
      renderGastosDiarios();
      renderResumen();
    }
    if (dInp) {
      dInp.addEventListener('keydown', function (e) { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { done = true; renderGastosDiarios(); } });
      dInp.addEventListener('blur', function () { setTimeout(commit, 150); });
    }
    if (cInp) {
      cInp.addEventListener('keydown', function (e) { if (e.key === 'Enter') commit(); });
      cInp.addEventListener('blur', function () { setTimeout(commit, 150); });
    }
  }

  function renderGastoAnalisis(items) {
    var el = document.getElementById('gastos-analisis');
    if (!el) return;
    if (!items.length) { el.innerHTML = '<div class="nota-empty">Registra gastos o pagos para ver el análisis.</div>'; return; }
    var cats = {};
    items.forEach(function (it) { var k = it.cat || 'Otros'; cats[k] = (cats[k] || 0) + it.usd; });
    var total = 0;
    Object.keys(cats).forEach(function (k) { total += cats[k]; });
    var sorted = Object.keys(cats).map(function (k) { return { k: k, v: cats[k] }; }).sort(function (a, b) { return b.v - a.v; });
    var max = sorted.length ? sorted[0].v : 1;
    var neg = 0, per = 0;
    items.forEach(function (it) { if (it.tipo === 'Negocio') neg += it.usd; else if (it.tipo === 'Personal') per += it.usd; });
    var bars = sorted.map(function (c) {
      var w = Math.min(100, Math.round(c.v / max * 100));
      var col = c.k === 'Pagos' ? 'var(--info)' : 'var(--amber)';
      return '<div class="tg-row"><span class="tg-name">' + esc(c.k) + '</span><span class="tg-h">' + fmtUSD(c.v) + '</span><div class="tg-bar-wrap"><div class="tg-bar" style="width:' + w + '%;background:' + col + ';"></div></div></div>';
    }).join('');
    var insights = [];
    if (sorted.length) insights.push('Tu mayor gasto es <b>' + esc(sorted[0].k) + '</b> con ' + fmtUSD(sorted[0].v) + ' (' + Math.round(sorted[0].v / Math.max(1, total) * 100) + '% del total). Si es una suscripción, evalúa cancelarla.');
    insights.push('Negocio <b>' + fmtUSD(neg) + '</b> · Personal <b>' + fmtUSD(per) + '</b> · Total ' + fmtUSD(total));
    insights.push('🔍 Fugas detectadas: Google One +$80, 6 cobros Skool +$30 e IA duplicada +$23.60 → recuperables <b>+$' + ahorroPotencial + '/mes</b>. Cáncelalas esta semana.');
    el.innerHTML =
      '<div class="pc-legend"><span class="sw" style="background:var(--amber)"></span> Categorías <span class="sw" style="background:var(--info)"></span> Pagos</div>' +
      '<div class="time-graph">' + bars + '</div>' +
      '<div class="gasto-insights">' + insights.map(function (s) { return '<div class="pulso-block act"><span class="pulso-dot">💡</span><div>' + s + '</div></div>'; }).join('') + '</div>';
  }

  function renderGastosMensuales() {
    var tb = document.getElementById('exp-table-body');
    var total = document.getElementById('gastos-total');
    if (tb) {
      var audit = expItems.filter(function (it) { return it.source !== 'Registro diario'; });
      tb.innerHTML = audit.slice().reverse().map(function (it) {
        var cls = it.status === 'Mantener' ? 'green' : it.status === 'Optimizar' ? 'amber' : 'red';
        return '<tr>' +
          '<td>' + esc(it.date) + '</td>' +
          '<td>' + esc(it.source) + '</td>' +
          '<td class="cell-title">' + esc(it.desc) + '</td>' +
          '<td>' + esc(it.cat) + '</td>' +
          '<td>' + esc(it.type) + '</td>' +
          '<td class="amt-exp">' + fmtUSD2(it.usd) + '</td>' +
          '<td style="font-family:JetBrains Mono,monospace;">S/ ' + it.pen.toFixed(2) + '</td>' +
          '<td><span class="usd-mini" style="color:var(--' + (cls === 'green' ? 'green' : cls === 'amber' ? 'amber' : 'red') + ')">' + esc(it.status) + '</span></td>' +
          '</tr>';
      }).join('');
      if (total) total.textContent = audit.length + ' cargos auditados \u00B7 ' + fmtUSD(gastos);
      var bizItems = expItems.filter(function (it) { return it.type === 'Negocio'; });
      var bizTotal = bizItems.reduce(function (s, it) { return s + it.usd; }, 0);
      setAlert('gastos-alert', true, '💸 <b>Gastos mensuales auditados:</b> ' + fmtUSD(gastos) + ' total (negocio ' + fmtUSD(bizTotal) + '). Fugas: Google One +$80, 6 cobros Skool +$30, IA duplicada +$23.60 \u2192 ahorro potencial <b>+$' + ahorroPotencial + '/mes</b>.');
    }
  }

    function renderDeudas() {
    var tb = document.getElementById('debt-formal-tbody');
    var tot = document.getElementById('debt-total');
    var banner = document.getElementById('debt-banner');
    if (tb) {
      var totalPend = 0;
      formalCredits.forEach(function (c) { totalPend += c.pendingBalancePEN; });
      var tDayN = new Date().getDate();
      var mDaysN = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      function daysTo(day) { var d = day - tDayN; if (d < 0) d = day + (mDaysN - tDayN); return d; }
      function daysCell(day, name) {
        var paidM = name && paidThisMonth(name) > 0;
        if (paidM) {
          var dNext = day + (mDaysN - tDayN);
          return '<td><span class="nb-days" style="color:var(--green);font-weight:800;">' + dNext + 'd</span></td>';
        }
        var d = daysTo(day);
        var color = d <= 2 ? 'var(--red)' : d <= 7 ? 'var(--amber)' : 'var(--green)';
        return '<td><span class="nb-days" style="color:' + color + ';font-weight:800;">' + (d === 0 ? 'HOY' : d + 'd') + '</span></td>';
      }
      tb.innerHTML = formalCredits.slice().sort(function (a, b) { return daysTo(a.dueDateDay) - daysTo(b.dueDateDay); }).map(function (c) {
        if (c.interestOnly) {
          return '<tr>' +
            '<td class="cell-title">' + esc(c.name) + ' <span class="usd-mini" style="color:var(--red);font-weight:800;">' + esc(c.status) + '</span></td>' +
            '<td style="color:var(--red);font-family:JetBrains Mono,monospace;font-weight:700;">S/ ' + c.monthlyFeePEN.toLocaleString() + ' <span class="usd-mini">\u2248 ' + usdEquiv(c.monthlyFeePEN) + ' USD</span></td>' +
            '<td>D\u00EDa ' + c.dueDateDay + '</td>' +
            daysCell(c.dueDateDay, c.name) +
            '<td><b style="color:var(--red);">Solo intereses</b></td>' +
            '<td>' + esc(c.range) + '</td>' +
            '<td style="color:var(--amber);font-family:JetBrains Mono,monospace;font-weight:800;">S/ ' + c.pendingBalancePEN.toLocaleString() + ' <span class="usd-mini">\u2248 ' + usdEquiv(c.pendingBalancePEN) + ' USD</span></td>' +
            '<td><div class="pay-quota-big" style="color:var(--red);">URGENTE</div>' +
            '<div class="pay-progress"><div class="pay-bar" style="width:100%;background:linear-gradient(90deg,#FF6B6B,#FF6B6B);"></div></div>' +
            '<div class="pay-meta">S/ 250/mes \u00B7 solo intereses \u00B7 sin capital</div>' +
            '<button class="pay-btn" data-name="' + esc(c.name) + '" data-amount="' + c.monthlyFeePEN + '">\u2714 Registrar pago</button></td>' +
            '</tr>';
        }
        var paid = payCount(c.name);
        var totalQ = c.totalQuotas || c.remainingQuota;
        var dataPaid = Math.max(0, totalQ - c.remainingQuota);
        paid = dataPaid + payCount(c.name);
        var pend = Math.max(0, totalQ - paid);
        var current = c.currentQuota || Math.min(totalQ, paid + 1);
        var shown = Math.min(paid, totalQ);
        if (totalQ > 0) {
          var pct = Math.min(100, Math.max(2, Math.round((paid / totalQ) * 100)));
          return '<tr>' +
            '<td class="cell-title">' + esc(c.name) + '</td>' +
            '<td style="color:var(--red);font-family:JetBrains Mono,monospace;font-weight:700;">S/ ' + c.monthlyFeePEN.toLocaleString() + ' <span class="usd-mini">\u2248 ' + usdEquiv(c.monthlyFeePEN) + ' USD</span></td>' +
            '<td>D\u00EDa ' + c.dueDateDay + '</td>' +
            daysCell(c.dueDateDay, c.name) +
            '<td><b>' + current + '</b> de ' + totalQ + '</td>' +
            '<td>' + esc(c.range) + '</td>' +
            '<td style="color:var(--amber);font-family:JetBrains Mono,monospace;font-weight:800;">S/ ' + c.pendingBalancePEN.toLocaleString() + ' <span class="usd-mini">\u2248 ' + usdEquiv(c.pendingBalancePEN) + ' USD</span></td>' +
            '<td><div class="pay-quota-big">' + current + '/' + totalQ + '</div>' +
            '<div class="pay-progress"><div class="pay-bar" style="width:' + pct + '%"></div></div>' +
            '<div class="pay-meta">' + pend + ' cuotas por pagar \u00B7 ' + shown + ' pagadas</div>' +
            '<button class="pay-btn" data-name="' + esc(c.name) + '" data-amount="' + c.monthlyFeePEN + '">\u2714 Registrar pago</button></td>' +
            '</tr>';
        }
        var paidM = paidThisMonth(c.name) > 0;
        return '<tr>' +
          '<td class="cell-title">' + esc(c.name) + '</td>' +
          '<td style="color:var(--red);font-family:JetBrains Mono,monospace;font-weight:700;">S/ ' + c.monthlyFeePEN.toLocaleString() + ' <span class="usd-mini">\u2248 ' + usdEquiv(c.monthlyFeePEN) + ' USD</span></td>' +
          '<td>D\u00EDa ' + c.dueDateDay + '</td>' +
          daysCell(c.dueDateDay, c.name) +
          '<td>—</td>' +
          '<td>' + esc(c.range) + '</td>' +
          '<td style="color:var(--amber);font-family:JetBrains Mono,monospace;font-weight:800;">S/ ' + c.pendingBalancePEN.toLocaleString() + ' <span class="usd-mini">\u2248 ' + usdEquiv(c.pendingBalancePEN) + ' USD</span></td>' +
          '<td><div class="pay-quota-big" style="color:' + (paidM ? 'var(--green)' : 'var(--amber)') + ';">' + (paidM ? 'Pagado' : 'Mensual') + '</div>' +
          '<div class="pay-meta">Pago fijo de cada mes</div>' +
          '<button class="pay-btn" data-name="' + esc(c.name) + '" data-amount="' + c.monthlyFeePEN + '">\u2714 Registrar pago</button></td>' +
          '</tr>';
      }).join('');
      tb.querySelectorAll('.pay-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var name = btn.getAttribute('data-name');
          var amount = parseFloat(btn.getAttribute('data-amount'));
          var arr = loadFormalPagos();
          arr.push({ name: name, amountPEN: amount, date: new Date().toISOString().slice(0, 10) });
          saveFormalPagos(arr);
          showToast('Pago registrado', name + ' \u00B7 S/ ' + amount.toLocaleString());
          renderDeudas();
        });
      });
      if (tot) tot.textContent = 'Compromiso S/ ' + deudasMes.toLocaleString() + ' \u2248 ' + usdEquiv(deudasMes) + ' USD \u00B7 Saldo formal S/ ' + totalPend.toLocaleString();
    }
    var wtb = document.getElementById('debt-weekly-tbody');
    if (wtb && debts) {
      var now = new Date();
      var daysToSunday = now.getDay() === 0 ? 0 : 7 - now.getDay();
      function countSundaysTo(endStr) {
        var d = new Date(now.getTime() + daysToSunday * 86400000);
        var ep = String(endStr).split('-');
        var end = new Date(Number(ep[0]), Number(ep[1]) - 1, Number(ep[2]));
        var n = 0;
        while (d <= end) { n++; d = new Date(d.getTime() + 7 * 86400000); }
        return n;
      }
      function shortDate(iso) {
        var p = String(iso).split('-');
        return p[2] + '/' + p[1];
      }
      function elapsedSundays(startStr) {
        var sp = String(startStr).split('-');
        var start = new Date(Number(sp[0]), Number(sp[1]) - 1, Number(sp[2]));
        var d = new Date(start);
        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var n = 0;
        while (d < today) { n++; d = new Date(d.getTime() + 7 * 86400000); }
        return n;
      }
      wtb.innerHTML = (debts.weeklyCommitments || []).filter(function (w) { return (w.weeklyFeePEN || 0) > 0; }).map(function (w) {
        var d = daysToSunday;
        var color = d <= 2 ? 'var(--red)' : d <= 7 ? 'var(--amber)' : 'var(--green)';
        var totalQ = w.totalQuotas || (w.endDate ? countSundaysTo(w.endDate) : 0);
        var basePaid = w.startDate ? elapsedSundays(w.startDate) : 0;
        var paid = basePaid + payCount(w.name);
        var todayPaid = d === 0 && paid > basePaid;
        var pend = Math.max(0, totalQ - paid);
        var current = totalQ > 0 ? Math.min(totalQ, paid + 1) : 0;
        var shown = Math.min(paid, totalQ);
        var pct = totalQ > 0 ? Math.min(100, Math.max(2, Math.round((paid / totalQ) * 100))) : 100;
        var saldo = pend * w.weeklyFeePEN;
        var avance = totalQ > 0
          ? '<div class="pay-quota-big">' + current + '/' + totalQ + '</div>' +
            '<div class="pay-progress"><div class="pay-bar" style="width:' + pct + '%"></div></div>' +
            '<div class="pay-meta">' + pend + ' pagos por hacer \u00B7 ' + shown + ' pagados</div>' +
            '<button class="pay-btn" data-name="' + esc(w.name) + '" data-amount="' + w.weeklyFeePEN + '">\u2714 Registrar pago</button>'
          : '<div class="pay-quota-big" style="color:var(--green);">Listo</div>' +
            '<div class="pay-progress"><div class="pay-bar" style="width:100%;background:linear-gradient(90deg,#25E77A,#25E77A);"></div></div>' +
            '<div class="pay-meta">Completado \u00B7 hasta ' + shortDate(w.endDate) + '</div>';
        return '<tr>' +
          '<td class="cell-title">' + esc(w.name) + '</td>' +
          '<td style="color:var(--red);font-family:JetBrains Mono,monospace;font-weight:700;">S/ ' + w.weeklyFeePEN.toLocaleString() + ' <span class="usd-mini">semanal</span></td>' +
          '<td>' + esc(w.dueDay) + '</td>' +
          '<td><span class="nb-days" style="color:' + color + ';font-weight:800;">' + (todayPaid ? '\u2713 Pagado' : d === 0 ? 'HOY' : d + 'd') + '</span></td>' +
          '<td><b>' + current + '</b> de ' + totalQ + '</td>' +
          '<td>Hasta ' + shortDate(w.endDate) + '</td>' +
          '<td style="color:var(--amber);font-family:JetBrains Mono,monospace;font-weight:800;">S/ ' + saldo.toLocaleString() + ' <span class="usd-mini">\u2248 ' + usdEquiv(saldo) + ' USD</span></td>' +
          '<td>' + avance + '</td>' +
          '</tr>';
      }).join('');
      wtb.querySelectorAll('.pay-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var name = btn.getAttribute('data-name');
          var amount = parseFloat(btn.getAttribute('data-amount'));
          var arr = loadFormalPagos();
          arr.push({ name: name, amountPEN: amount, date: new Date().toISOString().slice(0, 10) });
          saveFormalPagos(arr);
          showToast('Pago registrado', name + ' \u00B7 S/ ' + amount.toLocaleString());
          renderDeudas();
        });
      });
    }
    if (banner) {
      var profitP = monthProfitReal();
      var hoyP = new Date(), tDayP = hoyP.getDate();
      var mDaysP = new Date(hoyP.getFullYear(), hoyP.getMonth() + 1, 0).getDate();
      var proxC = null;
      formalCredits.forEach(function (c) {
        if (c.interestOnly) return;
        if (paidThisMonth(c.name) > 0) return;
        var dl = c.dueDateDay - tDayP; if (dl < 0) dl = c.dueDateDay + (mDaysP - tDayP);
        if (!proxC || dl < proxC.d) proxC = { d: dl, c: c };
      });
      var dts = hoyP.getDay() === 0 ? 0 : 7 - hoyP.getDay();
      var wk0 = (debts && debts.weeklyCommitments && debts.weeklyCommitments.length) ? debts.weeklyCommitments[0] : null;
      var posHtml = profitP >= 0
        ? '<div class="pulso-block pos"><span class="pulso-dot">\uD83D\uDFE2</span><div><b>Balance positivo:</b> ' + fmtUSD(profitP) + ' de beneficio en ' + monthLabel() + '.</div></div>'
        : '<div class="pulso-block crit"><span class="pulso-dot">\uD83D\uDD34</span><div><b>Balance negativo:</b> \u2212' + fmtUSD(Math.abs(profitP)) + ' en ' + monthLabel() + '. Revisa tus gastos ya.</div></div>';
      var actHtml = '';
      if (wk0 && dts <= (proxC ? proxC.d : 999)) {
        actHtml = '<div class="pulso-block act"><span class="pulso-dot">\uD83D\uDFE1</span><div><b>Pr\u00F3xima acci\u00F3n:</b> ' + esc(wk0.name) + ' \u00B7 S/ ' + wk0.weeklyFeePEN.toLocaleString() + (dts === 0 ? ' \u00B7 HOY' : ' \u00B7 en ' + dts + 'd') + '.</div></div>';
      } else if (proxC) {
        actHtml = '<div class="pulso-block act"><span class="pulso-dot">\uD83D\uDFE1</span><div><b>Pr\u00F3xima acci\u00F3n:</b> ' + esc(proxC.c.name.split('(')[0].trim()) + ' vence en ' + (proxC.d === 0 ? '0 d\u00EDas \u00B7 HOY' : proxC.d + ' d\u00EDas') + ' \u00B7 S/ ' + proxC.c.monthlyFeePEN.toLocaleString() + '.</div></div>';
      }
      banner.innerHTML = '<div class="pulso-title">\uD83D\uDCC8 Pulso financiero de ' + monthLabel() + '</div>' + posHtml + actHtml;
    }
    var itb = document.getElementById('debt-informal-tbody');
    var itot = document.getElementById('debt-informal-total');
    if (itb && debts) {
      var iTotal = 0;
      itb.innerHTML = (debts.informalDebts || []).map(function (d) {
        iTotal += d.amountPEN;
        return '<tr><td class="cell-title">' + esc(d.creditor) + '</td>' +
          '<td style="color:var(--red);font-family:JetBrains Mono,monospace;font-weight:700;">S/ ' + d.amountPEN.toLocaleString() + '</td>' +
          '<td>' + esc(d.note || '') + '</td>' +
          '<td><span class="usd-mini" style="color:var(--amber);font-weight:700;">' + esc(d.priority) + '</span></td></tr>';
      }).join('');
      if (itot) itot.textContent = 'Total informal: S/ ' + iTotal.toLocaleString() + ' \u2248 ' + usdEquiv(iTotal) + ' USD';
    }
    var ptb = document.getElementById('payments-tbody');
    var ptot = document.getElementById('payments-total');
    if (window.PAYMENTS_HISTORY && ptb) {
      var totalP = 0;
      ptb.innerHTML = window.PAYMENTS_HISTORY.map(function (p) {
        totalP += p.usd;
        return '<tr><td>' + esc(p.fecha) + '</td><td class="cell-title">' + esc(p.desc) + '</td><td class="amt-exp">' + fmtUSD(p.usd) + '</td></tr>';
      }).join('');
      if (ptot) ptot.textContent = 'Total pagado: ' + fmtUSD(totalP) + ' (mayo\u2013julio)';
    }
    renderDebtCharts();
  }

  function renderDebtCharts() {
    var donut = document.getElementById('debt-donut');
    var bars = document.getElementById('debt-bars');
    if (!donut || !formalCredits.length) return;
    var paid = 0, pending = 0;
    var per = formalCredits.filter(function (c) { return !c.interestOnly; }).map(function (c) {
      var total = c.totalQuotas || c.remainingQuota;
      var dataPaid = Math.max(0, total - c.remainingQuota);
      var p = Math.min(dataPaid + payCount(c.name), total);
      var pend = Math.max(0, total - p);
      paid += p; pending += pend;
      return { name: c.name, total: total, cur: c.currentQuota || Math.min(total, p + 1), pend: pend, saldo: c.pendingBalancePEN };
    });
    var totalQ = paid + pending;
    var donutHtml = '';
    if (totalQ > 0) {
      var aPaid = (paid / totalQ) * Math.PI * 2;
      var cx = 60, cy = 60, r = 50;
      function arc(ang0, ang1, color) {
        var x0 = cx + r * Math.cos(ang0 - Math.PI / 2), y0 = cy + r * Math.sin(ang0 - Math.PI / 2);
        var x1 = cx + r * Math.cos(ang1 - Math.PI / 2), y1 = cy + r * Math.sin(ang1 - Math.PI / 2);
        var large = (ang1 - ang0) > Math.PI ? 1 : 0;
        return '<path d="M ' + cx + ' ' + cy + ' L ' + x0.toFixed(2) + ' ' + y0.toFixed(2) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' Z" fill="' + color + '"></path>';
      }
      donutHtml = '<svg viewBox="0 0 120 120" width="132" height="132" style="flex-shrink:0;">' +
        arc(0, aPaid, '#55F58A') + arc(aPaid, Math.PI * 2, 'rgba(255,107,107,0.35)') +
        '<text x="60" y="56" fill="#F4F6F5" font-size="20" font-weight="800" text-anchor="middle" font-family="Inter,sans-serif">' + Math.round(paid / totalQ * 100) + '%</text>' +
        '<text x="60" y="72" fill="#7A8580" font-size="8" text-anchor="middle" font-family="Inter,sans-serif">PAGADO</text></svg>' +
        '<div class="donut-legend"><div><span class="sw" style="background:#55F58A"></span> Cuotas pagadas: ' + paid + '</div>' +
        '<div><span class="sw" style="background:rgba(255,107,107,0.5)"></span> Pendientes: ' + pending + '</div></div>';
    } else {
      donutHtml = '<div class="empty">Sin cuotas</div>';
    }
    donut.innerHTML = donutHtml;

    var maxPend = 1;
    per.forEach(function (c) { if (c.pend > maxPend) maxPend = c.pend; });
    bars.innerHTML = per.map(function (c) {
      var pct = Math.round(c.pend / maxPend * 100);
      var tip = c.name + ' \u00B7 cuota ' + c.cur + ' de ' + c.total + ' \u00B7 ' + c.pend + ' pendientes \u00B7 Saldo S/ ' + c.saldo.toLocaleString();
      return '<div class="cat-row" data-tip="' + esc(tip) + '">' +
        '<div class="cat-head"><span>' + esc(c.name.split('(')[0].trim()) + '</span><span class="pay-quota-big sm">' + c.cur + '/' + c.total + '</span></div>' +
        '<div class="cat-track"><div class="cat-fill" style="width:' + pct + '%;background:linear-gradient(90deg,#FF6B6B,#FFB020);"></div></div>' +
        '<div class="pay-meta" style="margin-top:4px;">' + c.pend + ' cuotas pendientes \u00B7 Saldo S/ ' + c.saldo.toLocaleString() + '</div>' +
        '</div>';
    }).join('');
  }

  function renderFechas() {
    var tb = document.getElementById('fechas-tbody');
    var total = document.getElementById('fechas-total');
    var proxEl = document.getElementById('fechas-prox');
    if (!tb) return;
    var hoy = new Date();
    var y = hoy.getFullYear(), m = hoy.getMonth();
    var items = [];
    function daysFrom(dt) { return Math.max(0, Math.round((dt - hoy) / 86400000)); }
    function nextDayOfMonth(day) {
      var d = new Date(y, m, day);
      if (d < new Date(y, m, hoy.getDate())) d = new Date(y, m + 1, day);
      return d;
    }
    formalCredits.forEach(function (c) {
      var d = nextDayOfMonth(c.dueDateDay);
      items.push({ fecha: d, dias: daysFrom(d), name: c.name.split('(')[0].trim(), tipo: 'Cr\u00E9dito', monto: 'S/ ' + c.monthlyFeePEN.toLocaleString() });
    });
    var dts = hoy.getDay() === 0 ? 0 : 7 - hoy.getDay();
    if (debts && debts.weeklyCommitments) debts.weeklyCommitments.forEach(function (w) {
      if (!(w.weeklyFeePEN > 0)) return;
      var d = new Date(hoy.getTime() + dts * 86400000);
      items.push({ fecha: d, dias: daysFrom(d), name: w.name, tipo: 'Semanal', monto: 'S/ ' + w.weeklyFeePEN.toLocaleString() });
    });
    if (window.CARDS_DATA) window.CARDS_DATA.cards.forEach(function (c) {
      var d = nextDayOfMonth(c.pago);
      items.push({ fecha: d, dias: daysFrom(d), name: c.card, tipo: 'Tarjeta', monto: (c.currency === 'USD' ? '$' : 'S/ ') + (c.linea ? c.linea.toFixed(2) : '—') });
    });
    var toolsN = [];
    if (window.BUSINESS_DATA && window.BUSINESS_DATA.tools) toolsN = toolsN.concat(window.BUSINESS_DATA.tools);
    loadNegocioExtra().forEach(function (t) { toolsN.push(t); });
    toolsN.forEach(function (t) {
      var s = String(t.fecha || '').trim();
      var parts = s.split(' ');
      var day = parseInt(parts[0], 10);
      if (!(day >= 1 && day <= 31)) return;
      var d = nextDayOfMonth(day);
      items.push({ fecha: d, dias: daysFrom(d), name: t.name, tipo: 'Herramienta', monto: '$' + (t.usd ? t.usd.toFixed(2) : '—') });
    });
    items.sort(function (a, b) { return a.fecha - b.fecha; });
    var wds = ['Dom', 'Lun', 'Mar', 'Mi\u00E9', 'Jue', 'Vie', 'S\u00E1b'];
    function fmtDate(dt) {
      var dd = ('0' + dt.getDate()).slice(-2);
      var mm2 = ('0' + (dt.getMonth() + 1)).slice(-2);
      return dd + '/' + mm2 + ' ' + wds[dt.getDay()];
    }
    tb.innerHTML = items.map(function (it) {
      var cls = it.dias <= 2 ? 'var(--red)' : it.dias <= 7 ? 'var(--amber)' : 'var(--green)';
      return '<tr>' +
        '<td style="font-family:JetBrains Mono,monospace;">' + fmtDate(it.fecha) + '</td>' +
        '<td><span class="nb-days" style="color:' + cls + ';font-weight:800;">' + (it.dias === 0 ? 'HOY' : it.dias + 'd') + '</span></td>' +
        '<td class="cell-title">' + esc(it.name) + '</td>' +
        '<td>' + esc(it.tipo) + '</td>' +
        '<td style="font-family:JetBrains Mono,monospace;color:var(--amber);font-weight:700;">' + it.monto + '</td>' +
        '</tr>';
    }).join('');
    var urgentes = items.filter(function (it) { return it.dias <= 7; });
    if (total) total.textContent = items.length + ' pagos en el horizonte \u00B7 ' + urgentes.length + ' en los pr\u00F3ximos 7 d\u00EDas';
    if (proxEl) {
      if (items.length) {
        var p = items[0];
        var pcls = p.dias <= 2 ? 'crit' : p.dias <= 7 ? 'act' : 'pos';
        proxEl.innerHTML = '<div class="pulso-block ' + pcls + '"><span class="pulso-dot">\uD83D\uDCC5</span><div><b>Pr\u00F3ximo pago:</b> ' + esc(p.name) + ' (' + esc(p.tipo) + ') \u00B7 ' + fmtDate(p.fecha) + ' \u00B7 ' + (p.dias === 0 ? 'HOY' : 'en ' + p.dias + 'd') + ' \u00B7 ' + p.monto + '.</div></div>';
      } else {
        proxEl.innerHTML = '';
      }
    }
    var crit = items.filter(function (it) { return it.dias <= 2; });
    setAlert('fechas-alert', !crit.length, crit.length
      ? '⚠️ <b>Pagos urgentes en 48h:</b> ' + crit.map(function (c) { return esc(c.name) + ' ' + c.monto; }).join(' \u00B7 ')
      : '🗓️ Sin pagos urgentes. Todo bajo control.');
  }

  function renderTotal() {
    var hero = document.getElementById('total-val');
    var heroSub = document.getElementById('total-sub');
    var moti = document.getElementById('total-moti');
    var groups = document.getElementById('total-groups');
    if (!debts || !groups) return;
    var formal = debts.formalCredits || [];
    var informal = debts.informalDebts || [];
    var cards = debts.creditCards || [];
    var fTot = 0, iTot = 0, cTot = 0;
    var fRows = formal.map(function (c) {
      var amt = c.pendingBalancePEN || (c.interestOnly ? (c.monthlyFeePEN || 0) : 0);
      fTot += amt;
      return '<div class="total-row"><span class="total-name">' + esc(c.name) + (c.status ? ' <em class="usd-mini">' + esc(c.status) + '</em>' : '') + '</span><span class="total-amt">S/ ' + amt.toLocaleString() + '</span></div>';
    }).join('');
    var iRows = informal.map(function (d) {
      iTot += d.amountPEN;
      return '<div class="total-row"><span class="total-name">' + esc(d.creditor) + (d.note ? ' <em class="usd-mini">' + esc(d.note.split('·')[0].trim()) + '</em>' : '') + '</span><span class="total-amt">S/ ' + d.amountPEN.toLocaleString() + '</span></div>';
    }).join('');
    var cRows = cards.filter(function (c) { return (c.balancePEN || 0) > 0 || (c.balanceUSD || 0) > 0; }).map(function (c) {
      var amt = c.balancePEN || Math.round((c.balanceUSD || 0) * FX);
      cTot += amt;
      return '<div class="total-row"><span class="total-name">' + esc(c.card) + (c.note ? ' <em class="usd-mini">' + esc(c.note.split('·')[0].trim()) + '</em>' : '') + '</span><span class="total-amt">S/ ' + amt.toLocaleString() + '</span></div>';
    }).join('');
    var grand = fTot + iTot + cTot;
    var usd = Math.round(grand / FX);
    if (hero) hero.textContent = fmtPEN(grand);
    if (heroSub) heroSub.textContent = '≈ ' + fmtUSD(usd) + ' USD · todo lo que debes, sin filtros';
    var mentoria = grand / 60;
    if (moti) {
      moti.innerHTML = '🔥 <b>Tu plan:</b> Vendechat.io (tu CRM) + tu curso en TikTok Live 24/7. Con <b>60 mentorías de ≈ S/ ' + Math.round(mentoria).toLocaleString() + ' (~' + fmtUSD(mentoria) + ')</b> cierras TODO. <b style="color:var(--green)">Nadie te para.</b>';
    }
    function block(title, total, rows) {
      return '<div class="total-block"><div class="total-block-head"><span>' + title + '</span><b>S/ ' + total.toLocaleString() + '</b></div>' + rows + '</div>';
    }
    groups.innerHTML =
      block('🏦 Créditos formales', fTot, fRows) +
      block('👥 Deudas informales y familiares', iTot, iRows) +
      block('💳 Tarjetas de crédito', cTot, cRows) +
      '<div class="total-grand">TOTAL QUE DEBES <span>' + fmtPEN(grand) + ' ≈ ' + fmtUSD(usd) + ' USD</span></div>';
  }

  function renderMetas() {
    var grid = document.getElementById('metas-grid');
    var det = document.getElementById('metas-detail');
    if (grid) {
      var falta = Math.max(0, META - saldo);
      var cards = [
        { t: 'Meta de saldo neto', v: metaPct + '%', s: fmtUSD(saldo) + ' de ' + fmtUSD(META), p: metaPct },
        { t: 'Ahorro mensual', v: falta > 0 ? 'Faltan US$ ' + falta.toLocaleString('en-US') : '¡Meta cumplida!', s: 'Estás al ' + metaPct + '%', p: metaPct },
        { t: 'Ahorro Meta Scotiabank', v: fmtPEN(warda), s: 'En ahorro e inversión', p: 100 }
      ];
      grid.innerHTML = cards.map(function (c) {
        return '<div class="meta-card"><h4>' + c.t + '</h4><div class="mc-value">' + c.v + '</div><div class="mc-sub">' + c.s + '</div><div class="mc-progress"><div class="mc-fill" style="width:' + Math.min(100, c.p) + '%"></div></div></div>';
      }).join('');
    }
    if (det) {
      var falta = Math.max(0, META - saldo);
      var rows = '';
      var acum = 0, sumIng = 0, sumGas = 0, sumSal = 0;
      fullMonths.forEach(function (m) {
        var hm = hotmartFor(m);
        var g = (m.adsUSD || 0) + (m.toolsUSD || 0) + (m.withdrawalsUSD || 0) 
        var s = (m.revenueUSD + hm) - g;
        sumIng += m.revenueUSD + hm; sumGas += g; sumSal += s; acum += s;
        rows += '<tr><td class="cell-title">' + esc(m.month) + '</td>' +
          '<td class="amt-inc">' + fmtUSD(m.revenueUSD + hm) + '</td>' +
          '<td style="color:var(--amber);font-family:JetBrains Mono,monospace;">−' + fmtUSD(g) + '</td>' +
          '<td style="font-family:JetBrains Mono,monospace;font-weight:700;color:' + (s >= 0 ? 'var(--green)' : 'var(--red)') + ';">' + fmtUSD(s) + '</td>' +
          '<td style="font-family:JetBrains Mono,monospace;">' + fmtUSD(acum) + '</td></tr>';
      });
      var ritmo = fullMonths.length ? sumSal / fullMonths.length : 0;
      var meses = ritmo > 0 ? Math.ceil(falta / ritmo) : 99;
      var falta6 = Math.round(falta / 6);
      det.innerHTML = '<div class="meta-hero">' +
        '<div class="meta-hero-num">' + metaPct + '%</div>' +
        '<div class="meta-hero-bar"><div class="meta-hero-fill" style="width:' + Math.min(100, metaPct) + '%"></div></div>' +
        '<div class="meta-hero-row"><span>Saldo neto</span><b>' + fmtUSD(saldo) + '</b></div>' +
        '<div class="meta-hero-row"><span>Meta</span><b>' + fmtUSD(META) + '</b></div>' +
        '<div class="meta-hero-row"><span>Faltante</span><b style="color:var(--amber);">' + fmtUSD(falta) + '</b></div>' +
        '<div class="meta-hero-row"><span>Ritmo promedio</span><b>' + fmtUSD(ritmo) + '/mes</b></div>' +
        '<div class="meta-hero-row"><span>Proyección a la meta</span><b style="color:var(--green);">' + (meses > 60 ? 'Más de 5 años' : meses + (meses === 1 ? ' mes' : ' meses')) + '</b></div>' +
        '</div>' +
        '<div class="meta-columns">' +
        '<div class="panel"><div class="panel-head"><h3>Desglose mensual del saldo</h3><span class="legend-sub">Ingresos − gastos</span></div>' +
        '<div class="table-scroll"><table class="tbl tbl-sm"><thead><tr><th>Mes</th><th>Ingresos</th><th>Gastos</th><th>Saldo</th><th>Acumulado</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>' +
        '<div class="panel"><div class="panel-head"><h3>Resumen del trimestre</h3></div>' +
        '<div class="meta-sum">' +
        '<div class="meta-sum-row"><span>Ingresos totales</span><b>' + fmtUSD(sumIng) + '</b></div>' +
        '<div class="meta-sum-row"><span>Gastos totales</span><b>−' + fmtUSD(sumGas) + '</b></div>' +
        '<div class="meta-sum-row"><span>Saldo acumulado</span><b style="color:var(--green);">' + fmtUSD(sumSal) + '</b></div>' +
        '<div class="meta-sum-row"><span>Ahorro Meta Scotiabank</span><b>' + fmtPEN(warda) + '</b></div>' +
        '<div class="meta-note">💡 Para alcanzar los <b>US$ 7,600</b> en 6 meses necesitas ahorrar <b>US$ ' + falta6.toLocaleString('en-US') + '/mes</b>.</div>' +
        '</div></div></div>';
    }
    var faltaM = Math.max(0, META - saldo);
    setAlert('metas-alert', faltaM <= 0, '🎯 <b>Meta US$ ' + META.toLocaleString('en-US') + ':</b> llevas ' + fmtUSD(saldo) + ' (' + metaPct + '%). ' + (faltaM > 0 ? 'Faltan <b>' + fmtUSD(faltaM) + '</b> — ahorra <b>US$ ' + Math.round(faltaM / 6).toLocaleString('en-US') + '/mes</b> para lograrlo en 6 meses.' : '¡Meta cumplida!'));
  }

  function renderReportes() {
    var tb = document.getElementById('reportes-tbody');
    var kpi = document.getElementById('reporte-kpis');
    var detail = document.getElementById('reportes-detail');
    if (!tb) return;
    var tIng = 0, tGas = 0, tSal = 0, tRoas = 0, tHm = 0, best = null, bestC = null, bestCRev = 0;
    fullMonths.forEach(function (m) {
      var hm = hotmartFor(m);
      var g = (m.adsUSD || 0) + (m.toolsUSD || 0) + (m.withdrawalsUSD || 0) 
      var s = (m.revenueUSD + hm) - g;
      tIng += m.revenueUSD + hm; tGas += g; tSal += s; tRoas += m.roas; tHm += hm;
      if (!best || s > best.s) best = { m: m.month, s: s };
      (m.countries || []).forEach(function (c) { if (c.revenue > bestCRev) { bestCRev = c.revenue; bestC = c.country; } });
    });
    var promRoas = fullMonths.length ? tRoas / fullMonths.length : 0;
    tb.innerHTML = fullMonths.map(function (m) {
      var hm = hotmartFor(m);
      var g = (m.adsUSD || 0) + (m.toolsUSD || 0) + (m.withdrawalsUSD || 0) 
      var s = (m.revenueUSD + hm) - g;
      var ok = s >= 0;
      return '<tr><td class="cell-title">' + esc(m.month) + '</td>' +
        '<td class="amt-inc">' + fmtUSD(m.revenueUSD + hm) + '</td>' +
        '<td style="color:var(--amber);font-family:JetBrains Mono,monospace;">−' + fmtUSD(g) + '</td>' +
        '<td style="font-family:JetBrains Mono,monospace;font-weight:700;color:' + (ok ? 'var(--green)' : 'var(--red)') + ';">' + fmtUSD(s) + '</td>' +
        '<td style="font-family:JetBrains Mono,monospace;">' + m.roas.toFixed(2) + 'x</td>' +
        '<td><span class="rk-badge ' + (ok ? 'ok' : 'bad') + '">' + (ok ? 'Positivo' : 'Revisar') + '</span></td></tr>';
    }).join('');
    if (kpi) {
      kpi.innerHTML = [
        ['Ingresos totales', fmtUSD(tIng)],
        ['Retiros Hotmart', fmtUSD(tHm)],
        ['Gastos totales', '−' + fmtUSD(tGas)],
        ['Saldo acumulado', fmtUSD(tSal)],
        ['ROAS promedio', promRoas.toFixed(2) + 'x'],
        ['Mejor mes', best ? best.m : '—'],
        ['Mejor país', bestC || '—']
      ].map(function (k) {
        return '<div class="rk-card"><span class="rk-label">' + k[0] + '</span><span class="rk-value">' + k[1] + '</span></div>';
      }).join('');
    }
    if (detail) {
      detail.innerHTML = fullMonths.map(function (m) {
        var hm = hotmartFor(m);
        var g = (m.adsUSD || 0) + (m.toolsUSD || 0) + (m.withdrawalsUSD || 0) 
        var s = (m.revenueUSD + hm) - g;
        var ok = s >= 0;
        var ctry = (m.countries || []).map(function (c) {
          return '<tr><td class="cell-title">' + esc(c.country) + '</td>' +
            '<td style="color:var(--amber);font-family:JetBrains Mono,monospace;">−' + fmtUSD(c.ads) + '</td>' +
            '<td class="amt-inc">' + fmtUSD(c.revenue) + '</td>' +
            '<td style="color:var(--green);font-family:JetBrains Mono,monospace;font-weight:700;">' + fmtUSD(c.profit) + '</td></tr>';
        }).join('');
        return '<div class="ing-card">' +
          '<div class="ing-head"><div class="ing-title">' + esc(m.month) + '</div><span class="rk-badge ' + (ok ? 'ok' : 'bad') + '">' + (ok ? 'Positivo' : 'Revisar') + '</span></div>' +
          '<div class="ing-metrics">' +
          '<div class="ing-metric"><span class="ing-label">Ingresos</span><span class="ing-value up">' + fmtUSD(m.revenueUSD + hm) + '</span></div>' +
          '<div class="ing-metric"><span class="ing-label">Low Ticket Hotmart</span><span class="ing-value up" style="color:#6EA8FF;">' + fmtUSD(hm) + '</span></div>' +
          '<div class="ing-metric"><span class="ing-label">Gasto pauta</span><span class="ing-value down">−' + fmtUSD(m.adsUSD || 0) + '</span></div>' +
          '<div class="ing-metric"><span class="ing-label">Herramientas</span><span class="ing-value down">−' + fmtUSD(m.toolsUSD || 0) + '</span></div>' +
          '<div class="ing-metric"><span class="ing-label">Retiros</span><span class="ing-value down">−' + fmtUSD(m.withdrawalsUSD || 0) + '</span></div>' +
          '<div class="ing-metric"><span class="ing-label">Saldo</span><span class="ing-value ' + (ok ? 'up' : 'down') + '">' + fmtUSD(s) + '</span></div>' +
          '</div>' +
          (m.highlights ? '<div class="ing-highlight">💡 <b>Destacado:</b> ' + esc(m.highlights) + '</div>' : '') +
          '<table class="tbl tbl-sm"><thead><tr><th>País</th><th>Pauta</th><th>Ingresos</th><th>Ganancia</th></tr></thead><tbody>' + ctry + '</tbody></table>' +
          '</div>';
      }).join('');
    }
    setAlert('reportes-alert', tSal >= 0, '📊 <b>Trimestre:</b> ingresos ' + fmtUSD(tIng) + ' · gastos −' + fmtUSD(tGas) + ' · saldo <b>' + fmtUSD(tSal) + '</b>. Mejor mes: <b>' + esc(best ? best.m : '—') + '</b> · Mejor país: <b>' + esc(bestC || '—') + '</b>.');
  }

  function renderAnchors() {
    var list = document.getElementById('ancla-list');
    var hero = document.getElementById('ancla-hero');
    var plan = document.getElementById('ancla-plan');
    if (!list || !window.ANCHORS_DATA) return;
    var D = window.ANCHORS_DATA;
    var hoy = new Date();
    var pago = new Date(hoy.getFullYear(), 8, 2);
    var days = Math.ceil((pago - hoy) / 86400000);
    if (days < 0) days = 0;
    setAlert('ancla-alert', days > 10,
      days <= 10
        ? '⏳ <b>Primer pago de septiembre en ' + days + ' d\u00EDa' + (days === 1 ? '' : 's') + ':</b> ' + D.september.alert
        : '✅ ' + D.september.alert);
    if (hero) {
      hero.innerHTML = '<div class="ancla-sep">' +
        '<div class="ancla-sep-head"><span>🚨 MES CR\u00CDTICO: SEPTIEMBRE 2026</span><span class="nb-days" style="color:var(--red);">' + (days <= 10 ? (days === 0 ? 'HOY' : 'en ' + days + 'd') : '') + '</span></div>' +
        '<div class="ancla-sep-text">' + D.september.alert + '</div>' +
        '<div class="ancla-sep-action">✅ <b>Acci\u00F3n:</b> ' + D.september.action + '</div>' +
        '</div>';
    }
    list.innerHTML = D.anchors.map(function (a) {
      var color = a.color === 'red' ? '#FF6B6B' : a.color === 'amber' ? '#FFB020' : '#55F58A';
      return '<div class="ancla-card">' +
        '<div class="ancla-top"><span class="ancla-num">' + a.n + '</span><span class="ancla-tag" style="color:' + color + ';border-color:' + color + ';">' + a.tag + '</span></div>' +
        '<div class="ancla-title">' + esc(a.title) + '</div>' +
        '<div class="ancla-desc">' + esc(a.desc) + '</div>' +
        '<div class="ancla-action" style="border-left-color:' + color + ';">✅ ' + esc(a.action) + '</div>' +
        '</div>';
    }).join('');
    if (plan) {
      plan.innerHTML = D.actionPlan.map(function (p) {
        return '<label class="ancla-item"><input type="checkbox"><span><b>' + esc(p.task) + '</b> <em class="usd-mini">' + esc(p.when) + '</em></span></label>';
      }).join('');
    }
  }

  // ============================================================
  // NAVEGACIÓN
  // ============================================================
  var NAV_TITLES = {
    inicio: 'Inicio · Mis proyectos',
    resumen: 'Resumen financiero',
    ingresos: 'Ingresos',
    'gastos-diarios': 'Gastos Diarios',
    'gastos-mensuales': 'Gastos Mensuales',
    deudas: 'Deudas',
    total: 'TOTAL',
    fechas: 'Fechas de pago',
    tarjetas: 'Tarjetas',
    negocio: 'Negocio',
    personal: 'Ahorros',
    ancla: 'Puntos ancla',
    notas: 'Notas'
  };

  function switchTab(target) {
    document.querySelectorAll('.view').forEach(function (v) { v.style.display = 'none'; });
    var view = document.getElementById('view-' + target);
    if (view) view.style.display = 'block';
    var t = document.getElementById('topbar-title');
    if (t && NAV_TITLES[target]) t.textContent = NAV_TITLES[target];

    if (target === 'resumen') renderResumen();
    else if (target === 'inicio') renderProyectos();
    else if (target === 'ingresos') renderIngresos();
    else if (target === 'gastos-diarios') renderGastosDiarios();
    else if (target === 'gastos-mensuales') renderGastosMensuales();
    else if (target === 'deudas') { renderDeudas(); renderTarjetas(); }
    else if (target === 'total') renderTotal();
    else if (target === 'fechas') renderFechas();
    else if (target === 'negocio') renderNegocio();
    else if (target === 'personal') renderPersonal();
    else if (target === 'ancla') renderAnchors();
    else if (target === 'notas') renderNotas();
    var sb = document.getElementById('sidebar');
    var sback = document.getElementById('side-backdrop');
    if (sb) sb.classList.remove('open');
    if (sback) sback.classList.remove('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('.nav-item').forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(function (x) { x.classList.remove('active'); });
      item.classList.add('active');
      switchTab(item.getAttribute('data-target'));
      var sb = document.getElementById('sidebar');
      if (sb) sb.classList.remove('open');
    });
  });

  // ============================================================
  // SIDEBAR DRAG & DROP (orden personalizado)
  // ============================================================
  var nav = document.querySelector('.sidebar-nav');
  function applyNavOrder() {
    if (!nav) return;
    var order = [];
    try { order = JSON.parse(localStorage.getItem('stark_nav_order') || '[]'); } catch (e) {}
    if (!order.length) return;
    order.forEach(function (t) {
      var el = nav.querySelector('.nav-item[data-target="' + t + '"]');
      if (el) nav.appendChild(el);
    });
  }
  function saveNavOrder() {
    if (!nav) return;
    var order = [];
    nav.querySelectorAll('.nav-item').forEach(function (el) { order.push(el.getAttribute('data-target')); });
    localStorage.setItem('stark_nav_order', JSON.stringify(order));
  }
  function initNavDrag() {
    if (!nav) return;
    var finePointer = window.matchMedia ? window.matchMedia('(pointer: fine)').matches : true;
    if (!finePointer) return;
    var dragEl = null;
    nav.querySelectorAll('.nav-item').forEach(function (item) {
      item.setAttribute('draggable', 'true');
      item.addEventListener('dragstart', function (e) {
        dragEl = item;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        try { e.dataTransfer.setData('text/plain', item.getAttribute('data-target')); } catch (ex) {}
      });
      item.addEventListener('dragend', function () {
        dragEl = null;
        nav.querySelectorAll('.nav-item').forEach(function (x) { x.classList.remove('dragging'); });
        saveNavOrder();
      });
      item.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (!dragEl || dragEl === item) return;
        var rect = item.getBoundingClientRect();
        var after = (e.clientY - rect.top) > rect.height / 2;
        if (after) item.after(dragEl); else item.before(dragEl);
      });
      item.addEventListener('drop', function (e) { e.preventDefault(); });
    });
  }
  applyNavOrder();
  initNavDrag();

  // ============================================================
  // MES / AGREGAR MOVIMIENTO / SYNC
  // ============================================================
  function buildMonthSelect() {
    var sel = document.getElementById('sel-month');
    if (!sel) return;
    sel.innerHTML = '';
    MONTHS.forEach(function (m, i) {
      var o = document.createElement('option');
      o.value = i;
      o.textContent = m.month;
      sel.appendChild(o);
    });
    sel.value = String(state.mIdx);
    sel.addEventListener('change', function () {
      state.mIdx = parseInt(sel.value, 10);
      renderResumen();
    });

    var selIng = document.getElementById('sel-month-ingresos');
    if (selIng) {
      selIng.innerHTML = '<option value="all">Todos los meses</option>';
      MONTHS.forEach(function (m) {
        var o = document.createElement('option');
        o.value = m.month.split(' ')[0];
        o.textContent = m.month;
        selIng.appendChild(o);
      });
      selIng.addEventListener('change', renderIngresos);
    }
  }

  document.getElementById('add-mov-btn').addEventListener('click', function () {
    openInfoModal('+ Agregar',
      '<div class="ing-highlight">💡 Elige qué quieres registrar.</div>' +
      '<div class="modal-foot" style="justify-content:flex-start;gap:10px;flex-wrap:wrap;margin-top:6px;">' +
      '<button class="btn-add" id="am-gasto">💸 Gasto diario</button>' +
      '<button class="btn-add" id="am-nota" style="background:linear-gradient(135deg,#11223A,#0C1B30);border:1px solid var(--border);box-shadow:none;color:var(--text-title);">📝 Agregar Nota</button>' +
      '</div>');
    var b1 = document.getElementById('am-gasto');
    if (b1) b1.addEventListener('click', function () { closeMonthModal(); switchTab('gastos-diarios'); var f = document.getElementById('gf-desc'); if (f) setTimeout(function () { f.focus(); }, 200); });
    var b3 = document.getElementById('am-nota');
    if (b3) b3.addEventListener('click', function () { closeMonthModal(); switchTab('notas'); var t = document.getElementById('nt-text'); if (t) setTimeout(function () { t.focus(); }, 200); });
  });

  var GOOGLE_SHEET_CSV = '';
  function parseRow(row) {
    var parts = [], cur = '', inQ = false;
    for (var i = 0; i < row.length; i++) {
      var ch = row[i];
      if (inQ) { if (ch === '"' && row[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') inQ = false; else cur += ch; }
      else { if (ch === '"') inQ = true; else if (ch === ',') { parts.push(cur); cur = ''; } else cur += ch; }
    }
    parts.push(cur);
    return parts.map(function (s) { return s.trim(); });
  }
  function syncFromSheet() {
    if (!GOOGLE_SHEET_CSV) {
      showToast('Google Sheets', 'Configura la URL CSV de tu hoja en GOOGLE_SHEET_CSV dentro de dashboard.js.');
      return;
    }
    showToast('Google Sheets', 'Sincronizando datos...');
    fetch(GOOGLE_SHEET_CSV, { cache: 'no-store' })
      .then(function (r) { return r.text(); })
      .then(function (txt) {
        var lines = txt.split(/\r?\n/).filter(function (l) { return l.trim(); });
        if (lines.length < 2) throw new Error('Hoja vacía o formato inesperado');
        var items = [];
        for (var i = 1; i < lines.length; i++) {
          var p = parseRow(lines[i]);
          if (!p[1]) continue;
          items.push({ source: p[6] || 'Google Sheet', date: p[0] || '2026-07-01', desc: p[1], cat: p[2] || 'Sin categoría', type: p[3] || 'Negocio', usd: parseFloat(p[4]) || 0, pen: parseFloat(p[5]) || 0, status: p[7] || 'Mantener' });
        }
        window.EXPENSES_DATA.items = items;
        expItems = items;
        showToast('Google Sheets', 'Sincronizado: ' + items.length + ' registros.');
        renderResumen();
      })
      .catch(function (e) { showToast('Google Sheets', 'Error: ' + e.message); });
  }


  // ============================================================
  // AGENTE IA
  // ============================================================
  function agentAnswer(q) {
    var t = q.toLowerCase();
    function has() { for (var i = 0; i < arguments.length; i++) if (t.indexOf(arguments[i]) !== -1) return true; return false; }
    if (has('registrar gasto', 'registra gasto', 'anota gasto', 'agregar gasto', 'nuevo gasto', 'apuntar gasto')) {
      var amG = t.match(/(\d+[.,]?\d*)/);
      var amtG = amG ? parseFloat(amG[1].replace(',', '.')) : NaN;
      var descG = q.replace(/registrar gasto|registra gasto|anota gasto|agregar gasto|nuevo gasto|apuntar gasto|por|\$|usd|soles/gi, '').replace(/\d+[.,]?\d*/g, '').trim();
      if (isNaN(amtG) || !descG) {
        return 'Para registrar un gasto dime: "registrar gasto [descripci\u00F3n] por [monto] USD". Ej: "registrar gasto Canva por 15 USD".';
      }
      var itemG = { source: 'Agente IA', date: new Date().toISOString().slice(0, 10), desc: descG, cat: 'Otros', type: 'Negocio', usd: amtG, pen: amtG * FX, status: 'Mantener' };
      expItems.push(itemG);
      gastos += amtG;
      var extrasG = loadExtras(); extrasG.push(itemG); saveExtras(extrasG);
      renderGastosDiarios(); renderGastosMensuales();
      renderResumen();
      return '\u2705 Gasto registrado: "' + descG + '" por ' + fmtUSD(amtG) + '. Lo agregu\u00E9 en Gastos y en tu Resumen.';
    }
    if (has('como voy', 'resumen', 'rapido')) {
      return 'En resumen: ingresos ' + fmtUSD(ingresos) + ', gastos ' + fmtUSD(gastos) + ' y saldo neto de ' + fmtUSD(saldo) + '. Deudas del mes ' + fmtPEN(deudasMes) + ' y ' + fmtPEN(disponible) + ' disponibles.';
    }
    if (has('deuda')) {
      if (has('pendiente', 'total')) return 'Deudas pendientes estimadas: ' + fmtPEN(deudaMin) + ' – ' + fmtPEN(deudaMax) + '. Créditos formales: S/ 71,169 + préstamo familiar S/ 56,860 + informales.';
      if (has('mes', 'mensual')) return 'Tus deudas del mes suman ' + fmtPEN(deudasMes) + ': S/ 6,971 créditos + S/ 2,000 junta + S/ 250 préstamo papá.';
      return 'Deudas del mes: ' + fmtPEN(deudasMes) + '. Pendientes: ' + fmtPEN(deudaMin) + ' – ' + fmtPEN(deudaMax) + '.';
    }
    if (has('gasto', 'salida', 'fuga')) {
      if (has('fuga', 'duplic')) return 'Fugas: Google One +$80 USD, 6 cobros Skool +$30 USD, IA duplicada +$23.60 USD. Ahorro potencial +$' + ahorroPotencial + ' USD/mes.';
      return 'Gastos del mes: ' + fmtUSD(gastos) + ' (negocio + personal). Revisa el módulo Gastos.';
    }
    if (has('ingreso', 'venta', 'factur')) return 'Ingresos del mes: ' + fmtUSD(ingresos) + '. Mejor mes del trimestre: ' + (comboMonths.length ? comboMonths.reduce(function (a, b) { return a.revenueUSD > b.revenueUSD ? a : b; }).month : '—');
    if (has('saldo', 'superavit', 'sobra')) return 'Tu saldo neto del mes es ' + fmtUSD(saldo) + '. Disponible líquido: ' + fmtPEN(disponible) + '.';
    if (has('septiembre', 'alerta', 'critico')) return 'Septiembre es crítico: S/ 9,221 (≈$2,459 USD) entre créditos, junta y préstamo papá.';
    if (has('disponible', 'activo', 'efectivo')) return 'Activos líquidos disponibles: ' + fmtPEN(disponible) + '.';
    if (has('meta', 'objetivo')) return 'Tu meta mensual es US$ ' + META.toLocaleString('en-US') + ' y llevas ' + metaPct + '% (' + fmtUSD(saldo) + ').';
      if (has('registrar pago', 'registra pago', 'anota pago', 'pago de', 'pague', 'paguE', 'abone', 'abonE')) {
      var am = t.match(/(\d+[.,]?\d*)/);
      var amt = am ? parseFloat(am[1].replace(',', '.')) : NaN;
      var desc = q.replace(/registrar pago|registra pago|anota pago|pago de|pague|paguE|abone|abonE|por|\$|usd/gi, '').replace(/\d+[.,]?\d*/g, '').trim();
      if (isNaN(amt) || !desc) {
        return 'Para registrar un pago dime: "registrar pago [concepto] por [monto] USD". Ej: "registrar pago Santander por 800 USD".';
      }
      var hoy = new Date();
      var dd = ('0' + hoy.getDate()).slice(-2), mm = ('0' + (hoy.getMonth() + 1)).slice(-2);
      var arr = loadPagosExtra();
      arr.push({ fecha: dd + '/' + mm, desc: desc, usd: amt });
      savePagosExtra(arr);
      renderPagos();
      return '\u2705 Pago registrado: "' + desc + '" por ' + fmtUSD(amt) + '. Lo ver\u00E1s en la secci\u00F3n Pagos.';
    }
  if (has('hola', 'buenas', 'hey')) return '¡Hola! Soy tu agente financiero. Pregúntame cómo vas, cuánto debes, tus gastos, fugas o metas.';
    if (has('gracias')) return '¡Con gusto! Aquí estoy cuando me necesites.';
    return 'Puedo ayudarte con: ingresos, deudas, gastos, fugas, saldo, disponible, metas o el resumen del mes.';
  }
  function bindAgent() {
    var fab = document.getElementById('agent-fab');
    var panel = document.getElementById('agent-panel');
    var body = document.getElementById('agent-body');
    var input = document.getElementById('agent-input');
    var form = document.getElementById('agent-form');
    var close = document.getElementById('agent-close');
    fab.addEventListener('click', function () { panel.classList.toggle('open'); });
    close.addEventListener('click', function () { panel.classList.remove('open'); });
    function push(html, who) {
      var m = document.createElement('div');
      m.className = 'agent-msg ' + (who || 'bot');
      m.innerHTML = html;
      body.appendChild(m);
      body.scrollTop = body.scrollHeight;
    }
    function ask(q) {
      if (!q) return;
      push(esc(q), 'user');
      setTimeout(function () { push(agentAnswer(q)); }, 320);
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      ask(input.value.trim());
      input.value = '';
    });
    document.querySelectorAll('.agent-chip').forEach(function (chip) {
      chip.addEventListener('click', function () { ask(chip.getAttribute('data-q')); });
    });
  }

  // ============================================================
  // TOOLTIP + TO-TOP
  // ============================================================
  var tipEl = document.getElementById('chart-tip');
  document.body.addEventListener('mouseover', function (e) {
    var t = e.target;
    var tip = (t && typeof t.getAttribute === 'function') ? t.getAttribute('data-tip') : null;
    if (tip) {
      tipEl.innerHTML = tip;
      tipEl.classList.add('visible');
      var x = e.clientX + 14, y = e.clientY + 14;
      var r = tipEl.getBoundingClientRect();
      if (x + r.width > window.innerWidth - 10) x = e.clientX - r.width - 14;
      if (y + r.height > window.innerHeight - 10) y = e.clientY - r.height - 14;
      tipEl.style.left = x + 'px';
      tipEl.style.top = y + 'px';
    } else {
      tipEl.classList.remove('visible');
    }
  });

  var toTop = document.getElementById('to-top');
  window.addEventListener('scroll', function () { toTop.classList.toggle('show', window.scrollY > 500); });
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  function loadExtras() { try { return JSON.parse(localStorage.getItem('stark_gastos_extra') || '[]'); } catch (e) { return []; } }
  function saveExtras(arr) { localStorage.setItem('stark_gastos_extra', JSON.stringify(arr)); }
  function loadFormalPagos() { try { return JSON.parse(localStorage.getItem('stark_formal_pagos') || '[]'); } catch (e) { return []; } }
  function saveFormalPagos(arr) { localStorage.setItem('stark_formal_pagos', JSON.stringify(arr)); }
  function payCount(name) { return loadFormalPagos().filter(function (p) { return p.name === name; }).length; }
  function paidThisMonth(name) {
    var hoy = new Date();
    var prefix = hoy.getFullYear() + '-' + (hoy.getMonth() + 1 < 10 ? '0' : '') + (hoy.getMonth() + 1);
    return loadFormalPagos().filter(function (p) { return p.name === name && String(p.date).indexOf(prefix) === 0; }).length;
  }

  function downloadCsv(filename, rows) {
    var csv = rows.map(function (r) { return r.map(function (c) { var s = String(c); if (s.indexOf(';') !== -1 || s.indexOf('"') !== -1 || s.indexOf('\n') !== -1 || s.indexOf('\r') !== -1) s = '"' + s.replace(/"/g, '""') + '"'; return s; }).join(';'); }).join('\r\n');
    var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }
  function exportTodo() {
    var rows = [];
    function sec(t) { rows.push([t]); rows.push([]); }
    function sep() { rows.push([]); }
    // RESUMEN
    sec('=== RESUMEN FINANCIERO ===');
    rows.push(['Mes', 'Ingresos (USD)', 'Gastos (USD)', 'Profit (USD)', 'Deudas del mes (PEN)']);
    var tI = 0, tG = 0, tP = 0;
    fullMonths.forEach(function (m) {
      var h = hotmartFor(m);
      var g = (m.adsUSD || 0) + (m.toolsUSD || 0) + (m.withdrawalsUSD || 0);
      var ing = m.revenueUSD + h;
      tI += ing; tG += g; tP += ing - g;
      rows.push([m.month, Math.round(ing), Math.round(g), Math.round(ing - g), '']);
    });
    rows.push(['TOTAL', Math.round(tI), Math.round(tG), Math.round(tP), deudasMes]);
    sep();
    // INGRESOS
    sec('=== INGRESOS ===');
    rows.push(['Mes', 'Ventas Combo IA', 'Retiros Hotmart', 'Ingresos totales', 'Gasto pauta', 'Herramientas', 'Retiros', 'Ganancia neta', 'ROAS']);
    fullMonths.forEach(function (m) {
      var h = hotmartFor(m);
      rows.push([m.month, m.revenueUSD, h, m.revenueUSD + h, m.adsUSD || 0, m.toolsUSD || 0, m.withdrawalsUSD || 0, m.profitUSD || 0, m.roas]);
    });
    sep();
    // GASTOS
    sec('=== GASTOS ===');
    rows.push(['Fecha', 'Fuente', 'Descripci\u00F3n', 'Categor\u00EDa', 'Tipo', 'USD', 'PEN', 'Estado']);
    var gUSD = 0, gPEN = 0;
    expItems.forEach(function (it) { gUSD += it.usd; gPEN += it.pen; rows.push([it.date, it.source, it.desc, it.cat, it.type, it.usd.toFixed(2), it.pen.toFixed(2), it.status]); });
    rows.push(['TOTAL', '', '', '', '', gUSD.toFixed(2), gPEN.toFixed(2), '']);
    sep();
    // DEUDAS
    sec('=== DEUDAS ===');
    rows.push(['Cr\u00E9dito', 'Cuota mensual (S/)', 'Vencimiento', 'Cuotas', 'Periodo', 'Saldo pendiente (S/)', 'Pagos registrados']);
    var pendTotal = 0;
    formalCredits.forEach(function (c) { pendTotal += c.pendingBalancePEN; rows.push([c.name, c.monthlyFeePEN, 'D\u00EDa ' + c.dueDateDay, c.remainingQuota, c.range, c.pendingBalancePEN, payCount(c.name)]); });
    rows.push(['TOTAL', '', '', '', '', pendTotal, '']);
    sep();
    sec('=== DEUDAS INFORMALES / FAMILIARES ===');
    rows.push(['Acreedor', 'Monto (S/)', 'Nota', 'Prioridad']);
    if (debts && debts.informalDebts) debts.informalDebts.forEach(function (d) { rows.push([d.creditor, d.amountPEN, d.note || '', d.priority || '']); });
    sep();
    // TARJETAS
    sec('=== TARJETAS ===');
    rows.push(['Tarjeta', 'Titular', 'Facturaci\u00F3n', 'Fecha de pago', 'L\u00EDnea']);
    if (window.CARDS_DATA) window.CARDS_DATA.cards.forEach(function (c) { rows.push([c.card, c.holder, 'D\u00EDa ' + c.factura, 'D\u00EDa ' + c.pago, (c.currency === 'USD' ? '$' : 'S/ ') + c.linea.toFixed(2)]); });
    sep();
    // NEGOCIO
    sec('=== NEGOCIO - HERRAMIENTAS ===');
    rows.push(['Herramienta', 'D\u00EDa de pago', 'Monto (USD)']);
    var toolsN = [];
    if (window.BUSINESS_DATA && window.BUSINESS_DATA.tools) toolsN = toolsN.concat(window.BUSINESS_DATA.tools);
    loadNegocioExtra().forEach(function (t) { toolsN.push(t); });
    var nTotal = 0;
    toolsN.forEach(function (t) { nTotal += t.usd; var d = parseInt(t.fecha, 10); rows.push([t.name, d <= 31 ? d + ' de cada mes' : t.fecha, t.usd]); });
    rows.push(['TOTAL', '', nTotal.toFixed(2)]);
    sep();
    // PERSONAL
    sec('=== PERSONAL - AHORROS ===');
    rows.push(['Mes', 'Banco', 'Saldo inicial (S/)', 'Entradas (S/)', 'Salidas (S/)', 'Saldo final (S/)']);
    if (window.PERSONAL_DATA) window.PERSONAL_DATA.accounts.forEach(function (acc) {
      Object.keys(acc.months).forEach(function (mo) {
        var m = acc.months[mo];
        rows.push([mo, acc.bank, m.ant, m.entradas, m.salidas, m.fin]);
      });
    });
    sep();
    // REPORTES
    sec('=== REPORTES ===');
    rows.push(['Mes', 'Ingresos (USD)', 'Gastos (USD)', 'Saldo (USD)', 'ROAS', 'Estado']);
    var rI = 0, rG = 0, rS = 0;
    fullMonths.forEach(function (m) {
      var h = hotmartFor(m);
      var g = (m.adsUSD || 0) + (m.toolsUSD || 0) + (m.withdrawalsUSD || 0);
      var s = (m.revenueUSD + h) - g;
      rI += m.revenueUSD + h; rG += g; rS += s;
      rows.push([m.month, Math.round(m.revenueUSD + h), Math.round(g), Math.round(s), m.roas, s >= 0 ? 'Positivo' : 'Revisar']);
    });
    rows.push(['TOTAL', Math.round(rI), Math.round(rG), Math.round(rS), '', '']);
    sep();
    // MOVIMIENTOS
    sec('=== MOVIMIENTOS ===');
    rows.push(['Movimiento', 'Categor\u00EDa', 'Fecha', 'Monto USD', 'Tipo']);
    buildMovementsList();
    movAll.forEach(function (r) { rows.push([r.name, r.cat, r.date, r.usd, r.type]); });
    downloadCsv('stark_resumen_completo.csv', rows);
    showToast('Exportado', 'Resumen completo descargado (todas las secciones).');
  }
  function exportActive() {
    var target = 'resumen';
    document.querySelectorAll('.view').forEach(function (v) { if (v.style.display === 'block') target = v.id.replace('view-', ''); });
    var rows = [];
    if (target === 'deudas') {
      rows = [['Cr\u00E9dito', 'Cuota mensual (S/)', 'Vencimiento', 'Cuotas', 'Periodo', 'Saldo pendiente (S/)', 'Pagos registrados']];
      var pendTotal = 0;
      formalCredits.forEach(function (c) { pendTotal += c.pendingBalancePEN; rows.push([c.name, c.monthlyFeePEN, 'D\u00EDa ' + c.dueDateDay, c.remainingQuota, c.range, c.pendingBalancePEN, payCount(c.name)]); });
      rows.push(['TOTAL', '', '', '', '', pendTotal, '']);
      downloadCsv('stark_deudas.csv', rows);
    } else if (target === 'gastos' || target === 'gastos-diarios' || target === 'gastos-mensuales') {
      rows = [['Fecha', 'Fuente', 'Descripci\u00F3n', 'Categor\u00EDa', 'Tipo', 'USD', 'PEN', 'Estado']];
      var gUSD = 0, gPEN = 0;
      expItems.forEach(function (it) { gUSD += it.usd; gPEN += it.pen; rows.push([it.date, it.source, it.desc, it.cat, it.type, it.usd.toFixed(2), it.pen.toFixed(2), it.status]); });
      rows.push(['TOTAL', '', '', '', '', gUSD.toFixed(2), gPEN.toFixed(2), '']);
      downloadCsv('stark_gastos.csv', rows);
    } else if (target === 'ingresos') {
      rows = [['Mes', 'Ingresos Combo (USD)', 'Retiros Hotmart (USD)', 'Total (USD)', 'Gasto pauta (USD)', 'Ganancia neta (USD)', 'ROAS']];
      var iC = 0, iH = 0, iAds = 0, iP = 0;
      fullMonths.forEach(function (m) { var h = hotmartFor(m); iC += m.revenueUSD; iH += h; iAds += (m.adsUSD || 0); iP += (m.profitUSD || 0); rows.push([m.month, m.revenueUSD, h, m.revenueUSD + h, m.adsUSD || 0, m.profitUSD || 0, m.roas]); });
      rows.push(['TOTAL', iC, iH, iC + iH, iAds, iP, '']);
      downloadCsv('stark_ingresos.csv', rows);
    } else if (target === 'reportes') {
      rows = [['Mes', 'Ingresos (USD)', 'Gastos (USD)', 'Saldo (USD)', 'ROAS', 'Estado']];
      var rI = 0, rG = 0, rS = 0;
      fullMonths.forEach(function (m) { var h = hotmartFor(m); var g = (m.adsUSD || 0) + (m.toolsUSD || 0) + (m.withdrawalsUSD || 0); var s = (m.revenueUSD + h) - g; rI += m.revenueUSD + h; rG += g; rS += s; rows.push([m.month, (m.revenueUSD + h), g, s, m.roas, s >= 0 ? 'Positivo' : 'Revisar']); });
      rows.push(['TOTAL', rI, rG, rS, '', '']);
      downloadCsv('stark_reportes.csv', rows);
    } else if (target === 'inicio') {
      exportProyectos();
    } else if (target === 'fechas') {
      exportFechas();
    } else if (target === 'notas') {
      downloadDiario();
    } else if (target === 'personal') {
      exportPersonal();
    } else if (target === 'negocio') {
      exportNegocio();
    } else if (target === 'resumen') {
      exportTodo();
    } else {
      rows = [['Movimiento', 'Categor\u00EDa', 'Fecha', 'Monto USD', 'Tipo']];
      buildMovementsList();
      movAll.forEach(function (r) { rows.push([r.name, r.cat, r.date, r.usd, r.type]); });
      downloadCsv('stark_movimientos.csv', rows);
    }
    showToast('Exportado', 'CSV descargado \u2014 \u00E1brelo en Excel o Google Sheets.');
  }
  function exportProyectos() {
    var rows = [['Proyecto', 'Prioridad', 'Objetivo', 'Fecha l\u00EDmite', 'Horas estimadas', 'Tiempo invertido', 'Progreso %', 'Ingresos USD', 'Gastos USD', 'USD/hora', 'Pr\u00F3xima acci\u00F3n']];
    loadProyectos().forEach(function (p) {
      var totalH = (p.tiempoTotalMs || 0) / 3600000;
      var pct = Math.min(100, Math.round((totalH / Math.max(0.01, (p.horasEstimadas || 0))) * 100));
      var rent = totalH > 0 ? ((p.ingresosUSD || 0) / totalH) : 0;
      var prio = p.completado ? 'Completado' : p.prioridad === 'max' ? 'M\u00E1xima' : p.prioridad === 'imp' ? 'Importante' : p.prioridad === 'control' ? 'En control' : 'Pausado';
      rows.push([p.nombre, prio, p.objetivo || '', p.fechaLimite || '', p.horasEstimadas || 0, fmtDur(p.tiempoTotalMs || 0), pct, p.ingresosUSD || 0, p.gastosUSD || 0, rent.toFixed(2), p.proximaAccion || '']);
      (p.tareas || []).forEach(function (t) { rows.push(['  TAREA: ' + t.text, t.done ? 'Hecha' : 'Pendiente', '', '', '', t.tiempoMs ? fmtDur(t.tiempoMs) : '', '', '', '', '', '']); });
    });
    downloadCsv('stark_proyectos.csv', rows);
  }
  function exportFechas() {
    var rows = [['Fecha', 'D\u00EDas', 'Concepto', 'Tipo', 'Monto']];
    var hoy = new Date();
    var y = hoy.getFullYear(), m = hoy.getMonth();
    function daysFrom(dt) { return Math.max(0, Math.round((dt - hoy) / 86400000)); }
    function nextDayOfMonth(day) { var d = new Date(y, m, day); if (d < new Date(y, m, hoy.getDate())) d = new Date(y, m + 1, day); return d; }
    var items = [];
    formalCredits.forEach(function (c) { var d = nextDayOfMonth(c.dueDateDay); items.push({ fecha: d, name: c.name.split('(')[0].trim(), tipo: 'Cr\u00E9dito', monto: 'S/ ' + c.monthlyFeePEN }); });
    var dts = hoy.getDay() === 0 ? 0 : 7 - hoy.getDay();
    if (debts && debts.weeklyCommitments) debts.weeklyCommitments.forEach(function (w) { if (!(w.weeklyFeePEN > 0)) return; var d = new Date(hoy.getTime() + dts * 86400000); items.push({ fecha: d, name: w.name, tipo: 'Semanal', monto: 'S/ ' + w.weeklyFeePEN }); });
    if (window.CARDS_DATA) window.CARDS_DATA.cards.forEach(function (c) { var d = nextDayOfMonth(c.pago); items.push({ fecha: d, name: c.card, tipo: 'Tarjeta', monto: (c.currency === 'USD' ? '$' : 'S/ ') + (c.linea || '') }); });
    var toolsN = [];
    if (window.BUSINESS_DATA && window.BUSINESS_DATA.tools) toolsN = toolsN.concat(window.BUSINESS_DATA.tools);
    loadNegocioExtra().forEach(function (t) { toolsN.push(t); });
    toolsN.forEach(function (t) { var day = parseInt(String(t.fecha || '').trim().split(' ')[0], 10); if (day >= 1 && day <= 31) { var d = nextDayOfMonth(day); items.push({ fecha: d, name: t.name, tipo: 'Herramienta', monto: '$' + (t.usd || '—') }); } });
    items.sort(function (a, b) { return a.fecha - b.fecha; });
    items.forEach(function (it) { var dd = ('0' + it.fecha.getDate()).slice(-2), mm = ('0' + (it.fecha.getMonth() + 1)).slice(-2); rows.push([dd + '/' + mm, daysFrom(it.fecha), it.name, it.tipo, it.monto]); });
    downloadCsv('stark_fechas_pago.csv', rows);
  }
  function exportPersonal() {
    var rows = [['Mes', 'BCP entradas', 'BCP salidas', 'BCP final', 'SCOT entradas', 'SCOT salidas', 'SCOT final', 'Total final']];
    ['Enero 2026', 'Febrero 2026', 'Marzo 2026', 'Abril 2026', 'Mayo 2026', 'Junio 2026', 'Julio 2026'].forEach(function (mo) {
      var b = null, s = null;
      if (window.PERSONAL_DATA) window.PERSONAL_DATA.accounts.forEach(function (acc) { var mm2 = acc.months[mo]; if (!mm2) return; if (acc.bank === 'BCP') b = mm2; else s = mm2; });
      var fin = (b ? b.fin : 0) + (s ? s.fin : 0);
      rows.push([mo, b ? b.entradas : 0, b ? b.salidas : 0, b ? b.fin : 0, s ? s.entradas : 0, s ? s.salidas : 0, s ? s.fin : 0, fin]);
    });
    downloadCsv('stark_ahorros.csv', rows);
  }
  function exportNegocio() {
    var rows = [['Herramienta', 'Fecha', 'USD']];
    var tools = [];
    if (window.BUSINESS_DATA && window.BUSINESS_DATA.tools) tools = tools.concat(window.BUSINESS_DATA.tools);
    tools = tools.concat(loadNegocioExtra());
    tools.forEach(function (t) { rows.push([t.name, t.fecha, t.usd]); });
    downloadCsv('stark_negocio.csv', rows);
  }
  function bindExtras() {
    var eb = document.getElementById('export-btn');
    if (eb) eb.addEventListener('click', exportActive);
    var ga = document.getElementById('gf-add');
    if (ga) ga.addEventListener('click', function () {
      var desc = document.getElementById('gf-desc').value.trim();
      var monto = parseFloat(document.getElementById('gf-monto').value);
      var mone = document.getElementById('gf-mone').value;
      if (!desc || isNaN(monto) || monto <= 0) { showToast('Gasto por d\u00EDa', 'Completa descripci\u00F3n y monto v\u00E1lido.'); return; }
      var usd = mone === 'SOL' ? monto / FX : monto;
      var pen = mone === 'SOL' ? monto : monto * FX;
      var item = { source: 'Registro diario', date: document.getElementById('gf-fecha').value || '2026-07-27', desc: desc, cat: document.getElementById('gf-cat').value, type: document.getElementById('gf-tipo').value, usd: usd, pen: pen, status: 'Mantener' };
      expItems.push(item);
      gastos += usd;
      var extras = loadExtras(); extras.push(item); saveExtras(extras);
      document.getElementById('gf-desc').value = '';
      document.getElementById('gf-monto').value = '';
      showToast('Gasto registrado', desc + ' \u00B7 ' + fmtUSD(usd) + ' \u2248 S/ ' + pen.toFixed(2));
      renderGastosDiarios(); renderGastosMensuales();
      renderResumen();
    });
    var gfm = document.getElementById('gf-monto');
    if (gfm) gfm.addEventListener('input', updateGastoEquiv);
    var gfn = document.getElementById('gf-mone');
    if (gfn) gfn.addEventListener('change', updateGastoEquiv);
  }
  function updateGastoEquiv() {
    var eq = document.getElementById('gf-equiv');
    if (!eq) return;
    var monto = parseFloat(document.getElementById('gf-monto') ? document.getElementById('gf-monto').value : '');
    if (isNaN(monto) || monto <= 0) { eq.textContent = ''; return; }
    var mone = document.getElementById('gf-mone') ? document.getElementById('gf-mone').value : 'USD';
    if (mone === 'SOL') eq.textContent = '≈ ' + fmtUSD(monto / FX) + ' USD';
    else eq.textContent = '≈ S/ ' + (monto * FX).toFixed(2);
  }
  function loadPagosExtra() { try { return JSON.parse(localStorage.getItem('stark_pagos_extra') || '[]'); } catch (e) { return []; } }
  function savePagosExtra(arr) { localStorage.setItem('stark_pagos_extra', JSON.stringify(arr)); }
  function renderPagos() {
    var tb = document.getElementById('payments-tbody');
    var tot = document.getElementById('payments-total');
    if (!tb) return;
    var rows = [];
    if (window.PAYMENTS_HISTORY) window.PAYMENTS_HISTORY.forEach(function (p) { rows.push({ fecha: p.fecha, desc: p.desc, usd: p.usd, extra: false }); });
    loadPagosExtra().forEach(function (p) { rows.push({ fecha: p.fecha, desc: p.desc, usd: p.usd, extra: true }); });
    rows.sort(function (a, b) { return String(a.fecha).localeCompare(String(b.fecha)); });
    var total = 0;
    tb.innerHTML = rows.map(function (r) {
      total += r.usd;
      return '<tr><td>' + esc(r.fecha) + '</td><td class="cell-title">' + esc(r.desc) + (r.extra ? ' <span class="usd-mini">(diario)</span>' : '') + '</td><td class="amt-exp">' + fmtUSD(r.usd) + '</td></tr>';
    }).join('');
    if (tot) tot.textContent = 'Total: ' + fmtUSD(total) + ' \u00B7 ' + rows.length + ' pagos';
  }
  function bindPagosForm() {
    var btn = document.getElementById('pf-add');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var desc = document.getElementById('pf-desc').value.trim();
      var usd = parseFloat(document.getElementById('pf-usd').value);
      if (!desc || isNaN(usd) || usd <= 0) { showToast('Pagos', 'Completa concepto y monto USD v\u00E1lido.'); return; }
      var fecha = (document.getElementById('pf-fecha').value || '2026-07-27').slice(5).split('-').reverse().join('/');
      var arr = loadPagosExtra(); arr.push({ fecha: fecha, desc: desc, usd: usd }); savePagosExtra(arr);
      document.getElementById('pf-desc').value = '';
      document.getElementById('pf-usd').value = '';
      showToast('Pago registrado', desc + ' \u00B7 ' + fmtUSD(usd));
      renderPagos();
    });
  }
  function loadNotas() { try { return JSON.parse(localStorage.getItem('stark_notas') || '[]'); } catch (e) { return []; } }
  function saveNotas(arr) { localStorage.setItem('stark_notas', JSON.stringify(arr)); }
  function analyzeNote(text) {
    var q = (text || '').toLowerCase();
    var has = function () { for (var i = 0; i < arguments.length; i++) if (q.indexOf(arguments[i]) !== -1) return true; return false; };
    var mNum = q.match(/(\d+[.,]?\d*)/);
    var amount = mNum ? parseFloat(mNum[1].replace(',', '.')) : null;
    var daily = has('diario', 'diaria', 'por dia', 'al dia', 'al d\u00EDa', 'cada dia', 'cada d\u00EDa');
    var weekly = has('semana', 'semanal', 'a la semana');
    var mult = daily ? 30 : weekly ? 4.33 : 1;
    var perMonth = amount !== null ? amount * mult : null;
    var compUSD = deudasMes / FX;
    var profit = monthProfitReal();
    var hoy = new Date(), tDay = hoy.getDate();
    var mDays = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
    var proxT = null;
    if (window.CARDS_DATA) window.CARDS_DATA.cards.forEach(function (c) {
      var d = c.pago - tDay; if (d < 0) d = c.pago + (mDays - tDay);
      if (!proxT || d < proxT.d) proxT = { d: d, c: c };
    });
    var proxC = null;
    formalCredits.forEach(function (c) {
      var d = c.dueDateDay - tDay; if (d < 0) d = c.dueDateDay + (mDays - tDay);
      if (!proxC || d < proxC.d) proxC = { d: d, c: c };
    });
    var out = [];
    var action = '';
    if (has('ahorro', 'ahorrar', 'guardar', 'meta', 'objetivo')) {
      out.push('Entiendo que quieres enfocarte en <b>ahorrar</b>' + (amount ? ' como m\u00EDnimo <b>US$ ' + amount.toLocaleString('en-US') + (daily ? ' diarios' : weekly ? ' semanales' : ' mensuales') + '</b>' : '') + '.');
      if (perMonth) {
        out.push('Eso equivale a <b>US$ ' + perMonth.toLocaleString('en-US', { maximumFractionDigits: 0 }) + '/mes</b>.');
        var faltante = Math.max(0, META - saldo);
        out.push('Tu meta es US$ ' + META.toLocaleString('en-US') + ' (vas al ' + metaPct + '%, faltan US$ ' + faltante.toLocaleString('en-US') + ').');
        out.push(perMonth <= profit
          ? 'Con tu profit real de ' + monthLabel() + ' (' + fmtUSD(profit) + ') <b>es alcanzable</b> — cabe dentro de tu flujo actual.'
          : 'Con tu profit actual de ' + fmtUSD(profit) + ' te faltar\u00EDan <b>US$ ' + (perMonth - profit).toLocaleString('en-US', { maximumFractionDigits: 0 }) + '/mes</b>. Cierra fugas (+$134/mes), sube el ROAS a \u22652x y separa ese ahorro el d\u00EDa 1.');
      }
      action = 'Automatiza el ahorro el d\u00EDa 1 (20% de cada ingreso) y recorta las fugas de suscripciones.';
    }
    if (has('pagar', 'credito', 'creditos', 'cr\u00E9dito', 'cr\u00E9ditos', 'deuda', 'deudas', 'cuota', 'cuotas', 'pendiente', 'pendientes', 'compromiso')) {
      out.push('Sobre tus <b>pagos pendientes</b>: comprometes <b>S/ ' + deudasMes.toLocaleString() + ' (\u2248 ' + fmtUSD(compUSD) + ')</b> este mes entre cr\u00E9ditos, junta y pr\u00E9stamo pap\u00E1.');
      if (perMonth) {
        out.push(perMonth >= compUSD
          ? 'Con tu ritmo de <b>US$ ' + perMonth.toLocaleString('en-US', { maximumFractionDigits: 0 }) + '/mes</b> cubres el compromiso y te sobran <b>US$ ' + (perMonth - compUSD).toLocaleString('en-US', { maximumFractionDigits: 0 }) + '</b> para amortizar deuda.'
          : 'Ese ritmo (<b>US$ ' + perMonth.toLocaleString('en-US', { maximumFractionDigits: 0 }) + '/mes</b>) no alcanza el compromiso de ' + fmtUSD(compUSD) + '/mes — te faltan <b>US$ ' + (compUSD - perMonth).toLocaleString('en-US', { maximumFractionDigits: 0 }) + '/mes</b>.');
      }
      var ven = [];
      if (proxC) ven.push(proxC.c.name.split('(')[0].trim() + ' el d\u00EDa ' + proxC.c.dueDateDay + ' (S/ ' + proxC.c.monthlyFeePEN.toLocaleString() + ')');
      if (proxT) ven.push(proxT.c.card + ' el d\u00EDa ' + proxT.c.pago);
      if (ven.length) out.push('Pr\u00F3ximos vencimientos: <b>' + ven.join(' y ') + '</b>.');
      action = 'Prioriza el pr\u00E9stamo de pap\u00E1 (S/ 5,000) y las tarjetas antes que las cuotas; aparta S/ 9,221 para septiembre.';
    }
    if (has('gasto', 'gastos', 'fuga', 'fugas', 'gastar', 'suscrip')) {
      out.push('Sobre tus <b>gastos</b>: las fugas detectadas suman <b>+$134/mes</b> (Google One +$80, 6 cobros Skool +$30, IA duplicada +$23.60 y OpenAI \u00D72 en enero).');
      if (!action) action = 'Cancela los duplicados esta semana: recuperas ~$134/mes para deuda o ahorro.';
    }
    if (has('ingreso', 'venta', 'hotmart', 'combo', 'factura', 'cliente')) {
      var avgCombo = comboMonths.length ? comboMonths.reduce(function (s, m) { return s + m.revenueUSD; }, 0) / comboMonths.length : 0;
      out.push('Tus <b>ingresos</b>: el Combo IA promedi\u00F3 US$ ' + fmtUSD(avgCombo) + '/mes y el Low Ticket Hotmart US$ 1,306/mes. Mejor mes: ' + (comboMonths.length ? comboMonths.reduce(function (a, b) { return a.revenueUSD > b.revenueUSD ? a : b; }).month : '—') + '.');
      if (!action) action = 'Empuja el Low Ticket a \u2265 US$ 1,700/mes para que cubra las herramientas.';
    }
    if (has('tarjeta', 'tarjetas', 'scotiabank', 'interbank', 'bbva', 'oh!')) {
      out.push('Sobre tus <b>tarjetas</b>: el revolving cuesta ~100% TEA — liquida Scotiabank Angel (S/ 1,550) y Papa Michel (S/ 2,400) antes que las cuotas de cr\u00E9dito.');
      if (!action) action = 'Paga primero las tarjetas y usa el calendario de pagos para no atrasarte.';
    }
    if (has('septiembre', 'critico', 'cr\u00EDtico', 'alerta')) {
      out.push('⚠️ <b>Septiembre es tu mes cr\u00EDtico:</b> S/ 9,221 en una sola tanda (cuotas d\u00EDas 2, 11 y 19 + junta + pr\u00E9stamo pap\u00E1).');
      if (!action) action = 'Aparta S/ 9,221 hoy mismo en una cuenta separada.';
    }
    if (!out.length) {
      out.push('📌 Entiendo tu nota: <b>' + esc(text) + '</b>.');
      out.push('Contexto para que decidas: tu profit real de ' + monthLabel() + ' es <b>' + fmtUSD(profit) + '</b>, el compromiso del mes es <b>' + fmtUSD(compUSD) + '</b> y vas al <b>' + metaPct + '%</b> de tu meta.');
    }
    if (!action) action = 'Haz tu revisi\u00F3n semanal del lunes: ROAS, pauta y pr\u00F3ximos pagos.';
    out.push('✅ <b>Acci\u00F3n sugerida:</b> ' + action + '.');
    return '<div class="ia-main">' + out.join(' ') + '</div>' +
      '<div class="ia-ctx">📊 Contexto del dashboard hoy: Profit real ' + monthLabel() + ': ' + fmtUSD(profit) + ' (ingresos ' + fmtUSD(monthIngresosReal()) + ' \u2212 gastos ' + fmtUSD(monthGastosReal()) + ') \u00B7 Deudas del mes: ' + fmtPEN(deudasMes) + (proxT ? ' \u00B7 Tarjeta ' + proxT.c.card + ' en ' + proxT.d + 'd' : '') + (proxC ? ' \u00B7 Cuota ' + proxC.c.name.split('(')[0].trim() + ' en ' + proxC.d + 'd' : '') + ' \u00B7 Meta al ' + metaPct + '%.</div>';
  }
  function noteExtract(text) {
    var q = (text || '').toLowerCase();
    var has = function () { for (var i = 0; i < arguments.length; i++) if (q.indexOf(arguments[i]) !== -1) return true; return false; };
    var mNum = q.match(/(\d+[.,]?\d*)/);
    var amount = mNum ? parseFloat(mNum[1].replace(',', '.')) : null;
    var daily = has('diario', 'diaria', 'por dia', 'al dia', 'al d\u00EDa', 'cada dia', 'cada d\u00EDa');
    var weekly = has('semana', 'semanal', 'a la semana');
    var mult = daily ? 30 : weekly ? 4.33 : 1;
    var perMonth = amount !== null ? amount * mult : null;
    var compUSD = deudasMes / FX;
    var profit = monthProfitReal();
    if (has('pagar', 'credito', 'creditos', 'cr\u00E9dito', 'cr\u00E9ditos', 'deuda', 'deudas', 'cuota', 'cuotas', 'pendiente', 'pendientes')) {
      if (perMonth) return perMonth >= compUSD
        ? '💡 US$ ' + perMonth.toLocaleString('en-US', { maximumFractionDigits: 0 }) + '/mes cubre tu compromiso de ' + fmtUSD(compUSD) + ' y deja margen.'
        : '💡 US$ ' + perMonth.toLocaleString('en-US', { maximumFractionDigits: 0 }) + '/mes no cubre el compromiso de ' + fmtUSD(compUSD) + '.';
      return '💡 Compromiso del mes: ' + fmtUSD(compUSD) + ' — prioriza pr\u00E9stamo pap\u00E1 y tarjetas.';
    }
    if (has('ahorro', 'ahorrar', 'guardar', 'meta', 'objetivo')) {
      if (perMonth) return '💡 Ahorrar US$ ' + perMonth.toLocaleString('en-US', { maximumFractionDigits: 0 }) + '/mes ' + (perMonth <= profit ? 's\u00ED es alcanzable con tu profit de ' + fmtUSD(profit) + '.' : 'supera tu profit de ' + fmtUSD(profit) + ' — revisa fugas y ROAS.');
      return '💡 Meta US$ ' + META.toLocaleString('en-US') + ' al ' + metaPct + '%: faltan ' + fmtUSD(Math.max(0, META - saldo)) + '.';
    }
    if (has('gasto', 'gastos', 'fuga', 'fugas', 'suscrip')) return '💡 Fugas +$134/mes: cancela los duplicados de suscripciones.';
    if (has('ingreso', 'venta', 'hotmart', 'combo', 'factura')) return '💡 Empuja el Low Ticket a \u2265 US$ 1,700/mes para cubrir las herramientas.';
    if (has('tarjeta', 'tarjetas', 'scotiabank', 'interbank', 'bbva', 'oh!')) return '💡 Liquida primero las tarjetas (revolving ~100% TEA).';
    if (has('septiembre', 'critico', 'cr\u00EDtico', 'alerta')) return '💡 Septiembre cr\u00EDtico: aparta S/ 9,221 hoy.';
    return '💡 Revisi\u00F3n semanal: ROAS, pauta y pr\u00F3ximos pagos.';
  }
  // ============================================================
  // PROYECTOS · SEMÁFOROS · DAILY
  // ============================================================
  var PROYECTOS_DEFAULT = [
    { id: 'venta-local', nombre: 'Venta Local Contra Entrega', objetivo: 'Cerrar ventas contra entrega en tu localidad y validar el modelo de flujo rápido', prioridad: 'max', fechaLimite: '2026-09-18', horasEstimadas: 40, diasSemana: 6, tiempoDiarioRecom: 3, ingresosUSD: 0, gastosUSD: 0, proximaAccion: 'Definir producto ancla y precios de entrega', historial: [] },
    { id: 'auto-vip', nombre: 'Curso Vende en Automático VIP', objetivo: 'Completar y vender el curso de ventas automatizadas', prioridad: 'imp', fechaLimite: '2026-09-30', horasEstimadas: 30, diasSemana: 6, tiempoDiarioRecom: 2, ingresosUSD: 0, gastosUSD: 0, proximaAccion: 'Grabar el módulo 2 del curso', historial: [] },
    { id: 'low-ticket', nombre: 'Productos Low ticket HT', objetivo: 'Publicar y escalar productos low ticket en Hotmart', prioridad: 'control', fechaLimite: '2026-10-15', horasEstimadas: 25, diasSemana: 5, tiempoDiarioRecom: 1, ingresosUSD: 1306, gastosUSD: 1600, proximaAccion: 'Publicar 3 productos de prueba esta semana', historial: [] },
    { id: 'vendespy', nombre: 'VendeSpy', objetivo: 'Pausado — investigar competencia cuando haya tiempo', prioridad: 'pausado', fechaLimite: '2026-12-31', horasEstimadas: 20, diasSemana: 0, tiempoDiarioRecom: 0, ingresosUSD: 0, gastosUSD: 0, proximaAccion: '—', historial: [] }
  ];
  var PRIO_OPTS = [
    ['max', '🔴 Prioridad máxima'],
    ['imp', '🟡 Importante'],
    ['control', '🟢 En control'],
    ['pausado', '⚪ Pausado'],
    ['completado', '🔵 Completado']
  ];
  function prioOptions(p) {
    var cur = p.completado ? 'completado' : p.prioridad;
    return PRIO_OPTS.map(function (o) { return '<option value="' + o[0] + '"' + (cur === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('');
  }
  function loadProyectos() {
    try {
      var saved = JSON.parse(localStorage.getItem('stark_proyectos_v2') || 'null');
      if (saved && saved.length) return saved;
    } catch (e) {}
    var seed = PROYECTOS_DEFAULT.map(function (p) { return JSON.parse(JSON.stringify(p)); });
    saveProyectos(seed);
    return seed;
  }
  function saveProyectos(arr) { localStorage.setItem('stark_proyectos_v2', JSON.stringify(arr)); }
  function loadProySesion() { try { return JSON.parse(localStorage.getItem('stark_proy_sesion') || 'null'); } catch (e) { return null; } }
  function saveProySesion(s) { localStorage.setItem('stark_proy_sesion', JSON.stringify(s)); }
  function todayKey() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function hoyMsOf(p, ses) {
    var t = 0;
    (p.historial || []).forEach(function (h) { if (h.fecha === todayKey()) t += h.ms || 0; });
    if (ses && String(ses.id) === String(p.id)) t += Date.now() - ses.start;
    return t;
  }
  function proyById(id) {
    var arr = loadProyectos();
    for (var i = 0; i < arr.length; i++) if (String(arr[i].id) === String(id)) return arr[i];
    return null;
  }
  function semaforoOf(p, hoyMs) {
    if (p.completado) return { e: '🔵', c: '#22A7F0', l: 'Completado' };
    if (p.prioridad === 'pausado') return { e: '⚪', c: '#8DA1B5', l: 'Pausado' };
    var totalH = (p.tiempoTotalMs || 0) / 3600000;
    var horasRest = Math.max(0, (p.horasEstimadas || 0) - totalH);
    if (horasRest <= 0.05) return { e: '🔵', c: '#22A7F0', l: 'Completado' };
    var fin = new Date(p.fechaLimite);
    var hoy = new Date();
    var diasRest = Math.max(0, Math.ceil((fin - hoy) / 86400000));
    var metaH = p.tiempoDiarioRecom || 1;
    var labor = diasRest * ((p.diasSemana || 5) / 7);
    var reqH = labor > 0 ? horasRest / labor : 0;
    var retrasado = reqH > metaH * 1.15;
    if (retrasado || (hoyMs === 0 && (diasRest <= 3 || p.prioridad === 'max'))) return { e: '🔴', c: '#FF5263', l: retrasado ? 'Atrasado' : 'Prioridad máxima' };
    if (hoyMs >= metaH * 3600000) return { e: '🟢', c: '#20E87B', l: 'En control' };
    if (hoyMs > 0) return { e: '🟡', c: '#F5B942', l: 'Importante' };
    return { e: p.prioridad === 'imp' ? '🟡' : p.prioridad === 'control' ? '🟢' : '🔴', c: p.prioridad === 'imp' ? '#F5B942' : p.prioridad === 'control' ? '#20E87B' : '#FF5263', l: p.prioridad === 'max' ? 'Prioridad máxima' : p.prioridad === 'imp' ? 'Importante' : 'En control' };
  }
  function streakDays(arr) {
    var days = {};
    arr.forEach(function (p) { (p.historial || []).forEach(function (h) { if ((h.ms || 0) > 0) days[h.fecha] = true; }); });
    var n = 0, d = new Date();
    while (true) {
      var k = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
      if (days[k]) { n++; d = new Date(d.getTime() - 86400000); } else break;
    }
    return n;
  }
  function renderProyCard(p) {
    var ses = loadProySesion();
    var hoyMs = hoyMsOf(p, ses);
    var sem = semaforoOf(p, hoyMs);
    var totalH = (p.tiempoTotalMs || 0) / 3600000;
    var horasRest = Math.max(0, (p.horasEstimadas || 0) - totalH);
    var fin = new Date(p.fechaLimite);
    var diasRest = Math.max(0, Math.ceil((fin - new Date()) / 86400000));
    var labor = diasRest * ((p.diasSemana || 5) / 7);
    var reqH = labor > 0 ? horasRest / labor : 0;
    var pct = Math.min(100, Math.round((totalH / Math.max(0.01, (p.horasEstimadas || 0))) * 100));
    var rent = totalH > 0 ? (p.ingresosUSD || 0) / totalH : 0;
    var act = ses && String(ses.id) === String(p.id);
    var hist = (p.historial || []).slice(-3).reverse().map(function (h) {
      return '<div class="proy-hist-item"><span>' + esc(h.fecha) + (h.ms ? ' · 🍅 ' + fmtDur(h.ms) : '') + '</span>' + (h.nota ? '<em>' + esc(h.nota) + '</em>' : '') + '</div>';
    }).join('');
    var rowHtml = function (t, ti) {
      var tAct = ses && String(ses.id) === String(p.id) && String(ses.tareaId) === String(t.id);
      return '<div class="proy-tarea' + (t.done ? ' done' : '') + (tAct ? ' focus' : '') + '" data-id="' + esc(p.id) + '" data-ti="' + ti + '">' +
        '<button class="proy-tarea-check' + (t.done ? ' on' : '') + '" data-id="' + esc(p.id) + '" data-ti="' + ti + '" title="Completar"><svg class="ico"><use href="#i-check"/></svg></button>' +
        '<button class="proy-tarea-pomo' + (tAct ? ' on' : '') + '" data-id="' + esc(p.id) + '" data-ti="' + ti + '" title="Empezar enfoque en esta tarea"><svg class="ico"><use href="#i-pomo"/></svg></button>' +
        '<span class="proy-tarea-text">' + esc(t.text) + '</span>' +
        '<span class="proy-tarea-time" id="pt-' + esc(p.id) + '-' + esc(t.id) + '">' + ((t.tiempoMs || 0) > 0 ? '🍅 ' + fmtDur(t.tiempoMs) : '') + '</span>' +
        '<span class="proy-tarea-moves">' +
        '<button class="proy-tarea-up" data-id="' + esc(p.id) + '" data-ti="' + ti + '" title="Mover arriba"><svg class="ico"><use href="#i-up"/></svg></button>' +
        '<button class="proy-tarea-down" data-id="' + esc(p.id) + '" data-ti="' + ti + '" title="Mover abajo"><svg class="ico"><use href="#i-down"/></svg></button>' +
        '</span>' +
        '<button class="proy-tarea-edit" data-id="' + esc(p.id) + '" data-ti="' + ti + '" title="Editar tarea"><svg class="ico"><use href="#i-edit"/></svg></button>' +
        '<button class="proy-tarea-del" data-id="' + esc(p.id) + '" data-ti="' + ti + '" title="Eliminar tarea"><svg class="ico"><use href="#i-x"/></svg></button>' +
        '</div>';
    };
    var pendHtml = '', doneHtml = '';
    (p.tareas || []).forEach(function (t, ti) {
      if (t.done) doneHtml += rowHtml(t, ti); else pendHtml += rowHtml(t, ti);
    });
    var tDone = (p.tareas || []).filter(function (t) { return t.done; }).length;
    var tTotal = (p.tareas || []).length;
    return '<div class="proy-card" data-id="' + esc(p.id) + '">' +
      '<div class="proy-head"><div class="proy-name"><span class="proy-sema" style="color:' + sem.c + '">' + sem.e + '</span> <b>' + esc(p.nombre) + '</b></div>' +
      '<div class="proy-head-right"><button class="proy-pin' + (p.pinned ? ' on' : '') + '" data-id="' + esc(p.id) + '" title="Fijar proyecto · siempre arriba"><svg class="ico"><use href="#i-pin"/></svg></button><select class="proy-prio" data-id="' + esc(p.id) + '" title="Cambiar prioridad">' + prioOptions(p) + '</select><button class="proy-edit" data-id="' + esc(p.id) + '" title="Editar proyecto"><svg class="ico"><use href="#i-edit"/></svg></button><button class="proy-del" data-id="' + esc(p.id) + '" title="Eliminar"><svg class="ico"><use href="#i-x"/></svg></button></div></div>' +
      '<div class="proy-objetivo">' + esc(p.objetivo) + '</div>' +
      '<div class="proy-pills"><span class="proy-pill" style="color:' + sem.c + ';border-color:' + sem.c + ';">' + sem.e + ' ' + sem.l + '</span><span class="proy-pill">📅 ' + (p.fechaLimite || '—') + (diasRest > 0 ? ' · ' + diasRest + 'd' : '') + '</span><span class="proy-pill">💵 $' + rent.toFixed(2) + '/h</span></div>' +
      '<div class="proy-stats">' +
      '<div><span class="proy-st-l">Meta diaria</span><span>' + (p.tiempoDiarioRecom || 0).toFixed(1) + 'h</span></div>' +
      '<div><span class="proy-st-l">Hoy</span><span id="proy-hoy-' + esc(p.id) + '" style="color:' + sem.c + ';font-weight:800;">' + fmtDur(hoyMs) + '</span></div>' +
      '<div><span class="proy-st-l">Acumulado</span><span>' + fmtDur(p.tiempoTotalMs || 0) + '</span></div>' +
      '<div><span class="proy-st-l">Progreso</span><span>' + pct + '%</span></div>' +
      '</div>' +
      '<div class="proy-progress"><div class="proy-bar" style="width:' + pct + '%;background:' + sem.c + ';"></div></div>' +
      '<div class="proy-actions">' +
      '<button class="btn-add proy-focus' + (act ? ' on' : '') + '" data-id="' + esc(p.id) + '">' + (act ? '⏹ Terminar sesión' : '▶ Empezar enfoque') + '</button>' +
      '<button class="proy-q" data-id="' + esc(p.id) + '" data-min="15">+15m</button>' +
      '<button class="proy-q" data-id="' + esc(p.id) + '" data-min="30">+30m</button>' +
      '<button class="proy-q" data-id="' + esc(p.id) + '" data-min="60">+1h</button>' +
      '</div>' +
      '<div class="proy-tareas">' +
      '<div class="proy-tarea-add"><input type="text" class="proy-tarea-inp" data-id="' + esc(p.id) + '" placeholder="Agregar pendiente..." maxlength="90"><button class="proy-tarea-btn" data-id="' + esc(p.id) + '">+</button></div>' +
      '<div class="proy-tareas-head">✅ Checklist <span class="usd-mini">' + tDone + '/' + tTotal + ' completadas</span></div>' +
      (pendHtml ? '<div class="proy-tareas-list">' + pendHtml + '</div>' : '') +
      (doneHtml ? '<div class="proy-done"><button class="proy-done-toggle" data-label="Completado" data-id="' + esc(p.id) + '" title="Ver tareas completadas">▼ Completado (' + tDone + ')</button><div class="proy-done-list hidden">' + doneHtml + '</div></div>' : '') +
      '</div>' +
      (hist ? '<div class="proy-done"><button class="proy-done-toggle" data-label="Tiempo en pomodoro" data-id="' + esc(p.id) + '" title="Ver tiempo de pomodoro">▼ Tiempo en pomodoro (' + (p.historial || []).length + ')</button><div class="proy-done-list hidden">' + hist + '</div></div>' : '') +
      '</div>';
  }
  function renderMoti() {
    var el = document.getElementById('proy-moti');
    if (!el) return;
    var arr = loadProyectos();
    var ses = loadProySesion();
    var orden = { max: 0, imp: 1, control: 2, pausado: 3 };
    var sorted = arr.slice().sort(function (a, b) { return (orden[a.prioridad] || 9) - (orden[b.prioridad] || 9); });
    var top = null;
    for (var i = 0; i < sorted.length; i++) {
      if (sorted[i].prioridad !== 'pausado' && !sorted[i].completado) { top = sorted[i]; break; }
    }
    if (top) {
      var prioL = { max: 'Prioridad máxima', imp: 'Importante', control: 'En control' };
      var sem = semaforoOf(top, hoyMsOf(top, ses));
      el.innerHTML = '🎯 <b>Hoy enfócate en:</b> ' + esc(top.nombre) + ' — ' + esc(top.proximaAccion || '') + ' <span class="proy-moti-badge">' + (prioL[top.prioridad] || sem.l) + '</span>';
    } else {
      el.innerHTML = '🎯 <b>Hoy enfócate en:</b> define tu próxima acción y dale prioridad a un proyecto.';
    }
  }
  function loadOwala() {
    var key = 'stark_owala_' + todayKey();
    try {
      var d = JSON.parse(localStorage.getItem(key) || 'null');
      if (d && typeof d[0] === 'number') return d;
    } catch (e) {}
    return [0, 0, 0];
  }
  function saveOwala(arr) { localStorage.setItem('stark_owala_' + todayKey(), JSON.stringify(arr)); }
  function owalaSvg(fill, gi) {
    var pct = Math.max(0, Math.min(100, fill * 10));
    var bodyTop = 24, bodyH = 47;
    var wH = Math.round(bodyH * pct / 100);
    var wY = bodyTop + bodyH - wH;
    return '<defs><linearGradient id="owgrad' + gi + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3EA9FF"/><stop offset="100%" stop-color="#0E5EAD"/></linearGradient></defs>' +
      '<rect x="12" y="18" width="20" height="8" rx="2" fill="#12233B" stroke="#173247"/>' +
      '<rect x="25" y="8" width="5" height="16" rx="2.5" fill="#0B1722" stroke="#173247"/>' +
      '<rect x="23" y="3" width="9" height="7" rx="2.5" fill="#0B1722" stroke="#1B3350"/>' +
      '<path d="M15 24 h14 v44 a7 7 0 0 1 -7 7 a7 7 0 0 1 -7 -7 z" fill="#0E1E31" stroke="#1B3350"/>' +
      '<clipPath id="owclip' + gi + '"><path d="M16 25 h12 v42 a6 6 0 0 1 -6 6 a6 6 0 0 1 -6 -6 z"/></clipPath>' +
      '<g clip-path="url(#owclip' + gi + ')">' +
      '<rect x="15" y="24" width="14" height="48" fill="url(#owgrad' + gi + ')" style="y:' + wY + 'px;height:' + wH + 'px;transition:y .45s ease,height .45s ease;"/>' +
      '</g>' +
      '<path class="owala-bolt" d="M23 27l-8 13h5l-4 15 13-17h-6l5-11z" fill="#FFE066" stroke="#0E2A44" stroke-width="0.6"/>' +
      '<rect x="17.5" y="28" width="2" height="28" rx="1" fill="#fff" opacity="0.14"/>';
  }
  function renderOwala() {
    var row = document.getElementById('owala-row');
    if (!row) return;
    var arr = loadOwala();
    for (var i = 0; i < 3; i++) {
      var svg = document.getElementById('owala-svg-' + i);
      var cnt = document.getElementById('owala-count-' + i);
      if (svg) svg.innerHTML = owalaSvg(arr[i], i);
      if (cnt) { cnt.textContent = arr[i] >= 10 ? '✅ llena' : arr[i] + '/10'; cnt.style.color = arr[i] >= 10 ? 'var(--green)' : 'var(--text-count)'; }
    }
  }
  var CD_TARGET = new Date(2026, 11, 31, 23, 59, 59);
  function renderCountdown() {
    var el = document.getElementById('proy-countdown');
    if (!el) return;
    var diff = CD_TARGET - new Date();
    if (diff < 0) diff = 0;
    var s = Math.floor(diff / 1000);
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600); s -= h * 3600;
    var m = Math.floor(s / 60); s -= m * 60;
    var set = function (id, v) { var e = document.getElementById(id); if (e) e.textContent = v; };
    set('cd-d', d);
    set('cd-h', ('0' + h).slice(-2));
    set('cd-m', ('0' + m).slice(-2));
    set('cd-s', ('0' + s).slice(-2));
    var mondays = 0;
    var walk = new Date();
    walk.setHours(0, 0, 0, 0);
    while (walk <= CD_TARGET) {
      if (walk.getDay() === 1) mondays++;
      walk.setDate(walk.getDate() + 1);
    }
    set('cd-mondays', mondays);
  }
  function renderNowFocus() {
    var el = document.getElementById('owala-now');
    if (!el) return;
    var ses = loadProySesion();
    if (ses) {
      var p = proyById(ses.id);
      if (p) {
        var tarea = null;
        if (ses.tareaId) { for (var i = 0; i < (p.tareas || []).length; i++) if (String(p.tareas[i].id) === String(ses.tareaId)) tarea = p.tareas[i]; }
        var hm = hoyMsOf(p, ses);
        el.style.display = '';
        el.innerHTML = '<span class="owala-now-label">⚡ Ahora mismo en</span> <span class="owala-now-val">' + esc(p.nombre) + (tarea ? ' · ' + esc(tarea.text) : '') + ' <b id="owala-now-time">' + fmtDur(hm) + '</b></span>';
        return;
      }
    }
    var timer = loadTimer();
    if (timer) {
      var note = notaById(timer.id);
      var ms2 = Date.now() - timer.start;
      var txt = note ? note.text.slice(0, 34) : 'Enfoque';
      var ti = loadNotasTiempo();
      var totalN = (ti[timer.id] || 0) + ms2;
      el.style.display = '';
      el.innerHTML = '<span class="owala-now-label">⚡ Ahora mismo en</span> <span class="owala-now-val">🍅 ' + esc(txt) + ' <b id="owala-now-time">' + fmtDur(totalN) + '</b></span>';
      return;
    }
    el.style.display = 'none';
    el.innerHTML = '';
  }
  function renderProyectos() {
    renderCountdown();
    renderNowFocus();
    renderOwala();
    var grid = document.getElementById('proy-cards');
    var dailyBar = document.getElementById('proy-daily-bar');
    var daily = document.getElementById('proy-daily');
    var streak = document.getElementById('proy-streak');
    var dtotal = document.getElementById('proy-daily-total');
    var arr = loadProyectos();
    var ses = loadProySesion();
    var metaTot = 0, hoyTot = 0;
    arr.forEach(function (p) { metaTot += (p.tiempoDiarioRecom || 1) * 3600000; hoyTot += hoyMsOf(p, ses); });
    var pctDay = metaTot > 0 ? Math.min(100, Math.round(hoyTot / metaTot * 100)) : 0;
    var act = ses ? proyById(ses.id) : null;
    if (dailyBar) {
      dailyBar.innerHTML = '<div class="proy-db">' +
        '<div><span class="proy-db-l">Meta de enfoque</span><b>' + fmtDur(metaTot) + '</b></div>' +
        '<div><span class="proy-db-l">Completado</span><b id="proy-db-hoy" style="color:var(--green)">' + fmtDur(hoyTot) + '</b></div>' +
        '<div><span class="proy-db-l">Cumplimiento</span><b style="color:' + (pctDay >= 100 ? 'var(--green)' : pctDay >= 50 ? 'var(--amber)' : 'var(--red)') + '">' + pctDay + '%</b></div>' +
        '<div><span class="proy-db-l">Racha</span><b style="color:var(--amber)">🔥 ' + streakDays(arr) + ' días</b></div>' +
        (act ? '<div><span class="proy-db-l">Activo</span><b style="color:var(--cyan)">▶ ' + esc(act.nombre) + '</b></div>' : '') +
        '</div>';
    }
    var grid2 = document.getElementById('proy-cards-inactivos');
    var inactWrap = document.getElementById('proy-inactivos');
    var ordenA = { max: 0, imp: 1, control: 2 };
    var pinned = arr.filter(function (p) { return p.pinned; });
    var rest = arr.filter(function (p) { return !p.pinned; });
    var activos = rest.filter(function (p) { return p.prioridad !== 'pausado' && !p.completado; }).sort(function (a, b) { return (ordenA[a.prioridad] || 9) - (ordenA[b.prioridad] || 9); });
    var inactivos = rest.filter(function (p) { return p.prioridad === 'pausado' || p.completado; }).sort(function (a, b) { return (a.prioridad === 'pausado' ? 0 : 1) - (b.prioridad === 'pausado' ? 0 : 1); });
    var mainList = pinned.concat(activos);
    if (grid) {
      grid.innerHTML = mainList.map(renderProyCard).join('') || '<div class="nota-empty">No tienes proyectos activos. Crea uno en ＋ Nuevo proyecto o sube la prioridad de uno pausado.</div>';
    }
    if (grid2) {
      grid2.innerHTML = inactivos.map(renderProyCard).join('');
      if (inactWrap) inactWrap.classList.toggle('hidden', !inactivos.length);
    }
    function bindProyListeners(scope) {
      scope.querySelectorAll('.proy-focus').forEach(function (b) {
        b.addEventListener('click', function () { toggleProyTimer(b.getAttribute('data-id')); });
      });
      scope.querySelectorAll('.proy-q').forEach(function (b) {
        b.addEventListener('click', function () { addProyTime(b.getAttribute('data-id'), parseInt(b.getAttribute('data-min'), 10)); });
      });
      scope.querySelectorAll('.proy-del').forEach(function (b) {
        b.addEventListener('click', function () { deleteProy(b.getAttribute('data-id')); });
      });
      scope.querySelectorAll('.proy-edit').forEach(function (b) {
        b.addEventListener('click', function () { openProyEdit(b.getAttribute('data-id')); });
      });
      scope.querySelectorAll('.proy-pin').forEach(function (b) {
        b.addEventListener('click', function () { toggleProyPin(b.getAttribute('data-id')); });
      });
      scope.querySelectorAll('.proy-tarea-inp').forEach(function (inp) {
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') addProyTarea(inp.getAttribute('data-id')); });
      });
      scope.querySelectorAll('.proy-tarea-btn').forEach(function (b) {
        b.addEventListener('click', function () { addProyTarea(b.getAttribute('data-id')); });
      });
      scope.querySelectorAll('.proy-tarea-pomo').forEach(function (b) {
        b.addEventListener('click', function () { startTaskFocus(b.getAttribute('data-id'), parseInt(b.getAttribute('data-ti'), 10)); });
      });
      scope.querySelectorAll('.proy-tarea-check').forEach(function (b) {
        b.addEventListener('click', function () { toggleProyTarea(b.getAttribute('data-id'), parseInt(b.getAttribute('data-ti'), 10)); });
      });
      scope.querySelectorAll('.proy-tarea-del').forEach(function (b) {
        b.addEventListener('click', function () { delProyTarea(b.getAttribute('data-id'), parseInt(b.getAttribute('data-ti'), 10)); });
      });
      scope.querySelectorAll('.proy-tarea-edit').forEach(function (b) {
        b.addEventListener('click', function () { editProyTarea(b.getAttribute('data-id'), parseInt(b.getAttribute('data-ti'), 10)); });
      });
      scope.querySelectorAll('.proy-tarea-up').forEach(function (b) {
        b.addEventListener('click', function () { moveProyTareaBy(b.getAttribute('data-id'), parseInt(b.getAttribute('data-ti'), 10), -1); });
      });
      scope.querySelectorAll('.proy-tarea-down').forEach(function (b) {
        b.addEventListener('click', function () { moveProyTareaBy(b.getAttribute('data-id'), parseInt(b.getAttribute('data-ti'), 10), 1); });
      });
      scope.querySelectorAll('.proy-done-toggle').forEach(function (b) {
        b.addEventListener('click', function () {
          var list = b.nextElementSibling;
          if (!list) return;
          list.classList.toggle('hidden');
          var n = list.children.length;
          var lbl = b.getAttribute('data-label') || 'Completado';
          b.innerHTML = list.classList.contains('hidden') ? '▼ ' + lbl + ' (' + n + ')' : '▲ Ocultar ' + lbl + ' (' + n + ')';
        });
      });
      scope.querySelectorAll('.proy-prio').forEach(function (sel) {
        sel.addEventListener('change', function () {
          var arr2 = loadProyectos();
          var p = null;
          arr2.forEach(function (x) { if (String(x.id) === String(sel.getAttribute('data-id'))) p = x; });
          if (!p) return;
          var v = sel.value;
          if (v === 'completado') { p.completado = true; p.prioridad = 'control'; }
          else { p.completado = false; p.prioridad = v; }
          saveProyectos(arr2);
          showToast('Prioridad actualizada', p.nombre + ' \u2192 ' + sel.options[sel.selectedIndex].text);
          renderProyectos();
        });
      });
    }
    if (grid) bindProyListeners(grid);
    if (grid2) bindProyListeners(grid2);
    var orden = { max: 0, imp: 1, control: 2, pausado: 3 };
    var sorted = arr.slice().sort(function (a, b) { return (orden[a.prioridad] || 9) - (orden[b.prioridad] || 9); });
    if (daily) {
      daily.innerHTML = sorted.filter(function (p) { return p.prioridad !== 'pausado' && !p.completado; }).map(function (p) {
        var hm = hoyMsOf(p, ses);
        var sem = semaforoOf(p, hm);
        var metaH = (p.tiempoDiarioRecom || 1) * 3600000;
        var w = metaH > 0 ? Math.min(100, Math.round(hm / metaH * 100)) : 0;
        return '<div class="proy-daily-row">' +
          '<span class="proy-daily-sema" style="color:' + sem.c + '">' + sem.e + '</span>' +
          '<div class="proy-daily-info"><b>' + esc(p.nombre) + '</b><div class="proy-daily-meta">' + sem.l + ' · ' + (p.tiempoDiarioRecom || 0).toFixed(1) + 'h meta · ' + fmtDur(hm) + ' hoy</div></div>' +
          '<div class="proy-daily-bar"><div class="proy-bar" style="width:' + w + '%;background:' + sem.c + ';"></div></div>' +
          '<span class="proy-daily-pct" style="color:' + sem.c + '">' + w + '%</span>' +
          '</div>';
      }).join('') || '<div class="nota-empty">Nada que hacer hoy. 🎉</div>';
    }
    if (dtotal) dtotal.textContent = sorted.filter(function (p) { return p.prioridad !== 'pausado' && !p.completado; }).length + ' proyectos activos · meta ' + fmtDur(metaTot) + ' · completado ' + fmtDur(hoyTot);
    if (streak) {
      var racha = streakDays(arr);
      var days = {};
      arr.forEach(function (p) { (p.historial || []).forEach(function (h) { if ((h.ms || 0) > 0) days[h.fecha] = true; }); });
      var activeDays = Object.keys(days).sort().reverse().slice(0, 14);
      streak.innerHTML = '<div class="proy-streak-big">🔥 <b>' + racha + '</b> día' + (racha === 1 ? '' : 's') + ' productivos seguidos</div>' +
        '<div class="proy-streak-grid">' + activeDays.map(function (k) { return '<span class="proy-streak-day" title="' + k + '">' + k.slice(8, 10) + '/' + k.slice(5, 7) + '</span>'; }).join('') + '</div>';
    }
  }
  var pendingProyId = null;
  var editProyId = null;
  function openProyEdit(id) {
    var p = proyById(id);
    if (!p) return;
    editProyId = id;
    var set = function (elId, val) { var el = document.getElementById(elId); if (el) el.value = val; };
    set('pe-nombre', p.nombre);
    set('pe-objetivo', p.objetivo || '');
    set('pe-prioridad', p.completado ? 'completado' : p.prioridad);
    set('pe-fechalimite', p.fechaLimite || '');
    set('pe-horas', p.horasEstimadas || '');
    set('pe-dias', p.diasSemana || '');
    set('pe-ingresos', p.ingresosUSD || '');
    set('pe-gastos', p.gastosUSD || '');
    set('pe-accion', p.proximaAccion || '');
    var modal = document.getElementById('proy-edit-modal');
    if (modal) modal.style.display = 'flex';
  }
  function closeProyEdit() {
    var modal = document.getElementById('proy-edit-modal');
    if (modal) modal.style.display = 'none';
    editProyId = null;
  }
  function saveProyEdit() {
    var id = editProyId;
    var arr = loadProyectos();
    var p = null;
    arr.forEach(function (x) { if (String(x.id) === String(id)) p = x; });
    if (!p) { closeProyEdit(); return; }
    var g = function (elId) { var el = document.getElementById(elId); return el ? el.value.trim() : ''; };
    var nombre = g('pe-nombre');
    if (!nombre) { showToast('Editar', 'El nombre no puede estar vacío.'); return; }
    p.nombre = nombre;
    p.objetivo = g('pe-objetivo');
    p.fechaLimite = g('pe-fechalimite') || p.fechaLimite;
    p.horasEstimadas = parseFloat(g('pe-horas')) || p.horasEstimadas || 0;
    p.diasSemana = parseInt(g('pe-dias'), 10) || p.diasSemana || 0;
    p.ingresosUSD = parseFloat(g('pe-ingresos')) || 0;
    p.gastosUSD = parseFloat(g('pe-gastos')) || 0;
    p.proximaAccion = g('pe-accion') || 'Definir próxima acción';
    var prio = g('pe-prioridad') || 'control';
    if (prio === 'completado') { p.completado = true; p.prioridad = 'control'; }
    else { p.completado = false; p.prioridad = prio; }
    saveProyectos(arr);
    closeProyEdit();
    showToast('✏️ Proyecto actualizado', p.nombre);
    renderProyectos();
  }
  function toggleProyTimer(id) {
    var ses = loadProySesion();
    if (ses && String(ses.id) === String(id)) { stopProySession(); return; }
    openProyFocusModal(id);
  }
  function openProyFocusModal(id) {
    var p = proyById(id);
    if (!p) return;
    pendingProyId = id;
    var modal = document.getElementById('proy-modal');
    var title = document.getElementById('proy-modal-title');
    var nota = document.getElementById('proy-modal-nota');
    if (title) title.textContent = p.nombre + ' — ¿Qué vas a hacer?';
    if (nota) { nota.value = ''; setTimeout(function () { nota.focus(); }, 60); }
    if (modal) modal.style.display = 'flex';
  }
  function closeProyFocusModal() {
    var modal = document.getElementById('proy-modal');
    if (modal) modal.style.display = 'none';
    pendingProyId = null;
  }
  function startProySession() {
    var id = pendingProyId;
    var p = proyById(id);
    if (!p) { closeProyFocusModal(); return; }
    var nota = (document.getElementById('proy-modal-nota') ? document.getElementById('proy-modal-nota').value : '').trim() || ('Enfoque en ' + p.nombre);
    commitSession(loadProySesion(), Date.now());
    saveProySesion({ id: id, start: Date.now(), nota: nota });
    closeProyFocusModal();
    showToast('▶ Enfocando', p.nombre + ' · tiempo en marcha');
    renderProyectos();
  }
  function commitSession(ses, now) {
    if (!ses) return 0;
    var arr = loadProyectos();
    var p = null;
    arr.forEach(function (x) { if (String(x.id) === String(ses.id)) p = x; });
    if (!p) return 0;
    var ms = now - ses.start;
    p.tiempoTotalMs = (p.tiempoTotalMs || 0) + ms;
    var h = (p.historial = p.historial || []);
    var last = h[h.length - 1];
    if (last && last.fecha === todayKey() && !last.ms) last.ms = ms;
    else h.push({ fecha: todayKey(), ms: ms, nota: ses.nota || '' });
    if (ses.tareaId) {
      for (var k = 0; k < (p.tareas || []).length; k++) {
        if (String(p.tareas[k].id) === String(ses.tareaId)) p.tareas[k].tiempoMs = (p.tareas[k].tiempoMs || 0) + ms;
      }
    }
    saveProyectos(arr);
    return ms;
  }
  function stopProySession() {
    var ses = loadProySesion();
    if (!ses) return;
    var ms = commitSession(ses, Date.now());
    localStorage.removeItem('stark_proy_sesion');
    var p = proyById(ses.id);
    if (!p) { renderProyectos(); return; }
    var sem = semaforoOf(p, hoyMsOf(p, null));
    if (ses.nota) {
      var arrN = loadNotas();
      arrN.push({ id: 'n' + Date.now() + '_' + Math.floor(Math.random() * 1e4), text: sem.e + ' ' + p.nombre + ' — ' + ses.nota + ' · 🍅 ' + fmtDur(ms), fecha: new Date().toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) });
      saveNotas(arrN);
    }
    showToast('✅ Sesión terminada', p.nombre + ' · ' + fmtDur(ms) + (ses.nota ? ' · nota guardada en tu diario' : ''));
    renderProyectos();
  }
  function startTaskFocus(proyId, ti) {
    var arr = loadProyectos();
    var p = null;
    arr.forEach(function (x) { if (String(x.id) === String(proyId)) p = x; });
    if (!p || !p.tareas || !p.tareas[ti]) return;
    var tarea = p.tareas[ti];
    var ses = loadProySesion();
    if (ses && String(ses.id) === String(proyId) && String(ses.tareaId) === String(tarea.id)) { stopProySession(); return; }
    commitSession(ses, Date.now());
    saveProySesion({ id: proyId, start: Date.now(), nota: '🍅 Tarea: ' + tarea.text, tareaId: tarea.id });
    showToast('▶ Enfocando', '🍅 ' + tarea.text.slice(0, 40));
    renderProyectos();
  }
  function addProyTime(id, min) {
    var arr = loadProyectos();
    var p = null;
    arr.forEach(function (x) { if (String(x.id) === String(id)) p = x; });
    if (!p) return;
    p.tiempoTotalMs = (p.tiempoTotalMs || 0) + min * 60000;
    (p.historial = p.historial || []).push({ fecha: todayKey(), ms: min * 60000, nota: '' });
    saveProyectos(arr);
    showToast('⏱ +' + min + ' min', p.nombre + ' · se guardó el tiempo');
    renderProyectos();
  }
  function saveProyNota(id) {
    var inp = document.querySelector('.proy-nota-inp[data-id="' + id + '"]');
    var val = inp ? inp.value.trim() : '';
    if (!val) return;
    var arr = loadProyectos();
    var p = null;
    arr.forEach(function (x) { if (String(x.id) === String(id)) p = x; });
    if (!p) return;
    (p.historial = p.historial || []).push({ fecha: todayKey(), ms: 0, nota: val });
    saveProyectos(arr);
    var sem = semaforoOf(p, hoyMsOf(p, null));
    var arrN = loadNotas();
    arrN.push({ id: 'n' + Date.now() + '_' + Math.floor(Math.random() * 1e4), text: sem.e + ' ' + p.nombre + ' — ' + val, fecha: new Date().toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) });
    saveNotas(arrN);
    showToast('📝 Guardado', 'Registrado en el proyecto y en tu diario de Notas');
    renderProyectos();
  }
  function editProyTarea(id, ti) {
    var row = document.querySelector('.proy-tarea[data-id="' + id + '"][data-ti="' + ti + '"]');
    if (!row) return;
    var span = row.querySelector('.proy-tarea-text');
    if (!span) return;
    var inp = document.createElement('input');
    inp.className = 'proy-tarea-edit-inp';
    inp.value = span.textContent;
    inp.maxLength = 90;
    span.replaceWith(inp);
    inp.focus();
    inp.select();
    var done = false;
    function commit() {
      if (done) return;
      done = true;
      var v = inp.value.trim();
      if (v) saveProyTareaText(id, ti, v);
      else renderProyectos();
    }
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') commit();
      if (e.key === 'Escape') { done = true; renderProyectos(); }
    });
    inp.addEventListener('blur', commit);
  }
  function saveProyTareaText(id, ti, v) {
    var arr = loadProyectos();
    var p = null;
    arr.forEach(function (x) { if (String(x.id) === String(id)) p = x; });
    if (!p || !p.tareas || !p.tareas[ti]) return;
    p.tareas[ti].text = v;
    saveProyectos(arr);
    showToast('✎ Tarea editada', p.tareas[ti].text.slice(0, 40));
    renderProyectos();
  }
  function addProyTarea(id) {
    var inp = document.querySelector('.proy-tarea-inp[data-id="' + id + '"]');
    var val = inp ? inp.value.trim() : '';
    if (!val) return;
    var arr = loadProyectos();
    var p = null;
    arr.forEach(function (x) { if (String(x.id) === String(id)) p = x; });
    if (!p) return;
    (p.tareas = p.tareas || []).push({ id: 't' + Date.now() + '_' + Math.floor(Math.random() * 1e4), text: val, done: false });
    saveProyectos(arr);
    showToast('✅ Tarea agregada', p.nombre);
    renderProyectos();
  }
  function toggleProyTarea(id, ti) {
    var arr = loadProyectos();
    var p = null;
    arr.forEach(function (x) { if (String(x.id) === String(id)) p = x; });
    if (!p || !p.tareas || !p.tareas[ti]) return;
    p.tareas[ti].done = !p.tareas[ti].done;
    p.tareas[ti].doneAt = p.tareas[ti].done ? todayKey() : null;
    saveProyectos(arr);
    renderProyectos();
  }
  function delProyTarea(id, ti) {
    var arr = loadProyectos();
    var p = null;
    arr.forEach(function (x) { if (String(x.id) === String(id)) p = x; });
    if (!p || !p.tareas) return;
    p.tareas.splice(ti, 1);
    saveProyectos(arr);
    renderProyectos();
  }
  function toggleProyPin(id) {
    var arr = loadProyectos();
    var p = null;
    arr.forEach(function (x) { if (String(x.id) === String(id)) p = x; });
    if (!p) return;
    p.pinned = !p.pinned;
    saveProyectos(arr);
    showToast(p.pinned ? '📌 Fijado arriba' : '📍 Desfijado', p.nombre);
    renderProyectos();
  }
  function moveProyTarea(proyId, from, to) {
    var arr = loadProyectos();
    var p = null;
    arr.forEach(function (x) { if (String(x.id) === String(proyId)) p = x; });
    if (!p || !p.tareas) return;
    if (from === to || from < 0 || to < 0 || from >= p.tareas.length || to >= p.tareas.length) return;
    var t = p.tareas.splice(from, 1)[0];
    p.tareas.splice(to, 0, t);
    saveProyectos(arr);
    renderProyectos();
  }
  function moveProyTareaBy(id, ti, dir) {
    var arr = loadProyectos();
    var p = null;
    arr.forEach(function (x) { if (String(x.id) === String(id)) p = x; });
    if (!p || !p.tareas) return;
    var to = ti + dir;
    if (to < 0 || to >= p.tareas.length) return;
    var t = p.tareas.splice(ti, 1)[0];
    p.tareas.splice(to, 0, t);
    saveProyectos(arr);
    renderProyectos();
  }
  function reorderTareasLive(proyId, from, to) {
    var arr = loadProyectos();
    var p = null;
    arr.forEach(function (x) { if (String(x.id) === String(proyId)) p = x; });
    if (!p || !p.tareas) return;
    if (from === to || from < 0 || to < 0 || from >= p.tareas.length || to >= p.tareas.length) return;
    var t = p.tareas.splice(from, 1)[0];
    p.tareas.splice(to, 0, t);
    saveProyectos(arr);
  }
  function persistTareaOrder(proyId) {
    var arr = loadProyectos();
    var p = null;
    arr.forEach(function (x) { if (String(x.id) === String(proyId)) p = x; });
    if (!p || !p.tareas) return;
    var first = document.querySelector('.proy-tarea[data-id="' + proyId + '"]');
    var container = first && first.parentNode;
    if (!container) return;
    var newOrder = [];
    Array.prototype.forEach.call(container.children, function (r) {
      var ti = parseInt(r.getAttribute('data-ti'), 10);
      if (p.tareas[ti]) newOrder.push(p.tareas[ti]);
    });
    if (newOrder.length === p.tareas.length) { p.tareas = newOrder; saveProyectos(arr); }
  }
  function deleteProy(id) {
    var p = proyById(id);
    if (!p) return;
    if (!confirm('¿Eliminar el proyecto "' + p.nombre + '" y todo su historial?')) return;
    var arr = loadProyectos().filter(function (x) { return String(x.id) !== String(id); });
    saveProyectos(arr);
    var ses = loadProySesion();
    if (ses && String(ses.id) === String(id)) localStorage.removeItem('stark_proy_sesion');
    showToast('Eliminado', p.nombre);
    renderProyectos();
  }
  function addProyecto() {
    var nombre = document.getElementById('pf-nombre').value.trim();
    if (!nombre) { showToast('Proyecto', 'Ponle un nombre al proyecto.'); return; }
    var objetivo = document.getElementById('pf-objetivo').value.trim();
    var prioridad = document.getElementById('pf-prioridad').value;
    var fechaLimite = document.getElementById('pf-fechalimite').value || '2026-12-31';
    var horas = parseFloat(document.getElementById('pf-horas').value) || 10;
    var dias = parseInt(document.getElementById('pf-dias').value, 10) || 5;
    var ingresos = parseFloat(document.getElementById('pf-ingresos').value) || 0;
    var gastos = parseFloat(document.getElementById('pf-gastos').value) || 0;
    var accion = document.getElementById('pf-accion').value.trim();
    var arr = loadProyectos();
    arr.push({ id: 'p' + Date.now(), nombre: nombre, objetivo: objetivo || 'Sin objetivo definido', prioridad: prioridad, fechaLimite: fechaLimite, horasEstimadas: horas, diasSemana: dias, tiempoDiarioRecom: Math.max(0.5, horas / Math.max(1, dias)), ingresosUSD: ingresos, gastosUSD: gastos, proximaAccion: accion || 'Definir próxima acción', historial: [] });
    saveProyectos(arr);
    ['pf-nombre', 'pf-objetivo', 'pf-horas', 'pf-dias', 'pf-ingresos', 'pf-gastos', 'pf-accion'].forEach(function (id) { var e = document.getElementById(id); if (e) e.value = ''; });
    showToast('🚀 Proyecto creado', nombre + ' · meta diaria ' + Math.max(0.5, horas / Math.max(1, dias)).toFixed(1) + 'h');
    document.querySelectorAll('.proy-tab').forEach(function (t) { t.classList.toggle('active', t.getAttribute('data-sub') === 'cards'); });
    document.querySelectorAll('.proy-sub').forEach(function (s) { s.classList.toggle('hidden', s.id !== 'proy-sub-cards'); });
    renderProyectos();
  }
  function bindProyectos() {
    document.querySelectorAll('.proy-tab').forEach(function (t) {
      t.addEventListener('click', function () {
        var sub = t.getAttribute('data-sub');
        document.querySelectorAll('.proy-tab').forEach(function (x) { x.classList.remove('active'); });
        t.classList.add('active');
        document.querySelectorAll('.proy-sub').forEach(function (s) { s.classList.toggle('hidden', s.id !== 'proy-sub-' + sub); });
      });
    });
    var cb = document.getElementById('pf-crear');
    if (cb) cb.addEventListener('click', addProyecto);
    var pms = document.getElementById('proy-modal-start');
    if (pms) pms.addEventListener('click', startProySession);
    var pmc = document.getElementById('proy-modal-cancel');
    if (pmc) pmc.addEventListener('click', closeProyFocusModal);
    var pmx = document.getElementById('proy-modal-close');
    if (pmx) pmx.addEventListener('click', closeProyFocusModal);
    var pmm = document.getElementById('proy-modal');
    if (pmm) pmm.addEventListener('click', function (e) { if (e.target === pmm) closeProyFocusModal(); });
    var pmi = document.getElementById('proy-modal-nota');
    if (pmi) pmi.addEventListener('keydown', function (e) { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); startProySession(); } });
    var pes = document.getElementById('pe-save');
    if (pes) pes.addEventListener('click', saveProyEdit);
    var pec = document.getElementById('pe-cancel');
    if (pec) pec.addEventListener('click', closeProyEdit);
    var pex = document.getElementById('proy-edit-close');
    if (pex) pex.addEventListener('click', closeProyEdit);
    var pem = document.getElementById('proy-edit-modal');
    if (pem) pem.addEventListener('click', function (e) { if (e.target === pem) closeProyEdit(); });
    document.querySelectorAll('.owala').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = parseInt(b.getAttribute('data-i'), 10);
        var arr = loadOwala();
        if (arr[i] >= 10) { showToast('💧 Owala ' + (i + 1), 'Ya está llena. ¡Sigue con tu enfoque! 💪'); return; }
        arr[i]++;
        saveOwala(arr);
        b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
        showToast('💧 Owala ' + (i + 1), arr[i] === 10 ? '¡Botella llena! 💪' : 'Nivel ' + arr[i] + '/10 · sigue hidratándote');
        renderOwala();
      });
    });
  }

  function ensureNotaIds() {
    var arr = loadNotas();
    var changed = false;
    arr.forEach(function (n) { if (!n.id) { n.id = 'n' + Date.now() + '_' + Math.floor(Math.random() * 1e4); changed = true; } });
    if (changed) saveNotas(arr);
  }
  function loadNotasTiempo() { try { return JSON.parse(localStorage.getItem('stark_notas_tiempo') || '{}'); } catch (e) { return {}; } }
  function saveNotasTiempo(o) { localStorage.setItem('stark_notas_tiempo', JSON.stringify(o)); }
  function loadTimer() { try { return JSON.parse(localStorage.getItem('stark_timer_active') || 'null'); } catch (e) { return null; } }
  function saveTimer(t) { localStorage.setItem('stark_timer_active', JSON.stringify(t)); }
  function fmtDur(ms) {
    if (!ms || ms <= 0) return '0m';
    var s = Math.floor(ms / 1000);
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    if (h > 0) return h + 'h ' + m + 'm';
    if (m > 0) return m + 'm ' + sec + 's';
    return sec + 's';
  }
  function notaById(id) {
    var arr = loadNotas();
    for (var i = 0; i < arr.length; i++) if (String(arr[i].id) === String(id)) return arr[i];
    return null;
  }
  function toggleTimer(id) {
    var n = notaById(id);
    if (!n) return;
    var timer = loadTimer();
    var ti = loadNotasTiempo();
    var now = Date.now();
    if (timer && String(timer.id) === String(id)) {
      var elapsed = now - timer.start;
      ti[id] = (ti[id] || 0) + elapsed;
      saveNotasTiempo(ti);
      localStorage.removeItem('stark_timer_active');
      showToast('🍅 Pomodoro detenido', fmtDur(elapsed) + ' sumados a esta nota.');
    } else {
      if (timer) {
        var prev = notaById(timer.id);
        ti[timer.id] = (ti[timer.id] || 0) + (now - timer.start);
        if (prev) showToast('🔄 Cambiaste de foco', 'Se guardó el tiempo de la nota anterior.');
      }
      saveNotasTiempo(ti);
      saveTimer({ id: id, start: now });
      showToast('🍅 Enfocando', n.text.slice(0, 34) + ' · tiempo en marcha.');
    }
    renderNotas();
  }
  function stopTimer() {
    var timer = loadTimer();
    if (!timer) return;
    var ti = loadNotasTiempo();
    var elapsed = Date.now() - timer.start;
    ti[timer.id] = (ti[timer.id] || 0) + elapsed;
    saveNotasTiempo(ti);
    localStorage.removeItem('stark_timer_active');
    showToast('🍅 Pomodoro detenido', fmtDur(elapsed) + ' sumados a tu diario.');
    renderNotas();
  }
  function dailyFocusMs() {
    var ti = loadNotasTiempo();
    var total = 0;
    Object.keys(ti).forEach(function (k) { total += ti[k] || 0; });
    var timer = loadTimer();
    if (timer) total += Date.now() - timer.start;
    return total;
  }
  function renderFocusBar() {
    var fb = document.getElementById('nota-focus');
    if (!fb) return;
    var timer = loadTimer();
    var total = dailyFocusMs();
    if (!timer && !total) { fb.className = 'nota-focus hidden'; fb.innerHTML = ''; return; }
    var n = timer ? notaById(timer.id) : null;
    fb.className = 'nota-focus';
    fb.innerHTML = '🍅 <b>Foco de hoy:</b> ' + fmtDur(total) +
      (timer && n ? ' <span class="nf-active">▶ ' + esc(n.text.slice(0, 40)) + '</span>' : '') +
      (timer ? ' <button class="btn-add btn-sm" id="nt-stop-all">⏹ Detener</button>' : '');
    var sb = document.getElementById('nt-stop-all');
    if (sb) sb.addEventListener('click', stopTimer);
  }
  function downloadDiario() {
    var notas = loadNotas();
    notas.sort(function (a, b) { return String(a.fecha).localeCompare(String(b.fecha)); });
    var ti = loadNotasTiempo();
    var lines = ['=== MI DIARIO · NOTAS RADAR ===', 'Descargado: ' + new Date().toLocaleString('es-PE'), 'Foco total: ' + fmtDur(dailyFocusMs()), '', ''];
    notas.forEach(function (n) {
      lines.push('[' + n.fecha + ']' + ((ti[n.id] || 0) > 0 ? ' (🍅 ' + fmtDur(ti[n.id]) + ')' : ''));
      lines.push(n.text);
      lines.push('---');
      lines.push('');
    });
    var blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/plain;charset=utf-8;' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mi_diario_' + new Date().toISOString().slice(0, 10) + '.txt';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    showToast('Diario descargado', 'Tus notas del día a día en .txt');
  }
  function renderInsightsDiario() {
    var el = document.getElementById('insights-diario');
    var kpis = document.getElementById('insights-kpis');
    if (!el && !kpis) return;
    var arr = loadProyectos();
    var totFocus = 0, best = null, bestMs = 0, pend = 0, doneHoy = 0, doneTot = 0;
    var tk = todayKey();
    arr.forEach(function (p) {
      var hm = hoyMsOf(p, null);
      totFocus += hm;
      if (hm > bestMs) { bestMs = hm; best = p; }
      (p.tareas || []).forEach(function (t) {
        if (t.done) { doneTot++; if (t.doneAt === tk) doneHoy++; } else pend++;
      });
    });
    var racha = streakDays(arr);
    var hoy = new Date();
    var tDay = hoy.getDate();
    var mDays = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
    var next = null;
    formalCredits.forEach(function (c) {
      if (c.interestOnly) return;
      if (paidThisMonth(c.name) > 0) return;
      var d = c.dueDateDay - tDay; if (d < 0) d = c.dueDateDay + (mDays - tDay);
      if (!next || d < next.d) next = { d: d, c: c };
    });
    var profit = monthProfitReal();
    if (kpis) {
      kpis.innerHTML = [
        ['🍅 Foco de hoy', totFocus > 0 ? fmtDur(totFocus) : '0m'],
        ['🔥 Racha', racha + ' día' + (racha === 1 ? '' : 's')],
        ['✅ Completadas hoy', doneHoy],
        ['📋 Pendientes', pend],
        ['💵 Balance del mes', fmtUSD(profit)],
        ['📅 Próximo pago', next ? (next.c.name.split('(')[0].trim() + ' · ' + (next.d === 0 ? 'HOY' : next.d + 'd')) : '—']
      ].map(function (k) {
        return '<div class="rk-card"><span class="rk-label">' + k[0] + '</span><span class="rk-value">' + k[1] + '</span></div>';
      }).join('');
    }
    var lines = [];
    if (totFocus > 0) {
      lines.push('🍅 Hoy llevas <b>' + fmtDur(totFocus) + '</b> de foco' + (best ? ', el mayor en <b>' + esc(best.nombre) + '</b> (' + fmtDur(bestMs) + ')' : '') + '. Sigue así.');
    } else {
      lines.push('🍅 Aún no registras foco hoy. Empieza una 🍅 en tu proyecto prioritario.');
    }
    lines.push('✅ Completaste <b>' + doneHoy + '</b> tarea' + (doneHoy === 1 ? '' : 's') + ' hoy · quedan <b>' + pend + '</b> pendientes en tu checklist.');
    if (next) lines.push('📅 Tu próximo pago es <b>' + esc(next.c.name.split('(')[0].trim()) + '</b> en ' + (next.d === 0 ? '0 días (HOY)' : next.d + ' días') + ' · S/ ' + next.c.monthlyFeePEN.toLocaleString() + '. Apártalo.');
    lines.push('💵 Balance del mes: <b>' + fmtUSD(profit) + '</b> ' + (profit >= 0 ? 'positivo. 🟢' : 'en negativo. Revisa tus gastos.'));
    if (el) el.innerHTML = lines.map(function (s) { return '<div class="pulso-block act"><span class="pulso-dot">💡</span><div>' + s + '</div></div>'; }).join('');
  }
  function renderNotas() {
    var list = document.getElementById('notas-list');
    var tot = document.getElementById('notas-total');
    if (!list) return;
    ensureNotaIds();
    var notas = loadNotas();
    notas.sort(function (a, b) { return String(b.fecha).localeCompare(String(a.fecha)); });
    var ti = loadNotasTiempo();
    var timer = loadTimer();
    if (notas.length) {
      list.innerHTML = notas.map(function (n, i) {
        var t = ti[n.id] || 0;
        var act = timer && String(timer.id) === String(n.id);
        return '<div class="nota-item c' + (i % 4) + (act ? ' timer-on' : '') + '">' +
          '<div class="nota-head"><span class="nota-text">' + esc(n.text) + '</span>' +
          '<span style="display:flex;gap:4px;align-items:center;">' +
          '<button class="nt-timer' + (act ? ' on' : '') + '" data-id="' + esc(n.id) + '" title="Pomodoro: registra tu tiempo en esta nota">' + (act ? '⏹' : '▶') + '</button>' +
          '<button class="nota-del" data-i="' + i + '" title="Eliminar">×</button></span></div>' +
          '<div class="nota-meta">' + esc(n.fecha) + (t > 0 ? ' · 🍅 <span class="nt-tt" id="tt-' + esc(n.id) + '">' + fmtDur(t) + '</span>' : '') + '</div>' +
          '</div>';
      }).join('');
      list.querySelectorAll('.nota-del').forEach(function (b) {
        b.addEventListener('click', function () {
          var arr = loadNotas();
          var n = arr.splice(parseInt(b.getAttribute('data-i'), 10), 1)[0];
          saveNotas(arr);
          if (n && timer && String(timer.id) === String(n.id)) localStorage.removeItem('stark_timer_active');
          renderNotas();
        });
      });
      list.querySelectorAll('.nt-timer').forEach(function (b) {
        b.addEventListener('click', function () { toggleTimer(b.getAttribute('data-id')); });
      });
    } else {
      list.innerHTML = '<div class="nota-empty">📝 Aún no tienes notas. Escribe una arriba y se guardará sola.</div>';
    }
    if (tot) tot.textContent = notas.length + ' nota' + (notas.length === 1 ? '' : 's') + ' · 🍅 ' + fmtDur(dailyFocusMs()) + ' de foco';
    renderFocusBar();
    renderTimeGraph();
    renderInsightsDiario();
  }
  function bindNotasForm() {
    var btn = document.getElementById('nt-add');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var text = document.getElementById('nt-text').value.trim();
      if (!text) { showToast('Notas', 'Escribe algo antes de guardar.'); return; }
      var arr = loadNotas();
      arr.push({ id: 'n' + Date.now() + '_' + Math.floor(Math.random() * 1e4), text: text, fecha: new Date().toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) });
      saveNotas(arr);
      document.getElementById('nt-text').value = '';
      showToast('Nota guardada', 'Se guardó en tu dispositivo.');
      renderNotas();
    });
    var inp = document.getElementById('nt-text');
    if (inp) inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); btn.click(); } });
    var dl = document.getElementById('nt-download');
    if (dl) dl.addEventListener('click', downloadDiario);
  }

  var RADAR_TERMS = [
    { t: 'combo ia pack', cat: 'oferta' }, { t: 'combo ia', cat: 'oferta' }, { t: 'low ticket', cat: 'oferta' },
    { t: 'vsl', cat: 'produccion' }, { t: 'hotmart', cat: 'plataforma' },
    { t: 'whatsapp', cat: 'canal' }, { t: 'meta ads', cat: 'canal' }, { t: 'facebook', cat: 'canal' }, { t: 'tiktok', cat: 'canal' }, { t: 'instagram', cat: 'canal' }, { t: 'youtube', cat: 'canal' }, { t: 'email', cat: 'canal' },
    { t: 'pauta', cat: 'tarea' }, { t: 'contenido', cat: 'tarea' }, { t: 'ventas', cat: 'tarea' }, { t: 'seguimiento', cat: 'tarea' }, { t: 'creativo', cat: 'tarea' }, { t: 'landing', cat: 'tarea' },
    { t: 'dropshipping', cat: 'oferta' }, { t: 'ecommerce', cat: 'nicho' }, { t: 'crm', cat: 'tarea' },
    { t: 'ia', cat: 'tema' }, { t: 'chatgpt', cat: 'tema' }, { t: 'claude', cat: 'tema' }, { t: 'openai', cat: 'tema' }, { t: 'automatizacion', cat: 'tema' }, { t: 'prompts', cat: 'tema' },
    { t: 'peru', cat: 'pais' }, { t: 'mexico', cat: 'pais' }, { t: 'colombia', cat: 'pais' }, { t: 'argentina', cat: 'pais' }, { t: 'bolivia', cat: 'pais' }, { t: 'españa', cat: 'pais' }, { t: 'latinos', cat: 'pais' },
    { t: 'salud', cat: 'nicho' }, { t: 'fitness', cat: 'nicho' }, { t: 'finanzas', cat: 'nicho' }, { t: 'belleza', cat: 'nicho' },
    { t: 'deuda', cat: 'finanzas' }, { t: 'ahorro', cat: 'finanzas' }, { t: 'junta', cat: 'finanzas' }, { t: 'fugas', cat: 'finanzas' },
    { t: 'estudio', cat: 'tarea' }, { t: 'formacion', cat: 'tarea' }, { t: 'reunion', cat: 'tarea' }
  ];
  var KW_TYPE_COLORS = { nicho: '#22A7F0', subnicho: '#4FD1C5', dolor: '#FF5263', deseo: '#F5A524', promesa: '#20E87B', hook: '#F5A524', angulo: '#B07BFF', mecanismo: '#4FD1C5', oferta: '#20E87B', canal: '#8DA1B5', tarea: '#8DA1B5', tema: '#22A7F0', pais: '#B07BFF', plataforma: '#22A7F0', produccion: '#F5A524', finanzas: '#F5A524' };
  var STATUS_COLORS = { ganadora: '#20E87B', vigilada: '#22A7F0', analizada: '#206BFF', testeando: '#F5B942', descartada: '#FF5263' };

  function buildMindGraph() {
    var notes = loadNotas();
    var ti = loadNotasTiempo();
    var timer = loadTimer();
    var focusByNote = {};
    var totalFocusMs = 0;
    notes.forEach(function (n) {
      var t = ti[n.id] || 0;
      if (timer && String(timer.id) === String(n.id)) t += Date.now() - timer.start;
      if (t) { focusByNote[n.id] = t; totalFocusMs += t; }
    });
    var kwMap = {};
    function bump(label, cat, w, noteIdx) {
      if (!kwMap[label]) kwMap[label] = { label: label, type: cat, w: 0, notes: {} };
      kwMap[label].w += w;
      if (noteIdx >= 0) kwMap[label].notes[noteIdx] = true;
    }
    notes.forEach(function (n, idx) {
      var txt = ' ' + (n.text || '').toLowerCase() + ' ';
      var focusH = (focusByNote[n.id] || 0) / 3600000;
      RADAR_TERMS.forEach(function (tm) {
        var count = txt.split(tm.t).length - 1;
        if (count > 0) bump(tm.t, tm.cat, count + focusH * 3, idx);
      });
    });
    var STOP = 'para como con los las una unos unas este esta esto que por su se al del el en y a o u de la lo es no si me mi tu te ha he ser un mas bien cada todo todos toda todas hasta desde entre sobre otra otro muy hoy hoy'
    var words = notes.map(function (n) { return (n.text || '') + ' '; }).join(' ').toLowerCase().split(/[^a-z0-9áéíóúñü]+/);
    var freq = {};
    words.forEach(function (w) { if (w.length >= 4 && STOP.indexOf(w) === -1) freq[w] = (freq[w] || 0) + 1; });
    Object.keys(freq).forEach(function (w) {
      if (freq[w] >= 2 && !kwMap[w]) bump(w, 'tema', freq[w], -1);
    });
    var kws = Object.keys(kwMap).map(function (k) { return kwMap[k]; }).filter(function (k) { return k.w > 0; });
    kws.sort(function (a, b) { return b.w - a.w; });
    return { kws: kws.slice(0, 26), totalFocusMs: totalFocusMs, noteCount: notes.length, activeTimer: timer };
  }

  function renderMindMap() {
    var el = document.getElementById('time-graph');
    if (!el) return;
    var g = buildMindGraph();
    if (!g.noteCount) {
      el.innerHTML = '<div class="nota-empty">📝 Escribe tu primera nota para encender tu NOTAS RADAR. Cada nota alimenta el grafo automáticamente.</div>';
      return;
    }
    var W = 940, H = 620, cx = W / 2, cy = H / 2;
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="mindmap-svg" preserveAspectRatio="xMidYMid meet">' +
      '<defs>' +
      '<radialGradient id="mm-center" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#14304A"/><stop offset="100%" stop-color="#08131F"/></radialGradient>' +
      '<filter id="mm-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '</defs>';
    var cats = {};
    g.kws.forEach(function (k) { (cats[k.type] = cats[k.type] || []).push(k); });
    var catList = Object.keys(cats);
    var maxW = 1;
    g.kws.forEach(function (k) { if (k.w > maxW) maxW = k.w; });
    var placed = [];
    catList.forEach(function (c, ci) {
      var base = (ci / catList.length) * Math.PI * 2 - Math.PI / 2;
      cats[c].forEach(function (k, ki) {
        var ang = base + (ki - (cats[c].length - 1) / 2) * 0.17;
        placed.push({ k: k, x: cx + Math.cos(ang) * 295, y: cy + Math.sin(ang) * 295 });
      });
    });
    placed.forEach(function (it) {
      svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + it.x + '" y2="' + it.y + '" stroke="' + (KW_TYPE_COLORS[it.k.type] || '#8DA1B5') + '" stroke-width="1.2" stroke-opacity="0.5"/>';
    });
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="50" fill="url(#mm-center)" stroke="#22A7F0" stroke-width="2" filter="url(#mm-glow)"/>';
    svg += '<text x="' + cx + '" y="' + (cy - 5) + '" text-anchor="middle" fill="#fff" font-size="11" font-weight="900" font-family="Inter,sans-serif">NOTAS</text>';
    svg += '<text x="' + cx + '" y="' + (cy + 13) + '" text-anchor="middle" fill="#22A7F0" font-size="12" font-weight="900" font-family="Inter,sans-serif">RADAR</text>';
    placed.forEach(function (it) {
      var rr = 7 + (it.k.w / maxW) * 11;
      var col = KW_TYPE_COLORS[it.k.type] || '#8DA1B5';
      svg += '<circle cx="' + it.x + '" cy="' + it.y + '" r="' + rr + '" fill="' + col + '" fill-opacity="0.24" stroke="' + col + '" stroke-width="1.3"/>';
      svg += '<text x="' + it.x + '" y="' + (it.y - rr - 4) + '" text-anchor="middle" fill="#DCE6F2" font-size="9.5" font-weight="700" font-family="Inter,sans-serif">' + esc(it.k.label.length > 14 ? it.k.label.slice(0, 14) + '…' : it.k.label) + '</text>';
    });
    svg += '</svg>';
    var CAT_LABEL = { oferta: 'Ofertas', canal: 'Canales', tarea: 'Tareas', tema: 'Temas', nicho: 'Nichos', pais: 'Países', finanzas: 'Finanzas', plataforma: 'Plataformas', produccion: 'Producción' };
    var leg = '<div class="mm-legend">' + catList.map(function (c) {
      return '<span class="mm-leg"><span class="sw" style="background:' + (KW_TYPE_COLORS[c] || '#8DA1B5') + '"></span> ' + (CAT_LABEL[c] || c) + '</span>';
    }).join('') +
      '<span class="mm-leg mm-note">🍅 Foco de hoy: ' + fmtDur(g.totalFocusMs) + (g.activeTimer ? ' · ⏹ hay un pomodoro en marcha' : '') + ' · el grafo nace 100% de tus notas.</span>' +
      '</div>';
    el.innerHTML = svg + leg;
  }

  function renderTimeGraph() { renderMindMap(); }

  function loadNegocioExtra() { try { return JSON.parse(localStorage.getItem('stark_negocio_extra') || '[]'); } catch (e) { return []; } }
  function saveNegocioExtra(arr) { localStorage.setItem('stark_negocio_extra', JSON.stringify(arr)); }
  function renderTarjetas() {
    var tb = document.getElementById('cards-tbody');
    var graph = document.getElementById('cards-graph');
    if (!tb || !window.CARDS_DATA) return;
    var hoy = new Date();
    var tDay = hoy.getDate();
    var mDays = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
    var cards = window.CARDS_DATA.cards.map(function (c) {
      var days = c.pago - tDay;
      if (days < 0) days = c.pago + (mDays - tDay);
      c.dias = days;
      return c;
    });
    cards.sort(function (a, b) { return a.dias - b.dias; });
    function lineFmt(c) {
      return (c.currency === 'USD' ? 'US$ ' : 'S/ ') + c.linea.toLocaleString('en-US', { minimumFractionDigits: 2 });
    }
    tb.innerHTML = cards.map(function (c) {
      var color = c.dias <= 2 ? 'var(--red)' : c.dias <= 7 ? 'var(--amber)' : 'var(--green)';
      return '<tr>' +
        '<td class="cell-title">' + esc(c.card) + '</td>' +
        '<td>' + esc(c.holder) + '</td>' +
        '<td>D\u00EDa ' + c.factura + '</td>' +
        '<td><b>D\u00EDa ' + c.pago + '</b></td>' +
        '<td class="amt-inc">' + lineFmt(c) + '</td>' +
        '<td><span class="nb-days" style="color:' + color + ';">' + (c.dias === 0 ? 'HOY' : c.dias + 'd') + '</span></td>' +
        '</tr>';
    }).join('');
    var prox = cards.filter(function (c) { return c.dias <= 3; });
    setAlert('tarjetas-alert', !prox.length,
      prox.length
        ? '⚠️ <b>Pago de tarjeta pr\u00F3ximo:</b> ' + prox.map(function (c) { return '<b>' + esc(c.card) + '</b> (' + (c.dias === 0 ? '\u00A1HOY!' : c.dias + 'd') + ')'; }).join(' \u00B7 ') + '. No dejes pasar la fecha.'
        : '✅ Ning\u00FAn pago de tarjeta en los pr\u00F3ximos 3 d\u00EDas.');
    if (graph) {
      graph.innerHTML = cards.map(function (c) {
        var pct = Math.min(100, Math.max(3, Math.round((1 - c.dias / mDays) * 100)));
        var color = c.dias <= 2 ? '#FF6B6B' : c.dias <= 7 ? '#FFB020' : '#55F58A';
        var tip = c.card + ' \u00B7 factura d\u00EDa ' + c.factura + ' \u00B7 pago d\u00EDa ' + c.pago + ' \u00B7 faltan ' + c.dias + ' d\u00EDas \u00B7 ' + lineFmt(c);
        return '<div class="nb-row" data-tip="' + esc(tip) + '">' +
          '<div class="nb-head"><span><b>' + esc(c.card) + '</b> <span class="usd-mini">' + esc(c.holder) + ' \u00B7 ' + lineFmt(c) + '</span></span>' +
          '<span class="nb-days" style="color:' + color + ';">' + (c.dias === 0 ? 'HOY' : c.dias + 'd') + '</span></div>' +
          '<div class="cat-track"><div class="cat-fill" style="width:' + pct + '%;background:' + color + ';"></div></div>' +
          '<div class="nb-sub">Factura d\u00EDa ' + c.factura + ' \u00B7 paga el d\u00EDa ' + c.pago + ' \u00B7 ' + (c.dias === 0 ? '\u00A1hoy mismo!' : 'faltan ' + c.dias + ' d\u00EDa' + (c.dias === 1 ? '' : 's')) + '</div>' +
          '</div>';
      }).join('');
    }
    return prox;
  }
  function checkCardAlerts() {
    var prox = renderTarjetas();
    if (!prox || !prox.length) return;
    playChime();
    showToast('Tarjeta por pagar', prox.map(function (c) { return c.card + ' (' + (c.dias === 0 ? 'HOY' : 'en ' + c.dias + 'd') + ')'; }).join(' \u00B7 '));
  }
  function checkDebtAlerts() {
    var hoy = new Date(), tDay = hoy.getDate();
    var mD = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
    var due = [];
    formalCredits.forEach(function (c) {
      var d = c.dueDateDay - tDay; if (d < 0) d = c.dueDateDay + (mD - tDay);
      if (d <= 2) due.push({ d: d, c: c });
    });
    if (!due.length) return;
    playChime();
    showToast('Deuda por pagar', due.map(function (x) { return x.c.name.split('(')[0].trim() + ' (' + (x.d === 0 ? 'HOY' : 'en ' + x.d + 'd') + ')'; }).join(' \u00B7 '));
  }

  function renderNegocio() {
    var tb = document.getElementById('negocio-tbody');
    var tot = document.getElementById('negocio-total');
    var tfoot = document.getElementById('negocio-tfoot-total');
    var alertBox = document.getElementById('negocio-alert');
    var graph = document.getElementById('negocio-graph');
    if (!tb) return;
    var tools = [];
    if (window.BUSINESS_DATA && window.BUSINESS_DATA.tools) tools = tools.concat(window.BUSINESS_DATA.tools);
    loadNegocioExtra().forEach(function (t) { tools.push(t); });
    var hoy = new Date();
    var tDay = hoy.getDate();
    var monthLen = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
    tools.forEach(function (t) {
      t.dia = parseInt(t.fecha, 10);
      if (isNaN(t.dia)) t.dia = 99;
      if (t.dia <= 31) {
        var daysLeft = t.dia - tDay;
        if (daysLeft < 0) daysLeft = t.dia + (monthLen - tDay);
        t.dias = daysLeft;
      } else { t.dias = 999; }
    });
    tools.sort(function (a, b) { return a.dias - b.dias || String(a.name).localeCompare(String(b.name)); });
    var total = 0;
    tb.innerHTML = tools.map(function (t) {
      total += t.usd;
      var dia = t.dia <= 31 ? ('0' + t.dia).slice(-2) + ' de cada mes' : esc(t.fecha);
      var dcolor = t.dias <= 2 ? 'var(--red)' : t.dias <= 7 ? 'var(--amber)' : 'var(--green)';
      return '<tr><td class="cell-title">' + esc(t.name) + '</td><td class="dia-pago">' + dia + '</td>' +
        '<td><span class="nb-days" style="color:' + dcolor + ';">' + (t.dias === 0 ? 'HOY' : t.dias + 'd') + '</span></td>' +
        '<td class="amt-exp">' + fmtUSD2(t.usd) + '</td></tr>';
    }).join('');
    if (tfoot) tfoot.innerHTML = '<b>' + fmtUSD2(total) + '</b>';
    if (tot) tot.textContent = tools.length + ' herramientas \u00B7 ordenadas por d\u00EDa de pago \u00B7 TOTAL: ' + fmtUSD2(total) + ' \u2248 S/ ' + (total * FX).toFixed(2);

    var prontos = tools.filter(function (t) { return t.dia <= 31 && t.dias <= 3; }).sort(function (a, b) { return a.dias - b.dias; });
    if (alertBox) {
      if (prontos.length) {
        alertBox.className = 'negocio-alert warn';
        alertBox.innerHTML = '\u26A0\uFE0F <b>Pago pr\u00F3ximo:</b> ' + prontos.map(function (p) { return esc(p.name) + ' (' + (p.dias === 0 ? '\u00A1HOY!' : p.dias + 'd') + ')'; }).join(' \u00B7 ');
      } else {
        alertBox.className = 'negocio-alert ok';
        alertBox.innerHTML = '\u2705 Ninguna herramienta pr\u00F3xima a pagar (pr\u00F3ximos 3 d\u00EDas).';
      }
    }
    if (graph) {
      var list = tools.filter(function (t) { return t.dia <= 31; }).slice().sort(function (a, b) { return a.dias - b.dias; });
      var totalMes = list.reduce(function (s, t) { return s + t.usd; }, 0);
      graph.innerHTML = '<div class="nb-legend"><span class="sw" style="background:#55F58A"></span> >7 d\u00EDas <span class="sw" style="background:#FFB020;margin-left:12px;"></span> \u22647 d\u00EDas <span class="sw" style="background:#FF6B6B;margin-left:12px;"></span> \u22642 d\u00EDas (hoy) <span style="margin-left:auto;" class="usd-mini">Total mensual: ' + fmtUSD2(totalMes) + '</span></div>' +
        list.map(function (t) {
          var pct = Math.min(100, Math.max(3, Math.round((1 - t.dias / monthLen) * 100)));
          var color = t.dias <= 2 ? '#FF6B6B' : t.dias <= 7 ? '#FFB020' : '#55F58A';
          var tip = t.name + ' \u00B7 paga el ' + t.dia + ' de cada mes \u00B7 faltan ' + t.dias + ' d\u00EDas \u00B7 ' + fmtUSD2(t.usd);
          return '<div class="nb-row" data-tip="' + esc(tip) + '">' +
            '<div class="nb-head"><span><b>' + ('0' + t.dia).slice(-2) + '</b> · ' + esc(t.name) + ' <span class="usd-mini">' + fmtUSD2(t.usd) + '</span></span>' +
            '<span class="nb-days" style="color:' + color + ';">' + (t.dias === 0 ? 'HOY' : t.dias + 'd') + '</span></div>' +
            '<div class="cat-track"><div class="cat-fill" style="width:' + pct + '%;background:' + color + ';"></div></div>' +
            '<div class="nb-sub">paga el d\u00EDa ' + t.dia + ' \u00B7 ' + (t.dias === 0 ? '\u00A1hoy mismo!' : 'faltan ' + t.dias + ' d\u00EDa' + (t.dias === 1 ? '' : 's')) + '</div>' +
            '</div>';
        }).join('');
    }
  }
  function bindNegocioForm() {
    var btn = document.getElementById('nf-add');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var nombre = document.getElementById('nf-nombre').value.trim();
      var usd = parseFloat(document.getElementById('nf-usd').value);
      if (!nombre || isNaN(usd) || usd <= 0) { showToast('Negocio', 'Completa nombre y monto USD v\u00E1lido.'); return; }
      var fechaRaw = document.getElementById('nf-fecha').value;
      var meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      var fecha = fechaRaw ? parseInt(fechaRaw.slice(8), 10) + ' ' + meses[parseInt(fechaRaw.slice(5, 7), 10) - 1] + ' ' + fechaRaw.slice(0, 4) : 'pr\u00F3ximo pago';
      var arr = loadNegocioExtra(); arr.push({ name: nombre, fecha: fecha, usd: usd }); saveNegocioExtra(arr);
      document.getElementById('nf-nombre').value = '';
      document.getElementById('nf-usd').value = '';
      showToast('Herramienta agregada', nombre + ' \u00B7 ' + fmtUSD2(usd));
      renderNegocio();
    });
  }
  // ============================================================
  // INIT
  // ============================================================
  window.addEventListener('error', function (e) {
    try {
      var b = document.createElement('div');
      b.style.cssText = 'position:fixed;bottom:8px;left:8px;right:8px;z-index:9999;background:#FF5263;color:#fff;padding:10px 14px;border-radius:10px;font:12px monospace;white-space:pre-wrap;pointer-events:none;';
      b.textContent = '⚠️ Error: ' + (e.message || 'desconocido') + (e.lineno ? ' (línea ' + e.lineno + ')' : '');
      document.body.appendChild(b);
    } catch (ex) {}
  });
  var gff = document.getElementById('gf-fecha');
  if (gff) gff.value = new Date().toISOString().slice(0, 10);
  buildMonthSelect();
  bindAgent();
  renderResumen();
  switchTab('inicio');
  bindExtras();
  bindPagosForm();
  bindNegocioForm();
  bindNotasForm();
  bindProyectos();
  var lastPomToast = 0;
  var lastPomChime = -1;
  setInterval(function () {
    renderCountdown();
    renderNowFocus();
    var ses = loadProySesion();
    if (ses) {
      var sp = proyById(ses.id);
      var elHoy = document.getElementById('proy-hoy-' + ses.id);
      if (elHoy && sp) elHoy.textContent = fmtDur(hoyMsOf(sp, ses));
      var dbh = document.getElementById('proy-db-hoy');
      if (dbh) {
        var hoyT = 0;
        loadProyectos().forEach(function (p) { hoyT += hoyMsOf(p, ses); });
        dbh.textContent = fmtDur(hoyT);
      }
      if (ses.tareaId && sp) {
        var ttEl = document.getElementById('pt-' + ses.id + '-' + ses.tareaId);
        if (ttEl) {
          for (var tk = 0; tk < (sp.tareas || []).length; tk++) {
            if (String(sp.tareas[tk].id) === String(ses.tareaId)) {
              ttEl.textContent = '🍅 ' + fmtDur((sp.tareas[tk].tiempoMs || 0) + (Date.now() - ses.start));
            }
          }
        }
      }
    }
    var timer = loadTimer();
    var fb = document.getElementById('nota-focus');
    if (!timer) {
      if (fb && fb.className.indexOf('hidden') === -1) renderFocusBar();
      return;
    }
    var elapsed = Date.now() - timer.start;
    var note = notaById(timer.id);
    var txt = note ? note.text.slice(0, 30) : 'tu nota';
    if (fb) {
      fb.className = 'nota-focus';
      fb.innerHTML = '🍅 <b>Foco de hoy:</b> ' + fmtDur(dailyFocusMs()) + ' <span class="nf-active">▶ ' + esc(txt) + ' · ' + fmtDur(elapsed) + '</span> <button class="btn-add btn-sm" id="nt-stop-all">⏹ Detener</button>';
      var sb = document.getElementById('nt-stop-all');
      if (sb) sb.addEventListener('click', stopTimer);
    }
    var tt = document.getElementById('tt-' + timer.id);
    if (tt) tt.textContent = fmtDur((loadNotasTiempo()[timer.id] || 0) + elapsed);
    if (elapsed >= 25 * 60000 && lastPomToast !== timer.start) {
      lastPomToast = timer.start;
      showToast('🍅 Pomodoro completado', '25 minutos de foco. Toma 5 y sigue o detén.');
    }
    var min10 = Math.floor(elapsed / 600000);
    if (min10 >= 1 && min10 !== lastPomChime) {
      lastPomChime = min10;
      playChime();
      showToast('⏱ 10 minutos', 'Llevas ' + min10 * 10 + ' min de foco en esta nota. Sigue así 🍅');
    }
  }, 1000);
  var mbtn = document.getElementById('menu-btn');
  var sback = document.getElementById('side-backdrop');
  function toggleSidebar(open) {
    var sb = document.getElementById('sidebar');
    if (sb) sb.classList.toggle('open', !!open);
    if (sback) sback.classList.toggle('show', !!open);
  }
  window.__toggleSidebar = toggleSidebar;
  if (mbtn) mbtn.addEventListener('click', function () {
    var sb = document.getElementById('sidebar');
    toggleSidebar(!(sb && sb.classList.contains('open')));
  });
  if (sback) sback.addEventListener('click', function () { toggleSidebar(false); });
  var ndb = document.getElementById('notify-debt-btn');
  if (ndb) ndb.addEventListener('click', function () {
    playChime();
    var hoy = new Date(), tDay = hoy.getDate();
    var mD = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
    var list = formalCredits.map(function (c) {
      var d = c.dueDateDay - tDay; if (d < 0) d = c.dueDateDay + (mD - tDay);
      return c.name.split('(')[0].trim() + ' ' + (d === 0 ? '¡HOY!' : 'día ' + c.dueDateDay + ' (en ' + d + 'd)');
    });
    showToast('Deudas del mes', list.join(' \u00B7 '));
  });
  var mmc = document.getElementById('month-modal-close');
  if (mmc) mmc.addEventListener('click', closeMonthModal);
  var mm = document.getElementById('month-modal');
  if (mm) mm.addEventListener('click', function (e) { if (e.target === mm) closeMonthModal(); });
  document.querySelectorAll('.mini-icon').forEach(function (ic) {
    ic.addEventListener('click', function () {
      var t = ic.getAttribute('data-popup');
      if (t === 'ingresos') openIngresosPopup();
      else if (t === 'gastos') openGastosPopup();
      else if (t === 'deudas') openDeudasPopup();
    });
  });
  document.querySelectorAll('.quick-card').forEach(function (qc) {
    qc.addEventListener('click', function () {
      var t = qc.getAttribute('data-quick');
      if (t === 'pago') switchTab('deudas');
      else if (t === 'brecha') switchTab('ancla');
      else if (t === 'septiembre') switchTab('ancla');
      else if (t === 'fugas') switchTab('gastos-mensuales');
    });
  });
  var itb = document.getElementById('ingresos-tbody');
  if (itb) itb.addEventListener('click', function (e) {
    var row = e.target && e.target.closest ? e.target.closest('tr[data-month]') : null;
    if (row) openMonthModal(row.getAttribute('data-month'));
  });
  try {
    if (localStorage.getItem(SESSION_KEY) === '1') { unlock(); checkCardAlerts(); checkDebtAlerts(); }
    else { lock(); }
  } catch (e) { lock(); }
})();
