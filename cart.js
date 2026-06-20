(function () {
  'use strict';

  var STORAGE_KEY = 'bodytreat_cart';

  // ── State ────────────────────────────────────────────────────────────────────

  function getCart() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (_) { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function cartCount(cart) {
    return cart.reduce(function (s, i) { return s + i.quantity; }, 0);
  }

  function cartTotal(cart) {
    return cart.reduce(function (s, i) { return s + parseFloat(i.price) * i.quantity; }, 0);
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  window.addToCart = function (el) {
    var slug  = el.dataset.slug;
    var name  = el.dataset.name;
    var price = el.dataset.price;
    var image = el.dataset.image;

    var cart = getCart();
    var existing = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].slug === slug) { existing = cart[i]; break; }
    }
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ slug: slug, name: name, price: price, image: image, quantity: 1 });
    }
    saveCart(cart);
    renderCart();
    openCart();

    // Analytics
    if (window._btPixel) window._btPixel.addToCart({ content_ids: [slug], content_name: name, value: parseFloat(price) || 0, currency: 'NZD', content_type: 'product' });
    if (window._btKlaviyo) window._btKlaviyo.track('Added to Cart', { ProductName: name, ProductID: slug, Value: parseFloat(price) || 0, Currency: 'NZD' });

    // Brief button feedback
    var orig = el.textContent;
    el.textContent = 'Added';
    el.disabled = true;
    setTimeout(function () { el.textContent = orig; el.disabled = false; }, 900);
  };

  window._btCart = {
    updateQty: function (index, delta) {
      var cart = getCart();
      if (!cart[index]) return;
      cart[index].quantity = Math.max(1, cart[index].quantity + delta);
      saveCart(cart);
      renderCart();
    },
    removeItem: function (index) {
      var cart = getCart();
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
    },
    closeCart: closeCart,
    checkout:  checkout,
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  function renderCart() {
    var cart  = getCart();
    var count = cartCount(cart);

    // Badge
    var badge = document.getElementById('cart-badge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }

    var itemsEl   = document.getElementById('cart-items');
    var totalEl   = document.getElementById('cart-total');
    var footerEl  = document.getElementById('cart-footer');
    var checkoutBtn = document.getElementById('cart-checkout-btn');
    if (!itemsEl) return;

    if (cart.length === 0) {
      itemsEl.innerHTML =
        '<div class="cart-empty">' +
          '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>' +
          '<p>Your cart is empty</p>' +
          '<a href="products.html" onclick="window._btCart.closeCart()">Browse products</a>' +
        '</div>';
      if (footerEl) footerEl.style.display = 'none';
    } else {
      itemsEl.innerHTML = cart.map(function (item, idx) {
        var lineTotal = (parseFloat(item.price) * item.quantity).toFixed(2);
        return (
          '<div class="cart-item">' +
            '<div class="cart-item-img-wrap">' +
              '<img class="cart-item-img" src="' + escHtml(item.image) + '" alt="' + escHtml(item.name) + '">' +
            '</div>' +
            '<div class="cart-item-info">' +
              '<p class="cart-item-name">' + escHtml(item.name) + '</p>' +
              '<p class="cart-item-price">$' + parseFloat(item.price).toFixed(2) + ' NZD</p>' +
              '<div class="cart-item-qty">' +
                '<button class="cart-qty-btn" onclick="window._btCart.updateQty(' + idx + ', -1)" aria-label="Decrease quantity">−</button>' +
                '<span class="cart-qty-num">' + item.quantity + '</span>' +
                '<button class="cart-qty-btn" onclick="window._btCart.updateQty(' + idx + ', 1)" aria-label="Increase quantity">+</button>' +
              '</div>' +
            '</div>' +
            '<div class="cart-item-right">' +
              '<span class="cart-item-line">$' + lineTotal + '</span>' +
              '<button class="cart-item-remove" onclick="window._btCart.removeItem(' + idx + ')" aria-label="Remove ' + escHtml(item.name) + '">×</button>' +
            '</div>' +
          '</div>'
        );
      }).join('');
      if (footerEl) footerEl.style.display = 'block';
      if (checkoutBtn) { checkoutBtn.disabled = false; checkoutBtn.textContent = 'Checkout'; }
    }

    if (totalEl) totalEl.textContent = '$' + cartTotal(cart).toFixed(2) + ' NZD';
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Drawer open / close ──────────────────────────────────────────────────────

  function openCart() {
    var drawer  = document.getElementById('cart-drawer');
    var overlay = document.getElementById('cart-overlay');
    if (drawer)  drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    var drawer  = document.getElementById('cart-drawer');
    var overlay = document.getElementById('cart-overlay');
    if (drawer)  drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── Checkout ─────────────────────────────────────────────────────────────────

  async function checkout() {
    var cart = getCart();
    if (cart.length === 0) return;

    var btn = document.getElementById('cart-checkout-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Redirecting…'; }

    // Capture optional email
    var emailInput = document.getElementById('cart-email-input');
    var email = (emailInput && emailInput.value.trim()) || '';
    try { if (!email) email = localStorage.getItem('bt_email') || ''; } catch(e){}

    // Store pending cart so success.html can fire Purchase events
    try {
      var total = cartTotal(cart);
      localStorage.setItem('bt_pending_cart', JSON.stringify({ items: cart, total: total, email: email }));
    } catch(e){}

    // Analytics
    if (email && window._btKlaviyo) {
      window._btKlaviyo.identify(email);
      window._btKlaviyo.track('Started Checkout', { Items: cart.map(function(i){ return { ProductName: i.name, ProductID: i.slug, Value: parseFloat(i.price), Quantity: i.quantity }; }), Value: cartTotal(cart), Currency: 'NZD' });
    }
    if (window._btPixel) window._btPixel.initCheckout({ value: cartTotal(cart), currency: 'NZD', num_items: cartCount(cart) });

    try {
      var res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(function (i) { return { slug: i.slug, quantity: i.quantity }; }),
          email: email || undefined,
        }),
      });

      if (!res.ok) {
        var errData = await res.json().catch(function () { return {}; });
        throw new Error(errData.error || 'Checkout failed (' + res.status + ')');
      }

      var data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      if (btn) { btn.disabled = false; btn.textContent = 'Checkout'; }
      alert('Something went wrong: ' + err.message + '\n\nPlease try again or contact us at lovebodytreat@outlook.com');
    }
  }

  // ── DOM injection ────────────────────────────────────────────────────────────

  function injectStyles() {
    var style = document.createElement('style');
    style.textContent = [
      '/* Cart overlay */',
      '#cart-overlay{position:fixed;inset:0;background:rgba(44,26,20,0.55);z-index:200;opacity:0;pointer-events:none;transition:opacity 0.35s ease}',
      '#cart-overlay.open{opacity:1;pointer-events:auto}',

      '/* Cart drawer */',
      '#cart-drawer{position:fixed;top:0;right:0;bottom:0;width:420px;max-width:100vw;z-index:201;display:flex;flex-direction:column;background:#FEF7F4;transform:translateX(100%);transition:transform 0.4s cubic-bezier(0.22,1,0.36,1);box-shadow:-8px 0 40px rgba(44,26,20,0.12)}',
      '#cart-drawer.open{transform:translateX(0)}',

      '/* Cart header */',
      '.cart-header{display:flex;align-items:center;justify-content:space-between;padding:22px 28px 18px;border-bottom:1px solid #E8D4CE;flex-shrink:0}',
      '.cart-header-title{font-family:"Cormorant Garamond",serif;font-size:22px;font-weight:400;color:#2C1A14;letter-spacing:-0.01em}',
      '.cart-header-count{font-family:"Jost",sans-serif;font-size:11px;font-weight:400;letter-spacing:0.14em;text-transform:uppercase;color:#7A5850;margin-left:8px}',
      '.cart-close{background:none;border:none;cursor:pointer;padding:6px;color:#7A5850;display:flex;align-items:center;justify-content:center;transition:color 0.2s ease}',
      '.cart-close:hover{color:#C4897A}',

      '/* Cart items scroll area */',
      '#cart-items{flex:1;overflow-y:auto;padding:0 28px}',
      '#cart-items::-webkit-scrollbar{width:3px}',
      '#cart-items::-webkit-scrollbar-thumb{background:#E8D4CE;border-radius:2px}',

      '/* Cart item */',
      '.cart-item{display:flex;gap:14px;padding:20px 0;border-bottom:1px solid #F0DDD7}',
      '.cart-item-img-wrap{width:72px;height:72px;flex-shrink:0;border-radius:2px;overflow:hidden;background:#F8EDE8}',
      '.cart-item-img{width:100%;height:100%;object-fit:cover;object-position:center}',
      '.cart-item-info{flex:1;min-width:0}',
      '.cart-item-name{font-family:"Cormorant Garamond",serif;font-size:15px;font-weight:400;color:#2C1A14;line-height:1.3;margin-bottom:4px}',
      '.cart-item-price{font-family:"Jost",sans-serif;font-size:12px;font-weight:300;color:#7A5850;margin-bottom:10px}',
      '.cart-item-qty{display:flex;align-items:center;gap:10px}',
      '.cart-qty-btn{background:none;border:1px solid #E8D4CE;width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;color:#3D2218;line-height:1;transition:border-color 0.2s ease,color 0.2s ease;font-family:"Jost",sans-serif;font-weight:300}',
      '.cart-qty-btn:hover{border-color:#C4897A;color:#C4897A}',
      '.cart-qty-num{font-family:"Jost",sans-serif;font-size:13px;font-weight:300;color:#2C1A14;min-width:16px;text-align:center}',
      '.cart-item-right{display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between;flex-shrink:0}',
      '.cart-item-line{font-family:"Cormorant Garamond",serif;font-size:16px;font-weight:400;color:#2C1A14}',
      '.cart-item-remove{background:none;border:none;cursor:pointer;font-size:18px;color:#C4AFAB;padding:2px 4px;line-height:1;transition:color 0.2s ease;font-family:"Jost",sans-serif;font-weight:300}',
      '.cart-item-remove:hover{color:#C4897A}',

      '/* Empty state */',
      '.cart-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:64px 20px;color:#7A5850;text-align:center}',
      '.cart-empty svg{opacity:0.35}',
      '.cart-empty p{font-family:"Jost",sans-serif;font-size:14px;font-weight:300;color:#7A5850;letter-spacing:0.04em}',
      '.cart-empty a{font-size:11px;font-weight:400;letter-spacing:0.18em;text-transform:uppercase;color:#C4897A;text-decoration:none;border-bottom:1px solid #EAC5BB;padding-bottom:2px;transition:color 0.2s ease}',
      '.cart-empty a:hover{color:#A86D5F}',

      '/* Cart footer */',
      '#cart-footer{border-top:1px solid #E8D4CE;padding:20px 28px 28px;flex-shrink:0;background:#FEF7F4}',
      '.cart-total-row{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:6px}',
      '.cart-total-label{font-family:"Jost",sans-serif;font-size:11px;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;color:#7A5850}',
      '#cart-total{font-family:"Cormorant Garamond",serif;font-size:22px;font-weight:400;color:#2C1A14}',
      '.cart-free-ship{font-family:"Jost",sans-serif;font-size:11px;font-weight:300;color:#C4897A;letter-spacing:0.06em;margin-bottom:18px}',
      '#cart-checkout-btn{width:100%;background:#2C1A14;color:#FFFCFB;font-family:"Jost",sans-serif;font-size:11px;font-weight:400;letter-spacing:0.22em;text-transform:uppercase;border:none;padding:17px 24px;cursor:pointer;transition:background 0.3s ease,transform 0.15s ease}',
      '#cart-checkout-btn:hover:not(:disabled){background:#3D2218;transform:translateY(-1px)}',
      '#cart-checkout-btn:disabled{opacity:0.6;cursor:not-allowed}',
      '.cart-email-wrap{margin-bottom:14px}',
      '.cart-email-label{font-family:"Jost",sans-serif;font-size:10px;font-weight:400;letter-spacing:0.14em;text-transform:uppercase;color:#7A5850;display:block;margin-bottom:6px}',
      '#cart-email-input{width:100%;border:1px solid #E8D4CE;background:#FFFCFB;padding:11px 14px;font-family:"Jost",sans-serif;font-size:13px;font-weight:300;color:#2C1A14;outline:none;transition:border-color 0.2s ease;border-radius:0;-webkit-appearance:none;box-sizing:border-box}',
      '#cart-email-input::placeholder{color:#C4AFAB}',
      '#cart-email-input:focus{border-color:#C4897A}',

      '/* Nav cart button */',
      '#nav-right-group{display:flex;align-items:center;gap:16px}',
      '#cart-btn{background:none;border:none;cursor:pointer;display:flex;align-items:center;padding:6px;position:relative;color:#3D2218;transition:color 0.3s ease}',
      '#cart-btn:hover{color:#C4897A}',
      '#cart-btn svg{display:block}',
      '#cart-badge{position:absolute;top:0;right:0;background:#C4897A;color:#FFFCFB;font-family:"Jost",sans-serif;font-size:9px;font-weight:500;min-width:16px;height:16px;border-radius:8px;display:flex;align-items:center;justify-content:center;padding:0 4px;line-height:1}',

      '/* Fix button reset for product buy buttons */',
      'button.product-buy-btn{border:none;cursor:pointer;width:100%}',

      '/* Keep Shop Now text white on hover */',
      '.nav-links .nav-cta:hover{color:#FFFCFB!important}',
      '.nav-links .nav-cta::after{display:none}',

      '/* Hide-on-scroll nav */',
      'nav{transition:transform 0.35s cubic-bezier(0.4,0,0.2,1),padding 0.4s ease!important}',
      'nav.nav-hidden{transform:translateY(-100%)!important}',

      '@media(max-width:480px){',
        '#cart-drawer{width:100vw}',
        '.cart-header{padding:18px 20px 14px}',
        '#cart-items{padding:0 20px}',
        '#cart-footer{padding:16px 20px 24px}',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  function injectCartButton() {
    var nav = document.querySelector('nav');
    if (!nav) return;

    // Move "Shop Now" button into the nav-links list so it sits beside the other items
    var navCta = nav.querySelector('.nav-cta');
    var navLinks = nav.querySelector('.nav-links');
    if (navCta && navLinks) {
      var li = document.createElement('li');
      li.appendChild(navCta);
      navLinks.appendChild(li);
    }

    var btn = document.createElement('button');
    btn.id = 'cart-btn';
    btn.setAttribute('aria-label', 'Open cart');
    btn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>' +
        '<line x1="3" y1="6" x2="21" y2="6"/>' +
        '<path d="M16 10a4 4 0 01-8 0"/>' +
      '</svg>' +
      '<span id="cart-badge" style="display:none">0</span>';
    btn.onclick = openCart;

    // Group cart + hamburger as a single rightmost flex item.
    // Desktop: hamburger hidden → only cart shows.
    // Mobile: nav-links + nav-cta hidden → nav has 2 items (logo | group),
    // so space-between puts group at far right, not stranded in the middle.
    var hamburger = nav.querySelector('.hamburger');
    if (hamburger) {
      var group = document.createElement('div');
      group.id = 'nav-right-group';
      hamburger.parentNode.insertBefore(group, hamburger);
      group.appendChild(btn);
      group.appendChild(hamburger);
    } else {
      nav.appendChild(btn);
    }
  }

  function injectCartDrawer() {
    var overlay = document.createElement('div');
    overlay.id = 'cart-overlay';
    overlay.onclick = closeCart;

    var drawer = document.createElement('div');
    drawer.id = 'cart-drawer';
    drawer.setAttribute('aria-label', 'Shopping cart');
    drawer.innerHTML =
      '<div class="cart-header">' +
        '<div>' +
          '<span class="cart-header-title">Your Cart</span>' +
        '</div>' +
        '<button class="cart-close" onclick="window._btCart.closeCart()" aria-label="Close cart">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>' +
      '<div id="cart-items"></div>' +
      '<div id="cart-footer" style="display:none">' +
        '<div class="cart-total-row">' +
          '<span class="cart-total-label">Subtotal</span>' +
          '<span id="cart-total">$0.00 NZD</span>' +
        '</div>' +
        '<p class="cart-free-ship">Free shipping throughout New Zealand</p>' +
        '<div class="cart-email-wrap">' +
          '<label class="cart-email-label" for="cart-email-input">Email for order updates</label>' +
          '<input id="cart-email-input" type="email" placeholder="your@email.com" autocomplete="email">' +
        '</div>' +
        '<button id="cart-checkout-btn" onclick="window._btCart.checkout()">Checkout</button>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    // Identify to Klaviyo as soon as user types their email
    document.addEventListener('blur', function(e) {
      if (e.target && e.target.id === 'cart-email-input') {
        var email = e.target.value.trim();
        if (email && window._btKlaviyo) window._btKlaviyo.identify(email);
      }
    }, true);
  }

  // ── Init ─────────────────────────────────────────────────────────────────────

  function initScrollNav() {
    var nav = document.querySelector('nav');
    if (!nav) return;
    var lastY = window.scrollY;
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var currentY = window.scrollY;
        var mobileMenuOpen = document.getElementById('mobileMenu') &&
                             document.getElementById('mobileMenu').classList.contains('open');

        if (!mobileMenuOpen) {
          if (currentY > lastY && currentY > 80) {
            nav.classList.add('nav-hidden');
          } else {
            nav.classList.remove('nav-hidden');
          }
        }

        lastY = currentY;
        ticking = false;
      });
    }, { passive: true });
  }

  function initVideoLoop() {
    document.querySelectorAll('video').forEach(function (v) {
      v.addEventListener('ended', function () {
        v.currentTime = 0;
        v.play().catch(function () {});
      });
    });
  }

  function init() {
    injectStyles();
    injectCartButton();
    injectCartDrawer();
    renderCart();
    initScrollNav();
    initVideoLoop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
