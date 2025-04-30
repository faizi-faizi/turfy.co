import React, { useEffect, useState } from 'react';
import { getManagerBookings, updateBookingStatus } from '../../services/managerApi';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

const TurfBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { managerId } = useParams();

  useEffect(() => {
    if (managerId) {
      fetchBookings(managerId); // ✅ Use managerId from URL
    } else {
      const storedManagerRaw = localStorage.getItem("managerData");
      const storedManager = storedManagerRaw ? JSON.parse(storedManagerRaw) : null;
  
      if (storedManager && storedManager._id) {
        fetchBookings(storedManager._id);
      } else {
        toast.error("Manager ID not found. Please log in again.");
        setLoading(false);
      }
    }
  }, [managerId]);

  const fetchBookings = async (managerId) => {
    try {
      const response = await getManagerBookings(managerId);
      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, { status: newStatus });
      toast.success(`Booking status updated to ${newStatus}`);
      fetchBookings(managerId); // 🔁 Refresh bookings list
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update booking status");
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-stone-700 mb-4">All Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="p-4 border rounded shadow bg-white">
              <h2 className="text-lg font-semibold text-stone-700">
                User: {booking.userId?.name || 'Unknown'}
              </h2>
              <p className="text-sm text-stone-600">Date: {booking.date}</p>
              <p className="text-sm text-stone-600">Slot: {booking.slot}</p>
              <p className="text-sm text-stone-600">
                Turf: {booking.turfId?.name || 'Unknown Turf'}
              </p>
              <p className="text-sm text-stone-600">Status: {booking.status}</p>

              <div className="mt-2">
                <select
                  className="p-2 border rounded bg-stone-700"
                  value={booking.status}
                  onChange={(e) =>
                    handleStatusChange(booking._id, e.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TurfBookings;