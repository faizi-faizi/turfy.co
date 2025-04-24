import React, { useEffect, useState } from "react";
import { dashboard } from "../../services/managerApi";

const ManagerDashboard = () => {
  const [data, setData] = useState({ bookings: [], turfs: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboard();
        setData(res.data);
        console.log("Manager data response:", res.data);
      } catch (error) {
        console.error("Failed to fetch manager data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>

      <h2 className="text-xl font-semibold mb-2">Your Turfs</h2>
      <ul className="mb-4">
        {data.turfs.map((turf) => (
          <li key={turf._id}>{turf.name} - {turf.location}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Bookings</h2>
      <ul>
        {data.bookings.map((booking) => (
          <li key={booking._id}>
            {booking.userId.name} booked {booking.turfId.name} on {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagerDashboard;