(function () {
  var PRODUCTS = [
    { id: 'optima', cat: 'richtkijkers', name: 'MS Optima 2.5–15×50 i', sub: 'Verlicht dradenkruis, 30 mm buis', price: 1249, img: 'scope-optima.jpg', badge: 'Bestseller' },
    { id: 'vector', cat: 'richtkijkers', name: 'MS Vector 5–25×56 FFP', sub: 'Eerste brandvlak, MRAD-torens', price: 1689, img: 'scope-tactical.jpg' },
    { id: 'hunt', cat: 'richtkijkers', name: 'MS Hunt 1.5–9×40', sub: 'Licht en snel, voor drukjacht', price: 749, img: 'scope-hunt.jpg' },
    { id: 'field', cat: 'verrekijkers', name: 'MS Field 10×42 ED', sub: 'ED-glas, 780 gram', price: 899, img: 'bino-field.jpg' },
    { id: 'compact', cat: 'verrekijkers', name: 'MS Compact 8×32', sub: 'Past in elke jaszak, 520 gram', price: 549, img: 'bino-compact.jpg' }
  ];
  window.MS_PRODUCTS = PRODUCTS;
  var eur = function (n) { return '€ ' + n.toLocaleString('nl-NL'); };
  window.MS_EUR = eur;

  // ---------- cart ----------
  function getCart() { try { return JSON.parse(localStorage.getItem('ms-cart') || '[]'); } catch (e) { return []; } }
  function setCart(c) { try { localStorage.setItem('ms-cart', JSON.stringify(c)); } catch (e) {} updateCount(); }
  window.MS_CART = { get: getCart, set: setCart };
  function updateCount() {
    var n = getCart().reduce(function (a, i) { return a + i.qty; }, 0);
    document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = n; el.style.visibility = n ? 'visible' : 'hidden'; });
  }
  updateCount();

  // ---------- toast ----------
  var toast = document.createElement('div');
  toast.className = 'ms-toast'; toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  var tt;
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }
  window.MS_TOAST = showToast;

  // ---------- advice modal ----------
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
  modal.querySelector('form').addEventListener('submit', function (e) { e.preventDefault(); closeModal(); showToast('Bedankt, we bellen je binnen één werkdag.'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  // ---------- link handling ----------
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    var txt = a.textContent.trim();
    if (href === '#advies-form' || /adviesgesprek|specialist/i.test(txt)) { e.preventDefault(); openModal(); return; }
    if (href === '#') {
      e.preventDefault();
      if (a.getAttribute('aria-label') === 'MS Precision home') { location.href = 'index.html'; return; }
      showToast('Deze pagina zit nog niet in de mockup.');
    }
  });
  document.querySelectorAll('button[aria-label="Zoeken"], button[aria-label="Account"], button[aria-label="Vorige"], button[aria-label="Volgende"]').forEach(function (b) {
    b.addEventListener('click', function () { showToast('Dit onderdeel zit nog niet in de mockup.'); });
  });
  var nl = document.getElementById('newsletter');
  if (nl) nl.addEventListener('submit', function (e) { e.preventDefault(); nl.reset(); showToast('Je bent aangemeld voor de nieuwsbrief.'); });

  // ---------- product page ----------
  var main = document.getElementById('mainImg');
  if (main) {
    var id = new URLSearchParams(location.search).get('id') || 'optima';
    var prod = PRODUCTS.filter(function (p) { return p.id === id; })[0] || PRODUCTS[0];
    var h1 = document.querySelector('h1');
    h1.textContent = prod.name;
    document.title = prod.name + ' | MS Precision';
    var crumb = document.querySelector('nav[aria-label="Kruimelpad"] span:last-child');
    if (crumb) crumb.textContent = prod.name;
    var thumbs = document.querySelectorAll('.thumb');
    if (prod.id !== 'optima') { main.src = prod.img; thumbs[0].dataset.src = prod.img; thumbs[0].querySelector('img').src = prod.img; }
    thumbs.forEach(function (t) {
      t.addEventListener('click', function () {
        thumbs.forEach(function (x) { x.classList.remove('is-active'); });
        t.classList.add('is-active'); main.src = t.dataset.src; main.alt = t.getAttribute('aria-label');
      });
    });
    var pills = document.querySelectorAll('.pill');
    var ret = document.getElementById('reticleName');
    pills.forEach(function (p) {
      p.addEventListener('click', function () {
        pills.forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-pressed', 'false'); });
        p.classList.add('is-active'); p.setAttribute('aria-pressed', 'true'); ret.textContent = p.textContent;
      });
    });
    var qty = 1, mount = document.getElementById('mount'), price = document.getElementById('price');
    function render() {
      document.getElementById('qty').textContent = qty;
      price.textContent = eur((prod.price + (mount.checked ? 79 : 0)) * qty);
    }
    document.getElementById('inc').addEventListener('click', function () { qty++; render(); });
    document.getElementById('dec').addEventListener('click', function () { qty = Math.max(1, qty - 1); render(); });
    mount.addEventListener('change', render);
    render();
    var add = document.getElementById('addToCart');
    add.addEventListener('click', function () {
      var c = getCart();
      var opt = (prod.cat === 'richtkijkers' ? ret.textContent : '') + (mount.checked ? (prod.cat === 'richtkijkers' ? ', ' : '') + 'met montage' : '');
      var key = prod.id + '|' + opt;
      var ex = c.filter(function (i) { return i.key === key; })[0];
      if (ex) ex.qty += qty; else c.push({ key: key, id: prod.id, name: prod.name, img: prod.img, opt: opt, price: prod.price + (mount.checked ? 79 : 0), qty: qty });
      setCart(c);
      add.textContent = 'Toegevoegd, naar winkelmand';
      add.onclick = function () { location.href = 'winkelmand.html'; };
      showToast(prod.name + ' staat in je winkelmand.');
    });
    if (prod.cat !== 'richtkijkers') {
      var rb = pills[0] && pills[0].parentNode.parentNode; if (rb) rb.style.display = 'none';
    }
  }
})();
