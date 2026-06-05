const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PRODUCTS = require('../lib/products');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Vercel parses application/json body automatically; handle both parsed and raw forms
    const body = typeof req.body === 'object' && req.body !== null
      ? req.body
      : JSON.parse(req.body);

    const { items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // SECURITY: resolve Price IDs server-side only — never trust any price from the client
    const line_items = items.map(({ slug, quantity }) => {
      const product = PRODUCTS[slug];

      if (!product) {
        throw new Error(`Unknown product: ${slug}`);
      }
      if (!product.priceId || product.priceId === 'price_REPLACE_ME') {
        throw new Error(`Product not yet configured in Stripe: ${slug}`);
      }

      return {
        price: product.priceId,
        quantity: Math.max(1, Math.floor(Number(quantity))),
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel.html`,
      shipping_address_collection: {
        allowed_countries: ['NZ'],
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
