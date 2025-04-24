import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTurfById } from '../services/TurfApi'
import { toast } from 'sonner'
import { bookTurf } from '../services/bookingApi'

function Turfpage() {
    const { id } = useParams()
    const [turf, setTurf] = useState(null)
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [selectedDate, setSelectedDate] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        getTurfById(id)
            .then((res) => {
                setTurf(res?.data)
            })
            .catch((err) => {
                console.error(err)
            })
    }, [id])
    const getTodayDate = () => {
        const today = new Date()
        return today.toISOString().split("T")[0]
    }

    const handleBookNow = async () => {
        if (!selectedDate || !selectedSlot) {
            toast.warning("Please select both a date and a time slot.")

            return
        }
        const storedUser = localStorage.getItem("user");
        console.log("storedUser:", storedUser);
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id;

        const bookingData = {
            userId,
            turfId: turf._id,
            date: selectedDate,
            slot: selectedSlot,
            price: turf.price
        }
        try {
            const response = await bookTurf(bookingData)

            toast.success(response?.data?.message)
            navigate(`/bookingpage/${response.data.bookingId}`)

        } catch (error) {
            console.error(error)
            toast.error(error?.response?.data?.message || "Booking failed!")
        }


    };



    if (!turf) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    return (
        <div className='p-6 max-w-6xl mx-auto text-black'>
            <h1 className='text-4xl font-normal mb-6'>{turf.name}</h1>

            <div className='flex flex-col md:flex-row gap-10 '>
                {/* Image Section */}
                <div className='md:w-1/2 '>
                    <img
                        src={turf.images}
                        alt={turf.name}
                        className='rounded-lg w-full shadow-md'
                    />
                </div>

                {/* Details Section */}
                <div className='md:w-1/2 flex flex-col justify-between text-black'>
                    <div className='space-y-6'>
                        <div>
                            <p className='text-lg font-normal'>City: <span className='font-thin'>{turf.location.city}</span></p>
                            <p className='text-lg font-normal'>Price: <span className='font-thin'>₹{turf.price}/-</span></p>
                        </div>

                        {/* Date Picker */}
                        <div>
                            <label className='text-lg font-normal mb-1 block '>Select Date:</label>
                            <input
                                type="date"
                                value={selectedDate}
                                min={getTodayDate()}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className='input input-bordered bg-neutral-content w-full'
                            />
                        </div>

                        {/* Time Slot Selection */}
                        <div>
                            <p className='text-lg font-semibold mb-2'>Select Time Slot:</p>
                            <div className='flex flex-wrap gap-2'>
                                {turf.slots?.map((slot, index) => (
                                    <button
                                        key={index}
                                        className={`badge badge-lg px-4 py-2 cursor-pointer transition-all duration-200 ${selectedSlot === slot
                                                ? 'bg-stone-500 text-white'
                                                : 'badge-outline hover:bg-gray-300 hover:text-grey-500'
                                            }`}
                                        onClick={() => setSelectedSlot(slot)}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Book Now button */}
                    <div className='mt-6'>
                        <button
                            className='btn btn-outline w-full hover:bg-stone-100 hover:text-black '
                            onClick={handleBookNow}
                >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Turfpage