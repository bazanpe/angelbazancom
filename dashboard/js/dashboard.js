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
  extraMonths.forEach(function (m) {
    var b = window.BANK_DATA && window.BANK_DATA.months ? window.BANK_DATA.months[m.month] : null;
    m.gastosBank = b || null;
    m.gastosUSD = b ? (b.scotiabankUSD || 0) + ((b.bcpPEN || 0) / FX) : 0;
    if (b) m.highlights = 'Ingresos low ticket v\u00EDa retiros Hotmart. Gastos: tarjeta Scotiabank US$ ' + Math.round(b.scotiabankUSD || 0) + ' + BCP S/ ' + Math.round(b.bcpPEN || 0).toLocaleString('en-US') + '.';
  });
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
    var g = (m.adsUSD || 0) + (m.toolsUSD || 0) + (m.withdrawalsUSD || 0) + (m.gastosUSD || 0);
    if (m.month.indexOf('Julio') !== -1 && expSum) g += (expSum.totalPersonalUSD || 0);
    return g;
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
    var ok = profit >= 0;
    var hv = document.getElementById('hero-saldo');
    hv.textContent = fmtUSD(profit);
    hv.style.color = ok ? '' : 'var(--red)';
    var lbl = document.querySelector('.hero-left .hero-label');
    if (lbl) lbl.textContent = 'PROFIT REAL DEL MES \u00B7 ' + monthLabel().toUpperCase();
    var growth = document.getElementById('hero-growth');
    growth.innerHTML = 'INGRESOS ' + fmtUSD(monthIngresosReal()) + ' \u2212 GASTOS ' + fmtUSD(monthGastosReal()) + ' = ' + fmtUSD(profit);
    growth.className = 'hero-growth ' + (ok ? 'up' : 'down');
  }

  function renderMinis() {
    document.getElementById('mini-ingresos').textContent = fmtUSD(monthIngresosReal());
    document.getElementById('mini-gastos').textContent = fmtUSD(monthGastosReal());
    document.getElementById('mini-deudas').textContent = fmtPEN(deudasMes);
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

  function renderResumenIngresos() {
    var el = document.getElementById('chart-flow');
    if (!el) return;
    var m = selectedMonth();
    var combo = m ? m.revenueUSD : 0;
    var hm = hotmartFor(m);
    var total = combo + hm;
    var rows = [
      { label: 'Ventas Combo IA', v: combo, color: '#55F58A', src: 'PDFs de ventas' },
      { label: 'Retiros Hotmart (low ticket)', v: hm, color: '#6EA8FF', src: 'CSV de transferencias' }
    ];
    var max = Math.max(1, combo, hm);
    el.innerHTML = '<div class="cat-bars">' + rows.map(function (r) {
      var pct = Math.round((r.v / max) * 100);
      return '<div class="cat-row">' +
        '<div class="cat-head"><span>' + esc(r.label) + '</span><span style="color:' + r.color + ';font-family:JetBrains Mono,monospace;font-weight:700;">' + fmtUSD(r.v) + '</span></div>' +
        '<div class="cat-track"><div class="cat-fill" style="width:' + Math.max(2, pct) + '%;background:' + r.color + ';"></div></div></div>';
    }).join('') +
      '<div class="desglose-total up"><span>Total ingresos</span><b>' + fmtUSD(total) + '</b></div>' +
      '</div>';
  }

  function renderGastosDesglose() {
    var el = document.getElementById('chart-cat');
    if (!el) return;
    var m = selectedMonth();
    var ads = m ? (m.adsUSD || 0) : 0;
    var tools = m ? (m.toolsUSD || 0) : 0;
    var retiros = m ? (m.withdrawalsUSD || 0) : 0;
    var personal = (m && m.month.indexOf('Julio') !== -1 && expSum) ? (expSum.totalPersonalUSD || 0) : 0;
    var bank = m ? (m.gastosUSD || 0) : 0;
    var total = ads + tools + retiros + personal + bank;
    var rows = [
      { label: 'Pauta (ads)', v: ads, color: '#FFB020' },
      { label: 'Herramientas', v: tools, color: '#18B875' },
      { label: 'Retiros', v: retiros, color: '#FF6B6B' },
      { label: 'Gastos personales', v: personal, color: '#4FD1FF' },
      { label: 'Gastos bancarios (BCP + TC)', v: bank, color: '#C084FC' }
    ].filter(function (r) { return r.v > 0; });
    var max = Math.max(1, total);
    el.innerHTML = '<div class="cat-bars">' + rows.map(function (r) {
      var pct = Math.round((r.v / max) * 100);
      return '<div class="cat-row">' +
        '<div class="cat-head"><span>' + esc(r.label) + '</span><span style="color:' + r.color + ';font-family:JetBrains Mono,monospace;font-weight:700;">' + fmtUSD(r.v) + '</span></div>' +
        '<div class="cat-track"><div class="cat-fill" style="width:' + Math.max(2, pct) + '%;background:' + r.color + ';"></div></div></div>';
    }).join('') +
      '<div class="desglose-total down"><span>Total gastos</span><b>' + fmtUSD(total) + '</b></div>' +
      '</div>';
  }

  function renderWeekActions() {
    var el = document.getElementById('week-actions');
    if (!el) return;
    var next = formalCredits[0];
    var items = [];
    if (next) {
      items.push({ cls: 'red', icon: '!', title: 'Cuota ' + next.name.split('(')[0].trim() + ' vence en 3 días', sub: 'S/ ' + next.monthlyFeePEN.toLocaleString() + ' ≈ ' + usdEquiv(next.monthlyFeePEN) + ' USD' });
    }
    var falta = Math.round((META - saldo));
    items.push({ cls: 'green', icon: '●', title: 'Meta de ahorro: faltan US$ ' + Math.max(0, falta).toLocaleString('en-US'), sub: 'Estás al ' + metaPct + '% de tu meta mensual' });
    items.push({ cls: 'green', icon: '▲', title: 'Ingresos arriba del plan', sub: fmtUSD(ingresos) + ' en el mes · ROAS ' + (julio ? julio.roas.toFixed(2) + 'x' : '—') });
    items.push({ cls: 'red', icon: '!', title: 'Septiembre: mes crítico S/ 8,971 (≈$2,392)', sub: 'Las 4 cuotas de créditos + junta caen juntas' });
    el.innerHTML = items.map(function (a) {
      return '<div class="wa-item ' + a.cls + '"><span class="wa-icon">' + a.icon + '</span><div><div class="wa-title">' + a.title + '</div><div class="wa-sub">' + a.sub + '</div></div></div>';
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

  function renderResumen() {
    renderHero();
    renderMinis();
    renderResumenIngresos();
    renderGastosDesglose();
    renderWeekActions();
    renderMovements();
    renderAssets();
  }

  // ============================================================
  // VISTAS SECUNDARIAS
  // ============================================================
  function renderIngresos() {
    var tb = document.getElementById('ingresos-tbody');
    var detail = document.getElementById('ingresos-detail');
    var tfoot = document.getElementById('ingresos-tfoot');
    if (!tb && !detail) return;
    var sel = document.getElementById('sel-month-ingresos');
    var filter = sel ? sel.value : 'all';
    var months = filter === 'all' ? fullMonths : fullMonths.filter(function (m) { return m.month.indexOf(filter) !== -1; });
    if (tb) {
      tb.innerHTML = months.map(function (m) {
        var hm = hotmartFor(m);
        var total = m.revenueUSD + hm;
        return '<tr><td class="cell-title">' + esc(m.month) + '</td>' +
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
  }

  function renderGastos() {
    var tb = document.getElementById('exp-table-body');
    var total = document.getElementById('gastos-total');
    if (!tb) return;
    var items = expItems.slice().reverse();
    tb.innerHTML = items.map(function (it) {
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
    if (total) total.textContent = items.length + ' cargos · ' + fmtUSD(gastos);
  }

    function renderDeudas() {
    var tb = document.getElementById('debt-formal-tbody');
    var tot = document.getElementById('debt-total');
    var banner = document.getElementById('debt-banner');
    if (tb) {
      var totalPend = 0;
      formalCredits.forEach(function (c) { totalPend += c.pendingBalancePEN; });
      tb.innerHTML = formalCredits.map(function (c) {
        var paid = payCount(c.name);
        var totalQ = c.totalQuotas || c.remainingQuota;
        var pend = Math.min(c.remainingQuota, totalQ);
        var current = c.currentQuota || Math.max(1, totalQ - pend + 1);
        var shown = Math.min(paid, totalQ);
        var pct = Math.min(100, Math.max(2, Math.round(((totalQ - pend) / totalQ) * 100)));
        return '<tr>' +
          '<td class="cell-title">' + esc(c.name) + '</td>' +
          '<td style="color:var(--red);font-family:JetBrains Mono,monospace;font-weight:700;">S/ ' + c.monthlyFeePEN.toLocaleString() + ' <span class="usd-mini">\u2248 ' + usdEquiv(c.monthlyFeePEN) + ' USD</span></td>' +
          '<td>D\u00EDa ' + c.dueDateDay + '</td>' +
          '<td><b>' + current + '</b> de ' + totalQ + '</td>' +
          '<td>' + esc(c.range) + '</td>' +
          '<td style="color:var(--amber);font-family:JetBrains Mono,monospace;font-weight:800;">S/ ' + c.pendingBalancePEN.toLocaleString() + ' <span class="usd-mini">\u2248 ' + usdEquiv(c.pendingBalancePEN) + ' USD</span></td>' +
          '<td><div class="pay-quota-big">' + current + '/' + totalQ + '</div>' +
          '<div class="pay-progress"><div class="pay-bar" style="width:' + pct + '%"></div></div>' +
          '<div class="pay-meta">' + pend + ' cuotas por pagar \u00B7 ' + shown + ' pagadas</div>' +
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
    if (banner) {
      banner.innerHTML = '<span style="font-size:18px;">\uD83D\uDEA8</span><div><b>ALERTA SEPTIEMBRE 2026:</b> caen juntas las 4 cuotas de cr\u00E9ditos (d\u00EDas 2, 11 y 19) por <b>S/ 6,971</b> + <b>S/ 2,000</b> de junta = <b>S/ 8,971</b> <span class="usd-mini">(\u2248 $2,392 USD)</span>.</div>';
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
    var per = formalCredits.map(function (c) {
      var p = Math.min(payCount(c.name), c.remainingQuota);
      var total = c.totalQuotas || c.remainingQuota;
      var pend = Math.min(c.remainingQuota, total);
      paid += p; pending += pend;
      return { name: c.name, total: total, cur: c.currentQuota || Math.max(1, total - pend + 1), pend: pend, saldo: c.pendingBalancePEN };
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
        var g = (m.adsUSD || 0) + (m.toolsUSD || 0) + (m.withdrawalsUSD || 0) + (m.gastosUSD || 0);
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
  }

  function renderReportes() {
    var tb = document.getElementById('reportes-tbody');
    var kpi = document.getElementById('reporte-kpis');
    var detail = document.getElementById('reportes-detail');
    if (!tb) return;
    var tIng = 0, tGas = 0, tSal = 0, tRoas = 0, tHm = 0, best = null, bestC = null, bestCRev = 0;
    fullMonths.forEach(function (m) {
      var hm = hotmartFor(m);
      var g = (m.adsUSD || 0) + (m.toolsUSD || 0) + (m.withdrawalsUSD || 0) + (m.gastosUSD || 0);
      var s = (m.revenueUSD + hm) - g;
      tIng += m.revenueUSD + hm; tGas += g; tSal += s; tRoas += m.roas; tHm += hm;
      if (!best || s > best.s) best = { m: m.month, s: s };
      (m.countries || []).forEach(function (c) { if (c.revenue > bestCRev) { bestCRev = c.revenue; bestC = c.country; } });
    });
    var promRoas = fullMonths.length ? tRoas / fullMonths.length : 0;
    tb.innerHTML = fullMonths.map(function (m) {
      var hm = hotmartFor(m);
      var g = (m.adsUSD || 0) + (m.toolsUSD || 0) + (m.withdrawalsUSD || 0) + (m.gastosUSD || 0);
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
        var g = (m.adsUSD || 0) + (m.toolsUSD || 0) + (m.withdrawalsUSD || 0) + (m.gastosUSD || 0);
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
  }

  // ============================================================
  // NAVEGACIÓN
  // ============================================================
  var NAV_TITLES = {
    resumen: 'Resumen financiero',
    ingresos: 'Ingresos',
    gastos: 'Gastos',
    deudas: 'Deudas',
    pagos: 'Pagos',
    negocio: 'Negocio',
    metas: 'Metas',
    reportes: 'Reportes'
  };

  function switchTab(target) {
    document.querySelectorAll('.view').forEach(function (v) { v.style.display = 'none'; });
    var view = document.getElementById('view-' + target);
    if (view) view.style.display = 'block';
    var t = document.getElementById('topbar-title');
    if (t && NAV_TITLES[target]) t.textContent = NAV_TITLES[target];

    if (target === 'resumen') renderResumen();
    else if (target === 'ingresos') renderIngresos();
    else if (target === 'gastos') renderGastos();
    else if (target === 'deudas') renderDeudas();
    else if (target === 'pagos') renderPagos();
    else if (target === 'negocio') renderNegocio();
    else if (target === 'metas') renderMetas();
    else if (target === 'reportes') renderReportes();
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
    var desc = prompt('Descripción del movimiento:');
    if (!desc) return;
    var usd = parseFloat(prompt('Monto en USD (usa − para gasto):'));
    if (isNaN(usd)) return;
    var cat = prompt('Categoría (Ads, SaaS, Personal, Operación):') || 'Operación';
    expItems.push({ source: 'Manual', date: '2026-07-27', desc: desc, cat: cat, type: usd >= 0 ? 'Negocio' : 'Personal', usd: Math.abs(usd), pen: Math.abs(usd) * FX, status: 'Mantener' });
    gastos = expSum ? (expSum.totalBusinessUSD + expSum.totalPersonalUSD) : 0;
    saldo = ingresos - gastos;
    showToast('Movimiento agregado', desc + ' · ' + fmtUSD(Math.abs(usd)));
    renderResumen();
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
  document.getElementById('sync-btn').addEventListener('click', syncFromSheet);

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
      renderGastos();
      renderResumen();
      return '\u2705 Gasto registrado: "' + descG + '" por ' + fmtUSD(amtG) + '. Lo agregu\u00E9 en Gastos y en tu Resumen.';
    }
    if (has('como voy', 'resumen', 'rapido')) {
      return 'En resumen: ingresos ' + fmtUSD(ingresos) + ', gastos ' + fmtUSD(gastos) + ' y saldo neto de ' + fmtUSD(saldo) + '. Deudas del mes ' + fmtPEN(deudasMes) + ' y ' + fmtPEN(disponible) + ' disponibles.';
    }
    if (has('deuda')) {
      if (has('pendiente', 'total')) return 'Deudas pendientes estimadas: ' + fmtPEN(deudaMin) + ' – ' + fmtPEN(deudaMax) + '. Créditos formales: S/ 66,169.';
      if (has('mes', 'mensual')) return 'Tus deudas del mes suman ' + fmtPEN(deudasMes) + ': S/ 6,971 créditos + S/ 2,000 junta.';
      return 'Deudas del mes: ' + fmtPEN(deudasMes) + '. Pendientes: ' + fmtPEN(deudaMin) + ' – ' + fmtPEN(deudaMax) + '.';
    }
    if (has('gasto', 'salida', 'fuga')) {
      if (has('fuga', 'duplic')) return 'Fugas: Google One +$80 USD, 6 cobros Skool +$30 USD, IA duplicada +$23.60 USD. Ahorro potencial +$' + ahorroPotencial + ' USD/mes.';
      return 'Gastos del mes: ' + fmtUSD(gastos) + ' (negocio + personal). Revisa el módulo Gastos.';
    }
    if (has('ingreso', 'venta', 'factur')) return 'Ingresos del mes: ' + fmtUSD(ingresos) + '. Mejor mes del trimestre: ' + (comboMonths.length ? comboMonths.reduce(function (a, b) { return a.revenueUSD > b.revenueUSD ? a : b; }).month : '—');
    if (has('saldo', 'superavit', 'sobra')) return 'Tu saldo neto del mes es ' + fmtUSD(saldo) + '. Disponible líquido: ' + fmtPEN(disponible) + '.';
    if (has('septiembre', 'alerta', 'critico')) return 'Septiembre es crítico: S/ 8,971 (≈$2,392 USD) entre créditos y junta.';
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

  function downloadCsv(filename, rows) {
    var csv = rows.map(function (r) { return r.map(function (c) { var s = String(c); if (s.indexOf(',') !== -1 || s.indexOf('"') !== -1) s = '"' + s.replace(/"/g, '""') + '"'; return s; }).join(','); }).join('\r\n');
    var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }
  function exportActive() {
    var target = 'resumen';
    document.querySelectorAll('.view').forEach(function (v) { if (v.style.display === 'block') target = v.id.replace('view-', ''); });
    var rows = [];
    if (target === 'deudas') {
      rows = [['Cr\u00E9dito', 'Cuota mensual', 'Vencimiento', 'Cuotas', 'Periodo', 'Saldo pendiente PEN', 'Pagos registrados']];
      formalCredits.forEach(function (c) { rows.push([c.name, c.monthlyFeePEN, 'D\u00EDa ' + c.dueDateDay, c.remainingQuota, c.range, c.pendingBalancePEN, payCount(c.name)]); });
      downloadCsv('stark_deudas.csv', rows);
    } else if (target === 'gastos') {
      rows = [['Fecha', 'Fuente', 'Descripci\u00F3n', 'Categor\u00EDa', 'Tipo', 'USD', 'PEN', 'Estado']];
      expItems.forEach(function (it) { rows.push([it.date, it.source, it.desc, it.cat, it.type, it.usd, it.pen, it.status]); });
      downloadCsv('stark_gastos.csv', rows);
    } else if (target === 'ingresos') {
      rows = [['Mes', 'Ingresos USD', 'Gasto pauta', 'Ganancia neta', 'ROAS']];
      comboMonths.forEach(function (m) { rows.push([m.month, m.revenueUSD, m.adsUSD, m.profitUSD, m.roas]); });
      downloadCsv('stark_ingresos.csv', rows);
    } else if (target === 'reportes') {
      rows = [['Mes', 'Ingresos', 'Gastos', 'Saldo', 'ROAS']];
      comboMonths.forEach(function (m) { var g = (m.adsUSD || 0) + (m.toolsUSD || 0) + (m.withdrawalsUSD || 0) + (m.gastosUSD || 0); rows.push([m.month, m.revenueUSD, g, m.revenueUSD - g, m.roas]); });
      downloadCsv('stark_reportes.csv', rows);
    } else {
      rows = [['Movimiento', 'Categor\u00EDa', 'Fecha', 'Monto USD', 'Tipo']];
      buildMovementsList();
      movAll.forEach(function (r) { rows.push([r.name, r.cat, r.date, r.usd, r.type]); });
      downloadCsv('stark_movimientos.csv', rows);
    }
    showToast('Exportado', 'CSV descargado \u2014 \u00E1brelo en Excel o Google Sheets.');
  }
  function bindExtras() {
    var eb = document.getElementById('export-btn');
    if (eb) eb.addEventListener('click', exportActive);
    var ga = document.getElementById('gf-add');
    if (ga) ga.addEventListener('click', function () {
      var desc = document.getElementById('gf-desc').value.trim();
      var usd = parseFloat(document.getElementById('gf-usd').value);
      if (!desc || isNaN(usd) || usd <= 0) { showToast('Gasto por d\u00EDa', 'Completa descripci\u00F3n y monto USD v\u00E1lido.'); return; }
      var item = { source: 'Registro diario', date: document.getElementById('gf-fecha').value || '2026-07-27', desc: desc, cat: document.getElementById('gf-cat').value, type: document.getElementById('gf-tipo').value, usd: usd, pen: usd * FX, status: 'Mantener' };
      expItems.push(item);
      gastos += usd;
      var extras = loadExtras(); extras.push(item); saveExtras(extras);
      document.getElementById('gf-desc').value = '';
      document.getElementById('gf-usd').value = '';
      showToast('Gasto registrado', desc + ' \u00B7 ' + fmtUSD(usd));
      renderGastos();
      renderResumen();
    });
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
  function loadNegocioExtra() { try { return JSON.parse(localStorage.getItem('stark_negocio_extra') || '[]'); } catch (e) { return []; } }
  function saveNegocioExtra(arr) { localStorage.setItem('stark_negocio_extra', JSON.stringify(arr)); }
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
    tools.sort(function (a, b) { return a.dia - b.dia || String(a.name).localeCompare(String(b.name)); });
    var total = 0;
    tb.innerHTML = tools.map(function (t) {
      total += t.usd;
      var dia = t.dia <= 31 ? ('0' + t.dia).slice(-2) + ' de cada mes' : esc(t.fecha);
      return '<tr><td class="cell-title">' + esc(t.name) + '</td><td class="dia-pago">' + dia + '</td><td class="amt-exp">' + fmtUSD2(t.usd) + '</td></tr>';
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
      graph.innerHTML = list.map(function (t) {
        var pct = Math.min(100, Math.max(3, Math.round((1 - t.dias / monthLen) * 100)));
        var color = t.dias <= 2 ? '#FF6B6B' : t.dias <= 7 ? '#FFB020' : '#55F58A';
        var tip = t.name + ' \u00B7 paga el ' + t.dia + ' de cada mes \u00B7 faltan ' + t.dias + ' d\u00EDas \u00B7 ' + fmtUSD2(t.usd);
        return '<div class="nb-row" data-tip="' + esc(tip) + '">' +
          '<div class="nb-head"><span>' + esc(t.name) + '</span><span style="color:' + color + ';font-weight:800;font-family:JetBrains Mono,monospace;">' + (t.dias === 0 ? 'HOY' : t.dias + 'd') + '</span></div>' +
          '<div class="cat-track"><div class="cat-fill" style="width:' + pct + '%;background:' + color + ';"></div></div>' +
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
  buildMonthSelect();
  bindAgent();
  renderResumen();
  switchTab('resumen');
  bindExtras();
  bindPagosForm();
  bindNegocioForm();
  try {
    if (localStorage.getItem(SESSION_KEY) === '1') { unlock(); }
    else { lock(); }
  } catch (e) { lock(); }
})();
