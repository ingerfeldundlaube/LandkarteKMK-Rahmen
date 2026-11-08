/* Landkarte: Route wählen.
   Ein Klick auf eine Perspektive färbt den Rundweg zwischen den Inseln in ihrer Farbe
   und zeigt „Route starten“. Ein zweiter Klick (oder Esc) macht die Karte wieder grün. */
(function () {
  var karte = document.querySelector('.karte');
  var knoepfe = document.querySelectorAll('.routen-knoepfe button');
  var start = document.querySelector('.routen-start');
  var titel = document.querySelector('.routen-titel');
  if (!karte || !knoepfe.length) return;

  function setze(knopf) {
    knoepfe.forEach(function (k) { k.setAttribute('aria-pressed', String(k === knopf)); });
    if (knopf) {
      karte.setAttribute('data-route', knopf.dataset.route);
      karte.style.setProperty('--routenfarbe', knopf.dataset.farbe);
      start.href = 'route.html#' + knopf.dataset.route;
      start.hidden = false;
      titel.textContent = 'Route: ' + knopf.dataset.name;
    } else {
      karte.removeAttribute('data-route');
      start.hidden = true;
      titel.textContent = 'Route durch alle Bereiche';
    }
  }

  knoepfe.forEach(function (k) {
    k.addEventListener('click', function () {
      setze(k.getAttribute('aria-pressed') === 'true' ? null : k);
    });
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && karte.hasAttribute('data-route')) setze(null);
  });
})();
