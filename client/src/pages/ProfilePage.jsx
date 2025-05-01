import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
import { toast } from 'sonner';
import { getProfile } from '../services/userApi';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching profile", error);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaCog className="animate-spin text-4xl text-gray-700" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded mt-8">
      <h2 className="text-2xl font-semibold text-stone-800 mb-4">Profile</h2>

      <div className="space-y-3 text-stone-700">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate('edit')}
          className="bg-stone-500 hover:bg-stone-700 text-white px-4 py-2 rounded"
        >
          Update Profile
        </button>
        <button
          onClick={() => navigate('change-password')}
          className="bg-red-900 mx-2 hover:bg-red-800 text-white px-4 py-2 rounded"
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;