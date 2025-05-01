import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {  getBookingByIds, updateBooking } from '../services/bookingApi';
import { getTurfById } from '../services/turfApi';
import { userInstance } from '../axios/axiosInstance';
import { FaCog } from 'react-icons/fa';

const EditBooking = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [date, setDate] = useState('');
    const [slot, setSlot] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [allSlots, setAllSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch booking and turf data
    useEffect(() => {
        const fetchBookingAndSlots = async () => {
            try {
                const res = await getBookingByIds(bookingId);
                const bookingData = res.data.booking;
        
                setBooking(bookingData);
                const formattedDate = bookingData.date.slice(0, 10);
                setDate(formattedDate);
                setSlot(bookingData.slot);
        
                const turfId = typeof bookingData.turfId === 'object'
                    ? bookingData.turfId._id
                    : bookingData.turfId;
        
                const turfRes = await getTurfById(turfId);
        
                // Log the whole response to inspect the structure
                console.log("Turf Response:", turfRes.data);
        
                // Extract raw slots from the response
                const rawSlots = turfRes.data.turf?.slots || [];
        
                // Log rawSlots to check if the data exists
                console.log("Raw Turf Slots:", rawSlots);
        
                if (rawSlots && rawSlots.length > 0) {
                    // If slots are found, process them
                    const turfSlots = rawSlots.map(s => typeof s === 'object' ? s.time : s);
                    console.log("Mapped Turf Slots:", turfSlots);
                    setAllSlots(turfSlots);
                } else {
                    console.warn("No slots found in the response for this turf.");
                }
        
                // Fetch available slots after setting allSlots
                await fetchAvailableSlots(formattedDate, turfId, bookingData.slot, rawSlots);
            } catch (error) {
                console.error("Failed to fetch booking or turf:", error);
                toast.error("Failed to load booking details");
            } finally {
                setLoading(false);
            }
        };

        fetchBookingAndSlots();
    }, [bookingId]);

    const fetchAvailableSlots = async (selectedDate, turfId, originalSlot, turfSlots) => {
        try {
            console.log("Fetching available slots for Turf ID:", turfId, "Date:", selectedDate);
            const res = await userInstance.get(`/bookings/booking-by-turf-date/${turfId}/${selectedDate}`);
            console.log("Bookings response:", res.data);
    
            const bookedSlots = res.data.bookings.map(b => b.slot);
            console.log("Booked slots:", bookedSlots);
    
            // Trim spaces and convert to lowercase for comparison
            const formattedBookedSlots = bookedSlots.map(slot => slot.trim().toLowerCase());
            const formattedTurfSlots = turfSlots.map(slot => slot.trim().toLowerCase());
    
            // Log comparison results
            console.log("Formatted Turf Slots:", formattedTurfSlots);
            console.log("Formatted Booked Slots:", formattedBookedSlots);
    
            // Filter available slots
            const filtered = formattedTurfSlots.filter(s => !formattedBookedSlots.includes(s) || s === originalSlot.trim().toLowerCase());
            console.log("Filtered available slots:", filtered);
    
            setAvailableSlots(filtered);
        } catch (error) {
            console.error("Error fetching slots:", error);
            toast.error("Error fetching available slots");
            setAvailableSlots([]);
        }
    };

    const handleDateChange = async (value) => {
        setDate(value);

        if (booking?.turfId) {
            const turfId = typeof booking.turfId === 'object'
                ? booking.turfId._id
                : booking.turfId;

            await fetchAvailableSlots(value, turfId, booking.slot, allSlots);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedData = { date, slot };
            await updateBooking(bookingId, updatedData);
            toast.success("Booking updated successfully!");
            navigate(`/booking/${bookingId}`);
        } catch (error) {
            console.error("Failed to update booking:", error);
            toast.error("Failed to update booking");
        }
    };

    if (loading) {
        return(
            <div className="flex justify-center items-center min-h-screen">
                    <FaCog className="animate-spin text-4xl text-gray-700" />
                  </div>
        )
    }
    if (!booking) return <div className="text-center text-red-500">Booking not found</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 mt-5 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-stone-700">Edit Booking</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-semibold text-stone-600">Date</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="slot" className="block text-sm font-semibold text-stone-600">Slot</label>
                    <select
                        id="slot"
                        value={slot}
                        onChange={(e) => setSlot(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        required
                    >
                        <option value="" disabled>Select a slot</option>
                        {availableSlots.length > 0 ? (
                            availableSlots.map((s, index) => (
                                <option key={index} value={s}>{s}</option>
                            ))
                        ) : (
                            <option disabled>No slots available</option>
                        )}
                    </select>
                </div>

                <div className="flex gap-4 mt-6">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/booking/${bookingId}`)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBooking;