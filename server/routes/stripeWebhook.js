
const stripeRouter = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const bodyParser = require('body-parser');
const paymentModel = require('../model/paymentModel');

stripeRouter.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }), // raw body for Stripe verification
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata;

      try {
        const payment = new paymentModel({
          bookingId: metadata.bookingId, 
          userId: metadata.userId,
          amount: session.amount_total / 100,
          method: 'Stripe',
          status: 'completed'
        });

        await payment.save();
        console.log('✅ Payment saved in DB');
      } catch (error) {
        console.error('DB Save error:', error.message);
      }
    }

    res.json({ received: true });
  }
);

module.exports = stripeRouter;