/* ================================================================
   analytics.js — Bodytreat
   Meta Pixel · Klaviyo · Cookie Consent · Newsletter Popup

   SETUP: fill in the three values below, then deploy.
   ================================================================ */

(function () {
  'use strict';

  // ── CONFIG ────────────────────────────────────────────────────────
  var PIXEL_ID      = 'YOUR_META_PIXEL_ID';       // Meta Business Manager → Events Manager → Create Pixel
  var KL_PUBLIC_KEY = 'YOUR_KLAVIYO_PUBLIC_KEY';  // Klaviyo → Settings → API Keys → Public API Key
  var KL_LIST_ID    = 'YOUR_KLAVIYO_LIST_ID';     // Klaviyo → Lists & Segments → your list → List ID
  // ─────────────────────────────────────────────────────────────────

  var LS_CONSENT  = 'bt_consent';   // 'yes' when accepted
  var LS_NL_DONE  = 'bt_nl_done';   // 'subscribed' | 'dismissed'
  var LS_NL_COUNT = 'bt_nl_count';  // times popup has shown
  var LS_EMAIL    = 'bt_email';     // cached customer email

  function hasConsent()   { try { return localStorage.getItem(LS_CONSENT) === 'yes'; } catch(e){ return false; } }
  function grantConsent() { try { localStorage.setItem(LS_CONSENT, 'yes'); } catch(e){} }

  // ================================================================
  // META PIXEL
  // ================================================================
  function loadPixel() {
    if (window._btPixelLoaded || PIXEL_ID === 'YOUR_META_PIXEL_ID') return;
    window._btPixelLoaded = true;
    /* jshint ignore:start */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* jshint ignore:end */
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }

  // Public API — called by cart.js and success.html
  window._btPixel = {
    viewContent:  function(d){ if(window.fbq) fbq('track', 'ViewContent', d); },
    addToCart:    function(d){ if(window.fbq) fbq('track', 'AddToCart', d); },
    initCheckout: function(d){ if(window.fbq) fbq('track', 'InitiateCheckout', d); },
    purchase:     function(d){ if(window.fbq) fbq('track', 'Purchase', d); },
  };

  // ================================================================
  // KLAVIYO
  // ================================================================
  function loadKlaviyo() {
    if (window._btKlLoaded || KL_PUBLIC_KEY === 'YOUR_KLAVIYO_PUBLIC_KEY') return;
    window._btKlLoaded = true;
    window._learnq = window._learnq || [];
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=' + KL_PUBLIC_KEY;
    document.head.appendChild(s);
  }

  function klPush(cmd, a, b) {
    window._learnq = window._learnq || [];
    window._learnq.push(b !== undefined ? [cmd, a, b] : [cmd, a]);
  }

  window._btKlaviyo = {
    identify: function(email, firstName) {
      if (!email) return;
      try { localStorage.setItem(LS_EMAIL, email); } catch(e){}
      var p = { '$email': email };
      if (firstName) p['$first_name'] = firstName;
      klPush('identify', p);
    },
    track: function(event, props) {
      klPush('track', event, props || {});
    },
    subscribe: function(email, onSuccess, onError) {
      if (KL_LIST_ID === 'YOUR_KLAVIYO_LIST_ID' || KL_PUBLIC_KEY === 'YOUR_KLAVIYO_PUBLIC_KEY') {
        if (onError) onError(new Error('Klaviyo not configured'));
        return;
      }
      fetch('https://a.klaviyo.com/client/subscriptions/?company_id=' + KL_PUBLIC_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'revision': '2023-12-15' },
        body: JSON.stringify({
          data: {
            type: 'subscription',
            attributes: {
              custom_source: 'Website Newsletter Popup',
              profile: { data: { type: 'profile', attributes: { email: email } } }
            },
            relationships: { list: { data: { type: 'list', id: KL_LIST_ID } } }
          }
        })
      }).then(function(r) {
        if (r.ok || r.status === 202) { if (onSuccess) onSuccess(); }
        else { if (onError) onError(new Error('Status ' + r.status)); }
      }).catch(function(e) { if (onError) onError(e); });
    }
  };

  // ================================================================
  // COOKIE CONSENT BANNER
  // ================================================================
  function showConsentBanner() {
    loadKlaviyo(); // always load for email features (not advertising)

    if (hasConsent()) {
      loadPixel();
      return;
    }

    var css = document.createElement('style');
    css.textContent =
      '#bt-cb{position:fixed;bottom:0;left:0;right:0;z-index:8000;background:rgba(44,26,20,0.97);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);padding:16px 40px;transform:translateY(100%);transition:transform 0.4s cubic-bezier(0.22,1,0.36,1)}' +
      '#bt-cb.bt-in{transform:none}' +
      '.bt-cb-wrap{max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:20px;flex-wrap:wrap}' +
      '.bt-cb-txt{font-family:"Jost",sans-serif;font-size:12px;font-weight:300;color:rgba(255,252,251,0.72);line-height:1.65;flex:1;min-width:220px}' +
      '.bt-cb-txt a{color:#EAC5BB;text-underline-offset:3px}' +
      '.bt-cb-btns{display:flex;gap:10px;flex-shrink:0}' +
      '.bt-cb-btn{font-family:"Jost",sans-serif;font-size:11px;font-weight:400;letter-spacing:0.14em;text-transform:uppercase;border:none;padding:10px 18px;cursor:pointer;line-height:1;transition:background 0.2s ease,color 0.2s ease}' +
      '.bt-cb-yes{background:#C4897A;color:#FFFCFB}' +
      '.bt-cb-yes:hover{background:#A86D5F}' +
      '.bt-cb-no{background:transparent;color:rgba(255,252,251,0.42);border:1px solid rgba(255,252,251,0.15)}' +
      '.bt-cb-no:hover{color:rgba(255,252,251,0.75)}' +
      '@media(max-width:600px){#bt-cb{padding:14px 20px}}';
    document.head.appendChild(css);

    var el = document.createElement('div');
    el.id = 'bt-cb';
    el.innerHTML =
      '<div class="bt-cb-wrap">' +
        '<p class="bt-cb-txt">We use cookies to personalise your experience and show you relevant ads. ' +
        'By clicking "Accept all" you consent to this use. See our <a href="/terms.html#cookies">Cookie Policy</a> for details.</p>' +
        '<div class="bt-cb-btns">' +
          '<button class="bt-cb-btn bt-cb-yes" id="bt-cb-yes">Accept all</button>' +
          '<button class="bt-cb-btn bt-cb-no" id="bt-cb-no">Essential only</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);
    setTimeout(function(){ el.classList.add('bt-in'); }, 300);

    function dismiss(accepted) {
      if (accepted) grantConsent();
      el.classList.remove('bt-in');
      setTimeout(function(){ if (el.parentNode) el.parentNode.removeChild(el); }, 450);
    }

    document.getElementById('bt-cb-yes').addEventListener('click', function(){ dismiss(true);  loadPixel(); });
    document.getElementById('bt-cb-no').addEventListener('click',  function(){ dismiss(false); });
  }

  // ================================================================
  // NEWSLETTER POPUP
  // ================================================================
  function initNewsletter() {
    try { if (localStorage.getItem(LS_NL_DONE)) return; } catch(e){ return; }
    if (/success|cancel/.test(window.location.pathname)) return;

    var count = 0;
    try { count = parseInt(localStorage.getItem(LS_NL_COUNT) || '0', 10); } catch(e){}
    var delay = count === 0 ? 12000 : 30000;

    setTimeout(function(){
      try { if (localStorage.getItem(LS_NL_DONE)) return; } catch(e){}
      showNewsletter();
    }, delay);
  }

  function showNewsletter() {
    var css = document.createElement('style');
    css.textContent =
      '#bt-nl-bg{position:fixed;inset:0;background:rgba(44,26,20,0.5);z-index:7000;display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity 0.35s ease}' +
      '#bt-nl-bg.bt-in{opacity:1}' +
      '#bt-nl-box{background:#FEF7F4;max-width:456px;width:100%;padding:52px 44px 40px;position:relative;text-align:center;opacity:0;transform:translateY(14px);transition:opacity 0.35s ease 0.06s,transform 0.35s ease 0.06s}' +
      '#bt-nl-bg.bt-in #bt-nl-box{opacity:1;transform:none}' +
      '#bt-nl-x{position:absolute;top:14px;right:16px;background:none;border:none;font-size:22px;line-height:1;color:#C4AFAB;cursor:pointer;padding:4px 6px;font-family:"Jost",sans-serif;font-weight:300;transition:color 0.2s ease}' +
      '#bt-nl-x:hover{color:#C4897A}' +
      '.bt-nl-eye{font-family:"Jost",sans-serif;font-size:10px;font-weight:400;letter-spacing:0.32em;text-transform:uppercase;color:#C4897A;display:block;margin-bottom:14px}' +
      '.bt-nl-h{font-family:"Cormorant Garamond",serif;font-size:clamp(26px,4vw,34px);font-weight:300;line-height:1.12;letter-spacing:-0.01em;color:#2C1A14;margin-bottom:12px}' +
      '.bt-nl-h em{font-style:italic;color:#C4897A}' +
      '.bt-nl-p{font-family:"Jost",sans-serif;font-size:13px;font-weight:300;color:#7A5850;line-height:1.65;margin:0 auto 26px;max-width:300px}' +
      '#bt-nl-f{display:flex;flex-direction:column;gap:10px}' +
      '#bt-nl-e{border:1px solid #E8D4CE;background:#FFFCFB;padding:13px 16px;font-family:"Jost",sans-serif;font-size:13px;font-weight:300;color:#2C1A14;outline:none;transition:border-color 0.2s ease;width:100%;border-radius:0;-webkit-appearance:none}' +
      '#bt-nl-e::placeholder{color:#C4AFAB}' +
      '#bt-nl-e:focus{border-color:#C4897A}' +
      '#bt-nl-s{background:#2C1A14;color:#FFFCFB;font-family:"Jost",sans-serif;font-size:11px;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;border:none;padding:15px;cursor:pointer;width:100%;transition:background 0.25s ease,transform 0.15s ease}' +
      '#bt-nl-s:hover:not(:disabled){background:#3D2218;transform:translateY(-1px)}' +
      '#bt-nl-s:disabled{opacity:0.55;cursor:not-allowed}' +
      '.bt-nl-note{font-family:"Jost",sans-serif;font-size:10px;font-weight:300;color:#C4AFAB;letter-spacing:0.04em;margin-top:2px}' +
      '.bt-nl-ok{font-family:"Cormorant Garamond",serif;font-size:22px;font-weight:300;color:#2C1A14;padding:16px 0;display:block}' +
      '@media(max-width:480px){#bt-nl-box{padding:40px 24px 32px}}';
    document.head.appendChild(css);

    try {
      var c = parseInt(localStorage.getItem(LS_NL_COUNT) || '0', 10);
      localStorage.setItem(LS_NL_COUNT, String(c + 1));
    } catch(e){}

    var bg = document.createElement('div');
    bg.id = 'bt-nl-bg';
    bg.innerHTML =
      '<div id="bt-nl-box">' +
        '<button id="bt-nl-x" aria-label="Close">×</button>' +
        '<span class="bt-nl-eye">Join the ritual</span>' +
        '<h2 class="bt-nl-h">Made with care,<br><em>delivered with love</em></h2>' +
        '<p class="bt-nl-p">Gentle updates on new blends, aromatherapy tips from Rosie, and the occasional exclusive offer.</p>' +
        '<form id="bt-nl-f">' +
          '<input id="bt-nl-e" type="email" placeholder="Your email address" required autocomplete="email">' +
          '<button id="bt-nl-s" type="submit">Join the newsletter</button>' +
          '<p class="bt-nl-note">No spam. Unsubscribe any time.</p>' +
        '</form>' +
      '</div>';
    document.body.appendChild(bg);
    setTimeout(function(){ bg.classList.add('bt-in'); }, 40);

    function closeNl(reason) {
      try { localStorage.setItem(LS_NL_DONE, reason || 'dismissed'); } catch(e){}
      bg.classList.remove('bt-in');
      setTimeout(function(){ if (bg.parentNode) bg.parentNode.removeChild(bg); }, 400);
    }

    document.getElementById('bt-nl-x').addEventListener('click', function(){ closeNl('dismissed'); });
    bg.addEventListener('click', function(e){ if (e.target === bg) closeNl('dismissed'); });

    var escHandler = function(e){ if (e.key === 'Escape') { closeNl('dismissed'); document.removeEventListener('keydown', escHandler); } };
    document.addEventListener('keydown', escHandler);

    document.getElementById('bt-nl-f').addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('bt-nl-e').value.trim();
      var btn   = document.getElementById('bt-nl-s');
      if (!email) return;
      btn.disabled = true;
      btn.textContent = 'Subscribing…';

      function onDone() {
        try { localStorage.setItem(LS_EMAIL, email); } catch(ex){}
        window._btKlaviyo.identify(email);
        var form = document.getElementById('bt-nl-f');
        if (form) form.innerHTML = '<span class="bt-nl-ok">Thank you — welcome to the ritual ✶</span>';
        setTimeout(function(){ closeNl('subscribed'); }, 2200);
      }

      window._btKlaviyo.subscribe(email, onDone, onDone); // treat error as success (existing subscriber)
    });
  }

  // ================================================================
  // PRODUCT PAGE — ViewContent
  // ================================================================
  function fireViewContent() {
    if (!window.fbq) return;
    var btn = document.querySelector('[data-slug][data-price]');
    if (!btn) return;
    window._btPixel.viewContent({
      content_ids:  [btn.dataset.slug],
      content_name: btn.dataset.name,
      content_type: 'product',
      value:        parseFloat(btn.dataset.price) || 0,
      currency:     'NZD'
    });
  }

  // ================================================================
  // INIT
  // ================================================================
  function init() {
    showConsentBanner();
    initNewsletter();
    if (hasConsent()) setTimeout(fireViewContent, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
