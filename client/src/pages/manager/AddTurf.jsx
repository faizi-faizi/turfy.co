import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTurf } from "../../services/turfApi";

const AddTurf = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      name: "",
      location: {
        city: "",
        state: "",
        pincode: "",
      },
      price: "",
      slots: "",
      amenities: "",
    });
  
    const [images, setImages] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // <-- New state
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      if (["city", "state", "pincode"].includes(name)) {
        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            [name]: value,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    };
  
    const handleImageChange = (e) => {
      setImages([...e.target.files]);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (loading) return; // Block duplicate clicks
      setError("");
      setLoading(true); // Set loading true
  
      try {
        await createTurf(formData, images); // Use the service
        navigate("/manager/dashboard");
      } catch (err) {
        setError(err?.response?.data?.message || "Submission failed");
      } finally {
        setLoading(false); // Reset loading whether success or error
      }
    };

    
  return (
   <div className=" bg-white">
     <div className="min-h-screen flex justify-center items-start mt-4 bg-gray-50 px-4">
      <div className="p-6 bg-white shadow-lg rounded-xl w-full max-w-2xl">
        <h2 className="text-3xl text-stone-700 font-bold mb-6 text-center">
          Add New Turf
        </h2>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Turf Title"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border text-stone-700 border-gray-300 bg-neutral-content rounded"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.location.city}
              onChange={handleInputChange}
              className="p-2 border text-stone-700 bg-neutral-content border-gray-300 rounded"
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.location.state}
              onChange={handleInputChange}
              className="p-2 border text-stone-700 bg-neutral-content border-gray-300 rounded"
              required
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.location.pincode}
              onChange={handleInputChange}
              className="p-2 border text-stone-700 bg-neutral-content border-gray-300 rounded"
              required
            />
          </div>

          <input
            type="number"
            name="price"
            placeholder="Price per hour"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full p-2 border text-stone-700 bg-neutral-content border-gray-300 rounded"
            required
          />

          <input
            type="text"
            name="slots"
            placeholder="Available slots (comma separated)"
            value={formData.slots}
            onChange={handleInputChange}
            className="w-full p-2 border text-stone-700 bg-neutral-content border-gray-300 rounded"
            required
          />

          <input
            type="text"
            name="amenities"
            placeholder="Amenities (comma separated)"
            value={formData.amenities}
            onChange={handleInputChange}
            className="w-full p-2 border text-stone-700 bg-neutral-content border-gray-300 rounded"
            required
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border bg-neutral-content text-stone-400 border-gray-300 rounded"
          />

          <button
            type="submit"
            className="w-full bg-stone-700 text-white py-2 px-4 rounded hover:bg-stone-600"
          >
            Add Turf
          </button>
        </form>
      </div>
    </div>
   </div>
  );
};

export default AddTurf;