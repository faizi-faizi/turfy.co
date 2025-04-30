import { userInstance } from "../axios/axiosInstance"

export const dashboard = async () => {
    try {
      const response = await userInstance.get("/manager/dashboard")
      console.log("recieved data", response.data);
      
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  }

  export const getTurfDetailsWithBookings = async (turfId) => {
    try {
      const turfRes = await userInstance.get(`/turfs/list-turfs/${turfId}`);
      const bookingRes = await userInstance.get(`/bookings/turf/${turfId}`);
  
      return {
        turf: turfRes.data.turf,
        bookings: bookingRes.data.bookings || [],
        totalRevenue: bookingRes.data.totalRevenue || 0,
      };
    } catch (error) {
      console.error("Error fetching turf details:", error);
      throw error;
    }
  };

  export const updateTurf = async (turfId, formData, images) => {
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("location", JSON.stringify(formData.location));
    submitData.append("price", formData.price);
    submitData.append("slots", formData.slots);
    submitData.append("amenities", formData.amenities);
  
    images.forEach((img) => submitData.append("images", img));
  
    const response = await userInstance.patch(`/turfs/update-turf/${turfId}`, submitData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  
    return response.data;
  };

  export const deleteTurf = async (turfId) => {
    const response = await userInstance.delete(`/turfs/delete-turf/${turfId}`);
    return response.data;
  };

  export const getManagerBookings = async (managerId) => {
    return await userInstance.get(`/bookings/${managerId}`);
  };


  export const updateBookingStatus = async (bookingId, data) => {
    try {
      const response = await userInstance.patch(`/bookings/${bookingId}/status`, data);
      return response.data;
    } catch (error) {
      console.error("Failed to update booking status:", error.response?.data || error.message);
      throw error;
    }
  };
  