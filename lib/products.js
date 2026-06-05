// Server-side product catalog — maps slug to Stripe Price ID.
// Price IDs are created in the Stripe dashboard (Products → Add product → copy price_xxx).
// The frontend never receives these IDs; the backend resolves them here.
module.exports = {
  'aches-pains': {
    name: 'Aches & Pains Blend',
    priceId: 'price_REPLACE_ME',
  },
  'calm-relax': {
    name: 'Calm & Relax Blend',
    priceId: 'price_REPLACE_ME',
  },
  'dry-skin': {
    name: 'Dry Skin Nourish',
    priceId: 'price_REPLACE_ME',
  },
  'soothe-sleep': {
    name: 'Soothe & Sleep Blend',
    priceId: 'price_REPLACE_ME',
  },
  'uplifting': {
    name: 'Uplifting Blend',
    priceId: 'price_REPLACE_ME',
  },
  'womens-hormone': {
    name: "Womens' Hormone Blend",
    priceId: 'price_REPLACE_ME',
  },
  'bio-retinol': {
    name: 'Bio-Retinol Firm & Smooth Face Oil',
    priceId: 'price_REPLACE_ME',
  },
  'gift-set': {
    name: 'Country Blooms × Bodytreat Gift Set',
    priceId: 'price_REPLACE_ME',
  },
};
