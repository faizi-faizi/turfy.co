// pages/ManagerDashboard.jsx
import React, { useEffect, useState } from 'react';
import { dashboard } from '../../services/managerApi';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const ManagerDash = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  

  useEffect(()=> {
    const token = localStorage.getItem('managerToken')
    if (!token){
      navigate('/manager/login')
    }
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("Fetching dashboard data...");
        const data = await dashboard();
        console.log("Received data:", data);
        console.log("Turfs:", data.turfs);
        setDashboardData(data);
        
      } catch (error) {
        // Log full error response for better insight
        console.error('Failed to fetch manager dashboard data:', error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 403) {
          console.error("Authorization error: Check token or user permissions.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  if (loading) return <div className="text-center p-4">Loading...</div>;

  if (!dashboardData) return <div className="text-center p-4">Failed to load data</div>;

  return (
    <div className="p-6 bg-white">
      <h1 className="text-3xl text-stone-700 font-bold mb-4">Manager Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-4 bg-neutral-content rounded shadow text-center">
          <h2 className="text-xl text-stone-600 font-semibold">Total Revenue</h2>
          <p className="text-2xl text-stone-500 mt-2">₹ {dashboardData.totalRevenue.toFixed(2)}</p>
        </div>

        <div
  className="p-4 bg-white rounded shadow text-center cursor-pointer hover:bg-stone-100 transition"
  onClick={() => navigate(`/manager/bookings/${dashboardData.managerId}`)}
  
>
  <h2 className="text-xl text-stone-600 font-semibold">Total Bookings</h2>
  <p className="text-2xl text-stone-500 mt-2">{dashboardData.bookings.length}</p>
</div>

        <div className="p-4 bg-white rounded shadow text-center">
          <h2 className="text-xl text-stone-600 font-semibold">New Bookings (7 days)</h2>
          <p className="text-2xl text-stone-500 mt-2">{dashboardData.newBookingCount}</p>
        </div>
      </div>

      <div>
      <div className="flex items-center justify-between mb-4">
  <h2 className="text-2xl text-stone-700 font-bold">Your Turfs</h2>
  <button 
    onClick={() => navigate('/manager/add-turf')}
    className="p-2 rounded-full bg-stone-200 hover:bg-stone-300 transition"
    title="Add New Turf"
  >
    <Plus className="w-5 h-5 text-stone-700" />
  </button>
</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboardData.turfs.length > 0 ? (
            dashboardData.turfs.map(turf => (
              <div key={turf._id}  onClick={() => navigate(`/manager/turf/${turf._id}`)}
              className="cursor-pointer p-4 bg-white rounded shadow flex justify-between items-center gap-4 hover:bg-stone-50 transition"
            >

                <div>
                  <h3 className="text-xl text-stone-600 font-semibold">{turf.name || 'Unnamed Turf'}</h3>
                  <p className="text-stone-500">
                    {turf.location?.city || 'Unknown City'}, {turf.location?.state || 'Unknown State'} - {turf.location?.pincode || '000000'}
                  </p>
                  <p className="text-stone-400">Price per Hour: ₹ {turf.price || 0}</p>
                </div>


                <img
                  src={turf.images}
                  alt="Turf"
                  className="w-28 h-20 object-cover rounded-md"
                />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No turfs available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDash;