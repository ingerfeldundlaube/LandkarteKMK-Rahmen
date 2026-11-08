/* Routenseite: alle sechs Kompetenzbereiche aus einer Perspektive.
   Die Inhalte kommen aus der Reflexionskarten-App (immer aktueller Stand).
   Ist sie nicht erreichbar, wird die mitgelieferte Kopie daten/karten.json verwendet. */
(function () {
  var QUELLEN = [
    'https://ingerfeldundlaube.github.io/KI-Kompetenzen/daten/karten.json',
    'daten/karten.json',
  ];
  var STUFEN = ['Grundlegend', 'Fortgeschritten', 'Vertieft'];
  var BEREICHE = window.ROUTE_BEREICHE;
  var PERSP = window.ROUTE_PERSPEKTIVEN;
  var inhalt = document.getElementById('route-inhalt');
  var stationen = document.querySelector('.stationen');
  var daten = null;

  function el(tag, klasse, text) {
    var e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function laden(i) {
    if (i >= QUELLEN.length) return Promise.reject(new Error('keine Quelle erreichbar'));
    return fetch(QUELLEN[i], { cache: 'no-cache' })
      .then(function (a) { if (!a.ok) throw new Error(a.status); return a.json(); })
      .catch(function () { return laden(i + 1); });
  }

  function aktuellePerspektive() {
    var key = (location.hash || '').slice(1);
    return PERSP.find(function (p) { return p.key === key; }) || PERSP[0];
  }

  function zeichne() {
    var p = aktuellePerspektive();
    document.documentElement.style.setProperty('--routenfarbe', p.farbe);
    document.getElementById('route-titel').textContent = 'Route: ' + p.name;
    document.title = 'Route: ' + p.name + ' – Kompetenzen in der digitalen Welt';
    document.querySelectorAll('.route-reiter a').forEach(function (a) {
      if (a.dataset.route === p.key) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    if (!daten) return;

    // Stationsleiste
    stationen.textContent = '';
    BEREICHE.forEach(function (b) {
      var k = el('button', 'station-knopf');
      k.type = 'button';
      k.innerHTML = '<span class="station-nr"></span><span class="station-name"></span>';
      k.querySelector('.station-nr').textContent = b.nr;
      k.querySelector('.station-name').textContent = b.titel;
      k.addEventListener('click', function () {
        document.getElementById('station-' + b.nr).scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      stationen.appendChild(k);
    });

    // Stationen
    inhalt.textContent = '';
    BEREICHE.forEach(function (b) {
      var s = el('section', 'station');
      s.id = 'station-' + b.nr;
      var kopf = el('header', 'station-kopf');
      kopf.appendChild(el('span', 'nummer', b.nr));
      var t = el('div');
      t.appendChild(el('div', 'station-label', 'Station ' + b.nr + ' von ' + BEREICHE.length));
      t.appendChild(el('h2', '', b.titel));
      t.appendChild(el('p', 'unterzeile', b.untertitel));
      kopf.appendChild(t);
      s.appendChild(kopf);

      b.teil.forEach(function (teil) {
        var karte = daten.karten[teil.nr];
        var box = el('article', 'route-karte');
        box.appendChild(el('h3', '', teil.nr + ' ' + teil.titel));
        if (!karte) {
          box.appendChild(el('p', 'hinweis', 'Für diese Karte liegen noch keine Inhalte vor.'));
          s.appendChild(box);
          return;
        }
        // Entwicklungsraster dieser Perspektive
        box.appendChild(el('h4', '', 'Entwicklungsraster'));
        var raster = el('ol', 'route-raster');
        (karte.raster[p.key] || []).forEach(function (text, i) {
          var li = el('li');
          li.appendChild(el('span', 'stufe', (i + 1) + ' ' + STUFEN[i]));
          li.appendChild(el('span', '', text));
          raster.appendChild(li);
        });
        box.appendChild(raster);
        // Reflexionsanlässe
        box.appendChild(el('h4', '', 'Reflexionsanlässe'));
        var fragen = el('ul', 'route-fragen');
        (karte.reflexionsanlaesse[p.key] || []).forEach(function (f) { fragen.appendChild(el('li', '', f)); });
        box.appendChild(fragen);
        // Entwicklungsimpulse dieser Perspektive
        var impulse = (karte.impulse || []).filter(function (i) { return i.perspektiven.indexOf(p.key) !== -1; });
        if (impulse.length) {
          box.appendChild(el('h4', '', 'Entwicklungsimpulse'));
          var liste = el('ul', 'route-impulse');
          impulse.forEach(function (i) { liste.appendChild(el('li', '', i.text)); });
          box.appendChild(liste);
        }
        s.appendChild(box);
      });

      // Weiter zur nächsten Station
      var naechste = BEREICHE[BEREICHE.indexOf(b) + 1];
      if (naechste) {
        var w = el('button', 'weiter-station', 'Weiter zu Station ' + naechste.nr + ': ' + naechste.titel + ' ↓');
        w.type = 'button';
        w.addEventListener('click', function () {
          document.getElementById('station-' + naechste.nr).scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        s.appendChild(w);
      } else {
        var ziel = el('p', 'route-ziel');
        ziel.innerHTML = '<strong>Ziel erreicht.</strong> Mit den Reflexionskarten weiterarbeiten: <a></a>';
        var a = ziel.querySelector('a');
        a.href = window.ROUTE_APP;
        a.textContent = 'Reflexionskarten öffnen';
        s.appendChild(ziel);
      }
      inhalt.appendChild(s);
    });
    document.querySelector('.route-quelle').textContent =
      'Inhalte: Reflexionskarten zum ' + (daten.quelle || 'KMK-Kompetenzrahmen') + (daten.stand ? ', Stand ' + daten.stand : '') + '.';
  }

  window.addEventListener('hashchange', function () { zeichne(); window.scrollTo(0, 0); });
  zeichne();
  laden(0).then(function (d) { daten = d; zeichne(); }).catch(function () {
    inhalt.innerHTML = '<p class="platzhalter">Die Inhalte der Route konnten nicht geladen werden. Bitte später erneut versuchen.</p>';
  });
})();
