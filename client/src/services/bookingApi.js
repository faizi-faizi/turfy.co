import { userInstance } from "../axios/axiosInstance"

export const bookTurf = (bookingData)=>{
    return userInstance.post("/bookings/create-booking",bookingData)
}
    export const getBookingById = (id)=> {
       return userInstance.get(`/bookings/booking/${id}`)
    }

export const makePayment = (data) => {
    return userInstance.post("/payment/stripe-checkout", data)
}

export const savePaymentDetails = (sessionId) => {
    return userInstance.post("/payment/save", { sessionId });
  };