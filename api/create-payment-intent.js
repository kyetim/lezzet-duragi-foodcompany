// Vercel Serverless Function for creating payment intents
const Stripe = require('stripe');

// Check if Stripe secret key is configured
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY environment variable is missing');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

module.exports = async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ Stripe secret key not configured');
      return res.status(500).json({ error: 'Payment system not configured' });
    }

    const { amount, currency = 'try' } = req.body;

    console.log('💰 Payment intent request:', { amount, currency });

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    // Create payment intent (amount already in cents from frontend)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount already converted to cents
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      amount: amount,
      id: paymentIntent.id
    });
    
    console.log('✅ Payment intent created successfully:', paymentIntent.id);
  } catch (error) {
    console.error('❌ Payment intent error:', error.message);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ error: 'Card was declined' });
    }
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }
    if (error.type === 'StripeAuthenticationError') {
      return res.status(401).json({ error: 'Authentication with Stripe failed' });
    }
    
    res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
