(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var widgets = document.querySelectorAll('.skool-floating-widget');
    for (var i = 1; i < widgets.length; i++) {
      widgets[i].parentNode.removeChild(widgets[i]);
    }

    var menu = document.getElementById('mobile-menu');
    if (menu) {
      menu.addEventListener('click', function () {
        menu.classList.remove('open');
      });
    }

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
