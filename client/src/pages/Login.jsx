import React, { useState } from 'react'
import { userLogin } from '../services/userApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function Login({ role = "user" }) {

    const navigate = useNavigate()
    const [values, setValues] = useState({
        email: "",
        password: ""
    })

    const handlesubmit = (e) => {
        e.preventDefault()
        userLogin(values, role).then((res) => {

            if(role == "manager"){
            localStorage.removeItem("token");
            localStorage.setItem("managerToken", res?.data?.token);
            toast.success(res?.data?.message);
            navigate("/manager/dashboard")

            } else {
                localStorage.removeItem("managerToken");
                localStorage.setItem("token", res?.data?.token);
                localStorage.setItem("user", JSON.stringify({
                    _id: res?.data?.user._id,
                    name: res?.data?.user.name,
                    email: res?.data?.user.email
                    
                }));
                toast.success(res?.data?.message);
                navigate("/");
            }
            

           

        }).catch((err) => {
            toast.error(err?.response?.data?.error);

        })
    }

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    return (
        <div>
            <div className="hero bg-white text-black min-h-screen">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold">{role == "manager" ? "Manager Login":"Login now!"}</h1>
                        <p className="py-6">
                        {role == "manager"? "Manage your game, own the field. Step in, Manager!" : "Every game starts with a step. Log in and make your move."}
                        </p>
                    </div>
                    <div className="card bg-neutral-content w-full max-w-sm shrink-0 shadow-2xl">
                        <form className="card-body" onSubmit={handlesubmit}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="email" placeholder="email" name="email" className="input input-bordered bg-gray-50" onChange={handleChange} required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input type="password" name="password" placeholder="password" className="input input-bordered bg-gray-50" onChange={handleChange} required />
                                <label className="label">
                                    <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                                </label>
                            </div>
                            <div className="form-control mt-6">
                                <button className="btn btn-neutral">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
