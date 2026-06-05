# Bodytreat Website Summary — Full Redesign Brief

---

## Business Overview

**Brand:** Bodytreat  
**URL:** bodytreat.co.nz  
**Owner/Founder:** Rosie  
**Location:** Tasman region (just outside Nelson), New Zealand  
**Platform:** Shopify  

Bodytreat is a small-batch, handcrafted aromatherapy and body oil brand founded and run by Rosie, a qualified aromatherapist with 22 years of experience across Holistic Health, Aromatherapy, Sports/Remedial Massage, and Beauty Therapy. She originally trained in England (starting 2002), co-ran a clinic in Hereford for a decade, and returned to New Zealand where she now operates from a Tasman clinic near Nelson. Every product is handcrafted by Rosie personally using locally sourced NZ ingredients.

---

## Site Structure & Navigation

The site has a hamburger menu (mobile-first layout) with five navigation links:

- **Home** — `/`
- **About Us** — `/pages/about-me`
- **Catalogue** — `/collections/all`
- **Wholesale** — `/pages/contact` *(labelled "Wholesale Enquiries" on the page — note this is a mismatch)*
- **Stockists** — `/pages/stockists`

Additional utility elements in the header: Search, Account (login), Cart. There is a persistent announcement bar at the top: "🎁 Enjoy Free Shipping in NZ! 🇳🇿"

### Broken/Missing Pages (404 errors)

- `/pages/about` — linked from footer "Read More" on homepage (correct URL is `/pages/about-me`)
- `/pages/terms-and-policies` — linked in footer
- Several product URLs produce 404s (e.g. Calm and Relax Blend, Country Blooms Gift Set), suggesting broken product handles

---

## Page-by-Page Content Breakdown

### Homepage (`/`)

A hero banner featuring the Bio-Retinol Face Oil with two CTAs: "Discover Bio-Retinol" and "See All Products." Below the hero, four value proposition icons appear: All Natural, NZ Made, Handcrafted, and Therapeutic Benefits. This is followed by a brand story section ("22 Years in the Making") and an email list sign-up form. The footer contains only a copyright notice and a "Terms and Policies" link (which is broken).

### About Us (`/pages/about-me`)

A personal founder story page titled "Rosie's Story." Includes a full-width header with botanical illustration, a photo of Rosie surrounded by her products, and a narrative about her journey from England back to NZ. The tone is warm, personal, and authentic. No contact details, certifications list, or clinic information are shown.

### Catalogue / All Products (`/collections/all`)

The full product collection page. Features a collection description, then a grid of products (two columns on mobile). Eight products total:

| Product | Price | Size |
|---|---|---|
| Aches and Pains Blend | $44.99 | 100ml |
| Bio-Retinol Firm & Smooth Face Oil | $47.00 | 30ml |
| Calm and Relax Blend | $44.99 | 100ml |
| Country Blooms x Bodytreat Gift Set | $120.00 | — |
| Dry Skin Nourish | $44.99 | 100ml |
| Soothe and Sleep Blend | $44.99 | 100ml |
| Uplifting Blend | $44.99 | 100ml |
| Womens' Hormone Blend | $44.99 | 100ml |

> **Note:** Some product pages return 404 errors (Calm and Relax Blend, the Gift Set), indicating broken product handles or unpublished products still appearing in the catalogue.

### Individual Product Pages

Each product page follows the same single-column layout: product image, title, price, quantity selector, Add to Cart, a short benefit description, a bullet list of key features, size/origin info, and a full ingredients list. Products share consistent features: no parabens/artificial additives, natural Vitamin E tocopherols, NZ made with locally sourced ingredients, 100ml bottles.

**Product blends and key essential oils:**

| Product | Key Oils | Purpose |
|---|---|---|
| Aches & Pains | Coriander, Ginger, Ylang Ylang, Lemongrass, Cypress | Muscle soreness/tension |
| Bio-Retinol Face Oil | Rose Geranium, Rose, Jasmine, Mandarin + Cacay/Marula/Camellia oils | Anti-ageing night oil |
| Dry Skin Nourish | Sandalwood, Cypress, Rose, Orange, Amyris | Hydration/rejuvenation |
| Soothe & Sleep | Lavender, Chamomile, Rose | Nervous system calm, sleep |
| Uplifting Blend | Sandalwood, Jasmine, Rose, Pink Grapefruit, Tangerine | Mood lift |
| Womens' Hormone Blend | Jasmine, Sweet Fennel, Clary Sage, Bergamot, Rose Geranium | Hormonal balance/cramps |

### Contact / Wholesale (`/pages/contact`)

Despite being labelled "Wholesale" in the nav, this page is titled "Wholesale Enquiries" and functions as a general contact form. It promotes an opening deal for new stockists (free testers, free retail display unit, free initial postage). The form fields are Name, Email, Phone, and Comment. There is no general customer contact option visible on this page.

### Stockists (`/pages/stockists`)

