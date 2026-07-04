import stripe from 'stripe';
import Booking from '../models/Booking.js';

export const stripeWebHooks = async (request, response) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return response.status(400).send(`WebHooks Error: ${error.message}`);
  }

  try {
    const eventType = event?.type;
    const eventObject = event?.data?.object;

    if (eventType === 'checkout.session.completed') {
      const session = eventObject;
      const bookingId = session?.metadata?.bookingId;

      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, {
          isPaid: true,
          paymentLink: '',
        });
      }
    } else if (eventType === 'payment_intent.succeeded') {
      const paymentIntent = eventObject;
      const sessionList = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      });
      const session = sessionList.data[0];
      const bookingId = session?.metadata?.bookingId;

      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, {
          isPaid: true,
          paymentLink: '',
        });
      }
    } else {
      console.log('Unhandled event type :', eventType);
    }

    return response.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return response.status(500).send('Internal server Error');
  }
};