import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { cancelBooking, getBookingById } from '../services/bookingApi';
import { FaCog } from 'react-icons/fa';

const BookingDetails = () => {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await getBookingById(bookingId);
                setBooking(res.data);

            } catch (error) {
                console.error("Failed to fetch booking:", error);
                toast.error("Failed to load booking details");
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId]);

    const handleCancel = async () => {
        const confirm = window.confirm("Are you sure you want to cancel this booking?");
        if (!confirm) return;

        try {
            await cancelBooking(booking._id);
            toast.success("Booking cancelled successfully");
            setBooking(prev => ({ ...prev, status: "cancelled" }))
        } catch (error) {
            console.error("Failed to cancel booking:", error)
            toast.error("Failed to cancel booking");
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                    <FaCog className="animate-spin text-4xl text-gray-700" />
                  </div>
        );
    }
    if (!booking) return <div className="text-center text-red-500">Booking not found</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 mt-5 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-stone-700">Booking Details</h2>
            <div className='text-stone-600'>
            <p className='text-stone-500'><strong>Booking ID:</strong> {booking._id}</p>
                <p><strong>Turf:</strong> {booking.turfId?.name}</p>
                <p><strong>Location:</strong> {booking.turfId?.location?.city}, {booking.turfId?.location?.state} - {booking.turfId?.location?.pincode}</p>
                <p><strong>Date:</strong> {booking.date.slice(0, 10)}</p>
                <p><strong>Slot:</strong> {booking.slot}</p>
                <p><strong>Price:</strong> ₹{booking.price}</p>
                <p>
                    <strong>Status:</strong>{' '}
                    <span
                        className={
                            booking.status === "cancelled"
                                ? "text-red-600 font-semibold"
                                : booking.status === "pending"
                                    ? "text-yellow-600 font-semibold"
                                    : booking.status === "confirmed"
                                        ? "text-green-600 font-semibold"
                                        : "text-gray-600"
                        }
                    >
                        {booking.status}
                    </span>
                </p>

            </div>

            <div className="mt-6 flex gap-4">

                {booking.status !== "cancelled" && (
                    <button onClick={() => navigate("edit")} className="bg-slate-900 hover:bg-slate-600 text-white px-4 py-2 rounded">
                        Edit
                    </button>
                )}



                {booking.status !== "cancelled" && (
                    <button
                        onClick={handleCancel}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};

export default BookingDetails;