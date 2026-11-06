/* Seitenfuß: Ein Klick auf Impressum, Datenschutz oder Lizenz blendet den Text ein,
   ein zweiter Klick oder × blendet ihn wieder aus. */
(function () {
  var knoepfe = document.querySelectorAll('.seitenfuss-verweise button');
  function schliesseAlle() {
    knoepfe.forEach(function (k) {
      k.setAttribute('aria-expanded', 'false');
      document.getElementById(k.getAttribute('aria-controls')).hidden = true;
    });
  }
  knoepfe.forEach(function (k) {
    k.addEventListener('click', function () {
      var war = k.getAttribute('aria-expanded') === 'true';
      schliesseAlle();
      if (!war) {
        var text = document.getElementById(k.getAttribute('aria-controls'));
        k.setAttribute('aria-expanded', 'true');
        text.hidden = false;
        text.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
  document.querySelectorAll('.seitenfuss-zu').forEach(function (z) {
    z.addEventListener('click', schliesseAlle);
  });
})();

/* Menü „Informationen“: schließt bei Klick daneben oder mit Esc */
(function () {
  var menue = document.querySelector('.info-menue');
  if (!menue) return;
  document.addEventListener('click', function (ev) {
    if (menue.open && !menue.contains(ev.target)) menue.open = false;
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && menue.open) { menue.open = false; menue.querySelector('summary').focus(); }
  });
})();
