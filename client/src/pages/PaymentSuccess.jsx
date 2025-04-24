
import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { savePaymentDetails } from "../services/bookingApi";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // Add this line

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      // hit backend to confirm payment and save it
      savePaymentDetails(sessionId)
        .then((res) => {
          console.log("Payment saved:", res.data);
        })
        .catch((err) => {
          console.error("Payment saving failed:", err);
        });
    }
  }, []);

  const handleGoHome = () => {
    navigate("/"); // Navigate to home page
  };

  return (
    <div className="text-center p-10">
      <div>
        <h1 className="text-2xl font-bold text-green-700">Payment Successful!</h1>
        <p className="mt-4 text-stone-600">Thank you for your booking. Enjoy your game!</p>
      </div>
      <div>
        <button className="btn btn-neutral mt-6" onClick={handleGoHome}>
          Go Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;