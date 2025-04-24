
import { userInstance } from "../axios/axiosInstance"

export const getTurf = () =>{
    return userInstance.get("/turfs/list-turfs")
}

export const getTurfById = (id) => {
    return userInstance.get(`/turfs/list-turfs/${id}`)
  }