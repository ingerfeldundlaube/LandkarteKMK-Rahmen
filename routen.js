/* Landkarte: Route wählen.
   Ein Klick auf eine Perspektive färbt die Wege zwischen den Inseln in ihrer Farbe
   und zeigt „Route starten“ (Routen-App) und „Überblick lesen“ (route.html). Ein zweiter Klick (oder Esc) macht die Karte wieder grün. */
(function () {
  var karte = document.querySelector('.karte');
  var knoepfe = document.querySelectorAll('.routen-knoepfe button');
  var start = document.querySelector('.routen-start');
  var lesen = document.querySelector('.routen-lesen');
  var APP = start.getAttribute('href');
  var titel = document.querySelector('.routen-titel');
  if (!karte || !knoepfe.length) return;

  function setze(knopf) {
    knoepfe.forEach(function (k) { k.setAttribute('aria-pressed', String(k === knopf)); });
    if (knopf) {
      karte.setAttribute('data-route', knopf.dataset.route);
      karte.style.setProperty('--routenfarbe', knopf.dataset.farbe);
      start.href = APP + 'route-' + knopf.dataset.route + '/';
      start.hidden = false;
      lesen.href = 'route.html#' + knopf.dataset.route;
      lesen.hidden = false;
      titel.textContent = knopf.dataset.kurz;
      titel.title = 'Route: ' + knopf.dataset.name;
    } else {
      karte.removeAttribute('data-route');
      start.hidden = true;
      lesen.hidden = true;
      titel.textContent = 'Routen durch alle Bereiche';
      titel.removeAttribute('title');
    }
  }

  knoepfe.forEach(function (k) { k.style.setProperty('--farbe', k.dataset.farbe); });
  knoepfe.forEach(function (k) {
    k.addEventListener('click', function () {
      setze(k.getAttribute('aria-pressed') === 'true' ? null : k);
      k.setAttribute('aria-label', k.getAttribute('aria-pressed') === 'true' ? 'Route ' + k.dataset.name + ' beenden' : 'Route ' + k.dataset.name + ' wählen');
    });
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && karte.hasAttribute('data-route')) setze(null);
  });
})();
