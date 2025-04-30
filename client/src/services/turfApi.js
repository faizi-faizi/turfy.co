
import { userInstance } from "../axios/axiosInstance"

export const getTurf = () =>{
    return userInstance.get("/turfs/list-turfs")
}

export const getTurfById = async (id) => {
    const turfRes = await userInstance.get(`/turfs/list-turfs/${id}`)
    console.log(turfRes); 
    return turfRes;
}

export const createTurf = async (formData, images) => {
  const submitData = new FormData();
  submitData.append("name", formData.name);
  submitData.append("location", JSON.stringify(formData.location));
  submitData.append("price", formData.price);
  submitData.append("slots", formData.slots);
  submitData.append("amenities", formData.amenities);
  images.forEach((img) => submitData.append("images", img));

  const response = await userInstance.post("/turfs/create-turf", submitData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