Features an interactive OpenStreetMap with pins, followed by a list of 12 stockist locations across New Zealand — primarily concentrated in the Nelson/Tasman region, with a handful in Auckland, Bay of Plenty, and other areas. Each stockist entry links to their website and sometimes an email. Stockists include art galleries, eco resorts, gift shops, retreat centres, and cafés.

| Stockist | Location |
|---|---|
| Red Art Gallery | Nelson |
| The Old Post Office | Upper Moutere |
| Country Blooms | Hope |
| Toad Hall | Motueka |
| Nelson Classic Car Museum | Nelson |
| Giftrapt | Te Puke |
| Sanctum Recovery | Auckland |
| Mana Retreat Centre | Manaia |
| Kimi Ora Eco Resort | Kaiteriteri |
| Rabbit Island Coffee Co. | Māpua |
| Madame Fancy Pants | Featherston |
| Foxy Boxy | Nelson |

---

## Visual Design & Branding

**Current Aesthetic:** Warm, natural, artisanal. The logo is a hand-drawn script style featuring a botanical/flower motif with "Massage & Body Oil" text in a circular badge. Product photography is clean with natural props (flowers, pearls, blue silk fabric).

**Colour Palette:** Muted dusty blue-purple for hero banners and page headers, soft blush/cream for backgrounds, gold accents in the logo and icon elements. The overall palette feels organic and spa-like.

**Typography:** Serif/script fonts for headings (elegant, artisanal feel), sans-serif for body text.

**Product Packaging:** Amber dropper bottles with pastel-coloured boxes (each blend has its own colour). Gold logo and typography on labels. The Bio-Retinol is differentiated with a blue box and a more premium feel.

**Photography:** High quality product lifestyle shots. Rosie's About page includes a warm, candid photo of her with her products.

---

## Key Issues & Gaps for Redesign

### 🔴 Broken Links & 404 Pages
Several internal links are broken, including the "Read More" homepage button, the Terms & Policies footer link, and 2 product pages from the catalogue.

### 🔴 Navigation Confusion
The "Wholesale" nav item leads to a page only relevant to trade buyers — there is no dedicated general customer contact option.

### 🔴 No Footer Navigation
The footer is almost empty — only a copyright year and a broken Terms & Policies link. There is no footer menu, social media links, or trust signals.

### 🟡 No Social Media Links
No Instagram, Facebook, or other social links appear anywhere on the site, which is unusual for a brand with strong visual/lifestyle appeal.

### 🟡 No Testimonials or Reviews
Product pages and the homepage have no customer reviews, testimonials, or social proof — a significant missed opportunity in the wellness/beauty space.

### 🟡 Limited About Page
The About page tells Rosie's story well but lacks her qualifications list, certifications, clinic details, or a way for local clients to book treatments.

### 🟡 No Blog or Educational Content
Given Rosie's deep expertise in aromatherapy, there is no blog, ingredient glossary, or educational content to build SEO authority.

### 🟡 Mobile-First but Navigation is Hidden on Desktop
The hamburger menu hides all navigation on desktop, reducing discoverability. There is no persistent navigation bar on larger screens.

### 🟡 Inconsistent Product Catalogue
Some products listed in the catalogue return 404 errors, creating a poor customer experience.

### 🟡 No Shipping/Returns Policy Page
The "Terms and Policies" link is broken. Customers have no visible access to shipping info, returns policy, or FAQs beyond the announcement bar.

---

## Target Audience

Based on the product range and messaging, the **primary audience** is women aged 30–60 in New Zealand interested in natural wellness, self-care, aromatherapy, and holistic health. **Secondary audiences** include trade/wholesale buyers (spas, gift shops, wellness retreats) and gift purchasers (evidenced by the gift set product and stockists in gift/lifestyle stores).

---

## Redesign Recommendations Summary

A full redesign should:

- **Fix all broken links and 404 pages** — restore missing product pages, correct internal links, and publish a proper Terms & Policies page
- **Introduce a full footer** — with navigation links, social media icons, contact info, and legal pages
- **Separate wholesale from customer contact** — create a dedicated general Contact page and a separate Trade/Wholesale enquiry page
- **Add customer reviews and testimonials** — surface social proof on product pages and the homepage
- **Build out the About page** — include Rosie's qualifications, certifications, and clinic booking information for local clients
- **Add a blog or editorial section** — leverage Rosie's expertise for SEO and brand authority (ingredient spotlights, how-to guides, aromatherapy education)
- **Implement persistent desktop navigation** — replace the hamburger-only nav with a visible header menu for larger screens
- **Link to social media** — integrate Instagram feed or at minimum add social icons throughout the site
- **Add a FAQ / Shipping & Returns page** — give customers easy access to policy information before purchasing

The brand's warmth, authenticity, and strong product story are genuine assets — the redesign should amplify these rather than replace them.

---

*Summary prepared: May 2026*
