
import { userInstance } from "../axios/axiosInstance"

export const userLogin = (data, role) =>{
    return userInstance.post(`/user/login?role=${role}`, data)
}


export const userSignup = (data)=>{
    return userInstance.post("/user/register",data)
}

export const getProfile = ()=> {
    return userInstance.get('/user/profile');
}

export const changePasswordApi = (oldPassword, newPassword) => {
    return userInstance.put("/user/change-password",
        {
          oldPassword,
          newPassword,
        });
}

