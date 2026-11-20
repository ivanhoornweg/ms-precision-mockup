(function () {
  var PRODUCTS = [
    { id: 'optima', cat: 'richtkijkers', series: 'Optima serie', name: 'MS Optima 2.5–15×50 i', sub: 'Verlicht dradenkruis, 30 mm buis', chips: ['2.5–15×', '50 mm', 'SFP'], price: 1249, img: 'scope-optima.jpg', badge: 'Bestseller', rating: '4,8', reviews: 126, stock: 'Op voorraad', tags: ['best'] },
    { id: 'vector', cat: 'richtkijkers', series: 'Vector serie', name: 'MS Vector 5–25×56 FFP', sub: 'Eerste brandvlak, MRAD-torens', chips: ['5–25×', '56 mm', 'FFP'], price: 1689, img: 'scope-tactical.jpg', badge: 'Nieuw', rating: '4,9', reviews: 38, stock: 'Op voorraad', tags: ['best', 'new'] },
    { id: 'hunt', cat: 'richtkijkers', series: 'Hunt serie', name: 'MS Hunt 1.5–9×40', sub: 'Licht en snel, voor drukjacht', chips: ['1.5–9×', '40 mm', '480 g'], price: 749, img: 'scope-hunt.jpg', rating: '4,7', reviews: 84, stock: 'Nog 3 op voorraad', low: true, tags: ['best', 'new'] },
    { id: 'field', cat: 'verrekijkers', series: 'Field serie', name: 'MS Field 10×42 ED', sub: 'ED-glas, 780 gram', chips: ['10×', '42 mm', 'ED'], price: 899, img: 'bino-field.jpg', rating: '4,8', reviews: 61, stock: 'Op voorraad', tags: ['best', 'bino'] },
    { id: 'compact', cat: 'verrekijkers', series: 'Compact serie', name: 'MS Compact 8×32', sub: 'Past in elke jaszak, 520 gram', chips: ['8×', '32 mm', '520 g'], price: 549, img: 'bino-compact.jpg', badge: 'Nieuw', rating: '4,6', reviews: 22, stock: 'Op voorraad', tags: ['new', 'bino'] }
  ];
  window.MS_PRODUCTS = PRODUCTS;
  var eur = function (n) { return '€ ' + n.toLocaleString('nl-NL'); };
  window.MS_EUR = eur;
  var STAR = '<svg width="13" height="13" viewBox="0 0 24 24" fill="#2C3A30" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1L3.2 9.4l6.1-.8z"/></svg>';
  var HEART = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#151814" stroke-width="1.6" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';

  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || '[]'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return []; } }
  function getCart() { return store('ms-cart') || []; }
  function setCart(c) { store('ms-cart', c); updateCount(); }
  window.MS_CART = { get: getCart, set: setCart };
  function updateCount() {
    var n = getCart().reduce(function (a, i) { return a + i.qty; }, 0);
    document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = n; el.style.display = n ? 'flex' : 'none'; });
  }
  updateCount();

  // card renderer (shared)
  window.MS_CARD = function (p) {
    var wish = (store('ms-wish') || []).indexOf(p.id) > -1;
    return '<article class="pcard">' +
      '<a href="product.html?id=' + p.id + '" class="pc-media"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' + (p.badge ? '<span class="pc-badge mono">' + p.badge + '</span>' : '') + '</a>' +
      '<button class="pc-wish' + (wish ? ' on' : '') + '" data-wish="' + p.id + '" aria-label="Bewaar ' + p.name + '" aria-pressed="' + wish + '">' + HEART + '</button>' +
      '<a href="product.html?id=' + p.id + '" class="pc-body">' +
      '<span class="pc-series mono">' + p.series + '</span>' +
      '<span class="pc-name">' + p.name + '</span>' +
      '<span class="chips">' + p.chips.map(function (c) { return '<span class="chip mono">' + c + '</span>'; }).join('') + '</span>' +
      '<span class="pc-rating">' + STAR + STAR + STAR + STAR + STAR + ' ' + p.rating + ' (' + p.reviews + ')</span>' +
      '<span class="pc-foot"><span class="pc-price">' + eur(p.price) + '</span><span class="stock' + (p.low ? ' low' : '') + '">' + p.stock + '</span></span>' +
      '</a>' +
      '<label class="pc-compare"><input type="checkbox" data-compare="' + p.id + '"> Vergelijk</label>' +
      '</article>';
  };
  // wishlist + compare (delegated)
  document.addEventListener('click', function (e) {
    var w = e.target.closest('[data-wish]');
    if (w) {
      e.preventDefault();
      var list = store('ms-wish') || [], id = w.dataset.wish, i = list.indexOf(id);
      if (i > -1) list.splice(i, 1); else list.push(id);
      store('ms-wish', list);
      w.classList.toggle('on', i === -1); w.setAttribute('aria-pressed', i === -1);
      toastMsg(i === -1 ? 'Bewaard op je verlanglijst.' : 'Verwijderd van je verlanglijst.');
    }
  });
  document.addEventListener('change', function (e) {
    if (!e.target.matches('[data-compare]')) return;
    var n = document.querySelectorAll('[data-compare]:checked').length, bar = document.getElementById('compareBar');
    if (bar) { bar.hidden = n === 0; document.getElementById('compareN').textContent = n; }
  });
  var cg = document.getElementById('compareGo');
  if (cg) cg.addEventListener('click', function () { toastMsg('De vergelijkpagina zit nog niet in de mockup.'); });

  // toast
  var toast = document.createElement('div');
  toast.className = 'ms-toast'; toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  var tt;
  function toastMsg(msg) { toast.textContent = msg; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('show'); }, 2600); }
  window.MS_TOAST = toastMsg;

  // advice modal
  var modal = document.createElement('div');
  modal.className = 'ms-modal';
  modal.innerHTML = '<div class="ms-modal-box" role="dialog" aria-modal="true" aria-labelledby="ms-modal-title">' +
    '<button class="ms-modal-close" aria-label="Sluiten">×</button>' +
    '<h2 id="ms-modal-title">Plan een adviesgesprek</h2>' +
    '<p>Laat je gegevens achter. Een specialist belt je binnen één werkdag terug.</p>' +
    '<form><label>Naam<input required></label><label>Telefoonnummer<input type="tel" required></label>' +
    '<label>Waarvoor zoek je een kijker?<select><option>Aanzit en schemering</option><option>Drukjacht</option><option>Lange afstand</option><option>Natuurwaarneming</option></select></label>' +
    '<button type="submit" class="ms-btn">Verstuur aanvraag</button></form></div>';
  document.body.appendChild(modal);
  function openModal() { modal.classList.add('open'); var i = modal.querySelector('input'); if (i) i.focus(); }
  function closeModal() { modal.classList.remove('open'); }
  modal.addEventListener('click', function (e) { if (e.target === modal || e.target.classList.contains('ms-modal-close')) closeModal(); });
  modal.querySelector('form').addEventListener('submit', function (e) { e.preventDefault(); closeModal(); toastMsg('Bedankt, we bellen je binnen één werkdag.'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  // links
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (a.hasAttribute('data-advice') || /specialist|adviesgesprek|Plan een bezoek/i.test(a.textContent)) { e.preventDefault(); openModal(); return; }
    if (href === '#') { e.preventDefault(); toastMsg('Deze pagina zit nog niet in de mockup.'); }
  });
  document.querySelectorAll('.icon-btn[aria-label="Account"], .icon-btn[aria-label="Verlanglijst"]').forEach(function (b) {
    b.addEventListener('click', function () { toastMsg('Dit onderdeel zit nog niet in de mockup.'); });
  });
  var mb = document.querySelector('.menu-btn');
  if (mb) mb.addEventListener('click', function () { document.body.classList.toggle('mobile-nav-open'); });
  var srch = document.querySelector('.search input');
  if (srch) srch.addEventListener('keydown', function (e) { if (e.key === 'Enter') location.href = 'assortiment.html'; });
  var nl = document.getElementById('newsletter');
  if (nl) nl.addEventListener('submit', function (e) { e.preventDefault(); nl.reset(); toastMsg('Je bent aangemeld voor de nieuwsbrief.'); });

  // home: product tabs
  var hp = document.getElementById('homeProducts');
  if (hp) {
    var draw = function (tag) { hp.innerHTML = PRODUCTS.filter(function (p) { return p.tags.indexOf(tag) > -1; }).slice(0, 4).map(window.MS_CARD).join(''); };
    document.querySelectorAll('.tab').forEach(function (t) {
      t.addEventListener('click', function () {
        document.querySelectorAll('.tab').forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
        t.classList.add('is-active'); t.setAttribute('aria-selected', 'true'); draw(t.dataset.tab);
      });
    });
    draw('best');
  }

  // home: quiz
  var qr = document.getElementById('quizResult');
  if (qr) {
    var ans = { type: 'aanzit', dist: 'mid' };
    var pick = function () {
      var id = 'optima', why = 'Een groot objectief en verlicht punt voor de laatste minuten licht.';
      if (ans.type === 'druk' || ans.dist === 'kort') { id = 'hunt'; why = 'Lage vergroting en een ruim beeldveld, zodat je bewegend wild snel oppakt.'; }
      if (ans.type === 'berg' || ans.type === 'sport' || ans.dist === 'lang') { id = 'vector'; why = 'Eerste brandvlak en precieze torens, zodat je op elke afstand juist corrigeert.'; }
      var p = PRODUCTS.filter(function (x) { return x.id === id; })[0];
      qr.innerHTML = '<img src="' + p.img + '" alt=""><div class="qr-text"><span class="mono">Ons advies</span><b>' + p.name + '</b><p>' + why + '</p><div class="btn-row"><a href="product.html?id=' + p.id + '" class="btn btn-dark btn-sm">Bekijk ' + eur(p.price) + '</a><a href="#" data-advice class="btn btn-sm" style="border-color:#D6D0C4">Bespreek met specialist</a></div></div>';
    };
    document.querySelectorAll('.choice-row').forEach(function (row) {
      row.addEventListener('click', function (e) {
        var b = e.target.closest('.choice'); if (!b) return;
        row.querySelectorAll('.choice').forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active'); ans[row.dataset.q] = b.dataset.v; pick();
      });
    });
    pick();
  }

  // product page
  var main = document.getElementById('mainImg');
  if (main) {
    var pid = new URLSearchParams(location.search).get('id') || 'optima';
    var prod = PRODUCTS.filter(function (p) { return p.id === pid; })[0] || PRODUCTS[0];
    document.querySelectorAll('[data-p-name]').forEach(function (el) { el.textContent = prod.name; });
    document.querySelectorAll('[data-p-series]').forEach(function (el) { el.textContent = prod.series; });
    document.querySelectorAll('[data-p-rating]').forEach(function (el) { el.textContent = prod.rating + ' · ' + prod.reviews + ' beoordelingen'; });
    document.title = prod.name + ' | MS Precision';
    var thumbs = document.querySelectorAll('.thumb');
    main.src = prod.img; thumbs[0].dataset.src = prod.img; thumbs[0].querySelector('img').src = prod.img;
    thumbs.forEach(function (t) {
      t.addEventListener('click', function () {
        thumbs.forEach(function (x) { x.classList.remove('is-active'); });
        t.classList.add('is-active'); main.src = t.dataset.src; main.alt = t.getAttribute('aria-label');
      });
    });
    var pills = document.querySelectorAll('.pill[data-ret]'), ret = document.getElementById('reticleName');
    pills.forEach(function (p) {
      p.addEventListener('click', function () {
        pills.forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-pressed', 'false'); });
        p.classList.add('is-active'); p.setAttribute('aria-pressed', 'true'); ret.textContent = p.textContent;
      });
    });
    var qty = 1, mount = document.getElementById('mount'), price = document.getElementById('price');
    var isScope = prod.cat === 'richtkijkers';
    if (!isScope) { document.querySelectorAll('[data-scope-only]').forEach(function (el) { el.style.display = 'none'; }); }
    function render() { document.getElementById('qty').textContent = qty; price.textContent = eur((prod.price + (isScope && mount.checked ? 79 : 0)) * qty); }
    document.getElementById('inc').addEventListener('click', function () { qty++; render(); });
    document.getElementById('dec').addEventListener('click', function () { qty = Math.max(1, qty - 1); render(); });
    mount.addEventListener('change', render); render();
    var add = document.getElementById('addToCart');
    add.addEventListener('click', function () {
      if (add.dataset.done) { location.href = 'winkelmand.html'; return; }
      var c = getCart(), m = isScope && mount.checked;
      var opt = isScope ? ret.textContent + (m ? ', met montage' : '') : '';
      var key = prod.id + '|' + opt, ex = c.filter(function (i) { return i.key === key; })[0];
      if (ex) ex.qty += qty; else c.push({ key: key, id: prod.id, name: prod.name, img: prod.img, opt: opt, price: prod.price + (m ? 79 : 0), qty: qty });
      setCart(c); add.dataset.done = 1; add.textContent = 'Toegevoegd, naar winkelmand';
      toastMsg(prod.name + ' staat in je winkelmand.');
    });
    var rel = document.getElementById('related');
    if (rel) rel.innerHTML = PRODUCTS.filter(function (p) { return p.id !== prod.id; }).slice(0, 4).map(window.MS_CARD).join('');
  }
})();
