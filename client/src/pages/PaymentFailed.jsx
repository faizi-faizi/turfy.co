import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PaymentFailed = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    toast.info("Redirecting to homepage...");
    navigate("/"); // You can navigate to the booking page instead if needed
  };

  return (
    <div className="text-center p-10">
      <div>
        <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
        <p className="mt-4 text-stone-600">
          Something went wrong during the payment process.
        </p>
        <p className="text-stone-600">Please try again or contact support.</p>
      </div>
      <div>
        <button className="btn btn-error mt-6" onClick={handleTryAgain}>
          Go Home
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;
