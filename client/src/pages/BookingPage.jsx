import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookingById, makePayment } from "../services/bookingApi"; // 👈 create this API if not made
import { loadStripe } from '@stripe/stripe-js';
import { FaCog } from "react-icons/fa";

const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHED_KEY_STRIPE)

function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);


  useEffect(() => {
    getBookingById(id)
      .then((res) => {
        setBooking(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  const makePaymentFuction = async () => {
    const body = {
        turfs : [booking]
    }

    const response = await makePayment(body)
    console.log(response.data.sessionId, "stripe")

    const session = response.data.sessionId

    const stripe = await stripePromise

    if(stripe){
        const result = await stripe.redirectToCheckout({
            sessionId: session 
        })

        if(result.error){
            console.log(result.error.message);
            
        }
    }else{
        console.log('Stripe failed to load');
        
    }
  }


  if (!booking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaCog className="animate-spin text-4xl text-gray-700" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl  text-stone-900">
      <h2 className="text-2xl font-semibold mb-4">Confirm your booking</h2>
      <div className="space-y-4">
        <p><strong>Turf:</strong> {booking.turfId.name}</p>
        <p><strong>Location:</strong> {booking.turfId.location.city}</p>
        <p><strong>Date:</strong> {booking.date}</p>
        <p><strong>Slot:</strong> {booking.slot}</p>
        <p><strong>Price:</strong> ₹{booking.price}</p>
        <p><strong>Status:</strong> {booking.status}</p>
        <div className="mt-6 text center"> <button
          className="bg-neutral text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
          onClick={makePaymentFuction}
        >
          Proceed to Checkout
        </button></div>
      </div>
  
      {/* Checkout Button */}
      <div className="mt-6 text-center">
       
      </div>
    </div>
  );
}

export default BookingPage;