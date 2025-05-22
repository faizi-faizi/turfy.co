import React, { useEffect, useState } from 'react'
import { getTurf } from '../services/turfApi'
import { Link, useNavigate } from 'react-router-dom'

function Homepage() {
    const [turfs, setTurf] = useState([])
    const [currentSlide, setCurrentSlide] = useState(0)
    const navigate = useNavigate()

    const slideImages = [
        "https://www.shutterstock.com/image-photo/green-grass-field-background-football-600nw-2330372505.jpg",
        "https://media.hudle.in/venues/c1c68681-a410-4905-8411-3275ee943221/photo/076aa6cbcc27781e781a11702a3a16ebc992af75",
        "https://media.istockphoto.com/id/520999573/photo/indoor-soccer-football-field.jpg?s=612x612&w=0&k=20&c=X2PinGm51YPcqCAFCqDh7GvJxoG2WnJ19aadfRYk2dI="
    ]

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);


    useEffect(() => {
        getTurf()
            .then((res) => setTurf(res?.data))
            .catch((err) => console.log(err))
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slideImages.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="bg-white min-h-screen text-black">
            {/* Auto Carousel Section */}
            <div className="w-full h-[350px] mb-8 overflow-hidden relative">
                {slideImages.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        className={`w-full h-full object-cover absolute transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        alt={`slide-${index}`}
                    />
                ))}
            </div>

           {/* Turf Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
    {turfs.map((turf) => (
        <Link to={`turfdetails/${turf._id}`} key={turf._id}>
            <div className="card bg-neutral-content shadow-xl hover:scale-105 text-black transition-all h-full">
                <figure className="h-48 overflow-hidden">
                    <img src={turf.images} alt={turf.name} className="w-full h-full object-cover" />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">{turf.name}</h2>
                    <p>{turf.location.city}</p>
                    <p>Price: ₹{turf.price}/-</p>
                </div>
            </div>
        </Link>
    ))}
</div>
        </div>
    )
}

export default Homepage