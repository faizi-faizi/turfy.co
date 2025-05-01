import React, { useState } from "react";
import { changePasswordApi } from "../services/userApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      const response = await changePasswordApi(oldPassword, newPassword);
      toast.success(response.data.message || "Password updated successfully");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-stone-700 text-center">Change Password</h2>
      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label className="text-stone-600 block mb-1 font-medium">Old Password</label>
          <input
            type="password"
            className="w-full border text-stone-700 border-gray-300 bg-neutral-content px-3 py-2 rounded"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-stone-600 font-medium">New Password</label>
          <input
            type="password"
            className="w-full text-stone-700 border-gray-300 bg-neutral-content border px-3 py-2 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-stone-600 font-medium">Confirm New Password</label>
          <input
            type="password"
            className="w-full text-stone-700 border-gray-300 bg-neutral-content border px-3 py-2 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-stone-600 hover:bg-stone-700 text-white py-2 rounded transition"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}

export default ChangePasswordPage;