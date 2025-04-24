import { userInstance } from "../axios/axiosInstance"

export const dashboard = ()=>{
    return userInstance.get("/manager/dashboard")
}