// Server-side product catalog.
// Use priceId (price_xxx) OR productId (prod_xxx) for each entry — not both.
// priceId: copy from Stripe dashboard → product → price row.
// productId: copy from Stripe dashboard → product header. The checkout function
//   will fetch the first active price for that product at runtime.
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
    productId: 'prod_UgNNx9OfMqVypT',
  },
  'gift-set': {
    name: 'Country Blooms × Bodytreat Gift Set',
    productId: 'prod_Uh3haoKAgMp1li',
  },
};
