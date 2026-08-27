(function () {
  'use strict';

  var ACCESS_CODE = '203955';
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

  var debts = window.DEBTS_DATA || null;
  var formalCredits = debts ? debts.formalCredits || [] : [];
  var expSum = window.EXPENSES_DATA ? window.EXPENSES_DATA.summary : null;
  var expItems = window.EXPENSES_DATA ? window.EXPENSES_DATA.items : [];

  function julyMonth() {
    for (var i = 0; i < comboMonths.length; i++) if (comboMonths[i].month.indexOf('Julio') !== -1) return comboMonths[i];
    return null;
  }
  var julio = julyMonth();

  var ingresos = julio ? julio.revenueUSD : 0;
  var gastos = expSum ? (expSum.totalBusinessUSD + expSum.totalPersonalUSD) : 0;
  var saldo = ingresos - gastos;
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
  var gateError = document.getElementById('gate-error');
  var appShell = document.querySelector('.app-shell');

  function unlock() {
    appShell.classList.add('unlocked');
    gate.classList.add('hidden');
    var st = document.getElementById('lock-status-text');
    if (st) st.textContent = 'Sesión privada activa';
  }
  function lock() {
    appShell.classList.remove('unlocked');
    gate.classList.remove('hidden');
    gateInput.value = '';
    if (gateError) gateError.textContent = '';
    var st = document.getElementById('lock-status-text');
    if (st) st.textContent = 'Panel bloqueado';
  }
  function tryUnlock() {
    var v = gateInput.value.trim();
    if (!v) { gateError.textContent = 'Ingresa el código de acceso.'; return; }
    if (v === ACCESS_CODE) { gateError.textContent = ''; unlock(); }
    else {
      gateError.textContent = 'Código incorrecto. Inténtalo de nuevo.';
      var card = document.getElementById('gate-card');
      card.classList.remove('gate-shake'); void card.offsetWidth; card.classList.add('gate-shake');
    }
  }
  document.getElementById('gate-btn').addEventListener('click', tryUnlock);
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
    document.getElementById('hero-saldo').textContent = fmtUSD(saldo);
    var growth = document.getElementById('hero-growth');
    growth.innerHTML = '↑ +18.4% vs. mes anterior';
    growth.className = 'hero-growth up';

    var pctEl = document.getElementById('meta-pct');
    pctEl.textContent = metaPct + '%';
    document.getElementById('meta-sub').textContent = fmtUSD(saldo) + ' de ' + fmtUSD(META) + ' alcanzados';
    var ring = document.getElementById('meta-ring-fill');
    var dash = Math.max(0, Math.min(314, (metaPct / 100) * 314));
    ring.setAttribute('stroke-dashoffset', (314 - dash).toFixed(1));
  }

  function renderMinis() {
    document.getElementById('mini-ingresos').textContent = fmtUSD(ingresos);
    document.getElementById('mini-gastos').textContent = fmtUSD(gastos);
    document.getElementById('mini-deudas').textContent = fmtPEN(deudasMes);
  }

  function renderFlowChart() {
    var el = document.getElementById('chart-flow');
    if (!el || !comboMonths.length) return;
    var W = 560, H = 220, padT = 24, padB = 30, padL = 46, padR = 12;
    var innerW = W - padL - padR, innerH = H - padT - padB;
    var data = comboMonths.map(function (m) {
      return { label: m.month.split(' ')[0], inc: m.revenueUSD, exp: (m.adsUSD || 0) + (m.toolsUSD || 0) };
    });
    var max = 1;
    data.forEach(function (d) { max = Math.max(max, d.inc, d.exp); });
    var stepX = innerW / Math.max(1, data.length - 1);
    function pt(v) { return padT + innerH - (v / max) * innerH; }
    function line(key, color) {
      var d = '';
      data.forEach(function (p, i) { d += (i ? ' L ' : 'M ') + (padL + stepX * i).toFixed(1) + ' ' + pt(p[key]).toFixed(1); });
      return '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />';
    }
    var grid = '';
    for (var g = 0; g <= 4; g++) {
      var v = max * (g / 4), gy = pt(v);
      grid += '<line x1="' + padL + '" y1="' + gy + '" x2="' + (W - padR) + '" y2="' + gy + '" stroke="rgba(255,255,255,0.05)"/>';
      grid += '<text x="' + (padL - 6) + '" y="' + (gy + 3) + '" fill="#7A8580" font-size="9" text-anchor="end" font-family="JetBrains Mono, monospace">' + fmtUSD(v) + '</text>';
    }
    var labels = data.map(function (d, i) {
      return '<text x="' + (padL + stepX * i) + '" y="' + (H - 8) + '" fill="#7A8580" font-size="10" text-anchor="middle">' + esc(d.label) + '</text>';
    }).join('');
    var dots = data.map(function (d, i) {
      return '<circle cx="' + (padL + stepX * i) + '" cy="' + pt(d.inc) + '" r="3.5" fill="#55F58A" data-tip="' + esc(d.label + ' · Ingresos ' + fmtUSD(d.inc)) + '"/>' +
        '<circle cx="' + (padL + stepX * i) + '" cy="' + pt(d.exp) + '" r="3.5" fill="#FFB020" data-tip="' + esc(d.label + ' · Gastos ' + fmtUSD(d.exp)) + '"/>';
    }).join('');
    el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" style="width:100%;height:auto;">' + grid + line('exp', '#FFB020') + line('inc', '#55F58A') + dots + labels + '</svg>';
  }

  function renderCategoryBars() {
    var el = document.getElementById('chart-cat');
    if (!el) return;
    var catMap = { 'Ads': 0, 'SaaS': 0, 'Personal': 0, 'Operación': 0 };
    var adsKeys = ['MARKETING', 'FACEBOOK', 'ADS'];
    var saasKeys = ['IA', 'SAAS', 'CLOUD', 'EMAIL', 'EDUCACI', 'COMUNIDAD', 'INFRA', 'GOOGLE', 'OPENAI', 'CHATGPT', 'CLAUDE', 'SKOOL'];
    var persKeys = ['ALIMENT', 'DELIVERY', 'ENTRETEN', 'COMPRAS', 'RETAIL', 'TRANSPORT', 'VIAJES', 'CINE'];
    expItems.forEach(function (it) {
      var u = (it.desc + ' ' + it.cat).toUpperCase();
      if (adsKeys.some(function (k) { return u.indexOf(k) !== -1; })) catMap['Ads'] += it.usd;
      else if (saasKeys.some(function (k) { return u.indexOf(k) !== -1; })) catMap['SaaS'] += it.usd;
      else if (persKeys.some(function (k) { return u.indexOf(k) !== -1; })) catMap['Personal'] += it.usd;
      else catMap['Operación'] += it.usd;
    });
    var colors = { 'Ads': '#FFB020', 'SaaS': '#18B875', 'Personal': '#4FD1FF', 'Operación': '#8A9490' };
    var keys = Object.keys(catMap).sort(function (a, b) { return catMap[b] - catMap[a]; });
    var max = Math.max(1, keys.reduce(function (a, k) { return Math.max(a, catMap[k]); }, 0));
    var html = '<div class="cat-bars">';
    keys.forEach(function (k) {
      var pct = Math.round((catMap[k] / max) * 100);
      html += '<div class="cat-row">' +
        '<div class="cat-head"><span>' + k + '</span><span style="color:' + colors[k] + ';font-family:JetBrains Mono,monospace;font-weight:700;">' + fmtUSD(catMap[k]) + '</span></div>' +
        '<div class="cat-track"><div class="cat-fill" style="width:' + pct + '%;background:' + colors[k] + ';"></div></div>' +
        '</div>';
    });
    html += '</div>';
    el.innerHTML = html;
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

  function renderMovements() {
    var el = document.getElementById('mov-table');
    var countEl = document.getElementById('mov-count');
    if (!el) return;
    var rows = [];
    comboMonths.forEach(function (m) {
      rows.push({ name: 'Combo IA — Hotmart', cat: 'Ingresos', date: m.month, usd: m.revenueUSD, type: 'inc' });
    });
    expItems.slice().reverse().slice(0, 12).forEach(function (it) {
      rows.push({ name: it.desc, cat: it.cat, date: it.date, usd: it.usd, type: 'exp', pen: it.pen });
    });
    var html = '<table class="tbl"><thead><tr><th>Movimiento</th><th>Categoría</th><th>Fecha</th><th>Monto</th></tr></thead><tbody>';
    rows.forEach(function (r) {
      html += '<tr>' +
        '<td class="cell-title">' + esc(r.name) + '</td>' +
        '<td>' + esc(r.cat) + '</td>' +
        '<td>' + esc(r.date) + '</td>' +
        '<td class="' + (r.type === 'inc' ? 'amt-inc' : 'amt-exp') + '">' + (r.type === 'inc' ? '+' : '−') + fmtUSD(r.usd) + '</td>' +
        '</tr>';
    });
    html += '</tbody></table>';
    el.innerHTML = html;
    if (countEl) countEl.textContent = rows.length + ' movimientos';
  }

  function renderAssets() {
    var el = document.getElementById('assets-value');
    var bars = document.getElementById('assets-bars');
    if (el) el.textContent = fmtPEN(disponible);
    if (bars) {
      var max = Math.max(disponible, warda);
      bars.innerHTML =
        '<div class="ab-row"><div class="ab-head"><span>Disponible en cuentas</span><span>' + fmtPEN(disponible) + '</span></div>' +
        '<div class="ab-track"><div class="ab-fill" style="width:' + Math.round(disponible / max * 100) + '%"></div></div></div>' +
        '<div class="ab-row"><div class="ab-head"><span>Ahorro Warda BCP</span><span>' + fmtPEN(warda) + '</span></div>' +
        '<div class="ab-track"><div class="ab-fill" style="width:' + Math.round(warda / max * 100) + '%;background:var(--amber);"></div></div></div>';
    }
  }

  function renderResumen() {
    renderHero();
    renderMinis();
    renderFlowChart();
    renderCategoryBars();
    renderWeekActions();
    renderMovements();
    renderAssets();
  }

  // ============================================================
  // VISTAS SECUNDARIAS
  // ============================================================
  function renderIngresos() {
    var tb = document.getElementById('ingresos-tbody');
    if (!tb) return;
    tb.innerHTML = comboMonths.map(function (m) {
      return '<tr><td class="cell-title">' + esc(m.month) + '</td>' +
        '<td class="amt-inc">' + fmtUSD(m.revenueUSD) + '</td>' +
        '<td style="color:var(--amber);font-family:JetBrains Mono,monospace;">−' + fmtUSD(m.adsUSD) + '</td>' +
        '<td style="color:var(--green);font-family:JetBrains Mono,monospace;font-weight:700;">' + fmtUSD(m.profitUSD) + '</td>' +
        '<td style="font-family:JetBrains Mono,monospace;">' + m.roas.toFixed(2) + 'x</td></tr>';
    }).join('');
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
        return '<tr><td class="cell-title">' + esc(c.name) + '</td>' +
          '<td style="color:var(--red);font-family:JetBrains Mono,monospace;font-weight:700;">S/ ' + c.monthlyFeePEN.toLocaleString() + ' <span class="usd-mini">≈ ' + usdEquiv(c.monthlyFeePEN) + ' USD</span></td>' +
          '<td>Día ' + c.dueDateDay + '</td>' +
          '<td>' + c.remainingQuota + ' cuotas</td>' +
          '<td>' + esc(c.range) + '</td>' +
          '<td style="color:var(--amber);font-family:JetBrains Mono,monospace;font-weight:800;">S/ ' + c.pendingBalancePEN.toLocaleString() + ' <span class="usd-mini">≈ ' + usdEquiv(c.pendingBalancePEN) + ' USD</span></td></tr>';
      }).join('');
      if (tot) tot.textContent = 'Compromiso S/ ' + deudasMes.toLocaleString() + ' ≈ ' + usdEquiv(deudasMes) + ' USD · Saldo formal S/ ' + totalPend.toLocaleString();
    }
    if (banner) {
      banner.innerHTML = '<span style="font-size:18px;">🚨</span><div><b>ALERTA SEPTIEMBRE 2026:</b> caen juntas las 4 cuotas de créditos (días 2, 11 y 19) por <b>S/ 6,971</b> + <b>S/ 2,000</b> de junta = <b>S/ 8,971</b> <span class="usd-mini">(≈ $2,392 USD)</span>.</div>';
    }
  }

  function renderMetas() {
    var grid = document.getElementById('metas-grid');
    if (!grid) return;
    var falta = Math.max(0, META - saldo);
    var cards = [
      { t: 'Meta de saldo neto', v: metaPct + '%', s: fmtUSD(saldo) + ' de ' + fmtUSD(META), p: metaPct },
      { t: 'Ahorro mensual', v: falta > 0 ? 'Faltan US$ ' + falta.toLocaleString('en-US') : '¡Meta cumplida!', s: 'Estás al ' + metaPct + '%', p: metaPct },
      { t: 'Ahorro Warda BCP', v: fmtPEN(warda), s: 'En ahorro e inversión', p: 100 }
    ];
    grid.innerHTML = cards.map(function (c) {
      return '<div class="meta-card"><h4>' + c.t + '</h4><div class="mc-value">' + c.v + '</div><div class="mc-sub">' + c.s + '</div><div class="mc-progress"><div class="mc-fill" style="width:' + Math.min(100, c.p) + '%"></div></div></div>';
    }).join('');
  }

  function renderReportes() {
    var tb = document.getElementById('reportes-tbody');
    if (!tb) return;
    tb.innerHTML = comboMonths.map(function (m) {
      var g = (m.adsUSD || 0) + (m.toolsUSD || 0) + (m.withdrawalsUSD || 0);
      var s = m.revenueUSD - g;
      var ok = s >= 0;
      return '<tr><td class="cell-title">' + esc(m.month) + '</td>' +
        '<td class="amt-inc">' + fmtUSD(m.revenueUSD) + '</td>' +
        '<td style="color:var(--amber);font-family:JetBrains Mono,monospace;">−' + fmtUSD(g) + '</td>' +
        '<td style="font-family:JetBrains Mono,monospace;font-weight:700;color:' + (ok ? 'var(--green)' : 'var(--red)') + ';">' + fmtUSD(s) + '</td>' +
        '<td style="font-family:JetBrains Mono,monospace;">' + m.roas.toFixed(2) + 'x</td>' +
        '<td><span class="usd-mini" style="color:' + (ok ? 'var(--green)' : 'var(--red)') + ';font-weight:700;">' + (ok ? 'Positivo' : 'Revisar') + '</span></td></tr>';
    }).join('');
  }

  // ============================================================
  // NAVEGACIÓN
  // ============================================================
  var NAV_TITLES = {
    resumen: 'Resumen financiero',
    ingresos: 'Ingresos',
    gastos: 'Gastos',
    deudas: 'Deudas',
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
    sel.innerHTML = '<option value="0">Julio 2026</option>';
    sel.value = '0';
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

  // ============================================================
  // INIT
  // ============================================================
  buildMonthSelect();
  bindAgent();
  renderResumen();
  switchTab('resumen');
  lock();
})();
