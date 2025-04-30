import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { getUserBookings } from '../services/bookingApi';
import { Link } from 'react-router-dom';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchBookings = async () => {
            try {
                const res = await getUserBookings();
                setBookings(res.bookings);
            } catch (error) {
                console.log("Failed to fetch bookings : ",error)
                toast.error("Failed to fetch bookings")
            }finally{
                setLoading(false);
            }
        }
        fetchBookings();
    },[]);
    
    if (loading) return  <div className="text-center py-10">Loading...</div>;

    return(
        <div className="max-w-4xl mx-auto p-4 ">
      <h2 className="text-2xl font-semibold mb-4 text-stone-800 text-center">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">No bookings found.</p>
      ) : (
        <div className="space-y-4 ">
          {bookings.map((booking) => (
            <Link to={`/booking/${booking._id}`} key={booking._id}>
            <div className="p-4 my-3 border bg-neutral-content rounded shadow text-stone-600 hover:bg-gray-200 transition-all duration-200 cursor-pointer">
            <p className='text-stone-500'><strong>Booking ID:</strong> {booking._id}</p>
                <p><strong>Turf:</strong> {booking.turfId?.name}</p>
                <p><strong>Location:</strong> 
  {booking.turfId?.location?.city}, {booking.turfId?.location?.state} - {booking.turfId?.location?.pincode}
</p>
<p><strong>Date:</strong> {booking.date.slice(0, 10)}</p>
                <p><strong>Slot:</strong> {booking.slot}</p>
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
        </Link>
          ))}
        </div>
      )}
    </div>
    )
 }

export default MyBookings
