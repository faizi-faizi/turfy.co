const Stripe = require('stripe');
const paymentModel = require('../model/paymentModel');
const stripe = new Stripe(process.env.STRIPE_SECRET);

const paymentFunction = async (req, res) => {
  try {
    const { turfs } = req.body;

    const bookingItems = turfs.map((turf) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: turf.turfId.name,
          images: [turf.turfId.images?.[0] ]
        },
        unit_amount: Math.round(turf.turfId.price * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: bookingItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success`, 
      cancel_url: `${process.env.FRONTEND_URL}/payment/failed`, 
    
    });

    res.status(200).json({
        succuss: true, sessionId: session.id
    })
  } catch (error) {
    console.error('Stripe payment error:', error);
    res.status( error.status || 500).json({ error:error.message || "Payment session creation failed"});
  }
};



module.exports = { paymentFunction };