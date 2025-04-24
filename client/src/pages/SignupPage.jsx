import React, { useState } from 'react';
import { userSignup } from '../services/userApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        phone: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        userSignup(values).then((res) => {
            toast.success(res?.data?.message);
            navigate('/');
        }).catch((err) => {
            toast.error(err?.response?.data?.error);
        });
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    return (
        <div className="hero bg-white text-black min-h-screen">
            <div className="hero-content flex-col lg:flex-row">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Join Turfy.co!</h1>
                    <p className="py-6">
                        Sign up and take your game to the next level with hassle-free turf bookings.
                    </p>
                </div>
                <div className="card bg-neutral-content w-full max-w-sm shrink-0 shadow-2xl">
                    <form className="card-body" onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input type="text" name="name" placeholder="Name" className="input input-bordered bg-gray-50" onChange={handleChange} required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" name="email" placeholder="Email" className="input input-bordered bg-gray-50" onChange={handleChange} required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Phone</span>
                            </label>
                            <input type="tel" name="phone" placeholder="Phone" className="input input-bordered bg-gray-50" onChange={handleChange} required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" name="password" placeholder="Password" className="input input-bordered bg-gray-50" onChange={handleChange} required />
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-neutral">Signup</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;