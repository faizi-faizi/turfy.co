import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteTurf, getTurfDetailsWithBookings } from '../../services/managerApi';

const ManagerTurfDetails = () => {
  const { id } = useParams(); // Get the turf ID from the URL
  const navigate = useNavigate();
  const [turf, setTurf] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchTurfAndBookings = async () => {
      try {
        const data = await getTurfDetailsWithBookings(id);
        console.log("Fetched Turf Details:", data);
        setTurf(data.turf);
        setBookings(data.bookings);
        setRevenue(data.totalRevenue);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTurfAndBookings();
  }, [id]); // Re-run this effect if the id changes

  if (loading) return <div>Loading...</div>;
  if (!turf) return <div>Turf not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl text-stone-700 font-bold mb-4">{turf.name}</h1>
      <p className="mb-2 text-stone-500">
        Location: {turf.location?.city || 'Unknown'}, {turf.location?.state || 'Unknown'}
      </p>
      <p className="mb-2 text-stone-500">Price: ₹ {turf.price}</p>
      <p className="mb-2 text-stone-500">Revenue: ₹ {revenue}</p>

      <h2 className="text-xl text-stone-600 font-semibold mt-4">Bookings</h2>
      {bookings.length === 0 ? (
        <p className='text-stone-500'>No bookings yet.</p>
      ) : (
        <ul className="text-stone-500 list-disc pl-6">
          {bookings.map((b) => (
            <li key={b._id}>
              {b.userId?.name || b.userId?.email || "Unknown"} <br/> {b.status} - Date: {b.date.slice(0, 10)} - Slot: {b.slot}
              <br/>
              <span className="text-sm text-stone-400">Price: ₹ {b.price}</span>
              <br/>
              <span className="text-sm text-stone-400">Booking ID: {b._id}</span>
               
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded" 
          onClick={() => navigate(`/manager/edit-turf/${turf._id}`)} // Navigate to edit page
        >
          Edit Turf
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={async () => {
            if (window.confirm("Are you sure you want to delete this turf?")) {
              try {
                await deleteTurf(id); 
                navigate("/manager/dashboard");
              } catch (err) {
                console.error("Delete failed:", err);
              }
            }
          }}
        >
          Delete Turf
        </button>
      </div>
    </div>
  );
};

export default ManagerTurfDetails;