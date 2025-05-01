import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { userInstance } from '../axios/axiosInstance';
import { getProfile } from '../services/userApi';

const ProfileUpdate = () => {
  const [user, setUser] = useState({ name: '', email: '', phone: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await userInstance.patch('/user/update', user);
      toast.success(res.data.message || "Profile updated");
      navigate('/profile');
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded mt-8">
      <h2 className="text-2xl font-semibold text-stone-800 mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-stone-700">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-neutral-content px-4 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-neutral-content px-4 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className="w-full border  bg-neutral-content border-gray-300 px-4 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-stone-500 hover:bg-stone-700 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdate;