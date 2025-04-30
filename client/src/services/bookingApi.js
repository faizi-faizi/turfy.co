import { userInstance } from "../axios/axiosInstance"

export const bookTurf = (bookingData)=>{
    return userInstance.post("/bookings/create-booking",bookingData)
}

export const makePayment = (data) => {
    return userInstance.post("/payment/stripe-checkout", data)
}

export const savePaymentDetails = (sessionId) => {
    return userInstance.post("/payment/save", { sessionId });
};

export const getUserBookings = async ()=>{
    const res = await userInstance.get("/bookings/user/all")
    return res.data;
}


export const cancelBooking = (id) =>{
    return userInstance.patch(`/bookings/cancel/${id}`)
}


export const getBookingById = (id)=> {
    return userInstance.get(`/bookings/booking/${id}`)
 }

 export const getBookingByIds = (id)=> {
    return userInstance.get(`/bookings/bookings/${id}`)
 }

export const updateBooking = async (bookingId, data) => {
    const response =  await userInstance.patch(`bookings/edit-booking/${bookingId}`, data);
    return response.data;
};

