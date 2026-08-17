(function () {
  function initSkoolPopup() {
    if (sessionStorage.getItem('skool_popup_closed') === 'true') {
      return;
    }
    if (document.getElementById('skool-popup')) {
      return;
    }

    var popup = document.createElement('div');
    popup.id = 'skool-popup';
    popup.className = 'skool-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-label', 'Comunidad Skool Vende en Automático');

    popup.innerHTML =
      '<button class="skool-popup-close" id="skool-popup-close" aria-label="Cerrar popup">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
      '</button>' +
      '<div class="skool-popup-badge">' +
        '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<rect width="28" height="28" rx="8" fill="url(#sk-badge-grad)"/>' +
          '<text x="14" y="19" font-family="-apple-system, BlinkMacSystemFont, \'Space Grotesk\', sans-serif" font-size="16" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="-0.5px">sk</text>' +
          '<defs>' +
            '<linearGradient id="sk-badge-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">' +
              '<stop stop-color="#00d2ff"/>' +
              '<stop offset="1" stop-color="#0066ff"/>' +
            '</linearGradient>' +
          '</defs>' +
        '</svg>' +
      '</div>' +
      '<div class="skool-popup-header">' +
        '<div class="skool-popup-title">' +
          '<span class="skool-popup-lightning">⚡</span> Únete a VENDE EN AUTOMÁTICO' +
        '</div>' +
      '</div>' +
      '<p class="skool-popup-desc">' +
        'Aprende paso a paso a vender productos digitales <strong>Low Ticket</strong> usando <strong>Meta Ads, WhatsApp + IA</strong>.' +
      '</p>' +
      '<a href="https://www.skool.com/vende-en-automatico-vip-8874/" target="_blank" rel="noopener noreferrer" class="skool-popup-btn">' +
        '<span>Unirme Ahora</span>' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>' +
      '</a>';

    document.body.appendChild(popup);

    var closeBtn = document.getElementById('skool-popup-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        popup.classList.add('skool-popup-hidden');
        sessionStorage.setItem('skool_popup_closed', 'true');
        setTimeout(function () {
          if (popup && popup.parentNode) {
            popup.parentNode.removeChild(popup);
          }
        }, 350);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var menu = document.getElementById('mobile-menu');
    if (menu) {
      menu.addEventListener('click', function () {
        menu.classList.remove('open');
      });
    }

    initSkoolPopup();

    if (!('IntersectionObserver' in window)) {
      return;
    }

    var els = document.querySelectorAll('.card, .tool-card, .list-item, .resource-card, .case-card, .book-card, .notes-cta');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });
  });
})();
