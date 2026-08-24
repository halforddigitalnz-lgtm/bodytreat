# Bodytreat — Automated Email Setup Guide

Two systems work together: **Stripe receipts** (transactional, free, instant) and **Klaviyo**
(branded marketing flows — welcome series, abandoned cart, newsletter). The site code is
already wired for both; everything below is dashboard setup plus two values to paste in.

---

## 1. Stripe receipts (5 minutes, no code)

Every completed checkout collects the customer's email, so once enabled, **every order gets
an automatic receipt**.

1. Log in to the [Stripe Dashboard](https://dashboard.stripe.com) (live mode).
2. **Settings → Business → Customer emails** → turn ON *"Successful payments"* and *"Refunds"*.
3. **Settings → Business → Branding**:
   - Icon: upload `images/logo/favicon.png`
   - Logo: upload `images/logo/logo-default.png`
   - Accent colour: `#C4897A` (Bodytreat rose)

Notes:
- Receipts only send for **live-mode** payments — test checkouts won't email.
- The receipt includes the order total, items, and a link to a hosted receipt page.

## 2. Klaviyo (free tier, ~30 minutes)

The site already tracks *Added to Cart*, *Started Checkout*, and *Placed Order*, and has a
newsletter popup built in — all currently dormant because the API keys are placeholders.

### 2a. Create the account and get two values

1. Sign up at [klaviyo.com](https://www.klaviyo.com) (free up to 250 contacts / 500 emails per month).
2. **Public API Key**: Account → Settings → API Keys → copy the *Public API Key* (6 characters, e.g. `AbC123`).
3. **List ID**: Lists & Segments → open your main list (e.g. "Newsletter") → Settings → copy the *List ID*.

### 2b. Paste them into the site (one file)

In `analytics.js` lines 13–14, replace the placeholders:

```js
var KL_PUBLIC_KEY = 'AbC123';        // your Public API Key
var KL_LIST_ID    = 'XyZ789';        // your List ID
```

Then in the same file (near the bottom, ~line 299) un-comment the newsletter popup:

```js
initNewsletter();   // remove the leading "//" and the note
```

Deploy — the popup, on-site tracking, and profile identification all go live.

### 2c. Connect Stripe to Klaviyo (reliable order data)

Klaviyo → **Integrations → Add integration → Stripe** → authorize. This sends *Placed Order*
events server-side from Stripe, so orders are captured even when ad blockers or closed tabs
kill the on-site tracking. The site's own client-side event stays as a fallback.

### 2d. Flows to build in Klaviyo (use their templates)

| Flow | Trigger | Purpose |
|---|---|---|
| Welcome series (2–3 emails) | Joins the newsletter list | Introduce Rosie's story, best-sellers, maybe a first-order code |
| Abandoned cart (1–2 emails) | *Started Checkout*, no order within a few hours | Recover checkouts — usually the highest-ROI flow |
| Post-purchase thank-you (optional) | *Placed Order* (Stripe integration) | A personal note from Rosie a few days after delivery — **not** an order confirmation (Stripe's receipt already covers that; doubling up sends two emails per order) |

### 2e. Deliverability (worth doing before real sends)

Klaviyo will prompt you to set up a **dedicated sending domain** (adds DNS records for
`bodytreat.co.nz`). Do it — emails from your own domain land in inboxes far more reliably
than from a shared Klaviyo address, especially since the reply-to is an Outlook address.

## 3. Contact form (2 minutes)

The contact form now posts to Web3Forms (replacing the broken `mailto:` form). To activate it:

1. Go to [web3forms.com](https://web3forms.com), enter `lovebodytreat@outlook.com`, and copy the access key from the email it sends.
2. In `contact.html`, replace `YOUR_WEB3FORMS_KEY` with that key and deploy.
3. Send a test message from the live site and check the Outlook inbox (and junk folder, the first time).

---

## Summary of what's pending

| Task | Where | Who |
|---|---|---|
| Enable customer emails + branding | Stripe dashboard | You |
| Create account, copy Public API Key + List ID | Klaviyo | You |
| Paste Klaviyo keys, un-comment popup | `analytics.js` | Dev (or send the keys over) |
| Connect Stripe integration + build flows | Klaviyo dashboard | You |
| Get Web3Forms access key | web3forms.com | You |
| Paste Web3Forms key | `contact.html` | Dev (or send the key over) |
