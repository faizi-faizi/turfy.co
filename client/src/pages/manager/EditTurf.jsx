import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTurfDetailsWithBookings, updateTurf } from "../../services/managerApi";
import { toast } from "sonner";

const EditTurf = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    location: { city: "", state: "", pincode: "" },
    price: "",
    slots: "",
    amenities: "",
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // ✅ store existing images
  const [imagesUpdated, setImagesUpdated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTurfData = async () => {
      try {
        const data = await getTurfDetailsWithBookings(id);
        console.log(data); 
        const turf = data?.turf;

        setFormData({
          name: turf.name,
          location: {
            city: turf.location.city,
            state: turf.location.state,
            pincode: turf.location.pincode,
          },
          price: turf.price,
          slots: turf.slots.join(", "),
          amenities: turf.amenities.join(", "),
        });

        setExistingImages(turf.images); 
      } catch (error) {
        setError(error?.response?.data?.message || "Failed to fetch turf details");
      } finally {
        setLoading(false);
      }
    };

    fetchTurfData();
  }, [id]);

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
    setImagesUpdated(true); 
 };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        ...formData,
        existingImages: !imagesUpdated ? existingImages : [],
      };

      await updateTurf(id, payload, imagesUpdated ? images : []);
      toast.success("Turf updated");
      navigate(`/manager/dashboard`);
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen flex justify-center items-start mt-4 bg-gray-50 px-4">
      <div className="p-6 bg-white shadow-lg rounded-xl w-full max-w-2xl">
        <h2 className="text-3xl text-stone-700 font-bold mb-6 text-center">Edit Turf</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Turf Name"
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
            placeholder="Slots (comma separated)"
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

{imagesUpdated && images.length > 0 && (
  <div className="grid grid-cols-2 gap-2 mt-2">
    {Array.from(images).map((img, idx) => (
      <img
        key={idx}
        src={URL.createObjectURL(img)}
        alt={`New Upload ${idx}`}
        className="w-full h-32 object-cover rounded"
      />
    ))}
  </div>
)}

          <button
            type="submit"
            className="w-full bg-stone-700 text-white py-2 px-4 rounded hover:bg-stone-600"
          >
            Update Turf
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTurf;