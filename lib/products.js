// Server-side product catalog.
// Use priceId (price_xxx) OR productId (prod_xxx) for each entry — not both.
// priceId: copy from Stripe dashboard → product → price row.
// productId: copy from Stripe dashboard → product header. The checkout function
//   will fetch the first active price for that product at runtime.
module.exports = {
  'aches-pains': {
    name: 'Aches & Pains Blend',
    productId: 'prod_Uh3jyNzE7uJgca',
  },
  'calm-relax': {
    name: 'Calm & Relax Blend',
    productId: 'prod_Uh3r3ucTj0SCQW',
  },
  'dry-skin': {
    name: 'Dry Skin Nourish',
    productId: 'prod_Uh3r5rkRVOFnEA',
  },
  'soothe-sleep': {
    name: 'Soothe & Sleep Blend',
    productId: 'prod_Uh3sLCRJPhnSBW',
  },
  'uplifting': {
    name: 'Uplifting Blend',
    productId: 'prod_Uh3sXJgmF1Tk8s',
  },
  'womens-hormone': {
    name: "Womens' Hormone Blend",
    productId: 'prod_Uh3tfMAp3JLRJ3',
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
